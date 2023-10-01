import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useHandleMessage } from "hooks";
import { getFirstError } from "utils/utils";
import axiosInstance from "auth/axiosInstance";
import config from "config/config";
import exportExcel from "utils/useExportExcel";

import { Modal, Button, Spinner } from "components/UI";

export default function updatePricesModal({ closeModal, companyUUID }) {
  const { t } = useTranslation("common");
  const handleMessage = useHandleMessage();

  const [exportLoading, setExportLoading] = useState(false);
  const [importLoading, setImportLoading] = useState(false);
  const columns = [
    {
      name: "office_car_uuid",
      getValue: (row) => row?.office_car_uuid,
    },
    {
      name: "company_name",
      getValue: (row) => row?.company_name,
    },
    {
      name: "office_uuid",
      getValue: (row) => row?.office_uuid,
    },
    {
      name: "office_name",
      getValue: (row) => row?.office_name,
    },
    {
      name: "car_name",
      getValue: (row) => row?.car_name,
    },
    {
      name: "available_quantity",
      getValue: (row) => row?.available_quantity,
    },
    {
      name: "is_active",
      getValue: (row) => row?.is_active,
    },
    {
      name: "daily_rate",
      getValue: (row) => row?.daily_rate,
    },
    {
      name: "daily_discounted_rate",
      getValue: (row) => row?.daily_discounted_rate,
    },
    {
      name: "weekly_rate",
      getValue: (row) => row?.weekly_rate,
    },
    {
      name: "weekly_discounted_rate",
      getValue: (row) => row?.weekly_discounted_rate,
    },
    {
      name: "monthly_rate",
      getValue: (row) => row?.monthly_rate,
    },
    {
      name: "monthly_discounted_rate",
      getValue: (row) => row?.monthly_discounted_rate,
    },
    {
      name: "activate_subscription_model",
      getValue: (row) => row?.activate_subscription_model,
    },
    {
      name: "show_car_in_subscription_list_only",
      getValue: (row) => row?.show_car_in_subscription_list_only,
    },
    {
      name: "3_months_rate",
      getValue: (row) => row["3_months_rate"],
    },
    {
      name: "6_months_rate",
      getValue: (row) => row["6_months_rate"],
    },
    {
      name: "9_months_rate",
      getValue: (row) => row["9_months_rate"],
    },
    {
      name: "12_months_rate",
      getValue: (row) => row["12_months_rate"],
    },
  ];

  const exportPrices = async () => {
    setExportLoading(true);
    try {
      const {
        data: { data },
      } = await axiosInstance.post(
        `${config.apiGateway.API_URL_TELGANI}/v2/supplier/business/company/${companyUUID}/car-prices`
      );
      await exportExcel(data, columns, `${t("prices_key")}`, handleMessage);
    } catch ({ data }) {
      handleMessage(
        getFirstError(data?.errors) || data?.message || data?.error
      );
    } finally {
      setExportLoading(false);
    }
  };
  const importPrices = async (file) => {
    setImportLoading(true);
    try {
      const {
        data: { data },
      } = await axiosInstance({
        url: `${config.apiGateway.API_URL_TELGANI}/v2/supplier/business/company/${companyUUID}/car-prices/import`,

        data: { file },

        method: "POST",
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    } catch ({ data }) {
      handleMessage(
        getFirstError(data?.errors) || data?.message || data?.error
      );
    } finally {
      setImportLoading(false);
    }
  };

  return (
    <>
      <Modal
        title={t("update_cars_prices_key")}
        show={true}
        footer={false}
        onClose={closeModal}
      >
        <div className="flex  justify-around gap-10 items-center p-4 w-[500px]">
          <div>
            <label className="btn btn--secondary" htmlFor="import">
              {importLoading ? (
                <>
                  <Spinner className="w-4 h-4 mr-3 rtl:ml-3" />
                  {t("loading_key")}
                </>
              ) : (
                t("import_key")
              )}
            </label>

            <input
              className=" hidden"
              id="import"
              type="file"
              multiple={false}
              onChange={(e) => importPrices(e.target.files[0])}
            />
          </div>

          <Button onClick={() => exportPrices(companyUUID)}>
            {exportLoading ? (
              <>
                <Spinner className="w-4 h-4 mr-3 rtl:ml-3" />
                {t("loading_key")}
              </>
            ) : (
              t("export_key")
            )}
          </Button>
        </div>
      </Modal>
    </>
  );
}
