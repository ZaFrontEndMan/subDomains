import React from 'react';
import PropTypes from 'prop-types';
import { Select, MinimizedBox } from 'components/UI';
import { useSelect } from 'hooks';
import { useTranslation } from 'react-i18next';
import { yearsFilter } from 'utils/utils';
import { SettlementFilter } from 'components/global';

export default function Filter({ fetchReport }) {
  const { t } = useTranslation('common');
  const yearId = useSelect("", "select", null);
  const settlementId = useSelect("", "select", null);

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
            options={yearsFilter()}
          />
        </div>
        <div className="">
          <SettlementFilter settlementId={settlementId} fetchReport={fetchReport} />

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