import React, { forwardRef, useImperativeHandle, useRef, useCallback } from "react";
import { useRouter } from "next/router";
import moment from 'moment';
import PropTypes from 'prop-types';

// custom
import PrintPageTableWrapper from "components/printPageTableWrapper";


const PrintView = forwardRef(({ t, data }, ref) => {
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
            filename={t("bookings_key")}
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
                                <th>{t('booking_id_key')}</th>
                                <th>{t('customer_name_key')}</th>
                                <th>{t('company_name_key')}</th>
                                <th>{t('office_name_key')}</th>
                                <th>{t('city_key')}</th>
                                <th>{t('rating_key')}</th>
                                <th>{t('pick_date_key')}</th>
                                <th>{t('drop_date_key')}</th>
                                <th>{t('created_at_key')}</th>
                                <th>{t('settlement_key')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data?.map((row, i) => (
                                <tr key={`row-${i}`} className="break-inside-avoid">
                                    <td>{row.uuid}</td>
                                    <td>{row.customer_name}</td>
                                    <td>{row.company_name}</td>
                                    <td>{row.office_name}</td>
                                    <td>{row.office_city}</td>
                                    <td>{row.last_booking_office_rating}</td>
                                    <td>{row.pick_date}</td>
                                    <td>{row.drop_date}</td>
                                    <td>{moment(row.createdAt).format(date_format)}</td>
                                    <td>{row.settlements ? t("settled_key") : t("not_settled_key")}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </td>
            </tr>
        </PrintPageTableWrapper>
    </>
});
PrintView.propTypes = {
    t: PropTypes.func.isRequired,
    data: PropTypes.array,
};

PrintView.displayName == "PrintView";

export default PrintView;