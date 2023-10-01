import React, { useCallback, useEffect } from "react";
import PropTypes from "prop-types";
// import { useCountries } from "use-react-countries";
import { Menu, MenuHandler, MenuList, MenuItem, Button } from "@material-tailwind/react";
import Image from "next/image";
import { Input } from "components/UI";
import { useTranslation } from "react-i18next";
import { countries } from "constants/jsonData";

export default function PhoneInput({ value, setValue, label, country, setCountry, mandatory, placeholder, ...rest }) {
  const { t } = useTranslation("common");
  // const { countries } = useCountries();

  const handleGetSelected = useCallback(() => {
    return countries.find(({ countryCallingCode }) => countryCallingCode && value.includes(countryCallingCode));
  }, [value]);

  useEffect(() => {
    if (value) {
      const selectedCountry = handleGetSelected();
      if (selectedCountry) {
        setValue(value.replace(selectedCountry.countryCallingCode, ""));
        setCountry({
          index: countries.indexOf(selectedCountry),
          country_code: selectedCountry.countryCallingCode
        });
      }
    }
  }, [value, handleGetSelected, setValue, setCountry]);

  const handleCountrySelect = (index, countryCallingCode) => {
    setCountry({
      index,
      country_code: countryCallingCode
    });
  };

  const { name, flags, countryCallingCode } = countries[country.index || 0];

  return (
    <div className="relative flex flex-col">
      {label && (
        <label className="block text-sm text-gray-800 dark:text-white">{label} {mandatory && <span className="text-red-500">*</span>}</label>
      )}
      <div className="relative flex w-full">
        <Menu placement="bottom-start">
          <MenuHandler>
            <Button
              ripple={false}
              variant="text"
              color="blue-gray"
              className=" flex items-center h-10 gap-2 pl-3 border border-l-0 rounded-r-none ltr:border-r-0 ltr:border-l-2 ltr:rounded-l-none border-blue-gray-200 bg-blue-gray-500/10"
            >
              <Image
                width={"25px"}
                height={"25px"}
                src={flags.svg}
                alt={name}
                className="rounded-full"
              />
              {countryCallingCode}
            </Button>
          </MenuHandler>
          <MenuList className="max-h-[20rem] max-w-[20rem] dark:bg-gray-900">
            {countries.map(({ name, flags, countryCallingCode }, index) => (
              <MenuItem
                key={name}
                value={name}
                className="flex items-center gap-2"
                onClick={() => handleCountrySelect(index, countryCallingCode)}
              >
                <Image
                  width={"25px"}
                  height={"25px"}
                  src={flags.svg}
                  alt={name}
                  className="rounded-full"
                />
                {name} <span className="ml-auto">{countryCallingCode}</span>
              </MenuItem>
            ))}
          </MenuList>
        </Menu>
        <Input
          placeholder={placeholder}
          // || t("enter_your_phone_number_key")
          value={value}
          submitted={value}
          validator={{ valid: !isNaN(value), message: t('phone_number_is_invalid_key') }}


          onChange={(event) => setValue(event.target.value)}
          {...rest}
        />
      </div>
    </div>
  );
}

PhoneInput.propTypes = {
  value: PropTypes.string.isRequired,
  setValue: PropTypes.func.isRequired,
  label: PropTypes.string,
  placeholder: PropTypes.string,
  mandatory: PropTypes.string,
  setCountry: PropTypes.func.isRequired,
  country: PropTypes.shape({
    index: PropTypes.number.isRequired,
    country_code: PropTypes.string,
  }).isRequired,
};

PhoneInput.defaultProps = {
  country: { index: 0, country_code: "" }
};
