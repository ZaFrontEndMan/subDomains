import React from 'react'
import { useTranslation } from 'react-i18next'
import PropTypes from "prop-types"
import Image from 'next/image';

export default function SelectComponent({ title, options, selected, setSelected, classes }) {
  const { t } = useTranslation("common");
  return (
    <div className={classes}>
      <h4 className="">
        {t(title)}
      </h4>
      <div className={`flex border rounded-3xl justify-between`}>
        {options.map((item, i) => {
          return (
            <button
              disabled={item.disabled}
              key={item.label}
              onClick={() => setSelected(i + 1)}
              className={`flex-grow basis-1/${options.length} border  flex p-3 rounded-3xl ${item.disabled && "opacity-70"} ${selected === i + 1 ? "border-primary bg-secondary dark:bg-gray-600" : "border-transparent"}`}
            >
              <Image
                width={35}
                height={25}
                src={`/images/${item.imageType}.png`}
              />
              <span>{t(item.label)}</span>
            </button>
          );
        })}
      </div>
    </div>
  )
}
SelectComponent.propTypes = {
  title: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(PropTypes.string).isRequired,
  selected: PropTypes.number.isRequired,
  setSelected: PropTypes.func.isRequired,
  classes: PropTypes.string,
  isAirPort: PropTypes.bool,

};