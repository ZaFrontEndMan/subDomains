import { DateInput, Button, Input, Spinner } from "components/UI";
import { extendRequest, getBook } from "helper/apis/booking";
import { useHandleMessage } from "hooks";
import moment from "moment";
import { useRouter } from "next/router";
import React, { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { getFirstError } from "utils/utils";
import PropTypes from "prop-types";
export default function ExtendModal({
  bookingDetails,
  setBookingDetails,
  drop_date,
  closeModal,
}) {
  const { t } = useTranslation("common");
  const router = useRouter();
  const bookingUUID = router?.query?.uuid || "";
  const handleMessage = useHandleMessage();

  const [newDropOffDate, setNewDropOffDate] = useState("");
  const [submitted, setSubmitted] = useState(false);

  // const newRentPrice = useMemo(() => {
  //   if (newDropOffDate && drop_date) {
  //     const price =
  //       moment(newDropOffDate).diff(moment(drop_date), "days") *
  //       (bookingDetails?.item?.base_nett_price || 0);
  //     return price;
  //   }
  //   return 0;
  // }, [newDropOffDate, drop_date, bookingDetails]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);
    try {
      const drop_date = moment(newDropOffDate).format("YYYY-MM-DD");
      await extendRequest(bookingUUID, { drop_date });

      const { data } = await getBook(bookingUUID);
      setBookingDetails(data);
      closeModal();
    } catch ({ data }) {
      handleMessage(
        getFirstError(data?.errors) || data?.error || data?.message
      );
    } finally {
      setSubmitted(false);
    }
  };
  console.log(
    moment(newDropOffDate).diff(moment(drop_date), "days") *
      bookingDetails?.item?.base_nett_price
  );
  return (
    <form onSubmit={handleSubmit}>
      <div className="flex flex-col gap-4 p-4 w-[450px]">
        <DateInput
          minDate={moment(drop_date).add(1, "day").toDate()}
          label={t("new_drop_off_date_key")}
          value={newDropOffDate}
          onChange={(value) => {
            setNewDropOffDate(value);
          }}
        />

        <Input
          
          disabled
          label={t("amount_key")}
          // {...amount.bind}
        />

        <div className="flex items-center justify-center gap-4 px-4">
          <Button
            onClick={closeModal}
            className="basis-1/2 btn--secondary"
            type="button"
          >
            {t("cancel_key")}
          </Button>
          <Button
            type="submit"
            disabled={
              submitted ||
              // || !+amount.value
              !newDropOffDate
            }
            onClick={handleSubmit}
            className="basis-1/2 btn--primary"
          >
            {submitted ? (
              <>
                <Spinner className="w-4 h-4 mr-3 rtl:ml-3" />
                {t("loading_key")}
              </>
            ) : (
              t("save_key")
            )}
          </Button>
        </div>
      </div>
    </form>
  );
}
// Define prop types for the component
ExtendModal.propTypes = {
  id: PropTypes.string.isRequired,
  closeModal: PropTypes.func.isRequired,
};
