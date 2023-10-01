import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import config from 'config/config';
import { Select } from 'components/UI';
import axiosInstance from 'auth/axiosInstance';
import { useSavedState } from 'hooks';

export default function CorporateSearch({ corporateId, fetchReport, ...reset }) {
  const { t } = useTranslation('common');
  const [defaultOptions, setDefaultOptions, clearDefaultOptions] = useSavedState([], "telgani-b2b-corporates-cache");
  useEffect(() => {
    const fetchData = async () => {
      await corporateSearch("a", (data) => setDefaultOptions(data));
    };
    !defaultOptions?.length && fetchData();
  }, [])

  const corporateSearch = (inputValue, callback) => {
    if (!inputValue) {
      return callback([]);
    } else {
      axiosInstance
        .get(
          `${config.apiGateway.API_URL_TELGANI}/dashboard/b2b/corporate?search[value]=${inputValue}&start=0&length=10&is_export=false`
        )
        .then(({ data }) => {
          const corporate = data.data;
          if (!corporate?.length) {
            return callback([]);
          }
          return callback(
            [...corporate]?.map((c) => {
              return {
                value: c.uuid,
                label: c.name,
              };
            })
          );
        });
    }
  };

  return (
    <Select
      label={t('corporate_name_key')}
      mandatory
      async={true}
      loadOptions={corporateSearch}
      isDisabled={false}
      value={corporateId.value}
      onChange={(value) => {
        corporateId.changeValue(value);
        fetchReport && fetchReport({ corporate: value });
      }}
      {...reset}
      defaultOptions={defaultOptions}
    // defaultValue={[{label:"ss",value:"va"}]}
    />
  );
}

CorporateSearch.propTypes = {
  corporateId: PropTypes.shape({
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    changeValue: PropTypes.func,
  }).isRequired,
  fetchReport: PropTypes.func,
};