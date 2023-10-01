import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useCallback,
} from "react";
import { useRouter } from "next/router";
import moment from "moment";
import PropTypes from "prop-types";

// custom
import PrintPageTableWrapper from "components/printPageTableWrapper";
import { useTranslation } from "react-i18next";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";

const PrintView = forwardRef(({ data }, ref) => {
  const router = useRouter();
  const { t } = useTranslation("common");
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

  const totals = data.reduce(
    (acc, curr) => {
      if (curr.regular_stats) {
        return {
          regular_stats: {
            available:
              acc.regular_stats.available + (curr.regular_stats.available || 0),
            taken: acc.regular_stats.taken + (curr.regular_stats.taken || 0),
            taken_accepted:
              acc.regular_stats.taken_accepted +
              (curr.regular_stats.taken_accepted || 0),
          },
        };
      } else {
        return acc;
      }
    },
    { regular_stats: { available: 0, taken: 0, taken_accepted: 0 } }
  );

  return (
    <>
      <PrintPageTableWrapper ref={componentRef} filename={t("offices_key")}>
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
                  <th>{t("maker_key")}</th>
                  <th>{t("model_key")}</th>
                  <th>{t("year_key")}</th>
                  <th>{t("available_key")}</th>
                  <th>{t("taken_key")}</th>
                  <th>{t("active_key")}</th>
                </tr>
              </thead>
              <tbody>
                {data?.map((row, i) => (
                  <tr key={`row-${i}`} className="break-inside-avoid">
                    <td>{row?.maker}</td>
                    <td>{row?.model}</td>
                    <td>{row?.year}</td>
                    <td>{row?.available}</td>
                    <td>{row?.taken}</td>
                    <td>
                      {row.active ? (
                        <CheckCircleIcon
                          width={25}
                          className={`text-green-600`}
                        />
                      ) : (
                        <XCircleIcon width={25} className={`text-red-600`} />
                      )}
                    </td>
                  </tr>
                ))}
                {/* {data && (
                  <tr className="h-8 text-white bg-primary">
                    <td colSpan="5" className="text-center bold">
                      {t("total_key")}
                    </td>
                    <td>{totals.regular_stats.available}</td>
                    <td>{totals.regular_stats.taken}</td>
                    <td>{totals.regular_stats.taken_accepted}</td>

                    <td></td>
                  </tr>
                )} */}
              </tbody>
            </table>
          </td>
        </tr>
      </PrintPageTableWrapper>
    </>
  );
});
PrintView.propTypes = {
  language: PropTypes.string.isRequired,
  data: PropTypes.array,
};

PrintView.displayName == "PrintView";

export default PrintView;
