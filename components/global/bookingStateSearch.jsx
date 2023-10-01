import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import config from 'config/config';
import { Select } from 'components/UI';
import axiosInstance from 'auth/axiosInstance';
import { useSavedState } from 'hooks';

export default function BookingStateSearch({ stateId, fetchReport, ...reset }) {
  const { t } = useTranslation('common');
  const [defaultOptions, setDefaultOptions, clearDefaultOptions] = useSavedState([], "telgani-b2b-state-cache");

  useEffect(() => {
    const fetchData = async () => {
      await axiosInstance.get(`${config.apiGateway.API_URL_TELGANI}/v2/booking/states`)
        .then(({ data }) => {
          const company = (data?.data || [])?.map((c) => {
            return {
              value: c,
              label: t(`${c}_key`),
            };
          });
          setDefaultOptions(company)
        });
    };

    !defaultOptions.length && fetchData();
  }, [])


  return (
    <Select
      label={t('state_key')}
      options={defaultOptions}
      isDisabled={false}
      value={stateId.value}
      onChange={(value) => {
        stateId.changeValue(value);
        fetchReport && fetchReport({ stateId: value });
      }}
      {...reset}
    />
  );
}

BookingStateSearch.propTypes = {
  stateId: PropTypes.shape({
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.string]),
    changeValue: PropTypes.func,
  }).isRequired,
  fetchReport: PropTypes.func,
};