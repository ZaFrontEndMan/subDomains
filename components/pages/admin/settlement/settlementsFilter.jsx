import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Select, MinimizedBox } from 'components/UI';
import { useSelect } from 'hooks';
import { useTranslation } from 'react-i18next';
import { monthsFilter, yearsFilter } from 'utils/utils';
import moment from 'moment';

export default function Filter({ fetchReport }) {
  const { t } = useTranslation('common');
  const yearId = useSelect("", "select", null);
  const monthId = useSelect("", "select", null);

  const years = yearsFilter() || [];
  const months = monthsFilter() || [];

  useEffect(() => {
    fetchReport({ yearId: years[0], monthId: months.find(e => e.value == moment().format("MM")) })
  }, [])

  return (
    <MinimizedBox>
      <div className="grid grid-cols-1 gap-2 mx-2 md:grid-cols-4">
        <div className="">
          <Select
            label={t('year_key')}
            onChange={(value) => {
              yearId.changeValue(value)
              fetchReport && fetchReport({ yearId: value })
            }}
            options={years}
            isClearable={false}
            defaultValue={years[0]}
          />
        </div>
        <div>
          <Select
            label={t('month_key')}
            onChange={(value) => {
              monthId.changeValue(value)
              fetchReport && fetchReport({ monthId: value })
            }}
            options={months}
            isClearable={false}
            defaultValue={months.find(e => e.value == moment().format("MM"))}
          />
        </div>
      </div>
    </MinimizedBox>
  );
}

Filter.propTypes = {
  years: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.any.isRequired,
    })
  ).isRequired,
  months: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.any.isRequired,
    })
  ).isRequired,
  fetchReport: PropTypes.func
};