import React, { useCallback, useEffect, useRef, useState } from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { getSession } from "next-auth/react";
import PropTypes from "prop-types";
// Custom
import { Layout, LayoutWithSidebar } from "components/layout";
import { customerColumns } from "components/columns";
import exportExcel from "utils/useExportExcel";
import config from "config/config";
import { useTranslation } from "react-i18next";
import { Actions, Modal, ViewLicense } from "components/UI";
import { useHandleMessage } from "hooks";
import { AddModal, PrintView } from "components/pages/corporate/customers-list";
import { Header } from "components/global";
import ServerTable from "components/ServerTable/ServerTable";
import { getFirstError } from "utils/utils";
import axiosInstance from "auth/axiosInstance";
import { getCustomer } from "helper/apis/customer";

const Index = ({ corporateUUid }) => {
  const [tableData, setTableData] = useState([]);
  const [perPage, setPerPage] = useState(10);
  const [totalRows, setTotalRows] = useState(0);
  const [loading, setLoading] = useState(true);
  const handleMessage = useHandleMessage();

  const { t } = useTranslation("common");
  const [exportingExcel, setExportingExcel] = useState(false);
  const printViewRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState("");

  // ================== add customer ============
  const [showModal, setShowModal] = useState(false);

  // modals
  const [showLicense, setShowLicense] = useState({
    loading: false,
    isOpen: false,
    url: "",
  });
  useEffect(() => {
    if (showLicense.uuid) {
      (async () => {
        setShowLicense((prev) => {
          return {
            ...prev,
            loading: true,
          };
        });
        try {
          const customer = await getCustomer(corporateUUid, showLicense.uuid);
          if (customer.license_url) {
            setShowLicense({
              isOpen: true,
              uuid: "",
              url: customer?.license_url || "",
            });
          } else {
            handleMessage(t("no_driver_license_found_key"), "warning");
          }
        } catch ({ data }) {
          handleMessage(
            getFirstError(data?.errors) || data?.error || data?.message
          );
        } finally {
          setShowLicense((prev) => {
            return {
              ...prev,
              loading: false,
            };
          });
        }
      })();
    }
  }, [showLicense.uuid]);

  // ================== add customer ============

  const columns = customerColumns(t, showLicense, setShowLicense);

  const fetchReport = async (page, perPage, query = "") => {
    const search = query?.trim() || searchQuery;
    setLoading(true);
    try {
      const { data } = await axiosInstance.get(
        `${config.apiGateway.API_URL_TELGANI}/dashboard/b2b/corporate/${corporateUUid}/customer`,
        {
          params: {
            "search[value]": search,
            start: (page - 1) * perPage,
            length: perPage,
            is_export: false,
          },
        }
      );
      setTableData(data.data);
      setTotalRows(data.recordsFiltered);
      setLoading(false);
    } catch ({ data }) {
      if (data?.message == "CanceledError") {
        return;
      }
      handleMessage(getFirstError(data?.errors) || data?.message || data?.error);
      setLoading(false);
    }
  };

  const handlePageChange = (page) => fetchReport(page, perPage);

  const handlePerRowsChange = (rowsPerPage, page) => {
    setPerPage(rowsPerPage);
    fetchReport(page, rowsPerPage);
  };

  const handleExportExcel = async () => {
    setExportingExcel(true);
    await exportExcel(tableData, columns, t("customers_key"), handleMessage);
    setTimeout(() => {
      setExportingExcel(false);
    }, 1000);
  };

  const exportPDF = useCallback(() => {
    if (printViewRef.current) {
      printViewRef.current.print();
    }
  }, [printViewRef.current]);
  useEffect(() => {
    fetchReport(1, 10);
  }, []);
  return (
    <>
      <div className="min-h-full bg-gray-100 rounded-md dark:bg-gray-700">
        <Header
          title={t("customers_key")}
          path="/corporate/customers"
          links={[]}
          classes="bg-gray-100 dark:bg-gray-700 border-none"
        />
        <ServerTable
          columns={columns}
          data={tableData || []}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          fetchReport={fetchReport}
          handlePageChange={handlePageChange}
          handlePerRowsChange={handlePerRowsChange}
          progressPending={loading}
          paginationTotalRows={totalRows}
          paginationPerPage={perPage}
          actions={
            <Actions
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              fetchReport={fetchReport}
              addMsg={t("add_customer_key")}
              onClickAdd={() => setShowModal(true)}
              onClickPrint={exportPDF}
              onClickExport={handleExportExcel}
              isDisabledExport={exportingExcel || !tableData?.length}
            />
          }
        />
      </div>
      <PrintView ref={printViewRef} data={tableData} />

      {showModal && (
        <Modal
          title={t("add_customer_key")}
          show={showModal}
          footer={false}
          onClose={() => setShowModal(false)}
        >
          <AddModal
            fetchReport={fetchReport}
            handleClose={() => setShowModal(false)}
            corporateUUID={corporateUUid}
          />
        </Modal>
      )}

      {showLicense.isOpen && (
        <Modal
          title={`${t("view_license_key")}`}
          show={showLicense.isOpen}
          footer={false}
          onClose={() => setShowLicense({ isOpen: false, uuid: "" })}
        >
          <ViewLicense url={showLicense?.url} />
        </Modal>
      )}
    </>
  );
};

Index.propTypes = {
  corporateUUid: PropTypes.string.isRequired,
};

Index.getLayout = function PageLayout(page) {
  return (
    <Layout>
      <LayoutWithSidebar>{page}</LayoutWithSidebar>
    </Layout>
  );
};

export default Index;

export const getServerSideProps = async (context) => {
  const session = await getSession({ req: context.req });
  const loginUrl = context.locale === "ar" ? "/login" : `/${context.locale}/login`;
  if (!session || session?.user?.role[0] != "corporate_coordinator") {
    return {
      redirect: {
        destination: loginUrl,
        permanent: false,
      },
    };
  } else {
    return {
      props: {
        corporateUUid: session?.user?.corporate?.uuid,
        ...(await serverSideTranslations(context.locale, ["common"])),
      },
    };
  }
}