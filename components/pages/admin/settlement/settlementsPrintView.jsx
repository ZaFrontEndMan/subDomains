import React, { forwardRef, useImperativeHandle, useRef, useCallback } from "react";
import { useRouter } from "next/router";
import moment from 'moment';
import PropTypes from 'prop-types';

// custom
import { formatComma, formatDate, sum } from "utils/utils";
import PrintPageTableWrapper from "components/printPageTableWrapper";


const settlementsPrintView = forwardRef(({ t, data }, ref) => {
    const router = useRouter();
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
            filename={t("settlement_details_key")}
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
                                <th>{t('year_month_key')}</th>
                                <th>{t('id_key')}</th>
                                <th>{t('booking_id_key')}</th>
                                <th>{t('amount_key')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data?.map((row, i) => (
                                <tr key={`row-${i}`} className="break-inside-avoid">
                                    <td>{`${formatDate(moment().month(row.month), "MMMM", router.locale)} - ${row.year}`}</td>
                                    <td>{row.uuid}</td>
                                    <td>
                                        <p className="text-primary">{row?.corporate_limits.map((c, i) => {
                                            return <p className="inline-block">
                                                <span>{c?.booking_individual_number}</span>
                                                {i + 1 < row?.corporate_limits?.length && <span className="text-black dark:text-white mx-1">,</span>}
                                            </p>
                                        })}</p>

                                    </td>
                                    <td>{formatComma(row.settled_amount_gross)}</td>
                                </tr>
                            ))}
                            {data && <tr className="h-8 text-white bg-primary">
                                <td colSpan='3' className="text-center bold">{t('total_key')}</td>
                                <td>{formatComma(sum(data, "settled_amount_gross"))}</td>

                            </tr>}
                        </tbody>
                    </table>
                </td>
            </tr>
        </PrintPageTableWrapper>
    </>
});
settlementsPrintView.propTypes = {
    t: PropTypes.func.isRequired,
    data: PropTypes.array,
};

settlementsPrintView.displayName == "settlementsPrintView";

export default settlementsPrintView;