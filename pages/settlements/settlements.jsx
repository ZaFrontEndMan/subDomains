import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useRouter } from "next/router";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "react-i18next";
import { getSession } from "next-auth/react";
import PropTypes from "prop-types";

/*__________ Components__________ */
import { Actions, Button, Modal } from "components/UI";
import ServerTable from "components/ServerTable/ServerTable";
import { Layout, LayoutWithSidebar } from "components/layout";
import {
  SettlementsDetailsFilter,
  AddSettlement,
} from "components/pages/admin/settlement";

/*__________ Functions __________ */
import { settlementsDetailsColumns } from "components/columns";
import axiosInstance from "auth/axiosInstance";
import { useHandleMessage } from "hooks";
import config from "config/config";
import { getFirstError } from "utils/utils";
import { ClockIcon } from "@heroicons/react/24/outline";
import {
  HistoryModal,
  PrintModal,
  TransactionModal,
} from "components/pages/admin/corporate-bookings";
import { Header } from "components/global";
import moment from "moment";

const Settlements = ({ session, corporateUUID }) => {
  const { t } = useTranslation("common");
  const handleMessage = useHandleMessage();

  const router = useRouter();
  const language = router.locale.toLowerCase();
  const date_format = language === "en" ? "DD/MM/YYYY" : "YYYY/MM/DD";

  const [tableData, setTableData] = useState([]);
  const [perPage, setPerPage] = useState(10);
  const [totalRows, setTotalRows] = useState(0);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [gridFilter, setGridFilter] = useState({});

  const _corporateUUID = useMemo(() => {
    return corporateUUID ? corporateUUID : (gridFilter?.corporate?.value || null)
  }, [corporateUUID, gridFilter.corporate]);

  const [selectedRows, setSelectedRows] = useState([]);

  const handleChange = (state) => {
    setSelectedRows(state.selectedRows?.map((c) => c) || []);
  };

  // *********************** modals ***********************
  const [addSettlementModal, setAddSettlementModal] = useState(false);

  const [historyModal, setHistoryModal] = useState({ isOpen: false, id: null });
  const [transactionModal, setTransactionModal] = useState({
    isOpen: false,
    id: null,
  });
  const [printModal, setPrintModal] = useState({ id: null, bookData: "" });
  const openPrintModal = async (id) => {
    if (id) {
      try {
        const { data } = await axiosInstance.get(
          `${config.apiGateway.API_URL_TELGANI}/v1/booking/${id}/print`
        );
        setPrintModal({ id: null, bookData: data });
        setTimeout(() => PrintBook(), 500);
      } catch ({ data }) {
        handleMessage(
          getFirstError(data?.errors) || data?.message || data?.error
        );
        setPrintModal({ id: null, bookData: "" });
      }
    }
  };
  const printBookRef = useRef(null);
  const PrintBook = useCallback(() => {
    if (printBookRef?.current) {
      printBookRef.current.print();
    }
  }, [printBookRef.current]);
  // *********************** modals ***********************

  const columns = settlementsDetailsColumns(
    t,
    date_format,
    setHistoryModal,
    setTransactionModal,
    openPrintModal,
    printModal
  );
  const fetchReport = async (page, perPage, query = "", filter = {}) => {
    const search =  searchQuery;
    const _filter = { ...gridFilter, ...filter };
    setLoading(true);
    try {
      const { data } = await axiosInstance.get(
        `${config.apiGateway.API_URL_TELGANI}/dashboard/b2b/corporate/${corporateUUID || _filter?.corporate?.value}/limit`,
        {
          params: {
            "search[value]": search,
            "columns[5][search][value]": false,

            ...(_filter?.createdAt
              ? {
                "columns[10][search][value]": `["${moment(
                  _filter.createdAt[0]
                )
                  .format("YYYY/MM/DD")
                  ?.toString()}","${moment(_filter.createdAt[1])
                    .format("YYYY/MM/DD")
                    ?.toString()}"]`,
              }
              : {}),

            ...(_filter?.customer
              ? { "columns[1][search][value]": _filter?.customer?.value }
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
    setGridFilter({ ...gridFilter, ...filter });
    fetchReport(1, perPage, null, filter);
  };
  const handlePageChange = (page) => fetchReport(page, perPage);

  const handlePerRowsChange = (rowsPerPage, page) => {
    setPerPage(rowsPerPage);
    fetchReport(page, rowsPerPage);
  };
  console.log(_corporateUUID);
  useEffect(() => {
    if (!loading) {
      setTimeout(() => {
        const item = document.getElementsByName("select-all-rows")[0];
        item && item.click();
      }, 800);
    }
  }, [loading]);

  const filteredTableData = useMemo(() => {
    if (!gridFilter?.settlementId) {
      return tableData.filter((ele) => !ele.is_settled);
    }
    const isPartial = gridFilter.settlementId === 3;
    return tableData.filter(
      (ele) => ele.payment?.is_partial === isPartial && !ele.is_settled
    );
  }, [tableData, gridFilter?.settlementId , corporateUUID]);

  useEffect(() => {
    corporateUUID && fetchReport(1, 10);
  }, []);
  return (
    <div className="min-h-full bg-gray-100 rounded-md dark:bg-gray-700">
      <Header
        title={t("home_key")}
        path="/"
        links={[
          { label: t("settlement_details_key"), path: "/settlements" },
          { label: t("settlement_key") },
        ]}
        classes="bg-gray-100 dark:bg-gray-700 border-none"
      />

      <div className="py-4 bg-gray-100 dark:bg-gray-700">
        <SettlementsDetailsFilter
          corporateUUID={corporateUUID || null}
          corporateUUID2={gridFilter?.corporate?.value || null}
          fetchReport={fetchReportFromFilter}
        />
      </div>

      <ServerTable
        columns={columns}
        data={filteredTableData || []}
        // noHeader={true}

        handlePageChange={handlePageChange}
        handlePerRowsChange={handlePerRowsChange}
        progressPending={loading}
        paginationTotalRows={totalRows}
        paginationPerPage={perPage}
        selectableRows
        // selectableRowSelected={(row) => {
        //   return row.uuid
        // }}
        onSelectedRowsChange={handleChange}
        actions={
          <Actions
            gridFilter={gridFilter}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            disableSearch={!_corporateUUID}
            fetchReport={fetchReport}
            addMsg={t("add_settlement_key")}
            onClickAdd={() => setAddSettlementModal(true)}
            isDisabledAdd={
              !selectedRows?.length ||
              (!_corporateUUID)
            }
            Children={
              <>
                <span className="w-0 h-full py-2 text-transparent border-gray-300 border-x">
                  .
                </span>
                <Button
                  onClick={() =>
                    router.push(`/settlements/settlements-by-month${_corporateUUID ? `?cor=${_corporateUUID}` : ""}`
                    )
                  }
                  className="flex gap-2 btn btn--secondary"
                >
                  <ClockIcon width={25} />
                  <span>{t("settlement_by_month_key")}</span>
                </Button>
              </>
            }
          />
        }
      />
      {addSettlementModal && (
        <Modal
          footer={false}
          title={t("add_settlement_key")}
          show={addSettlementModal}
          onClose={() => setAddSettlementModal(false)}
        >
          <AddSettlement
            onClose={() => setAddSettlementModal(false)}
            selectedRows={selectedRows}
            corporateUUID={_corporateUUID}
            setTableData={setTableData}
          />
        </Modal>
      )}

      {/* ************************actions************************ */}
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

      <PrintModal ref={printBookRef} bookData={printModal.bookData} />

      {/* ************************actions************************ */}
    </div>
  );
};

Settlements.propTypes = {
  session: PropTypes.object,
  corporateUUID: PropTypes.string.isRequired,
};

Settlements.getLayout = function PageLayout(page) {
  return (
    <Layout>
      <LayoutWithSidebar>{page}</LayoutWithSidebar>
    </Layout>
  );
};

export const getServerSideProps = async (context) => {
  const session = await getSession({ req: context.req });
  const corporateUUID = context.query?.cor || "";

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
        corporateUUID,
        ...(await serverSideTranslations(context.locale, ["common"])),
      },
    };
  }
};

export default Settlements;
