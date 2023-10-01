import React, { forwardRef, useImperativeHandle, useRef, useCallback } from "react";
import { useRouter } from "next/router";
import moment from 'moment';
import PropTypes from 'prop-types';

// custom
import { formatComma, sum } from "utils/utils";
import PrintPageTableWrapper from "components/printPageTableWrapper";
import { useTranslation } from "react-i18next";


const PrintView = forwardRef(({ data }, ref) => {
    const router = useRouter();
    const { t } = useTranslation("common");
    const componentRef = useRef(null);
    const language = router.locale.toLowerCase();
    const date_format = language === 'en' ? 'DD/MM/YYYY' : 'YYYY/MM/DD';

    const now = moment().format(`${date_format}, HH:mm:ss`);

    const printComponent = useCallback(() => {
        componentRef.current.print();
    }, [componentRef.current])
    useImperativeHandle(ref, () => ({
        print: () => {
            printComponent();
        }
    }));
    return <>
        <PrintPageTableWrapper
            ref={componentRef}
            filename={t("corporates_key")}
        >
            <tr>
                <td>
                    <p className="m-0 text-end"><i><small>{t('printed_on_key')} {now}</small></i></p>
                    <table className="table table-print table-bordered w-100"
                        dir={language == 'ar' ? 'rtl' : 'ltr'}
                        style={{ direction: language == 'ar' ? 'rtl' : 'ltr' }}
                    >
                        <thead className="h-10 font-bold text-white bg-primary">
                            <tr>
                                <th>{t('corporate_name_key')}</th>
                                <th>{t('total_customers_key')}</th>
                                <th>{t('number_of_bookings_key')}</th>
                                <th>{t('maximum_limits_key')}</th>
                                <th>{t('balance_key')}</th>
                                <th>{t('total_amount_key')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data?.map((row, i) => (
                                <tr key={`row-${i}`} className="break-inside-avoid">
                                    <td>{row.name}</td>
                                    <td>{row.customers_count}</td>
                                    <td>{row.bookings_count}</td>
                                    <td>{formatComma(row.total_limit_amount_gross)}</td>
                                    <td>{formatComma(row.currently_used_amount_gross)}</td>
                                    <td>{formatComma(row.total_settled_amount_gross)}</td>
                                </tr>
                            ))}
                            {data && <tr className="h-8 text-white bg-primary">
                                <td colSpan='1' className="text-center bold">{t('total_key')}</td>
                                <td>{sum(data, "customers_count")}</td>
                                <td>{sum(data, "bookings_count")}</td>
                                <td>{formatComma(sum(data, "total_limit_amount_gross"))}</td>
                                <td>{formatComma(sum(data, "currently_used_amount_gross"))}</td>
                                <td>{formatComma(sum(data, "total_settled_amount_gross"))}</td>
                            </tr>}
                        </tbody>
                    </table>
                </td>
            </tr>
        </PrintPageTableWrapper>
    </>
});
PrintView.propTypes = {
    language: PropTypes.string.isRequired,
    data: PropTypes.array,
};

PrintView.displayName == "PrintView";

export default PrintView;