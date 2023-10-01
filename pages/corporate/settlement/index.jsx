import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { getSession } from "next-auth/react";
import PropTypes from "prop-types";

/*__________ Components__________ */
import { Layout, LayoutWithSidebar } from "components/layout";

/*__________ Functions __________ */

import { useHandleMessage } from "hooks";

import { useTranslation } from "react-i18next";
import moment from "moment";
import { settlementsCoordinatorColumns } from "components/columns";

import { formatDate, getFirstError } from "utils/utils";
import { Filter } from "components/pages/corporate/settlement";
import config from "config/config";
import ServerTable from "components/ServerTable/ServerTable";
import { Actions } from "components/UI";
import axiosInstance from "auth/axiosInstance";
import { Header } from "components/global";

const Index = ({ corporateUUid }) => {
  const router = useRouter();
  const { t } = useTranslation("common");
  const [tableData, setTableData] = useState([]);
  const [perPage, setPerPage] = useState(10);
  const [totalRows, setTotalRows] = useState(0);
  const [loading, setLoading] = useState(false);
  const handleMessage = useHandleMessage();
  const [gridFilter, setGridFilter] = useState({});

  const [searchQuery, setSearchQuery] = useState("");

  const columns = settlementsCoordinatorColumns(t, formatDate, moment, router);

  const fetchReport = async (page, perPage, query = "", filter) => {
    const search = query?.trim() || searchQuery;
    setLoading(true);
    try {
      const _filter = { ...gridFilter, ...filter };

      const { data } = await axiosInstance.get(
        `${config.apiGateway.API_URL_TELGANI}/dashboard/b2b/corporate/${corporateUUid}/settlement`,
        {
          params: {
            ...(search ? { "search[value]": search } : {}),
            ...(_filter?.settlementId
              ? {
                  "columns[5][search][value]": _filter?.settlementId
                    ? _filter.settlementId === 1
                      ? "settled"
                      : _filter.settlementId === 2
                      ? "not settled"
                      : _filter.settlementId === 3
                      ? "partially settled"
                      : undefined
                    : undefined,
                }
              : {}),

            ...(moment(
              _filter?.createdAt ? _filter?.createdAt[0] : ""
            ).isValid()
              ? {
                  "columns[7][search][value]": `["${moment(_filter.createdAt[0])
                    .format("YYYY/MM/DD")
                    ?.toString()}","${moment(_filter.createdAt[1])
                    .format("YYYY/MM/DD")
                    ?.toString()}"]`,
                }
              : {}),

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
      handleMessage(
        getFirstError(data?.errors) || data?.message || data?.error
      );
      setLoading(false);
    }
  };

  const fetchReportFromFilter = (filter) => {
    fetchReport(1, 10, null, filter);
    setGridFilter({ ...gridFilter, ...filter });
  };
  const handlePageChange = (page) => fetchReport(page, perPage);

  const handlePerRowsChange = (rowsPerPage, page) => {
    setPerPage(rowsPerPage);
    fetchReport(page, rowsPerPage);
  };

  useEffect(() => {
    fetchReport(1, 10);
  }, []);

  return (
    <>
      <div className="min-h-full bg-gray-100 rounded-md dark:bg-gray-700">
        <Header
          title={t("settlements_key")}
          path="/corporate/settlement"
          links={[]}
          classes="bg-gray-100 dark:bg-gray-700 border-none"
        />
        <div className="py-4 bg-gray-100 dark:bg-gray-700">
          <Filter fetchReport={fetchReportFromFilter} />
        </div>

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
              gridFilter={gridFilter}
            />
          }
        />
      </div>
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
  const loginUrl =
    context.locale === "ar" ? "/login" : `/${context.locale}/login`;
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
};
