


import React, { useState } from "react";
import PropTypes from "prop-types";
import { MinimizedBox } from "components/UI";
import { useSelect } from "hooks";
import { useTranslation } from "react-i18next";
import { CorporateSearch, CustomerSearch } from "components/global";
import DatePicker from 'react-datepicker';

function Filter({ fetchReport, corporateUUID, corporateUUID2 }) {
  const { t } = useTranslation('common');
  const corporateId = useSelect("", "select", null);
  const customerId = useSelect("", "select", null);

  const [dateRange, setDateRange] = useState(["", ""]);
  const [startDate, endDate] = dateRange;

  return (
    <div className="bg-white rounded-md dark:bg-gray-800 py-6 px-3">
      <div className="grid grid-cols-1 gap-2 mx-2 md:grid-cols-2 lg:grid-cols-4">
        <div className="flex flex-col pb-2">
          <label className="">{t("pick_date_key")}</label>
          <DatePicker
            placeholderText={"00/00/000 - 00/00/000"}
            wrapperClassName='date_picker_icon'
            className="w-full px-6 py-2 bg-gray-100 border rounded outline-none dark:text-white dark:bg-gray-800 hover:border-primary focus:border-primary focus:outline-none"
            selectsRange
            isClearable
            startDate={startDate}
            endDate={endDate}
            onChange={(update) => {
              setDateRange(update || null);
              if ((update[0] && update[1]) || (!update[0] && !update[1])) {
                fetchReport({ createdAt: [update[0], update[1]] })
              }
            }}
            dateFormat="dd/MM/yyyy"
          />

        </div>
        {!corporateUUID && <div className="">
          <CorporateSearch isClearable={false} corporateId={corporateId} fetchReport={fetchReport} />

        </div>}
        <div className="">
          <CustomerSearch customerId={customerId} fetchReport={fetchReport} corporateUUID={corporateUUID || corporateUUID2} />
        </div>
      </div>
    </div>
  );
}

Filter.propTypes = {
  fetchReport: PropTypes.func.isRequired,
  corporateUUID: PropTypes.string,
  corporateUUID2: PropTypes.string,
};

export default Filter;
