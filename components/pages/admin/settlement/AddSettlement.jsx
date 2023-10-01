import React, { useState } from 'react'
import { Input, Button, Spinner, FileInput, DateInput } from "components/UI";
import { useHandleMessage, useInput } from "hooks";
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import { addSettlement } from 'helper/apis/admin';
import { formatComma, getFirstError, sum } from 'utils/utils';
import PropTypes from 'prop-types';

export default function AddSettlements({ onClose, selectedRows, corporateUUID, setTableData }) {
  const { t } = useTranslation("common");
  const handleMessage = useHandleMessage();
  const [submitted, setSubmitted] = useState(false);

  const payment_date = useInput("", "", false);
  // const wire_transfer = useInput("", "", false);
  const [wire_transfer, setWire_transfer] = useState({});

  const submit = async () => {
    setSubmitted(true);
    const formData = new FormData();
    formData.append('total_amount', sum(selectedRows, "limit_amount_gross"));
    formData.append('payment_date', moment(payment_date).format("YYYY-MM-DD"));
    formData.append('wire_transfer_file', wire_transfer);


    // Convert corporate_limit_uuids to an array and append each value separately
    if (selectedRows && selectedRows.length > 0) {
      selectedRows.forEach((row, index) => {
        formData.append(`corporate_limit_uuids[${index}]`, row.uuid);
      });
    }
    try {
      await addSettlement(formData, corporateUUID);
      selectedRows.forEach(({ uuid }) => {
        setTableData(prev => prev.filter(p => p.uuid !== uuid))
      })

      handleMessage(t("your_data_saved_successfully_key"), "success");

      onClose();
    } catch ({ data }) {
      handleMessage(getFirstError(data?.errors) || data?.message || data?.error);
    } finally {
      setSubmitted(false);
    }
  };
  return (
    <>
      <div className="flex flex-col gap-4 p-4 w-96">
        <DateInput
          mandatory
          label={t("money_paid_in_key")}
          value={payment_date.value}
          maxDate={moment().toDate()}
          onChange={(date) => payment_date.changeValue(date)}
        />

        <Input
          disabled
          label={t("amount_in_sar_key")}
          value={formatComma(sum(selectedRows, "limit_amount_gross"))}
        />
        <FileInput
          className="mb-4"
          mandatory
          // accept="image/*"
          value={wire_transfer}
          name={"input-file"}
          label={t("wire_transfer_key")}
          errorMsg={""}
          onChange={(value) => setWire_transfer(value)}
        />
      </div>

      <div className='flex items-center justify-center gap-4 px-4'>
        <Button
          onClick={onClose}
          className="btn--secondary basis-1/2"
          type="button"
        >
          {t("cancel_key")}
        </Button>
        <Button
          disabled={submitted || !wire_transfer || !payment_date.value}
          onClick={submit}
          className="btn--primary basis-1/2"
        >
          {submitted ? (
            <>
              <Spinner className="w-4 h-4 mr-3 rtl:ml-3" />
              {t("loading_key")}
            </>
          ) : (
            t("save_key")
          )}
        </Button>
      </div>
    </>
  )
}

AddSettlements.propTypes = {
  onClose: PropTypes.func.isRequired,
  selectedRows: PropTypes.array.isRequired,
  corporateUUID: PropTypes.string.isRequired,
};