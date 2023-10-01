import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { Select } from 'components/UI';

export default function SettlementFilter({ settlementId, fetchReport, showSettled = true, showPartiallySettled = true }) {
  const { t } = useTranslation('common');
  const options = [
    { label: t('all_key'), value: null },
    ...(showSettled
      ? [{ label: t('settled_key'), value: 1 }]
      : []),
    { label: t('not_settled_key'), value: 2 },
    ...(showPartiallySettled
      ? [{ label: t('partially_settled_key'), value: 3 }]
      : []),

  ];
  return (
    <Select
      label={t('settlement_key')}
      options={options}
      value={settlementId.value}
      onChange={(value) => {
        settlementId.changeValue(value);
        fetchReport && fetchReport({ settlementId: value?.value });
      }}
    />
  );
}

SettlementFilter.propTypes = {
  settlementId: PropTypes.shape({
    value: PropTypes.any.isRequired,
    changeValue: PropTypes.func.isRequired,
  }).isRequired,
  fetchReport: PropTypes.func,
  showSettled: PropTypes.bool,
};