import React, { useCallback, useEffect, useRef, useState } from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "react-i18next";
import { getSession, signOut } from "next-auth/react";
import PropTypes from "prop-types";

/*__________ Components__________ */
import { Actions } from "components/UI";
import ServerTable from "components/ServerTable/ServerTable";
import { Layout, LayoutWithSidebar } from "components/layout";
import { MaintenanceCorporatesFilter, PrintView } from "components/pages/admin/maintenance-corporates";


/*__________ Functions __________ */
import { maintenanceCompaniesColumns } from "components/columns";
import axiosInstance from "auth/axiosInstance";
import { useHandleMessage } from "hooks";
import config from "config/config";
import { getFirstError, unique } from "utils/utils";
import axios from "axios";
import { Header } from "components/global";
import exportExcel from "utils/useExportExcel";



const maintenanceCorporates = ({ error, statusCode, maintenanceCorporates, totalRecords }) => {
  const { t } = useTranslation("common");
  const handleMessage = useHandleMessage();
  const companyOptions = unique(maintenanceCorporates?.map(e => { return { label: e.companyName, value: e.uuid } }) || [], "label");
  const customerOptions = unique(maintenanceCorporates?.map(e => { return { label: e.customerName, value: e.uuid } }) || [], "label");

  const [tableData, setTableData] = useState([...maintenanceCorporates]);
  const [perPage, setPerPage] = useState(10);
  const [totalRows, setTotalRows] = useState(totalRecords);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [gridFilter, setGridFilter] = useState({});


  const [exportingExcel, setExportingExcel] = useState(false);
  const printViewRef = useRef(null);

  const columns = maintenanceCompaniesColumns(t);

  const fetchReport = async (page, perPage, query = "", filter) => {
    const search = query?.trim() || searchQuery;
    const _filter = { ...gridFilter, ...filter }
    setLoading(true);
    try {
      const { data } = await axiosInstance.get(`${config.apiGateway.API_URL_DUMMY}/dashboard/b2b/maintenanceCompanies`, {
        params: {
          'search[companyName]': search,
          ...(_filter?.companyName ? { 'search[companyName]': _filter?.companyName?.label } : {}),
          ...(_filter?.customerName ? { 'search[customerName]': _filter?.customerName?.label } : {}),
          start: (page - 1) * perPage,
          length: perPage,
          is_export: false
        },
      });
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
  const fetchReportFromFilter = (filter) => {
    fetchReport(1, perPage, null, filter);
    setGridFilter({ ...gridFilter, ...filter });
  }
  const handlePageChange = (page) => fetchReport(page, perPage);

  const handlePerRowsChange = (rowsPerPage, page) => {
    setPerPage(rowsPerPage);
    fetchReport(page, rowsPerPage);
  };


  const handleExportExcel = async () => {
    setExportingExcel(true);
    await exportExcel(tableData, columns, t("maintenance_corporates_key"), handleMessage);
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
          links={[{ label: t("maintenance_corporates_key") }]}
          classes="bg-gray-100 dark:bg-gray-700 border-none"
        />

        <div className="py-4 bg-gray-100 dark:bg-gray-700">
          <MaintenanceCorporatesFilter
            fetchReport={fetchReportFromFilter}
            companyOptions={companyOptions}
            customerOptions={customerOptions}
          />
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

maintenanceCorporates.propTypes = {
  error: PropTypes.string,
  statusCode: PropTypes.number,
  maintenanceCorporates: PropTypes.arrayOf(PropTypes.object).isRequired,
  totalRecords: PropTypes.number.isRequired
};

maintenanceCorporates.getLayout = function PageLayout(page) {
  return (
    <Layout>
      <LayoutWithSidebar>{page}</LayoutWithSidebar>
    </Layout>
  );
};

export const getServerSideProps = async (context) => {
  const session = await getSession({ req: context.req });

  const loginUrl = context.locale === "ar" ? "/login" : `/${context.locale}/login`;

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
      const { data: { data, recordsFiltered } } = await axios.get(`${apiUrl}/dashboard/b2b/maintenanceCompanies`, {
        headers: { Authorization: `Bearer ${session.user?.meta?.access_token}` },
        params: {
          start: 0,
          length: 10,
          is_export: false
        },
      });
      return {
        props: {
          maintenanceCorporates: data || [],
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
          maintenanceCorporates: [],
          totalRecords: 0,
          error: response?.data.message,
          statusCode: response ? response?.status : "",
          session,
          ...(await serverSideTranslations(context.locale, ["common"])),
        },
      };
    }
  }
}

export default maintenanceCorporates;
