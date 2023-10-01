import React from "react";
import PropTypes from "prop-types";
import { UserCircleIcon } from "@heroicons/react/24/outline";

const CustomerOptions = ({ innerProps, data, isSelected }) => {
  return (
    <div
      className={`flex gap-2 text-sm p-2 ${isSelected ? "bg-secondary-200" : ""
        } hover:bg-gray-200 cursor-pointer`}
      {...innerProps}
    >
      <UserCircleIcon color="#777" width={22} height={22} />
      <span>{data?.label}</span>
      <span>{data?.email ? `(${data.email})` : ""}</span>
      <span>{data?.phone}</span>
    </div>
  );
};

export default CustomerOptions;

CustomerOptions.propTypes = {
  innerProps: PropTypes.object.isRequired,
  data: PropTypes.shape({
    label: PropTypes.string.isRequired,
    email: PropTypes.string,
    phone: PropTypes.string.isRequired,
  }).isRequired,
  isSelected: PropTypes.bool.isRequired,
};