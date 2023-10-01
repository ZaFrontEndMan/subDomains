import React, { useCallback, useRef, useState } from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { getSession } from "next-auth/react";
import PropTypes from "prop-types";
import moment from "moment";

// Custom
import { Layout, LayoutWithSidebar } from "components/layout";
import { settlementsColumns } from "components/columns";
import { Header } from "components/global";
import { useTranslation } from "react-i18next";
import { useHandleMessage } from "hooks";
import { SettlementsFilter, SettlementsPrintView } from "components/pages/admin/settlement";

/*__________ Functions __________ */
import config from "config/config";
import { useRouter } from "next/router";
import ServerTable from "components/ServerTable/ServerTable";
import { Actions } from "components/UI";
import { getFirstError } from "utils/utils";
import axiosInstance from "auth/axiosInstance";
import { formatDate } from "utils/utils";
import exportExcel from "utils/useExportExcel";

const Settlements = ({ session: { user: { token } } }) => {
  const [tableData, setTableData] = useState([]);
  const [perPage, setPerPage] = useState(10);
  const [totalRows, setTotalRows] = useState(0);
  const [loading, setLoading] = useState(true);
  const handleMessage = useHandleMessage();

  const { t } = useTranslation("common");
  const [exportingExcel, setExportingExcel] = useState(false);
  const printViewRef = useRef(null);
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [gridFilter, setGridFilter] = useState({});

  const columns = settlementsColumns(t, formatDate, moment, router, token);

  const exportPDF = useCallback(() => {
    if (printViewRef.current) {
      printViewRef.current.print();
    }
  }, [printViewRef.current]);
  const handleExportExcel = async () => {
    setExportingExcel(true);
    await exportExcel(tableData, columns, t("settlement_details_key"), handleMessage);
    setTimeout(() => {
      setExportingExcel(false);
    }, 1000);
  };

  const fetchReport = async (page, perPage, query = "", filter) => {
    const search = query?.trim() || searchQuery;
    setLoading(true);
    try {
      const _filter = { ...gridFilter, ...filter }
      const { data } = await axiosInstance.get(`${config.apiGateway.API_URL_TELGANI}/dashboard/b2b/settlement`, {
        params: {
          'search[value]': search,
          ...(_filter?.yearId ? { 'columns[1][search][value]': _filter?.yearId?.value } : {}),
          ...(_filter?.monthId ? { 'columns[2][search][value]': _filter?.monthId?.value } : {}),


          ...(_filter?.monthId ? {
            'columns[6][search][value]': `["${moment().year(_filter?.yearId?.value || moment().format("YYYY")).month(_filter?.monthId?.value - 1).startOf("month").format("YYYY/MM/DD")?.toString()}","${moment().year(_filter?.yearId?.value || moment().format("YYYY")).month(_filter?.monthId?.value - 1).endOf("month").format("YYYY/MM/DD")?.toString()}"]`
          } : {}),
          start: (page - 1) * perPage,
          length: perPage,
          is_export: false,
        },
      })
      setTableData(data.data);
      setTotalRows(data.recordsFiltered)
      setLoading(false);
    } catch ({ data }) {
      if (data?.message == "CanceledError") {
        return;
      }
      handleMessage(getFirstError(data?.errors) || data?.message || data?.error);
      setLoading(false);
    }
  };

  const fetchReportFromFilter = (filter) => {
    fetchReport(1, 10, null, filter);
    setGridFilter({ ...gridFilter, ...filter });
  }
  const handlePageChange = (page) => fetchReport(page, perPage);

  const handlePerRowsChange = (rowsPerPage, page) => {
    setPerPage(rowsPerPage);
    fetchReport(page, rowsPerPage);
  };

  // useEffect(() => {
  //   fetchReport(1, 10);
  // }, []);

  return (
    <>
      <div className="min-h-full bg-gray-100 rounded-md dark:bg-gray-700">
        <Header
          title={t("home_key")}
          path="/"
          links={[{ label: t("settlement_details_key") }]}
          classes="bg-gray-100 dark:bg-gray-700 border-none"
        />

        <div className="py-4 bg-gray-100 dark:bg-gray-700">
          <SettlementsFilter fetchReport={fetchReportFromFilter} />
        </div>

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
              gridFilter={gridFilter}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              fetchReport={fetchReport}

              isDisabledExport={exportingExcel || !tableData?.length}
              onClickExport={handleExportExcel}

              isDisabledPrint={!tableData?.length}
              onClickPrint={exportPDF}

              addMsg={t("add_new_key")}
              onClickAdd={() => router.push(`${router.pathname}/settlements`)}
            />
          }
        />
      </div>

      <SettlementsPrintView ref={printViewRef} t={t} data={tableData} />

    </>
  );
};

Settlements.propTypes = {
  session: PropTypes.object.isRequired,
};

Settlements.getLayout = function PageLayout(page) {
  return (
    <Layout>
      <LayoutWithSidebar>{page}</LayoutWithSidebar>
    </Layout>
  );
};

export default Settlements;
export const getServerSideProps = async (context) => {
  const session = await getSession({ req: context.req });

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
        ...(await serverSideTranslations(context.locale, ["common"])),
      },
    };
  }

};
