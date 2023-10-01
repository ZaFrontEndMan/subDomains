import React from "react"
import PropTypes from "prop-types";
import { Select } from "components/UI";
import { useSelect } from "hooks";
import { AdjustmentsHorizontalIcon } from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";
const limit_options = [
  {
    label: 5,
    value: 5,
  },
  {
    label: 10,
    value: 10,
  },
  {
    label: 15,
    value: 15,
  },
  {
    label: 20,
    value: 20,
  },
  {
    label: 25,
    value: 25,
  }
];

export function Header({ showFilter, setShowFilter, fetchFromFilter }) {
  const { t } = useTranslation("common");
  const order_by_options = [
    {
      label: t("price_key"),
      value: "price_asc",
    },
    // {
    //   label: t("near_me_key"),
    //   value: "near_me_asc",
    // }
  ];
  const limit = useSelect(limit_options[0], "select", null);
  const order_by = useSelect(order_by_options[0], "select", null);

  return (
    <header className="flex justify-between flex-row">
      <button className="flex gap-2" onClick={() => setShowFilter(!showFilter)}>
        <AdjustmentsHorizontalIcon width={25} />
        <span>{t("filters_key")}</span>
      </button>

      <div className="flex justify-start gap-2 items-center ">
        <div className="flex justify-start gap-2 items-center">
          <span>{t("show_key")}</span>
          <Select
            label=""
            options={limit_options}
            value={limit.value}
            onChange={(item) => {
              limit.changeValue(item)
              item?.value && fetchFromFilter({ limit: item.value })
            }}
          />
        </div>
        <div className="flex justify-start gap-2 items-center">
          <span>{t("sort_key")}</span>
          <Select
            label=""
            options={order_by_options}
            value={order_by.value}
            onChange={(item) => {
              order_by.changeValue(item)
              fetchFromFilter({ order_by: item?.value })
            }}
          />
        </div>
      </div>

    </header>
  )
}

Header.propTypes = {
  t: PropTypes.func.isRequired,
  showFilter: PropTypes.bool.isRequired,
  setShowFilter: PropTypes.func.isRequired,
  fetchFromFilter: PropTypes.func.isRequired,
};