import React from "react";
import Select from "react-select";
import PropTypes from 'prop-types';

const SelectField = (props) => {
  const { options, field, form, isMulti, isObject = false, ...rest } = props;
  return (
    <Select
      options={options}
      name={field.name}
      value={
        options
          ? isMulti
            ? options.filter((option) => field.value.indexOf(option.value) >= 0)
            : options.find((option) => option.value === field.value)
          : isMulti
            ? []
            : ""
      }
      onChange={(options) => {
        form.setFieldValue(
          field.name,
          isMulti
            ? options?.map((item) => item.value)
            : isObject
              ? [options]
              : options.value
        );
      }}
      onBlur={field.onBlur}
      isMulti={isMulti}
      {...rest}
    />
  );
};

export default SelectField;
SelectField.propTypes = {
  options: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    label: PropTypes.string.isRequired
  })).isRequired,
  field: PropTypes.object.isRequired,
  form: PropTypes.object.isRequired,
  isMulti: PropTypes.bool,
  isObject: PropTypes.bool
}