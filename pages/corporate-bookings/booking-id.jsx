import React, { useCallback, useEffect, useRef, useState } from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { getSession, signOut } from "next-auth/react";
import PropTypes from "prop-types"
// Custom
import { Layout, LayoutWithSidebar } from "components/layout";
import { bookingsColumns } from "components/columns";
import exportExcel from "utils/useExportExcel";
import config from "config/config";
import axios from "axios";
import { Header } from "components/global";
import { useTranslation } from "react-i18next";
import { Actions, CancelReasons, Modal } from "components/UI";
import { useRouter } from "next/router";
import { useHandleMessage } from "hooks";
import {
  HistoryModal,
  PrintView,
  TransactionModal,
  PrintModal,
} from "components/pages/admin/corporate-bookings";
import ServerTable from "components/ServerTable/ServerTable";
import axiosInstance from "auth/axiosInstance";
import { acceptRequests, approveRequests } from "helper/apis/booking";
import { Filter } from "components/pages/admin/corporate-bookings";
import { getFirstError } from "utils/utils";
import moment from "moment";

const corporateBooking = ({ error, statusCode, corporateUUID, corporateName }) => {

  const router = useRouter();
  const { t } = useTranslation("common");
  const [tableData, setTableData] = useState([]);
  const [perPage, setPerPage] = useState(10);
  const [totalRows, setTotalRows] = useState(0);
  const [loading, setLoading] = useState(false);

  // modals

  const [cancelModal, setCancelModal] = useState({
    isOpen: false,
    id: null,
  });
  const [historyModal, setHistoryModal] = useState({
    isOpen: false,
    id: null,
  });
  const [transactionModal, setTransactionModal] = useState({
    isOpen: false,
    id: null,
  });
  const [printModal, setPrintModal] = useState({
    id: null,
    bookData: "",
  });
  const openPrintModal = async (id) => {
    if (id) {
      setActionLoading(true);
      try {
        const { data } = await axiosInstance.get(
          `${config.apiGateway.API_URL_TELGANI}/v1/booking/${id}/print`
        );
        setPrintModal({ id: null, bookData: data });
        setTimeout(() => PrintBook(), 500);
      } catch ({ data }) {
        handleMessage(
          getFirstError(data?.errors) || data?.error || data?.message
        );
        setPrintModal({ id: null, bookData: "" });
      } finally {
        setActionLoading(false);
      }
    }
  };
  const printBookRef = useRef(null);
  const PrintBook = useCallback(() => {
    if (printBookRef?.current) {
      printBookRef.current.print();
    }
  }, [printBookRef.current]);

  const language = router.locale.toLowerCase();
  const date_format = language === "en" ? "DD/MM/YYYY" : "YYYY/MM/DD";

  const [exportingExcel, setExportingExcel] = useState(false);
  const handleMessage = useHandleMessage();
  const printViewRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [gridFilter, setGridFilter] = useState({});

  const [actionLoading, setActionLoading] = useState(false);
  const handleAccept = async (uuid) => {
    setActionLoading(true);
    try {
      const { data } = await acceptRequests(uuid);
      fetchReport(1, perPage);
      handleMessage(t("request_accepted_successfully_key"), "success");
    } catch ({ data }) {
      handleMessage(
        getFirstError(data?.errors) || data?.error || data?.message
      );
    } finally {
      setActionLoading(false);
    }
  };
  const handleApprove = async (uuid) => {
    setActionLoading(true);
    try {
      const { data } = await approveRequests(uuid, {
        is_approved: true,
      });
      fetchReport(1, perPage);
      handleMessage(t("request_accepted_successfully_key"), "success");
    } catch ({ data }) {
      handleMessage(
        getFirstError(data?.errors) || data?.error || data?.message
      );
    } finally {
      setActionLoading(false);
    }
  };
  const handleReject = async (uuid) => {
    setCancelModal({
      id: uuid,
      isOpen: true,
    });
  };
  const columns = bookingsColumns(
    t,
    handleAccept,
    handleApprove,
    handleReject,
    actionLoading,
    setHistoryModal,
    setTransactionModal,
    openPrintModal,
    printModal,
    date_format
  );
  const fetchReport = async (page, perPage, query = "", filter) => {
    setLoading(true);
    try {
      const search = query?.trim() || searchQuery;
      const _filter = { ...gridFilter, ...filter }; const cityIds = _filter?.cityId?.map(item => item.value) || [];
      const cityIdParams = cityIds.reduce((params, id, index) => {
        params[`columns[44][search][value][${index}]`] = id;
        return params;
      }, {});
      const params = {
        'search[value]': search,
        // 'columns[5][search][value]': corporateUUID,
        ...(corporateUUID ? { 'columns[5][search][value]': corporateUUID } : {}),

        ...(_filter?.companyId?.value ? { 'columns[45][search][value]': _filter?.companyId?.value } : {}),
        ...(_filter?.stateId?.value ? { 'columns[58][search][value]': _filter?.stateId?.value } : {}),
        ...(_filter?.paymentMethod?.val ? { 'columns[63][search][value]': _filter?.paymentMethod?.val } : {}),
        ...(_filter?.paymentMethod?.secondValue ? { 'columns[64][search][value]': _filter?.paymentMethod?.secondValue } : {}),
        ...(_filter?.delivery?.value != null ? { 'columns[19][search][value]': _filter?.delivery?.value } : {}),
        ...(_filter?.settled?.value != null ? { 'columns[7][search][value]': _filter?.settled?.value } : {}),
        ...(_filter?.officeRating?.value ? { 'columns[30][search][value]': _filter?.officeRating?.value } : {}),
        ...(_filter?.compensated?.value != null ? { 'columns[22][search][value]': _filter?.compensated?.value } : {}),
        ...(_filter?.kiosk?.value != null ? { 'columns[68][search][value]': _filter?.kiosk?.value } : {}),
        ...(_filter?.discount?.value != null ? { 'columns[8][search][value]': _filter?.discount?.value } : {}),
        ...(_filter?.editByCustomer?.value != null ? { 'columns[21][search][value]': _filter?.editByCustomer?.value } : {}),

        //  pick date
        ...(moment(_filter?.pickDate ? _filter?.pickDate[0] : "").isValid() ? { 'columns[48][search][value]': `["${moment(_filter.pickDate[0]).format("YYYY/MM/DD")?.toString()}","${moment(_filter.pickDate[1]).format("YYYY/MM/DD")?.toString()}"]`, } : {}),
        ...(moment(_filter?.pickDate ? _filter?.pickDate[0] : "").isValid() ? { 'pick_date_to': moment(_filter.pickDate[1]).format("ddd MMM DD YYYY HH:mm:ss [GMT]ZZ") } : {}),

        //  drop date
        ...(moment(_filter?.dropDate ? _filter?.dropDate[0] : "").isValid() ? { 'columns[51][search][value]': `["${moment(_filter.dropDate[0]).format("YYYY/MM/DD")?.toString()}","${moment(_filter.dropDate[1]).format("YYYY/MM/DD")?.toString()}"]`, } : {}),
        ...(moment(_filter?.dropDate ? _filter?.dropDate[0] : "").isValid() ? { 'drop_date_to': moment(_filter.dropDate[1]).format("ddd MMM DD YYYY HH:mm:ss [GMT]ZZ") } : {}),

        //  openedContract date
        ...(moment(_filter?.openedContractDate ? _filter?.openedContractDate[0] : "").isValid() ? { 'columns[99][search][value]': `["${moment(_filter.openedContractDate[0]).format("YYYY/MM/DD")?.toString()}","${moment(_filter.openedContractDate[1]).format("YYYY/MM/DD")?.toString()}"]`, } : {}),
        ...(moment(_filter?.openedContractDate ? _filter?.openedContractDate[0] : "").isValid() ? { 'contract_opened_at_date_to': moment(_filter.openedContractDate[1]).format("ddd MMM DD YYYY HH:mm:ss [GMT]ZZ") } : {}),

        //  closedContract date
        ...(moment(_filter?.closedContractDate ? _filter?.closedContractDate[0] : "").isValid() ? { 'columns[100][search][value]': `["${moment(_filter.closedContractDate[0]).format("YYYY/MM/DD")?.toString()}","${moment(_filter.closedContractDate[1]).format("YYYY/MM/DD")?.toString()}"]`, } : {}),
        ...(moment(_filter?.closedContractDate ? _filter?.closedContractDate[0] : "").isValid() ? { 'contract_closed_at_date_to': moment(_filter.closedContractDate[1]).format("ddd MMM DD YYYY HH:mm:ss [GMT]ZZ") } : {}),

        //  created at date
        ...(moment(_filter?.createdAt || "").isValid() ? { 'columns[70][search][value]': `["${moment(_filter.createdAt[0]).format("YYYY/MM/DD")?.toString()}","${moment(_filter.createdAt[1]).format("YYYY/MM/DD")?.toString()}"]`, } : {}),

        ...(_filter?.extendStatus?.value != null ? { 'columns[87][search][value]': _filter?.extendStatus?.value } : {}),
        ...(_filter?.subscription?.value != null ? { 'columns[101][search][value]': _filter?.subscription?.value } : {}),
        ...(_filter?.servicesType?.value != null ? { 'columns[3][search][value]': _filter?.servicesType?.value } : {}),

        ...cityIdParams,

        start: (page - 1) * perPage,
        length: perPage,
        is_export: false,
      };
      const { data } = await axiosInstance.get(`${config.apiGateway.API_URL_TELGANI}/v2/bookings/new`, { params })
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
    setGridFilter({ ...(!filter.reset ? { ...gridFilter } : {}), ...filter });
    fetchReport(1, perPage, null, filter);
  }


  const handlePageChange = (page) => fetchReport(page, perPage);

  const handlePerRowsChange = (rowsPerPage, page) => {
    setPerPage(rowsPerPage);
    fetchReport(page, rowsPerPage);
  };

  const handleExportExcel = async () => {
    setExportingExcel(true);
    await exportExcel(
      tableData,
      columns,
      `${t("corporates_key")}-${t("bookings_key")}`,
      handleMessage
    );
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
    fetchReport(1, 10);
  }, []);

  return (
    <>
      <div className="min-h-full bg-gray-100 rounded-md dark:bg-gray-700">
        <Header
          title={t("corporates_key")}
          path="/corporate-list"
          links={[
            { label: t("bookings_key"), path: "/corporate-bookings" },
            ...(corporateUUID ? [{ label: corporateName }] : [])
          ]}
          classes="bg-gray-100 dark:bg-gray-700 border-none"
        />

        <div className="py-4 bg-gray-100 dark:bg-gray-700">
          <Filter
            fetchReport={fetchReportFromFilter}
          // submit={fetchReportFromFilter}
          // fetchReport={collectData}
          />
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
              gridFilter={gridFilter}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              fetchReport={fetchReport}
              addMsg={t("add_settlement_key")}
              onClickAdd={() =>
                router.push(
                  `/settlements/settlements${corporateUUID ? `?cor=${corporateUUID}` : ""
                  }`
                )
              }
              onClickPrint={exportPDF}
              isDisabledPrint={!tableData?.length}
              onClickExport={handleExportExcel}
              isDisabledExport={exportingExcel || !tableData?.length}
            />
          }
        />
      </div>

      <PrintView ref={printViewRef} t={t} data={tableData} />

      {/* ************************actions************************ */}
      {cancelModal.isOpen && (
        <Modal
          title={t("cancel_booking_key")}
          show={cancelModal.isOpen}
          footer={false}
          onClose={() => setCancelModal({ isOpen: false, id: null })}
        >
          <CancelReasons
            bookingDetails={tableData?.find(e => e?.uuid == cancelModal?.id)}
            handleClose={() => setCancelModal({ isOpen: false, id: null })}
            bookingId={cancelModal?.id}
            fetchReport={fetchReport}
            isAdmin={true}
          />
        </Modal>
      )}

      {historyModal.isOpen && (
        <Modal
          title={t("booking_history_key")}
          show={historyModal.isOpen}
          footer={false}
          onClose={() => setHistoryModal({ isOpen: false, id: null })}
        >
          <HistoryModal id={historyModal?.id} />
        </Modal>
      )}

      {transactionModal.isOpen && (
        <Modal
          title={t("transactions_history_key")}
          show={transactionModal.isOpen}
          footer={false}
          onClose={() => setTransactionModal({ isOpen: false, id: null })}
        >
          <TransactionModal id={transactionModal?.id} />
        </Modal>
      )}

      <PrintModal ref={printBookRef} bookData={printModal?.bookData} />

      {/* ************************actions************************ */}
    </>
  );
};

corporateBooking.propTypes = {
  session: PropTypes.object.isRequired,
};
corporateBooking.getLayout = function PageLayout(page) {
  return (
    <Layout>
      <LayoutWithSidebar>{page}</LayoutWithSidebar>
    </Layout>
  );
};

export default corporateBooking;
export const getServerSideProps = async (context) => {
  const session = await getSession({ req: context.req });
  const corporateUUID = context.query?.cor || "";
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
    try {
      const apiUrl = config.apiGateway.API_URL_TELGANI;
      const { data: corporate } = await axios.get(`${apiUrl}/dashboard/b2b/corporate/${corporateUUID}`, {
        headers: { Authorization: `Bearer ${session.user?.token}` },
        params: {
          start: 0,
          length: 10,
          is_export: false,
        },
      });


      return {
        props: {
          corporateName: corporate.name || corporateName,
          corporateUUID: corporate.uuid || corporateUUID,
          error: null,
          statusCode: null,
          session,
          ...(await serverSideTranslations(context.locale, ["common"])),
        },
      };
    } catch ({ response }) {
      return {
        props: {
          bookings: [],
          corporateName: "",
          corporateUUID: null,
          error: response?.data.message,
          statusCode: response ? response?.status : "",
          session,
          ...(await serverSideTranslations(context.locale, ["common"])),
        },
      };
    }
  }
};
