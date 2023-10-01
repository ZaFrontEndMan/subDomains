import React, { useState, useEffect } from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { getSession } from "next-auth/react";
import PropTypes from "prop-types";

// Custom
import { Layout, LayoutWithSidebar } from "components/layout";
import { registrationRequestsColumns } from "components/columns";
import { Header } from "components/global";
import { useTranslation } from "react-i18next";
import { useHandleMessage } from "hooks";

/*__________ Functions __________ */
import { acceptRequests, rejectRequests } from "helper/apis/admin";
import { Filter } from "components/pages/admin/registration-requests";
import config from "config/config";
import ServerTable from "components/ServerTable/ServerTable";
import { Actions } from "components/UI";
import { getFirstError } from "utils/utils";
import axiosInstance from "auth/axiosInstance";
// import sendPasswordResetEmail from "utils/sendPasswordResetEmail";

const RegistrationRequests = () => {
  const [tableData, setTableData] = useState([]);
  const [perPage, setPerPage] = useState(10);
  const [totalRows, setTotalRows] = useState(0);
  const [loading, setLoading] = useState(true);
  const handleMessage = useHandleMessage();

  const { t } = useTranslation("common");
  const [searchQuery, setSearchQuery] = useState("");
  const [gridFilter, setGridFilter] = useState({});

  const [actionLoading, setActionLoading] = useState(false);
  const handleAccept = async (coordinatorName, coordinatorEmail, uuid) => {
    setActionLoading(true);
    try {
      const { data } = await acceptRequests(uuid);
      setTableData((prev) =>
        prev.map((p) => (p.uuid != uuid ? p : { ...p, status: "ACCEPTED" }))
      );
      handleMessage(t("request_accepted_successfully_key"), "success");
      // try {
      //   await sendPasswordResetEmail(coordinatorName, coordinatorEmail, uuid);
      // } catch ({ data }) {
      //   handleMessage(getFirstError(data?.errors) || data?.message || data?.error);
      // }
    } catch ({ data }) {
      handleMessage(
        getFirstError(data?.errors) || data?.error || data?.message
      );
    } finally {
      setActionLoading(false);
    }
  };
  const handleReject = async (coordinatorName, coordinatorEmail, uuid) => {
    setActionLoading(true);
    try {
      const { data } = await rejectRequests(uuid);
      setTableData((prev) =>
        prev.map((p) => (p.uuid != uuid ? p : { ...p, status: "REJECTED" }))
      );
      handleMessage(t("request_rejected_successfully_key"), "success");
      // try {
      //   await sendPasswordResetEmail(
      //     coordinatorName,
      //     coordinatorEmail,
      //     uuid,
      //     "Sorry, your request has been rejected. If you have any questions or issues, feel free to contact our support team. We are here to assist you.");
      // } catch ({ data }) {
      //   handleMessage(getFirstError(data?.errors) || data?.message || data?.error);
      // }
      setLoading(false);
    } catch ({ data }) {
      handleMessage(getFirstError(data?.errors) || data?.message || data?.error);
      setLoading(false);
    }
  };

  const columns = registrationRequestsColumns(
    t,
    handleAccept,
    handleReject,
    actionLoading
  );
  const fetchReport = async (page, perPage, query = "", filter) => {
    const search = query?.trim() || searchQuery;
    setLoading(true);
    try {
      const _filter = { ...gridFilter, ...filter };

      const { data } = await axiosInstance.get(
        `${config.apiGateway.API_URL_TELGANI}/dashboard/b2b/registration-request`,
        {
          params: {
            "search[value]": search,
            ...(_filter?.corporate
              ? { "columns[1][search][value]": _filter?.corporate?.value }
              : {}),
            start: (page - 1) * perPage,
            length: perPage,
            is_export: false,
          },
        }
      );
      setTableData(
        data.data.map((t) => {
          return {
            ...t,
            request_body: JSON.parse(t.request_body),
          };
        })
      );

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
      <div className="min-h-full bg-white rounded-md dark:bg-gray-800">
        <Header
          title={t("corporates_key")}
          path="/corporate-list"
          links={[{ label: t("registration_requests_key") }]}
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
            />
          }
        />
      </div>
    </>
  );
};

RegistrationRequests.propTypes = {
  session: PropTypes.object.isRequired,
};

RegistrationRequests.getLayout = function PageLayout(page) {
  return (
    <Layout>
      <LayoutWithSidebar>{page}</LayoutWithSidebar>
    </Layout>
  );
};

export default RegistrationRequests;
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
