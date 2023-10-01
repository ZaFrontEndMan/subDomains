import React, { useMemo } from "react";
import PropTypes from "prop-types";
import TextError from "./TextError";

const Input = ({
  label,
  validator,
  submitted,
  mandatory,
  className = "",
  classNameWrap = "",
  formGroup = true,
  type = "text",
  append,
  prepend,
  ...props
}) => {
  const hasWarning = useMemo(
    () => submitted && validator && !validator.valid,
    [submitted, validator]
  );

  return (
    <div
      className={`w-full ${formGroup ? "form-group" : ""} ${
        hasWarning ? "-mb-1" : ""
      }`}
    >
      {label && (
        <label
          className="block text-sm text-gray-800 dark:text-white"
          htmlFor={props.id}
        >
          {label} {mandatory && <span className="text-red-500">*</span>}
        </label>
      )}
      <div
        className={`${formGroup ? "mb-4" : ""} ${
          hasWarning ? "border-red-500 " : ""
        } ${classNameWrap} ${append || prepend ? "relative" : ""}`}
      >
        {prepend && (
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <span className="text-gray-400 sm:text-sm">{prepend}</span>
          </div>
        )}
        <input
          type={type}
          className={` 
          rounded-md
          w-full px-3 py-2 
          placeholder-gray-400 text-gray-700 border
          dark:bg-gray-800
           dark:text-white 
           dark:focus:bg-gray-800
            disabled:dark:bg-gray-600
            disabled:bg-gray-300
            disabled:focus:border-0
            disabled:hover:border-transparent
             focus:outline-none
              disabled:cursor-not-allowed
             focus:shadow-outline-blue
             focus:border-primary ${className} ${
               hasWarning ? "border-red-500" : ""
             }
             hover:border-primary
            `}
          {...props}
          data-testid={props["data-testid"] || props.id}
          aria-invalid={hasWarning}
          aria-describedby={hasWarning ? `${props.id}-error` : null}
        />
        {append && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <span className="text-gray-400 sm:text-sm">{append}</span>
          </div>
        )}
        {hasWarning && <TextError>{validator.message}</TextError>}
      </div>
    </div>
  );
};

Input.propTypes = {
  id: PropTypes.string,
  label: PropTypes.string,
  validator: PropTypes.shape({
    valid: PropTypes.bool,
    message: PropTypes.string,
  }),
  submitted: PropTypes.bool,
  mandatory: PropTypes.bool,
  className: PropTypes.string,
  classNameWrap: PropTypes.string,
  formGroup: PropTypes.bool,
  type: PropTypes.string,
  append: PropTypes.object,
  prepend: PropTypes.object,
  "data-testid": PropTypes.string,
};

export default Input;
