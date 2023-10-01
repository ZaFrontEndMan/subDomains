import React from "react";
import { Field, ErrorMessage } from "formik";
import { TextError } from "components/UI";
import PropTypes from "prop-types";

const Input = ({ label, name, type = "text", className, ...rest }) => {
  return (
    <div className="mb-4">
      <label htmlFor={name} className="block text-sm text-gray-800 dark:text-white ">
        {label}
      </label>
      <Field
        type={type}
        id={name}
        name={name}
        className={`w-full bg-gray-100  dark:bg-gray-700 text-gray-800 dark:text-white border border-gray-300 dark:border-gray-300 rounded py-2 px-2 focus:outline-none focus:bg-white hover:border-primary dark:focus:bg-gray-800 ${className}`}
        {...rest}
      />
      <ErrorMessage name={name} component={TextError} />
    </div>
  );
};

Input.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  type: PropTypes.string,
  className: PropTypes.string,
};

export default Input;
