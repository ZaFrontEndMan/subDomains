import { Button, Modal, Spinner } from 'components/UI'
import moment from 'moment';
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next';
import { formatComma, getFirstError } from 'utils/utils'
import PropTypes from 'prop-types';
import { useHandleMessage } from 'hooks';
import { payment, withPayment } from 'helper/apis/booking';
import { useRouter } from 'next/router';

export default function Actions({
  discrad,
  summary,
  extraInsurance,
  babySeat,
  unlimitedKm,
  setUpdateLocaleStorage
}) {
  const { t } = useTranslation("common");
  const router = useRouter();
  const [showDetails, setShowDetails] = useState(false);
  const [showDiscardModal, setShowDiscardModal] = useState(false);
  const handleMessage = useHandleMessage();
  const [submitted, setSubmitted] = useState(false);

  const submit = async () => {
    setSubmitted(true);
    const formattedData = {
      "period": {
        "pick_date": moment(summary?.pickUpDate).format("YYYY-MM-DD"),
        "pick_time": summary?.time,
        "drop_date": moment(summary?.dropUpDate).format("YYYY-MM-DD")
      },
      "options": {
        "delivery_location": {
          "delivery_lat": summary?.driverTheCarToYourLocation?.lat || summary?.deliveryLocation?.lat || null,
          "delivery_lng": summary?.driverTheCarToYourLocation?.lng || summary?.deliveryLocation?.lng || null,
        },
        // "delivery": summary?.selectedReceiveType == 1,
        "unlimitedKm": summary?.isUnlimitedKm,
        "insurance": summary?.isExtraInsurance,
        "child_seat": summary?.isBabySeat,
        "promo_code": summary.promoCode,
        "fast_delivery_at_airport": summary?.selectedCar?.office?.fast_delivery_at_airport,

        "driver": false,
        "tam": null,
        "extra_driver": null,
        "auth_out_ksa": null,
        "no_smoking_car": null,
        "delivery_drop": null,
        "cancellation": false,
        "dropCity": null,
        "drop_office_uuid": null,
        "externals": [
          "string"
        ],
        "rewards": [
          "string"
        ],
      },
      "location": {
        "address": summary?.deliveryLocation?.address || "",
        "lat": summary?.deliveryLocation?.lat || null,
        "lng": summary?.deliveryLocation?.lng || null,
        "delivery_address": summary?.deliveryLocation?.address || ""
      },
      "item": {
        "uuid": summary?.selectedCar?.uuid || null
      },
      "booking_owner_uuid": summary?.customer?.uuid || null
    }
    try {
      const { data } = await withPayment(formattedData);
      const paymentData = {
        "billing_uuid": data?.billing_uuid || "",
        "booking_uuid": data?.uuid || "",
        "payments": {
          "corporate_limit": {
            "corporate_limit": {
              "amount": +summary?.totalAmount || 0,
              "method_type": "corporatepay",
              "payload": {
                "uuid": data?.corporate_booking_limit_uuid


              }
            }
          }
        }
      }
      await payment(paymentData, data.uuid);
      setShowDetails(false);
      handleMessage(t("your_booking_created_successfully_key"), "success");
      router.push(`/corporate/bookings/preview?uuid=${data?.uuid}`)
    }
    catch ({ data }) {
      handleMessage(getFirstError(data?.errors) || data?.message || data?.error);
    } finally {
      setSubmitted(false);
    }
  }
  return (
    <>
      <div className="flex items-center justify-between">
        <Button className="btn--secondary" onClick={() => setShowDiscardModal(true)}>{t('discard_key')}</Button>
        <div className="flex items-center justify-between gap-3">
          <Button onClick={() => {
            handleMessage(t("your_data_saved_successfully_key"), "success");
            setUpdateLocaleStorage(prev => !prev);
          }} className="btn--secondary">
            {t('save_key')}
          </Button>
          {summary?.selectedCar?.updated ? (<Button disabled={!summary?.vehicle?.name || !summary?.customer?.value || !summary?.pickUpDate || !summary?.dropUpDate} onClick={() => setShowDetails(true)}>
            {t('book_now_key')} ({t("sar_key")} {formatComma(summary?.totalAmount)})
          </Button>) : (
            <Spinner className="w-5" />
          )}
        </div>
      </div>

      {showDetails && (
        <Modal
          title={t('booking_details_key')}
          show={showDetails}
          footer={false}
          onUpdate={() => handleMessage("soon", "warning")}
          onClose={() => setShowDetails(false)}


        >
          <>
            <div className="flex flex-col text-sm gap-y-2 min-w-[500px]">

              <p className="flex items-center justify-between px-2">
                <span>{t("car_details_key")}</span>
                <span>{summary?.vehicle?.name}</span>
              </p>
              <p className="flex items-center justify-between px-2">
                <span>{t("pick_up_date_and_time_key")}</span>
                <span>{moment(summary?.pickUpDate).format("LL")}</span>
              </p>

              <p className="flex items-center justify-between px-2">
                <span>{t("drop_up_date_and_time_key")}</span>
                <span>{moment(summary?.dropUpDate).format("LL")}</span>
              </p>

              <p className="flex items-start justify-between px-2 mt-2 shadow-sm">
                <span>{t("extra_service_key")}</span>
                <div className='flex flex-col'>

                  {extraInsurance && (
                    <p className="flex items-center justify-between gap-2 px-2">
                      <span>+ {t("extra_insurance_key")}</span>
                      {/* <span>{formatComma(summary?.extraInsuranceDefaultAmount)}</span> */}
                    </p>
                  )}
                  {babySeat && (
                    <p className="flex items-center justify-between gap-2 px-2">
                      <span>+ {t("baby_seat_key")}</span>
                      {/* <span>{formatComma(summary?.babySeatAmount)}</span> */}
                    </p>
                  )}
                  {unlimitedKm && (
                    <p className="flex items-center justify-between gap-2 px-2">
                      <span>+ {t("unlimited_km_key")}</span>
                      {/* <span>{formatComma(summary?.unlimitedKmDefaultAmount)}</span> */}
                    </p>
                  )}
                </div>
              </p>

              <p className="flex items-center justify-between px-2 mt-2">
                <span>{t("company_key")}</span>
                <span>{summary?.selectedCar.office?.company?.name}</span>
              </p>
              <p className="flex items-center justify-between px-2">
                <span>{t("branch_key")}</span>
                <span>{summary?.selectedCar.office?.name}</span>
              </p>

              <hr className="w-full border border-gray-300 " />

              <h3 className='text-bold'>{t("payment_break_down_key")}</h3>
              <p className="flex items-center justify-between px-2 language">
                <span>{t("original_price_key")}</span>
                <span>{` ${formatComma(summary?.originalPrice / summary?.days)}  ${t("sar_key")} * ${`${summary?.days}`} ${t("day_key")}`}</span>
              </p>
              <p className="flex items-center justify-between px-2">
                <span>{t("service_fee_key")}</span>
                <span>{`${t("sar_key")} ${formatComma(summary?.serviceFee)}`}</span>
              </p>
              {extraInsurance && (
                <p className="flex items-center justify-between gap-2 px-2">
                  <span>+ {t("extra_insurance_key")}</span>
                  <span>{`${t("sar_key")} ${formatComma(summary?.extraInsuranceAmount)}`}</span>
                </p>
              )}
              {babySeat && (
                <p className="flex items-center justify-between gap-2 px-2">
                  <span>+ {t("baby_seat_key")}</span>
                  <span>{`${t("sar_key")} ${formatComma(summary?.babySeatAmount)}`}</span>
                </p>
              )}
              {unlimitedKm && (
                <p className="flex items-center justify-between gap-2 px-2">
                  <span>+ {t("unlimited_km_key")}</span>
                  <span>{`${t("sar_key")} ${formatComma(summary?.unlimitedKmAmount)}`}</span>
                </p>
              )}

              <p className="flex items-center justify-between p-2 bg-gray-200 rounded dark:bg-gray-700 dark:text-white">
                <span>{t("total_price_key")}</span>
                <span>{`${t("sar_key")} ${formatComma(summary?.totalAmount)}`}</span>
              </p>

              <hr className="w-full border border-gray-300 " />

              <div className='flex items-center justify-between'>
                <h3 className='font-bold '>{t("payment_method_key")}</h3>
                <Button className='text-sm btn--primary'>{`${t("limit_key")} (${formatComma(summary?.limit)})`}</Button>
              </div>
            </div>
            <div className="flex items-center justify-end p-4 border-t border-solid rounded-b border-slate-200 dark:border-gray-500 dark:bg-gray-800 dark:text-white">
              <Button
                className="btn btn--secondary"
                type="button" onClick={() => setShowDetails(false)}>
                {t("cancel_key")}
              </Button>
              <Button
                disabled={submitted}
                className={" btn btn--primary ml-4 rtl:mr-4"}
                type="button"
                onClick={submit}
              >
                {submitted ? (
                  <>
                    <Spinner className="w-4 h-4 mr-3 rtl:ml-3" />
                    {t("loading_key")}
                  </>
                ) : t("confirm_key")}
              </Button>
            </div>
          </>
        </Modal>
      )}
      {showDiscardModal && (
        <Modal
          title={t('discard_key')}
          show={showDiscardModal}
          footer={true}
          onUpdate={() => {
            setShowDiscardModal(false);
            discrad();
          }}
          onClose={() => setShowDiscardModal(false)}
          submitText={t("discard_key")}


        >
          <div className='w-[500px]'>
            {t("are_you_sure_you_want_to_discard_this_trip_key")}
          </div>
        </Modal>
      )}
    </>
  )
}

Actions.propTypes = {
  discrad: PropTypes.func.isRequired,
  setUpdateLocaleStorage: PropTypes.func,
  summary: PropTypes.object.isRequired,
  extraInsurance: PropTypes.bool.isRequired,
  babySeat: PropTypes.bool.isRequired,
  unlimitedKm: PropTypes.bool.isRequired,
};
