import { TextError } from "components/UI";
import React, { Fragment } from "react";
import PropTypes from "prop-types";

function FileInput({ label, name, className, errorMsg, onChange, ...rest }) {
  return (
    <Fragment>
      <div className={`${className}`}>
        <label htmlFor={label}>{label}</label>
        <input
          className="hidden"
          type="file"
          name={name}
          id={label}
          onChange={onChange}
          {...rest}
        />
        <TextError>{errorMsg}</TextError>
      </div>
    </Fragment>
  );
}

export default FileInput;

FileInput.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  className: PropTypes.string,
  errorMsg: PropTypes.string,
  onChange: PropTypes.func.isRequired,
};