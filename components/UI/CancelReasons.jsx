import React, { useEffect, useState } from "react";
import { Button, Select, Spinner } from "components/UI";
import { useTranslation } from "react-i18next";
import { useHandleMessage, useSavedState, useSelect } from "hooks";
import { adminRejectRequests, rejectRequests } from "helper/apis/booking";
import config from "config/config";
import axiosInstance from "auth/axiosInstance";
import { useRouter } from "next/router";
import { getFirstError } from "utils/utils";
import PropTypes from "prop-types";


export default function CancelReasons({ bookingDetails, handleClose, setBookingDetails = null, bookingId, fetchReport, isAdmin = false }) {
  const { t } = useTranslation("common");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const router = useRouter();
  const handleMessage = useHandleMessage();

  const language = router.locale.toLowerCase();

  const [cancelOptions, setCancelOptions, clearCancelOptions] = useSavedState([], "telgani-b2b-cancel-options-cache");

  const CancelBookingId = useSelect("", "select", null);
  const submit = async () => {
    setSubmitted(true);
    try {
      if (isAdmin) {
        const { data } = await adminRejectRequests(bookingId, { cancel_reason: { uuid: CancelBookingId.value?.value } });
        setBookingDetails && setBookingDetails(data);

      } else {
        const { message } = await rejectRequests(bookingId,
          {
            cancel_reason: {
              uuid: CancelBookingId.value?.value,
              // description: CancelBookingId.value?.description
            },
            "compensation": {
              "method": bookingDetails?.payment?.method || "",
              // "iban": "string",
              // "bank_name": "string"
            },
            // "card_holder_name": bookingDetails?.customer?.card_holder_name || ""
          });
        handleMessage(`${JSON.stringify(message)}`, "success");

        setBookingDetails && setBookingDetails({
          ...bookingDetails,
          state: "canceled",
          corporate: { ...bookingDetails.corporate, can_cancel: false }
        });

      }
      handleMessage(t("request_rejected_successfully_key"), "success");
      handleClose();
      fetchReport && fetchReport(1, 10);
    } catch ({ data }) {
      handleMessage(getFirstError(data?.errors) || data?.message || data?.error);
    } finally {
      setSubmitted(false);
    }
  };

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data: { data } } = await axiosInstance.get(`${config.apiGateway.API_URL_TELGANI}/v2/booking/cancel-reasons`);
        const formatted = data.map(item => {
          return {
            ...item,
            value: item.uuid,
            label: language == "en" ? item?.details?.name?.en : item?.details?.name?.ar,
            description: language == "en" ? item?.details?.description?.en : item?.details?.description?.ar,
          }
        })
        setCancelOptions(formatted);
        setLoading(false);
      } catch ({ data }) {
        handleMessage(getFirstError(data?.errors) || data?.message || data?.error);

      }
    }
    if (cancelOptions?.length) {
      setLoading(false);
    } else {
      setLoading(true);
      fetch();
    }
  }, [])

  return (
    <div className="m-10 w-[800px] min-h-[400px]">
      <div className="min-h-[360px]">
        {loading ? (<p className="text-center">
          <Spinner className="w-16 mx-auto " />
        </p>) : (
          <Select
            options={cancelOptions}
            mandatory
            label={t("reject_reason_key")}
            {...CancelBookingId.bind}
          />
        )}
      </div>


      <div className="flex items-center justify-end p-4 rounded-b dark:bg-gray-800 dark:text-white">
        <Button
          disabled={submitted || !CancelBookingId.value?.value}
          type="submit"
          onClick={submit}
          className={"btn--primary"}>
          {submitted ? (
            <>
              <Spinner className="w-4 h-4 mr-3 rtl:ml-3" />
              {t("loading_key")}
            </>
          ) : t("submit_key")}
        </Button>


        <Button
          className="ml-4 btn--secondary rtl:mr-4"
          onClick={handleClose}
          type="button" >{t("cancel_key")}</Button>
      </div>
    </div>
  );
}

CancelReasons.propTypes = {
  bookingDetails: PropTypes.object,
  handleClose: PropTypes.func.isRequired,
  bookingId: PropTypes.string.isRequired,
  fetchReport: PropTypes.func,
  setBookingDetails: PropTypes.func.isRequired,
};