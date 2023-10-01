import React from 'react'
import PropTypes from 'prop-types'
import { Spinner } from 'components/UI'

const InfoCard = ({ title, count, desc, t, loading }) => {
  return (
    <div className='p-4 bg-white rounded-lg shadow-sm dark:bg-slate-800 flex-1 '>
      <div className="font-bold text-slate-600 dark:text-slate-200">{t(title)}</div>
      <div className="mt-3 text-3xl font-semibold text-primary">
        {loading && !count ? (
          <Spinner className="w-6 h-6 text-primary" />
        ) : (

          count
        )}
      </div>
      <div className="text-sm font-bold text-slate-400 dark:text-slate-200">{t(desc)}</div>
    </div>
  )
}

InfoCard.propTypes = {
  title: PropTypes.string.isRequired,
  count: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  desc: PropTypes.string.isRequired,
  t: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  tableData: PropTypes.bool.isRequired,
}

export default InfoCard