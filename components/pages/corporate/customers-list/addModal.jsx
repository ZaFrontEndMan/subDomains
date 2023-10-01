import React, { useCallback, useState } from "react";
import PropTypes from "prop-types";

// Custom
import { useHandleMessage, useInput } from "hooks"
import { DateInput, PhoneInput, Button, Spinner, Input, FileInput } from "components/UI";
import { useTranslation } from "react-i18next";
import moment from "moment";
import { getFirstError } from "utils/utils";
import { addCustomer, assignCustomer, customerLicenseScan, getCustomer } from "helper/apis/customer";
import { useRouter } from "next/router";
import { InformationCircleIcon } from "@heroicons/react/24/outline";


export default function AddCustomerModal({ fetchReport, handleClose, corporateUUID, isFromBook, customerId }) {
  const { t } = useTranslation("common");
  const [stepType, setStepType] = useState("");
  const [step, setStep] = useState(1);
  const router = useRouter();

  const handleMessage = useHandleMessage();
  // const [user_uuid, setUser_uuid] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [country, setCountry] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("+966");
  const license_number = useInput("", "number", true);

  const name = useInput("", "", true);
  const birth_date = useInput("", "", true);
  const license_expire_date = useInput("", "", true);
  const email = useInput("", "email", true);
  const [driverLicense, setDriverLicense] = useState({});

  const closeModal = (close = false) => {
    setPhoneNumber("+966")
    setCountry("")
    license_number.reset();

    name.reset();
    birth_date.reset();
    license_expire_date.reset();
    email.reset();
    setSubmitted(false);
    setStep(1);
    !close && handleClose(false);
  }


  const [scanDriverLicenseLoading, setScanDriverLicenseLoading] = useState(false);
  const scanDriverLicense = async (value) => {
    if (value) {
      setDriverLicense(value);
      setScanDriverLicenseLoading(true)
      try {
        const formData = new FormData();
        formData.append('driver_license', value);
        const { data } = await customerLicenseScan(formData);
        name.changeValue(data.full_name);
        moment(data.expire_date).isValid() && license_expire_date.changeValue(moment(data.expire_date).toDate());
        moment(data.date_of_birth).isValid() && birth_date.changeValue(moment(data.date_of_birth).toDate());
      } catch (error) {
        handleMessage(getFirstError(error?.data?.errors) || error?.data?.error || error?.data?.message);
      } finally {
        setScanDriverLicenseLoading(false);
      }
    }
  }
  const handleSubmit = async (type) => {
    setSubmitted(true);
    if (step === 1) {
      const data = {
        "prefixes": country?.country_code,
        "phone": `${country?.country_code}${phoneNumber}`,
        "license_number": +license_number.value
      }
      try {
        const { user_uuid } = await assignCustomer(data, corporateUUID);
        const customer = await getCustomer(corporateUUID, user_uuid);
        // name.changeValue(customer.name);
        // customer.birth_date && birth_date.changeValue(moment(customer.birth_date).toDate());
        // customer.license_expire_date && license_expire_date.changeValue(moment(customer.license_expire_date).toDate());
        // email.changeValue(customer.email);
        // setStep(2);
        // isFromBook
        handleMessage(t("customer_assigned_to_your_corporate_successfully_key"), "success");
        if (isFromBook) {
          customerId.changeValue({ label: customer.name, value: user_uuid })
        } else {
          fetchReport(1, 10);
        }
        handleClose(false);

      } catch (error) {
        if (error.status == 404) {
          setStep(2);
        } else {
          handleMessage(getFirstError(error?.data?.errors) || error?.data?.error || error?.data?.message);
        }
      } finally {
        setStepType("");
        setSubmitted(false);
      }
    } else {
      const formData = new FormData();
      formData.append('license', driverLicense);
      formData.append('phone', `${country?.country_code}${phoneNumber}`);
      formData.append('license_number', +license_number.value);
      formData.append('license_expire_date', moment(license_expire_date.value).format("YYYY-MM-DD"));
      formData.append('name', name.value);
      formData.append('email', email.value);
      formData.append('birth_date', moment(birth_date.value).format("YYYY-MM-DD"));


      try {
        const { user_uuid } = await addCustomer(formData, corporateUUID);

        const data = {
          "phone": `${country?.country_code}${phoneNumber}`,
          "license_number": +license_number.value
        }
        const { user_uuid: assign_user_uuid } = await assignCustomer(data, corporateUUID);
        handleMessage(t("your_data_saved_successfully_key"), "success");
        // isFromBook
        if (isFromBook) {
          customerId.changeValue({ label: name.value, value: user_uuid })
          handleClose(false);
          return;
        }

        if (type === 1) {
          router.push(`/corporate/book-car?cus=${user_uuid}`)
        } else {
          closeModal(true);
          fetchReport(1, 10);
        }
      } catch ({ data }) {
        handleMessage(getFirstError(data?.errors) || data?.message || data?.error);

      } finally {
        setSubmitted(false);
        setStepType("");
      }
    }
  }


  const handleCancel = () => step === 1 ? closeModal() : setStep(1);

  const validation = useCallback(() => {
    if (step === 1 && phoneNumber && license_number.value) {
      return true
    } else if (step === 2 && name.value && email.value && birth_date.value && license_expire_date.value && driverLicense) {
      return true
    }
  }, [step, phoneNumber, license_number.value, name.value, email.value, birth_date.value, license_expire_date.value, driverLicense]);

  return (
    <>
      <form>

        <div className="flex flex-col gap-4 p-4 w-[550px]">
          {step === 1 ? (
            <>
              <div>
                <PhoneInput
                  autoFocus
                  mandatory
                  label={t("phone_number_key")}
                  value={phoneNumber}
                  setValue={(value) => setPhoneNumber(value)}
                  country={country}
                  setCountry={(country) => setCountry(country)}
                />
              </div>
              <div>
                <Input
                  mandatory
                  label={t("national_or_iqma_id_key")}
                  {...license_number.bind}
                />
              </div>
            </>
          ) : (
            <>
              <div className=" flex items-start justify-between gap-3 p-2 border-primary border rounded-lg bg-[#DFF2F1] dark:bg-gray-800">
                <InformationCircleIcon width={25} className="text-primary basis-1/12" />
                <div className="flex basis-11/12">

                  <p className="m-0 text-base font-light leading-relaxed ">
                    <span className="text-primary">{t("note_key")}: </span>
                    {t("note_paragraph_key")}</p>
                </div>
              </div>
              <div>
                <FileInput
                  mandatory
                  // accept="image/*"
                  value={driverLicense}
                  name={"input-file"}
                  label={<>
                    {t("drive_license_key")}
                    {scanDriverLicenseLoading && <Spinner className="w-4 h-4 mx-2 basis-2" />}
                  </>}
                  errorMsg={""}
                  onChange={scanDriverLicense}
                />
              </div>
              <div>
                <Input
                  mandatory
                  label={t("name_key")}
                  placeholder={t("enter_customer_name_key")}
                  {...name.bind}
                />
              </div>

              <DateInput
                mandatory
                label={t("birth_date_key")}
                value={birth_date.value}
                onChange={(date) => birth_date.changeValue(date)}
              />

              <DateInput
                mandatory
                label={t("expiration_date_key")}
                value={license_expire_date.value}
                onChange={(date) => license_expire_date.changeValue(date)}
              />

              <div>
                <Input
                  mandatory
                  label={t("email_key")}
                  placeholder={t("enter_customer_email_key")}
                  {...email.bind}
                />
              </div>
            </>
          )}

        </div>

        <div className="flex items-center justify-end p-4 rounded-b dark:bg-gray-800 dark:text-white">
          {!isFromBook ? (
            <>
              <Button
                disabled={!validation() || submitted}
                // type="submit"
                onClick={() => {
                  setStepType(2);
                  handleSubmit(2)
                }
                }
                className={"btn--primary"}>
                {submitted && stepType == 2 ? (
                  <>
                    <Spinner className="w-4 h-4 mr-3 rtl:ml-3" />
                    {t("loading_key")}
                  </>
                ) : (step === 1 ? t("next_key") : t("save_add_new_key"))}
              </Button>
              {step === 2 && <Button
                disabled={!validation() || submitted}
                // type="submit"
                onClick={() => {
                  setStepType(1);
                  handleSubmit(1)
                }
                }
                className={"btn--secondary  ml-4 rtl:mr-4"}>
                {submitted && stepType == 1 ? (
                  <>
                    <Spinner className="w-4 h-4 mr-3 rtl:ml-3" />
                    {t("loading_key")}
                  </>
                ) : (step === 1 ? t("next_key") : t("save_book_a_car_key"))}
              </Button>}
            </>
          ) : (
            <>
              <Button
                disabled={!validation() || submitted}
                // type="submit"
                onClick={() => handleSubmit(2)}
                className={"btn--primary"}>
                {submitted ? (
                  <>
                    <Spinner className="w-4 h-4 mr-3 rtl:ml-3" />
                    {t("loading_key")}
                  </>
                ) : (step === 1 ? t("next_key") : t("submit_key"))}
              </Button>
            </>
          )}

          <Button
            className="ml-4 btn--secondary rtl:mr-4"
            onClick={handleCancel}
            type="button" >{t("cancel_key")}</Button>
        </div>
      </form>

    </>
  )
}
AddCustomerModal.propTypes = {
  fetchReport: PropTypes.func,
  handleClose: PropTypes.func.isRequired,
  corporateUUID: PropTypes.string.isRequired,
  isFromBook: PropTypes.bool,
  customerId: PropTypes.shape({
    changeValue: PropTypes.func,
    value: PropTypes.any,
  }),
};