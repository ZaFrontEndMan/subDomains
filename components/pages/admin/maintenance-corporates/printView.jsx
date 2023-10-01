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
            filename={t("maintenance_corporates_key")}
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
                                <th>{t('company_id_key')}</th>
                                <th>{t('customer_id_key')}</th>
                                <th>{t('customer_name_key')}</th>
                                <th>{t('service_type_key')}</th>
                                <th>{t('amount_key')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data?.map((row, i) => (
                                <tr key={`row-${i}`} className="break-inside-avoid">
                                    <td>{row.uuid.slice(0, 4)}</td>
                                    <td>{row.uuid.slice(3, 8)}</td>
                                    <td>
                                        <div className="flex flex-col" >
                                            <span className="block">{row?.customerName}</span>
                                            <span dir="ltr" className="block">{row?.phone}</span>
                                        </div>
                                    </td>
                                    <td>{row.serviceType}</td>
                                    <td>{formatComma(row.amount)}</td>
                                </tr>
                            ))}
                            {data && <tr className="h-8 text-white bg-primary">
                                <td colSpan='4' className="text-center bold">{t('total_key')}</td>
                                <td>{formatComma(sum(data, "amount"))}</td>
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