


import React from "react";
import PropTypes from "prop-types";
import { useSelect } from "hooks";
import { Select, MinimizedBox } from "components/UI";
import { useTranslation } from "react-i18next";

function Filter({ fetchReport, companyOptions, customerOptions }) {
  const { t } = useTranslation('common');
  const companyId = useSelect("", "select", null);
  const customerId = useSelect("", "select", null);

  return (
    <MinimizedBox>
      <div className="grid grid-cols-1 gap-2 mx-2 md:grid-cols-4">
        <div className="">
          <Select
            label={t('company_name_key')}
            value={companyId.value}
            options={companyOptions}
            onChange={(value) => {
              companyId.changeValue(value);
              fetchReport && fetchReport({ companyName: value });
            }}
          />
        </div>
        <div className="">
          <Select
            label={t('customer_key')}
            value={customerId.value}
            options={customerOptions}
            onChange={(value) => {
              customerId.changeValue(value);
              fetchReport && fetchReport({ customerName: value });
            }}
          />
        </div>
      </div>
    </MinimizedBox>
  );
}

Filter.propTypes = {
  fetchReport: PropTypes.func.isRequired,
  companyOptions: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired
    })
  ),
  customerOptions: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired
    })
  ),
};

export default Filter;
