import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import PropTypes from "prop-types";
import moment from "moment";
import { useTranslation } from "react-i18next";

// Custom
import config from "config/config";
import Table from "components/Table/Table";
import axiosInstance from "auth/axiosInstance";
import { useHandleMessage } from "hooks"
import { getFirstError } from "utils/utils";


export default function HistoryModal({  id }) {
  const { t } = useTranslation("common");
  const router = useRouter();
  const language = router.locale.toLowerCase();
  const date_format = language === 'en' ? 'DD/MM/YYYY' : 'YYYY/MM/DD';
  const [tableData, settableData] = useState([])
  const [loading, setLoading] = useState(true);
  const handleMessage = useHandleMessage();
  useEffect(() => {
    if (id) {
      (async () => {
        try {
          const { data: { data } } = await axiosInstance.get(`${config.apiGateway.API_URL_TELGANI}/v2/booking/${id}/history`);
          settableData(data)
        } catch ({ data }) {
          handleMessage(getFirstError(data?.errors) || data?.message || data?.error);
        } finally { setLoading(false) }
      })();
    }
  }, [id]);

  const columns = useMemo(() => [
    {
      name: t("id_key"),
      selector: row => row.id,
      sortable: true,
    },
    {
      name: t("message_key"),
      width: "350px",
      selector: row => (row.message).toString().slice(0, 100),
      sortable: true,
    },
    {
      name: t("user_key"),
      selector: row => row.author,
      sortable: true,
    },
    {
      name: t("date_time_key"),
      selector: row => moment(row.created_at).format(`${date_format}, HH:mm:ss`),
      sortable: true,
    },
  ], []);


  return (
    <>

      <div className="p-1 mt-4 bg-white rounded-md md:p-5 dark:bg-gray-800 md:min-w-[1000px]">
        <Table
          columns={columns}
          data={tableData || []}
          noHeader={true}
          pagination={true}
          searchAble={true}
          loading={loading}
          paginationRowsPerPageOptions={[10, 20, 30, 50, 100]}
        />
      </div>
    </>
  )
}
HistoryModal.propTypes = {
  id: PropTypes.string.isRequired
};