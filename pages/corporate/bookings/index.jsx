import React, { useCallback, useEffect, useRef, useState } from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { getSession } from "next-auth/react";
import PropTypes from "prop-types";

/*__________ Components__________ */
import { Layout, LayoutWithSidebar } from "components/layout";

/*__________ Functions __________ */

import { useHandleMessage } from "hooks";

import { useTranslation } from "react-i18next";
import { coordinatorBookingsColumns } from "components/columns";

import { getFirstError } from "utils/utils";
import { Filter, PrintView } from 'components/pages/corporate/bookings';
import config from "config/config";
import ServerTable from "components/ServerTable/ServerTable";
import { Actions } from "components/UI";
import axiosInstance from "auth/axiosInstance";
import { useRouter } from "next/router";
import exportExcel from "utils/useExportExcel";
import { Header } from "components/global";
import moment from "moment";

const Index = ({ corporateUUid }) => {
  const router = useRouter();
  const [tableData, setTableData] = useState([]);
  const [perPage, setPerPage] = useState(10);
  const [totalRows, setTotalRows] = useState(0);
  const [loading, setLoading] = useState(true);
  const handleMessage = useHandleMessage();
  const language = router.locale.toLowerCase();
  const date_format = language === 'en' ? 'DD/MM/YYYY' : 'YYYY/MM/DD';
  const [gridFilter, setGridFilter] = useState({});
  const [exportingExcel, setExportingExcel] = useState(false);
  const printViewRef = useRef(null);


  const { t } = useTranslation("common");
  const [searchQuery, setSearchQuery] = useState('');


  const columns = coordinatorBookingsColumns(t, date_format);

  const fetchReport = async (page, perPage, query = "", filter = {}) => {
    const search = query?.trim() || searchQuery;
    setLoading(true);
    try {
      const _filter = { ...gridFilter, ...filter }
      const { data } = await axiosInstance.get(`${config.apiGateway.API_URL_TELGANI}/dashboard/b2b/corporate/${corporateUUid}/bookings`, {
        params: {
          'search[value]': search,
          // 'columns[5][search][value]': corporateUUid,
          ...(_filter?.settlementId ? { 'columns[7][search][value]': _filter?.settlementId == 1 ? true : false } : {}),
          ...(_filter?.createdAt
            ? {
              'columns[69][search][value]': `["${moment(_filter.createdAt[0]).format("YYYY/MM/DD")?.toString()}","${moment(_filter.createdAt[1]).format("YYYY/MM/DD")?.toString()}"]`,
            }
            : {}),


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


  const fetchReportFromFilter = (filter = {}) => {
    fetchReport(1, 10, null, filter);
    setGridFilter({ ...gridFilter, ...filter });
  }
  const handlePageChange = (page) => fetchReport(page, perPage);

  const handlePerRowsChange = (rowsPerPage, page) => {
    setPerPage(rowsPerPage);
    fetchReport(page, rowsPerPage);
  };


  const handleExportExcel = async () => {
    setExportingExcel(true);
    await exportExcel(tableData, columns, `${t("customers_key")}-${t("bookings_key")}`, handleMessage);
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
          title={t("bookings_key")}
          path="/corporate/bookings"
          links={[]}
          classes="bg-gray-100 dark:bg-gray-700 border-none"
        />

        <div className="py-4 bg-gray-100 dark:bg-gray-700">
          <Filter fetchReport={fetchReportFromFilter} />
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
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              fetchReport={fetchReport}

              addMsg={t("create_new_booking_key")}
              onClickAdd={() => router.push("/corporate/book-car")}
              onClickPrint={exportPDF}

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
