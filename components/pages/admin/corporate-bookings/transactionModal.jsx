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
import { formatComma, getFirstError } from "utils/utils";


export default function TransactionModal({ id }) {
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
          const { data: { data } } = await axiosInstance.get(`${config.apiGateway.API_URL_TELGANI}/v2/transaction/${id}/booking`);
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
      selector: row => row.uuid,
      sortable: true,
    },
    {
      name: t("type_key"),
      selector: row => row.type,
      sortable: true,
    },
    {
      name: t("amount_key"),
      selector: row => formatComma(row?.amount?.gross),
      sortable: true,
    },
    {
      name: t("date_time_key"),
      selector: row => moment(row.created_at).format(`${date_format}, HH:mm:ss`),
      sortable: true,
    }
  ], []);


  return (
    <>

      <div className="p-1 mt-4 bg-white rounded-md md:p-5 dark:bg-gray-800 md:min-w-[1000px]">
        <Table
          columns={columns}
          data={tableData || []}
          noHeader
          pagination
          searchAble
          loading={loading}
          highlightOnHover
          paginationRowsPerPageOptions={[10, 20, 30, 50, 100]}
          expandableRows={(row) => row.meta}
          expandableRowsComponent={({ data }) => <ExpandedComponent t={t} data={data.meta} payment_id={data.payment_id} />}
        // expandableRowExpanded={rowPreExpanded}
        />
      </div>
    </>
  )
}
TransactionModal.propTypes = {
  id: PropTypes.string.isRequired
};


function ExpandedComponent({ t, data, payment_id }) {
  return (
    <div className="p-4 bg-gray-100 dark:bg-gray-700">
      <p>
        <span>{t("code_key")}: </span>
        <span>{data?.code}</span>
      </p>
      <p>
        <span>{t("message_key")}: </span>
        <span>{data?.message}</span>
      </p>
      <p>
        <span>{t("payment_id_key")}: </span>
        <span>{payment_id}</span>
      </p>
    </div>
  );
}
ExpandedComponent.propTypes = {
  t: PropTypes.func.isRequired,
  data: PropTypes.shape({
    code: PropTypes.string,
    message: PropTypes.string,
  }).isRequired,
  payment_id: PropTypes.string,
};