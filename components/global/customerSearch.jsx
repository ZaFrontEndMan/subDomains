import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import config from "config/config";
import { Select } from "components/UI";
import axiosInstance from "auth/axiosInstance";

export default function customerSearch({
  customerId,
  fetchReport,
  corporateUUID,
  ...reset
}) {
  const { t } = useTranslation("common");
  const [defaultOptions, setDefaultOptions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      await customerSearch("a", (data) => setDefaultOptions(data));
    };
    corporateUUID && !defaultOptions?.length && fetchData();
  }, [corporateUUID]);

  const customerSearch = (inputValue, callback) => {
    if (!inputValue) {
      return callback([]);
    } else {
      axiosInstance
        .get(
          `${config.apiGateway.API_URL_TELGANI}/dashboard/b2b/corporate/${corporateUUID}/customer?search[value]=${inputValue}&start=0&length=10&is_export=false`
        )
        .then(({ data }) => {
          const customer = data.data;

          if (!customer?.length) {
            return callback([]);
          }

          const mappedCustomers = customer.map((c) => {
            return {
              ...c,
              value: c.uuid,
              label: c.full_name,
            };
          });

          return callback(mappedCustomers);
        });
    }
  };

  return (
    <Select
      label={t("customer_key")}
      // mandatory
      isDisabled={!corporateUUID}
      async={true}
      loadOptions={customerSearch}
      value={customerId?.value}

      onChange={(value) => {
        customerId.changeValue(value);
        fetchReport && fetchReport({ customer: value });
      }}
      {...reset}
      defaultOptions={defaultOptions}
    // defaultValue={[{label:"ss",value:"va"}]}
    />
  );
}

customerSearch.propTypes = {
  customerId: PropTypes.shape({
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    changeValue: PropTypes.func,
  }).isRequired,
  fetchReport: PropTypes.func,
};
