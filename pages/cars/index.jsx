import React, { useCallback, useRef, useState, useEffect } from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { getSession } from "next-auth/react";
import PropTypes from "prop-types";
// Custom
import { Layout, LayoutWithSidebar } from "components/layout";
import { carsColumns } from "components/columns";
import exportExcel from "utils/useExportExcel";
import config from "config/config";
import { Header } from "components/global";
import { useTranslation } from "react-i18next";
import { Actions } from "components/UI";
import { useHandleMessage } from "hooks";
import { PrintView } from "components/pages/admin/carsList";
import ServerTable from "components/ServerTable/ServerTable";
import axiosInstance from "auth/axiosInstance";
import { getFirstError } from "utils/utils";

const Index = ({ officeUUID }) => {
  const { t } = useTranslation("common");
  const [tableData, setTableData] = useState([]);
  const [perPage, setPerPage] = useState(10);
  const [actionLoading, setActionLoading] = useState(false);
  const [totalRows, setTotalRows] = useState(0);
  const [loading, setLoading] = useState(true);
  const [exportingExcel, setExportingExcel] = useState(false);
  const handleMessage = useHandleMessage();
  const printViewRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState("");

  const activation = async (uuid, activate) => {
    setActionLoading(uuid);
    try {
      await axiosInstance.put(
        `${
          config.apiGateway.API_URL_TELGANI
        }/v2/supplier/business/car/${uuid}/${
          activate ? "activate" : "deactivate"
        }`
      );
      setTableData((prev) => {
        const updatedItemIndex = prev.findIndex((e) => e.uuid === uuid);
        const updatedItem = { ...prev[updatedItemIndex] };
        updatedItem.active = !updatedItem.active;

        return [
          ...prev.slice(0, updatedItemIndex),
          updatedItem,
          ...prev.slice(updatedItemIndex + 1),
        ];
      });

      setActionLoading(false);
    } catch ({ data }) {
      handleMessage(
        getFirstError(data?.errors) || data?.message || data?.error
      );
      setActionLoading(false);
    }
  };

  const columns = carsColumns(t, activation, actionLoading);

  const fetchReport = async (page, perPage, query = "") => {
    setLoading(true);
    try {
      const search = query?.trim() || searchQuery;

      const { data } = await axiosInstance.post(
        `${config.apiGateway.API_URL_TELGANI}/v2/supplier/business/office/${officeUUID}/car/list`,
        {
          start: (page - 1) * perPage,
          length: perPage,
          is_export: false,
        },
        {
          params: {
            "search[value]": search,
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
      handleMessage(
        getFirstError(data?.errors) || data?.message || data?.error
      );
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
    await exportExcel(tableData, columns, `${t("cars_key")}`, handleMessage);
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
          title={t("companies_key")}
          path="/companies-list"
          links={[
            { label: t("offices_key"), path: `/offices?com=${officeUUID}` },
            { label: t("cars_list_key"), path: "/cars-list" },
          ]}
          classes="bg-gray-100 dark:bg-gray-700 border-none"
        />

        <ServerTable
          columns={columns}
          data={tableData || []}
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
              onClickPrint={exportPDF}
              isDisabledPrint={!tableData?.length}
              onClickExport={handleExportExcel}
              isDisabledExport={exportingExcel || !tableData?.length}
            />
          }
        />
      </div>
      <PrintView ref={printViewRef} t={t} data={tableData} />
    </>
  );
};

Index.propTypes = {
  session: PropTypes.object.isRequired,
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
  const officeUUID = context.query?.office || "";

  const loginUrl =
    context.locale === "ar" ? "/login" : `/${context.locale}/login`;

    if (!session || session?.user?.role[0] !== "admin") {
    return {
      redirect: {
        destination: loginUrl,
        permanent: false,
      },
    };
  } else {
    return {
      props: {
        session,
        officeUUID,
        ...(await serverSideTranslations(context.locale, ["common"])),
      },
    };
  }
};
