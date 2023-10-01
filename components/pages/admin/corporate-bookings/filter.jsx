import React, { useCallback, useState } from "react";
import PropTypes from "prop-types";
import { Button, MinimizedBox, Select } from "components/UI";
import {
  BookingStateSearch,
  CitySearch,
  CompanySearch,
  TrueOrFalseOptions,
} from "components/global";
import { useSelect } from "hooks";
import { useTranslation } from "react-i18next";
import DatePicker from "react-datepicker";

// custom
function Filter({
  fetchReport: fetch,
}) {
  const { t } = useTranslation("common");
  const [collectedFilters, setCollectedFilters] = useState({});

  const fetchReport = useCallback((value) => setCollectedFilters(prev => ({ ...prev, ...value })), []);
  const fetchByCollectedData = useCallback(() => fetch(collectedFilters), [collectedFilters]);

  const cancel = () => {
    companyId.reset();
    stateId.reset();
    paymentMethod.reset();
    officeRating.reset();
    editByCustomer.reset();
    extendStatus.reset();
    servicesType.reset();
    cityId.reset();

    setPickDateDateRange([null, null]);
    setDropDateDateRange([null, null]);
    setOpenedContractDateDateRange([null, null]);
    setClosedContractDateDateRange([null, null]);
    setCreatedAtDateRange([null, null]);
    setCollectedFilters({});
    fetch({ reset: true });
  }

  const paymentMethods = [
    {
      value: 1,
      val: null,
      secondValue: null,
      label: t("all_key"),
    },
    {
      value: 2,
      val: "card",
      secondValue: null,
      label: t("card_key"),
    },
    {
      value: 3,
      val: "cash",
      secondValue: null,
      label: t("cash_key"),
    },
    {
      value: 4,
      val: "wallet",
      secondValue: "telganipay",
      label: t("wallet_key"),
    },
    {
      value: 5,
      val: "wallet",
      secondValue: "applepay",
      label: t("apple_pay_key"),
    },
  ];
  const officeRatings = [
    {
      value: null,
      label: t("all_key"),
    },
    {
      value: 1,
      label: 1,
    },
    {
      value: 2,
      label: 2,
    },
    {
      value: 3,
      label: 3,
    },
    {
      value: 4,
      label: 4,
    },
    {
      value: 5,
      label: 5,
    },
  ];
  const editByCustomerOptions = [
    {
      value: null,
      label: t("all_key"),
    },
    {
      value: "extended",
      label: t("extended_key"),
    },
    {
      value: "changed",
      label: t("changed_key"),
    },
    {
      value: "both",
      label: t("both_key"),
    },
  ];
  const extendStatusOptions = [
    {
      value: null,
      label: t("all_key"),
    },
    {
      value: "accepted",
      label: t("accepted_key"),
    },
    {
      value: "rejected",
      label: t("rejected_key"),
    },
    {
      value: "pending",
      label: t("pending_key"),
    },
  ];
  const servicesTypeOptions = [
    {
      value: null,
      label: t("all_key"),
    },
    {
      value: "airport",
      label: t("airport_key"),
    },
    {
      value: "delivery",
      label: t("delivery_key"),
    },
    {
      value: "pickup",
      label: t("pickup_key"),
    },
    {
      value: "subscription",
      label: t("subscription_key"),
    },
  ];

  const companyId = useSelect("", "select", null);
  const stateId = useSelect("", "select", null);
  const paymentMethod = useSelect("", "select", null);
  const officeRating = useSelect("", "select", null);
  const editByCustomer = useSelect("", "select", null);
  const extendStatus = useSelect("", "select", null);
  const servicesType = useSelect("", "select", null);
  const cityId = useSelect("", "select", null);

  // pick date
  const [pickDateDateRange, setPickDateDateRange] = useState([null, null]);
  const [pickDateStartDate, pickDateEndDate] = pickDateDateRange;

  // drop date
  const [dropDateDateRange, setDropDateDateRange] = useState([null, null]);
  const [dropDateStartDate, dropDateEndDate] = dropDateDateRange;

  // openedContract date
  const [openedContractDateDateRange, setOpenedContractDateDateRange] =
    useState([null, null]);
  const [openedContractDateStartDate, openedContractDateEndDate] =
    openedContractDateDateRange;

  // closedContract date
  const [closedContractDateDateRange, setClosedContractDateDateRange] =
    useState([null, null]);
  const [closedContractDateStartDate, closedContractDateEndDate] =
    closedContractDateDateRange;

  // created at
  const [createdAtDateRange, setCreatedAtDateRange] = useState([null, null]);
  const [createdAtStartDate, createdAtEndDate] = createdAtDateRange;

  return (
    <MinimizedBox>
      <div className="grid grid-cols-1 gap-3 mx-2 md:grid-cols-3 lg:grid-cols-4">
        <div className="">
          <CompanySearch
            placeholder={t("select_key")}
            companyId={companyId}
            fetchReport={fetchReport}
          />
        </div>
        <div className="">
          <BookingStateSearch
            placeholder={t("select_key")}
            stateId={stateId}
            fetchReport={fetchReport}
          />
        </div>
        <div className="">
          <Select
            placeholder={t("select_key")}
            label={t("payment_method_key")}
            options={paymentMethods}
            value={paymentMethod.value}
            onChange={(value) => {
              paymentMethod.changeValue(value);
              fetchReport && fetchReport({ paymentMethod: value });
            }}
          />
        </div>

        <div className="">
          <TrueOrFalseOptions
            placeholder={t("select_key")}
            label={t("delivery_key")}
            KeyName={"delivery"}
            fetchReport={fetchReport}
          />
        </div>
        <div className="">
          <TrueOrFalseOptions
            placeholder={t("select_key")}
            label={t("is_settled_key")}
            KeyName={"settled"}
            fetchReport={fetchReport}
          />
        </div>

        <div className="">
          <Select
            placeholder={t("select_key")}
            label={t("office_rating_key")}
            options={officeRatings}
            value={officeRating.value}
            onChange={(value) => {
              officeRating.changeValue(value);
              fetchReport && fetchReport({ officeRating: value });
            }}
          />
        </div>
        <div className="">
          <TrueOrFalseOptions
            placeholder={t("select_key")}
            label={t("compensated_key")}
            KeyName={"compensated"}
            fetchReport={fetchReport}
          />
        </div>
        <div className="">
          <TrueOrFalseOptions
            placeholder={t("select_key")}
            label={t("kiosk_key")}
            KeyName={"kiosk"}
            fetchReport={fetchReport}
          />
        </div>
        <div className="">
          <TrueOrFalseOptions
            placeholder={t("select_key")}
            label={t("discount_key")}
            KeyName={"discount"}
            fetchReport={fetchReport}
          />
        </div>
        <div className="">
          <Select
            placeholder={t("select_key")}
            label={t("edited_by_customer_key")}
            options={editByCustomerOptions}
            value={editByCustomer.value}
            onChange={(value) => {
              editByCustomer.changeValue(value);
              fetchReport && fetchReport({ editByCustomer: value });
            }}
          />
        </div>

        {/* pick_date_key */}
        <div className="flex flex-col pb-2">
          <label className="">{t("pick_date_key")}</label>
          <DatePicker
            placeholderText={"00/00/000 - 00/00/000"}
            className="w-full px-6 py-2 bg-gray-100 border rounded outline-none dark:text-white dark:bg-gray-800 hover:border-primary focus:border-primary focus:outline-none"
            isClearable
            selectsRange
            startDate={pickDateStartDate}
            endDate={pickDateEndDate}
            onChange={(update) => {
              setPickDateDateRange(update || []);
              if ((update[0] && update[1]) || (!update[0] && !update[1])) {
                fetchReport({ pickDate: [update[0], update[1]] });
              }
            }}
            dateFormat="dd/MM/yyyy"
          />
        </div>
        {/* drop_date_key */}
        <div className="flex flex-col pb-2">
          <label className="">{t("drop_date_key")}</label>
          <DatePicker
            placeholderText={"00/00/000 - 00/00/000"}
            className="w-full px-6 py-2 bg-gray-100 border rounded outline-none dark:text-white dark:bg-gray-800 hover:border-primary focus:border-primary focus:outline-none"
            isClearable
            selectsRange
            startDate={dropDateStartDate}
            endDate={dropDateEndDate}
            onChange={(update) => {
              setDropDateDateRange(update || []);
              if ((update[0] && update[1]) || (!update[0] && !update[1])) {
                fetchReport({ dropDate: [update[0], update[1]] });
              }
            }}
            dateFormat="dd/MM/yyyy"
          />
        </div>
        {/* created_at */}
        <div className="flex flex-col pb-2">
          <label className="">{t("created_at_key")}</label>
          <DatePicker
            placeholderText={"00/00/000 - 00/00/000"}
            className="w-full px-6 py-2 bg-gray-100 border rounded outline-none dark:text-white dark:bg-gray-800 hover:border-primary focus:border-primary focus:outline-none"
            isClearable
            selectsRange
            startDate={createdAtStartDate}
            endDate={createdAtEndDate}
            onChange={(update) => {
              setCreatedAtDateRange(update || []);
              if ((update[0] && update[1]) || (!update[0] && !update[1])) {
                fetchReport({ createdAt: [update[0], update[1]] });
              }
            }}
            dateFormat="dd/MM/yyyy"
          />
        </div>
        {/* opened_contract_date_key */}
        <div className="flex flex-col pb-2">
          <label className="">{t("opened_contract_date_key")}</label>
          <DatePicker
            placeholderText={"00/00/000 - 00/00/000"}
            className="w-full px-6 py-2 bg-gray-100 border rounded outline-none dark:text-white dark:bg-gray-800 hover:border-primary focus:border-primary focus:outline-none"
            isClearable
            selectsRange
            startDate={openedContractDateStartDate}
            endDate={openedContractDateEndDate}
            onChange={(update) => {
              setOpenedContractDateDateRange(update || []);
              if ((update[0] && update[1]) || (!update[0] && !update[1])) {
                fetchReport({ openedContractDate: [update[0], update[1]] });
              }
            }}
            dateFormat="dd/MM/yyyy"
          />
        </div>
        {/* closed_contract_date_key */}
        <div className="flex flex-col pb-2">
          <label className="">{t("closed_contract_date_key")}</label>
          <DatePicker
            placeholderText={"00/00/000 - 00/00/000"}
            className="w-full px-6 py-2 bg-gray-100 border rounded outline-none dark:text-white dark:bg-gray-800 hover:border-primary focus:border-primary focus:outline-none"
            isClearable
            selectsRange
            startDate={closedContractDateStartDate}
            endDate={closedContractDateEndDate}
            onChange={(update) => {
              setClosedContractDateDateRange(update || []);
              if ((update[0] && update[1]) || (!update[0] && !update[1])) {
                fetchReport({ closedContractDate: [update[0], update[1]] });
              }
            }}
            dateFormat="dd/MM/yyyy"
          />
        </div>
        {/* extend_status_key */}
        <div className="">
          <Select
            placeholder={t("select_key")}
            label={t("extend_status_key")}
            options={extendStatusOptions}
            value={extendStatus.value}
            onChange={(value) => {
              extendStatus.changeValue(value);
              fetchReport && fetchReport({ extendStatus: value });
            }}
          />
        </div>
        {/* subscription_key */}
        <div className="">
          <TrueOrFalseOptions
            placeholder={t("select_key")}
            label={t("subscription_key")}
            KeyName={"subscription"}
            fetchReport={fetchReport}
          />
        </div>

        <div className="">
          <Select
            placeholder={t("select_key")}
            label={t("services_type_key")}
            options={servicesTypeOptions}
            value={servicesType.value}
            onChange={(value) => {
              servicesType.changeValue(value);
              fetchReport && fetchReport({ servicesType: value });
            }}
          />
        </div>

        <div className="">
          <CitySearch
            placeholder={t("select_key")}
            cityId={cityId}
            fetchReport={fetchReport}
          />
        </div>
        <div className="flex justify-start gap-2 items-end">
          <Button
            className="btn--secondary w-36"
            onClick={cancel}
          >
            {t("reset_key")}
          </Button>
          <Button
            className="btn--primary w-36"
            onClick={fetchByCollectedData}
          >
            {t("submit_key")}
          </Button>
        </div>
      </div>
    </MinimizedBox>
  );
}

Filter.propTypes = {
  fetchReport: PropTypes.func.isRequired,
};

export default Filter;
