import React, { useCallback, useEffect, useRef, useState } from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { getSession } from "next-auth/react";
import PropTypes from "prop-types"
// Custom
import { Layout, LayoutWithSidebar } from "components/layout";
import InfoCard from "components/global/cards/InfoCard";
import ServerTable from "components/ServerTable/ServerTable";
import { corporateColumns } from "components/columns";
import exportExcel from "utils/useExportExcel";
import config from "config/config";
import { Header } from "components/global";
import { useTranslation } from "react-i18next";
import { Actions } from "components/UI";
import { useRouter } from "next/router";
import { useHandleMessage, useSavedState } from "hooks";
import { PrintView } from "components/pages/admin/corporate-list";
import axiosInstance from "auth/axiosInstance";
import { getFirstError } from "utils/utils";

const corporateList = () => {
  const [totals, setTotals] = useSavedState([
    {
      title: "total_corporates_key",
      desc: "corporates_key",
      count: 0
    },
    {
      title: "total_customers_key",
      desc: "customers_key",
      count: 0
    },
    {
      title: "total_booking_numbers_key",
      desc: "bookings_key",
      count: 0
    },
    {
      title: "total_amount_key",
      desc: "sar_key",
      count: 0
    },

  ], "telgani-b2b-corporate-totals-options-cache")
  const [tableData, setTableData] = useState([]);
  const [perPage, setPerPage] = useState(10);
  const [totalRows, setTotalRows] = useState(0);
  const [loading, setLoading] = useState(false);
  const handleMessage = useHandleMessage();

  const { t } = useTranslation("common");
  const router = useRouter();
  const [exportingExcel, setExportingExcel] = useState(false);
  const printViewRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState('');

  const columns = corporateColumns(t);

  const fetchReport = async (page, perPage, query = "") => {
    const search = query?.trim() || searchQuery;
    setLoading(true);
    try {
      const { data } = await axiosInstance.get(`${config.apiGateway.API_URL_TELGANI}/dashboard/b2b/corporate?search[value]=${search}&start=${(page - 1) * perPage}&length=${perPage}&is_export=false`)

      setTableData(data.data);
      setTotalRows(data.recordsFiltered);

      const totalCounts = [
        { ...totals[0], count: data?.metadata?.total_corporates_count || 0 },
        { ...totals[1], count: data?.metadata?.total_customers_count || 0 },
        { ...totals[2], count: data?.metadata?.total_bookings_count || 0 },
        { ...totals[3], count: data?.metadata?.total_settled_amount_gross_sum || 0 }
      ];
      setTotals(totalCounts);

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
    await exportExcel(tableData, columns, t("corporates_key"), handleMessage);
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
          title={t("corporates_key")}
          path="/corporate-list"
          links={[{ label: t("corporates_list_key") }]}
          classes="bg-gray-100 dark:bg-gray-700 border-none"
        />
        <div className="flex flex-wrap items-center justify-between gap-4 py-4 bg-gray-100 dark:bg-gray-700">
          {
            totals.map((card, idx) => <InfoCard
              key={idx}
              t={t}
              loading={loading}
              {...card}
            />)
          }
        </div>

        <ServerTable
          columns={columns}
          data={tableData || []}
          // noHeader={true}

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

              addMsg={t("add_corporate_key")}
              onClickAdd={() => router.push(`${router.pathname}/add`)}

              onClickPrint={exportPDF}

              onClickExport={handleExportExcel}
              isDisabledExport={exportingExcel || !tableData?.length}
            />
          }
        />
      </div>
      <PrintView ref={printViewRef} data={tableData} />
    </>
  );
};

corporateList.propTypes = {
  error: PropTypes.string,
  statusCode: PropTypes.number,
  session: PropTypes.object.isRequired
};
corporateList.getLayout = function PageLayout(page) {
  return (
    <Layout>
      <LayoutWithSidebar>{page}</LayoutWithSidebar>
    </Layout>
  );
};

export default corporateList;
export const getServerSideProps = async (context) => {
  const session = await getSession({ req: context.req });

  const loginUrl =
    context.locale === "ar" ? "/login" : `/${context.locale}/login`;
  if (!session) {
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
        ...(await serverSideTranslations(context.locale, ["common"])),
      },
    };

  }
}
