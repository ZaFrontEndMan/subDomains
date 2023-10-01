import React, { useEffect, useState } from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { getSession, signOut } from "next-auth/react";
import PropTypes from "prop-types";

// Custom
import { Layout, LayoutWithSidebar } from "components/layout";
import { Header } from "components/global";
import { useTranslation } from "react-i18next";
import { useHandleMessage } from "hooks";

/*__________ Functions __________ */
import { SettlementsByMonthFilter } from "components/pages/admin/settlement";
import config from "config/config";
import ServerTable from "components/ServerTable/ServerTable";
import { Actions } from "components/UI";
import { getFirstError } from "utils/utils";
import axios from "axios";
import axiosInstance from "auth/axiosInstance";
import { settlementsByMonthColumns } from "components/columns";

const SettlementByMonth = ({ error, statusCode, data, totalRecords }) => {
  const [tableData, setTableData] = useState([...data]);
  const [perPage, setPerPage] = useState(10);
  const [totalRows, setTotalRows] = useState(totalRecords);
  const [loading, setLoading] = useState(false);
  const handleMessage = useHandleMessage();

  const { t } = useTranslation("common");

  const [searchQuery, setSearchQuery] = useState('');
  const [gridFilter, setGridFilter] = useState({});

  const columns = settlementsByMonthColumns(t);


  const fetchReport = async (page, perPage, query = "", filter) => {
    const search = query?.trim() || searchQuery;
    setLoading(true);
    try {
      const _filter = { ...gridFilter, ...filter }

      const { data } = await axiosInstance.get(`${config.apiGateway.API_URL_DUMMY}/dashboard/b2b/settlements`, {
        params: {
          'search[value]': search,
          ...(_filter?.yearId ? { 'search[year]': _filter?.yearId?.value } : {}),
          ...(_filter?.settlementId ? { 'search[settlement]': _filter?.settlementId } : {}),
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

  useEffect(() => {
    if (statusCode == 401) {
      signOut();
      return;
    }
    error && handleMessage(error);
  }, []);
  return (
    <>
      <div className="min-h-full bg-gray-100 rounded-md dark:bg-gray-700">
        <Header
          title={t("home_key")}
          path="/"
          links={[{ label: t("settlement_details_key"), path: "/settlements" }, { label: t("settlement_by_month_key") }]}
          classes="bg-gray-100 dark:bg-gray-700 border-none"
        />

        <div className="py-4 bg-gray-100 dark:bg-gray-700">
          <SettlementsByMonthFilter fetchReport={fetchReportFromFilter} />
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
            />
          }
        />
      </div>

    </>
  );
};

SettlementByMonth.propTypes = {
  error: PropTypes.string,
  statusCode: PropTypes.number,
  totalRecords: PropTypes.number,
  data: PropTypes.arrayOf(PropTypes.object),
  session: PropTypes.object.isRequired,
};

SettlementByMonth.getLayout = function PageLayout(page) {
  return (
    <Layout>
      <LayoutWithSidebar>{page}</LayoutWithSidebar>
    </Layout>
  );
};

export default SettlementByMonth;
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
    try {
      const apiUrl = config.apiGateway.API_URL_DUMMY;
      const { data: { data, recordsFiltered } } = await axios.get(`${apiUrl}/dashboard/b2b/settlements`, {
        headers: { Authorization: `Bearer ${session.user?.token}` },
        params: {
          start: 0,
          length: 10,
          is_export: false
        },
      });
      return {
        props: {
          data: data || [],
          totalRecords: recordsFiltered || 0,
          error: null,
          statusCode: null,
          session,
          ...(await serverSideTranslations(context.locale, ["common"])),
        },
      };
    } catch ({ response }) {
      return {
        props: {
          data: [],
          totalRecords: 0,
          error: response?.data.message,
          statusCode: response ? response?.status : "",
          session,
          ...(await serverSideTranslations(context.locale, ["common"])),
        },
      };
    }
  }
};
