import React, { useState } from "react";
import PropTypes from "prop-types";
import { MinimizedBox } from "components/UI";
import { SettlementFilter } from "components/global";
import { useSelect } from "hooks";
import { useTranslation } from "react-i18next";
import moment from "moment";
import DatePicker from 'react-datepicker';

function Filter({ fetchReport }) {
  const { t } = useTranslation("common");
  const settlementId = useSelect("", "select", null);

  const [dateRange, setDateRange] = useState([moment().startOf("month").toDate(), moment().endOf("month").toDate()]);
  const [startDate, endDate] = dateRange;

  return (
    <MinimizedBox>
      <div className="grid grid-cols-1 gap-2 mx-2 md:grid-cols-3">
        <div className="">
          <SettlementFilter settlementId={settlementId} fetchReport={fetchReport} />
        </div>
        <div className="flex flex-col pb-2">
          <label className="">{t("created_at_key")}</label>
          <DatePicker
            placeholderText={"00/00/000 - 00/00/000"}
            // wrapperClassName='date_picker_icon'
            className="w-full px-6 py-2 bg-gray-100 border rounded outline-none dark:text-white dark:bg-gray-800 hover:border-primary focus:border-primary focus:outline-none"
            selectsRange={true}
            startDate={startDate}
            endDate={endDate}
            onChange={(update) => {
              setDateRange(update || []);
              if (update[0] && update[1]) {
                fetchReport({ createdAt: [update[0], update[1]] })
              }
            }}
            dateFormat="dd/MM/yyyy"
          />
        </div>
      </div>
    </MinimizedBox>
  );
}

Filter.propTypes = {
  fetchReport: PropTypes.func.isRequired,
};

export default Filter;