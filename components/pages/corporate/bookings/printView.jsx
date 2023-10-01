import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useCallback,
} from "react";
import { useRouter } from "next/router";
import moment from "moment";
import PropTypes from "prop-types";
import { XCircleIcon } from "@heroicons/react/24/outline";

// custom
import PrintPageTableWrapper from "components/printPageTableWrapper";

const PrintView = forwardRef(({ t, data }, ref) => {
  const router = useRouter();
  const componentRef = useRef(null);
  const language = router.locale.toLowerCase();

  const date_format = language === "en" ? "DD/MM/YYYY" : "YYYY/MM/DD";

  const now = moment().format(`${date_format}, HH:mm:ss`);

  const printComponent = useCallback(() => {
    componentRef.current.print();
  }, [componentRef.current]);
  useImperativeHandle(ref, () => ({
    print: () => {
      printComponent();
    },
  }));
  return (
    <>
      <PrintPageTableWrapper ref={componentRef} filename={t("bookings_key")}>
        <tr>
          <td>
            <p className="m-0 text-end">
              <i>
                <small>
                  {t("printed_on_key")} {now}
                </small>
              </i>
            </p>
            <table
              className="table table-print table-bordered w-100"
              dir={language == "ar" ? "rtl" : "ltr"}
              style={{ direction: language == "ar" ? "rtl" : "ltr" }}
            >
              <thead className="h-10 font-bold text-white bg-primary">
                <tr>
                  <th>{t("customer_name_key")}</th>
                  <th>{t("created_at_key")}</th>
                  <th>{t("pickup_date_key")}</th>
                  <th>{t("booking_id_key")}</th>
                  <th>{t("car_name_key")}</th>
                  <th>{t("amount_of_booking_key")}</th>
                  <th>{t("settlements_key")}</th>
                </tr>
              </thead>
              <tbody>
                {data?.map((row, i) => (
                  <tr key={`row-${i}`} className="break-inside-avoid">
                    <td>{row.customer_name}</td>
                    <td>{moment(row.createdAt).format(date_format)}</td>
                    <td>{moment(row.pickDate).format(date_format)}</td>
                    <td>{row.individual_number}</td>
                    <td>{row.vehicle}</td>
                    <td>{row.total_base_nett_price}</td>
                    <td>
                      {row.is_settled ? (
                        <XCircleIcon width={25} className={`text-green-600`} />
                      ) : (
                        <XCircleIcon width={25} className={`text-red-600`} />
                      )}
                    </td>{" "}

                  </tr>
                ))}
              </tbody>
            </table>
          </td>
        </tr>
      </PrintPageTableWrapper>
    </>
  );
});
PrintView.propTypes = {
  t: PropTypes.func.isRequired,
  data: PropTypes.array,
};

PrintView.displayName == "PrintView";

export default PrintView;
