
import React from "react";
import PropTypes from "prop-types";
import { MinimizedBox } from "components/UI";
import { TrueOrFalseOptions } from "components/global";
import { useTranslation } from "react-i18next";

function Filter({ fetchReport }) {
  const { t } = useTranslation("common");
  return (
    <MinimizedBox>
      <div className="grid grid-cols-1 gap-2 mx-2 md:grid-cols-3">
        <div className="">
          <TrueOrFalseOptions
            placeholder={t("select_key")}
            label={t("is_active_key")}
            KeyName={"isActive"}
            fetchReport={fetchReport}
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