import React from "react";
import { Field, ErrorMessage } from "formik";
import SelectField from "./SelectField";
import { TextError } from "components/UI";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";

const ReactSelect = ({ label, name, className, options, isObject = false }) => {
  const { theme } = useSelector((state) => state.theme);
  const darkMode = theme === "dark";

  const getOptionBackground = (isSelected, isFocused) => {
    if (darkMode) {
      return isSelected ? "#15A9BE" : isFocused ? "#129aaa" : "#212121";
    } else {
      return isSelected ? "#15A9BE" : isFocused ? "#129aaa" : undefined;
    }
  };

  const getOptionColor = (isSelected, isFocused) => {
    return isSelected || isFocused ? "#fff" : darkMode ? "#fff" : "inherit";
  };

  const colorStyles = {
    control: (styles, { isDisabled }) => ({
      ...styles,
      backgroundColor: darkMode ? "bg-gray-800" : isDisabled ? "#e9ecef" : "bg-gray-800",
      borderColor: "#e9ecef",
      boxShadow: "none",
      cursor: isDisabled ? "not-allowed" : "pointer",
      pointerEvents: isDisabled ? "auto" : "auto",
      "&:hover": {
        ...styles["&:hover"],
        borderColor: "#15A9BE",
      },
    }),
    option: (styles, { isDisabled, isSelected, isFocused }) => ({
      ...styles,
      cursor: isDisabled ? "not-allowed" : "pointer",
      backgroundColor: getOptionBackground(isSelected, isFocused),
      color: getOptionColor(isSelected, isFocused),
      ":active": {
        ...styles[":active"],
        backgroundColor: !isDisabled ? (isSelected ? "#15A9BE" : "#129aaa") : undefined,
      },
    }),
    singleValue: (styles) => ({
      ...styles,
      color: darkMode ? "#fff" : "inherit",
    }),
    menu: (styles) => ({
      ...styles,
      backgroundColor: darkMode ? "bg-gray-800" : "#fff",
    }),
    input: (styles) => ({
      ...styles,
      color: darkMode ? "#fff" : "#151824",
    }),
  };

  return (
    <div className={className}>
      <label htmlFor={name} className="block text-sm text-gray-800 dark:text-white">{label}</label>
      <Field
        component={SelectField}
        options={options}
        id={name}
        name={name}
        isObject={isObject}
        styles={colorStyles}
      />
      <ErrorMessage name={name} component={TextError} />
    </div>
  );
};

ReactSelect.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  className: PropTypes.string,
  options: PropTypes.oneOfType([
    PropTypes.arrayOf(
      PropTypes.shape({
        value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        label: PropTypes.string.isRequired,
      })
    ),
    PropTypes.arrayOf(PropTypes.string),
  ]).isRequired,
  isObject: PropTypes.bool,
};

export default ReactSelect;
