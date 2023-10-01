
import React from "react";
import PropTypes from "prop-types";
import { MinimizedBox } from "components/UI";
import { CorporateSearch } from "components/global";
import { useSelect } from "hooks";

function Filter({ fetchReport }) {
  const corporateId = useSelect("", "select", null);

  return (
    <MinimizedBox>
      <div className="grid grid-cols-1 gap-2 mx-2 md:grid-cols-3">
        <div className="">
          <CorporateSearch corporateId={corporateId} fetchReport={fetchReport} />
        </div>
      </div>
    </MinimizedBox>
  );
}

Filter.propTypes = {
  fetchReport: PropTypes.func.isRequired,
};

export default Filter;