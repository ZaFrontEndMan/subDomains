import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import config from 'config/config';
import { Select } from 'components/UI';
import axiosInstance from 'auth/axiosInstance';
import { useSavedState } from 'hooks';

export default function CitySearch({ cityId, fetchReport, ...reset }) {
  const { t } = useTranslation('common');
  const [defaultOptions, setDefaultOptions, clearDefaultOptions] = useSavedState([], "telgani-b2b-cities-cache");

  useEffect(() => {
    const fetchData = async () => {
      await axiosInstance.get(`${config.apiGateway.API_URL_TELGANI}/v2/city/collection`)
        .then(({ data }) => {
          const city = (data?.data || [])?.map((c) => {
            return {
              value: c.uuid,
              label: new String(c.name).toString(),
            };
          });
          setDefaultOptions(city)
        });
    };

    !defaultOptions.length && fetchData();
  }, [])


  return (
    <Select
      label={t('city_key')}
      // mandatory
      // async={true}
      // loadOptions={CitySearch}
      isMulti={true}
      options={defaultOptions}
      isDisabled={false}
      value={cityId.value}
      onChange={(value) => {
        cityId.changeValue(value);
        fetchReport && fetchReport({ cityId: value });
      }}
      {...reset}
    // defaultValue={[{label:"ss",value:"va"}]}
    />
  );
}

CitySearch.propTypes = {
  cityId: PropTypes.shape({
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    changeValue: PropTypes.func,
  }).isRequired,
  fetchReport: PropTypes.func,
};
