import React, { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { getSession, signOut } from "next-auth/react";
import PropTypes from "prop-types";
import axios from "axios";
// Custom
import { Header } from "components/global";
import { Layout, LayoutWithSidebar } from "components/layout";
import {
  Input,
  Button,
  Spinner,
  Actions,
  Modal,
  DateInput,
  PhoneInput,
  ViewLicense,
} from "components/UI";
import Table from "components/Table/Table";
import { limitColumns } from "components/columns";
import { LimitPrintView } from "components/pages/corporate/customers-list";

import config from "config/config";
import exportExcel from "utils/useExportExcel";
import { useHandleMessage, useInput } from "hooks";
import { addCustomerLimit, editCustomer } from "helper/apis/customer";
import { getFirstError } from "utils/utils";
import moment from "moment";
import { IdentificationIcon, PaperClipIcon } from "@heroicons/react/24/outline";

const Update = ({
  error,
  statusCode,
  customer,
  corporateUUID,
  customerUUID,
  limit,
}) => {
  const { t } = useTranslation("common");
  const router = useRouter();
  const language = router.locale.toLowerCase();
  const date_format = language === "en" ? "DD/MM/YYYY" : "YYYY/MM/DD";
  const handleMessage = useHandleMessage();

  const [limits, setLimits] = useState([...limit]);
  const [submitted, setSubmitted] = useState(false);
  const [exportingExcel, setExportingExcel] = useState(false);
  const printViewRef = useRef(null);

  // inputs
  const name = useInput(customer?.name, "", true);
  const [country, setCountry] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const email = useInput(customer?.email, "email", true);
  const birth_date = useInput(
    moment(customer?.birth_date || new Date()).toDate(),
    "date",
    null
  );
  const license_expire_date = useInput(
    moment(customer?.license_expire_date || new Date()).toDate(),
    "date",
    null
  );
  const license_number = useInput(customer?.license_number, "number", true);
  const [driverLicense, setDriverLicense] = useState(null);
  const phone = useInput(customer?.phone, "", true);

  const validation = useCallback(() => {
    if (
      name.value &&
      email.value &&
      license_number.value &&
      phone.value &&
      birth_date.value &&
      license_expire_date.value
    ) {
      return true;
    }
  }, [
    name.value,
    email.value,
    license_number.value,
    phone.value,
    birth_date.value,
    license_expire_date.value,
  ]);

  const columns = limitColumns(t, date_format);

  const handleExportExcel = async () => {
    setExportingExcel(true);
    await exportExcel(
      limits,
      columns,
      `${t("customers_key")} - ${t("limit_key")}`,
      handleMessage
    );
    setTimeout(() => {
      setExportingExcel(false);
    }, 1000);
  };

  const exportPDF = useCallback(() => {
    if (printViewRef.current) {
      printViewRef.current.print();
    }
  }, [printViewRef.current]);


  const handleSubmit = async () => {
    setSubmitted(true);
    const formData = new FormData();
    formData.append('name', name.value);
    formData.append('email', email.value);
    formData.append('phone', phone.value);
    formData.append('license_number', +license_number.value);
    formData.append('birth_date', moment(birth_date.value).format("YYYY-MM-DD"));
    formData.append('license_expire_date', moment(license_expire_date.value).format("YYYY-MM-DD"));
    formData.append('_method', "PUT");
    driverLicense && formData.append('license', driverLicense);

    try {
      const updatedCustomer = await editCustomer(
        formData,
        corporateUUID,
        customerUUID
      );
      handleMessage(t("your_data_saved_successfully_key"), "success");

      router.push("/corporate/customers-list");
    } catch ({ data }) {
      handleMessage(
        getFirstError(data?.errors) || data?.error || data?.message
      );
    } finally {
      setSubmitted(false);
    }
  };

  // modals
  const [showLicense, setShowLicense] = useState({ isOpen: false, url: "" })

  // **************************************  add limit modal **************************************
  const [showModal, setShowModal] = useState(false);
  const limit_amount_gross = useInput("", "number", true);
  const valid_until = useInput("", "", false);
  const closeModal = () => {
    limit_amount_gross.reset();
    valid_until.reset();
    setSubmitted(false);
    setShowModal(false);
  };

  const addLimit = async () => {
    setSubmitted(true);
    const data = {
      user_uuid: customerUUID,
      limit_amount_gross: limit_amount_gross.value,
      valid_until: moment(valid_until.value).format("YYYY-MM-DD"),
    };
    try {
      const { data: UUID } = await addCustomerLimit(data, corporateUUID);
      setLimits((prev) => [
        ...prev,
        {
          ...data,
          uuid: UUID?.uuid,
        },
      ]);
      closeModal();
    } catch ({ data }) {
      handleMessage(
        getFirstError(data?.errors) || data?.error || data?.message
      );
    } finally {
      setSubmitted(false);
    }
  };
  useEffect(() => {
    if (statusCode == 401) {
      signOut();
      return;
    }
    error && handleMessage(error);
  }, []);
  return (
    <>
      <div className="bg-white rounded-md dark:bg-gray-800">
        <Header
          title={t("corporates_key")}
          path="/corporate/customers-list"
          links={[
            {
              label: t("customers_list_key"),
              path: "/corporate/customers-list",
            },
            { label: t("edit_key") },
          ]}
          classes="bg-gray-100 dark:bg-gray-700 border-none"
        />
        <div className="p-4 md:p-8">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 ">
            <div>
              <Input mandatory label={t("name_key")} {...name.bind} />
            </div>
            <div>
              <PhoneInput
                // mandatory
                dir="ltr"
                label={t("alternative_contact_person_number_key")}
                value={phoneNumber}
                setValue={(value) => setPhoneNumber(value)}
                country={country}
                setCountry={(country) => setCountry(country)}
              />
            </div>

            <div>
              <Input label={t("email_key")} {...email.bind} />
            </div>

            <DateInput
              dir="ltr"
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
                dir="ltr"
                mandatory
                label={t("national_or_iqma_id_key")}
                {...license_number.bind}
              />
            </div>

            <div>
              <Input
                dir="ltr"
                mandatory
                label={t("phone_number_key")}
                {...phone.bind}
              />
            </div>


            <div className=" flex justify-start flex-col gap-2">
              <label className="block text-sm text-gray-800 dark:text-white">{t("license_key")}</label>
              <div className="flex justify-start gap-4">
                <Button
                  className="flex  w-40 items-center justify-start gap-2 text-xs btn--primary"
                  disabled={!customer?.license_url}
                  onClick={() =>
                    setShowLicense({
                      number: customer?.license_number,
                      isOpen: true,
                      url: customer?.license_url,
                    })
                  }
                >
                  <IdentificationIcon className="w-6" />
                  {t("view_license_key")}
                </Button>
                <div>
                  <label
                    htmlFor="customer-logo"
                    className="flex  cursor-pointer w-44 items-center justify-between gap-2 text-xs btn btn--secondary">
                    {driverLicense?.name || t("choose_a_file_key")}
                    <PaperClipIcon className="w-6" />
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setDriverLicense(e?.target?.files[0])}
                    className="hidden"
                    id="customer-logo"
                  />
                </div>
              </div>
            </div>

          </div>

          <div className="flex items-center justify-between px-2 mt-10 ml-auto rtl:mr-auto rtl:ml-0 w-80">
            <Button
              onClick={() => router.push("/corporate/customers-list")}
              className="w-32 btn--secondary"
              type="button"
            >
              <span className="text-primary hover:bg-transparent ">
                {t("cancel_key")}
              </span>
            </Button>
            <Button
              disabled={submitted || !validation()}
              onClick={handleSubmit}
              className="w-32 btn--primary"
            >
              {submitted ? (
                <>
                  <Spinner className="w-4 h-4 mr-3 rtl:ml-3" />
                  {t("loading_key")}
                </>
              ) : (
                t("submit_key")
              )}
            </Button>
          </div>
        </div>
      </div>
      <div className="p-1 mt-4 bg-white rounded-md md:p-5 dark:bg-gray-800">
        <Table
          columns={columns}
          data={limits || []}
          noHeader={true}
          pagination={true}
          searchAble={true}
          actions={
            <Actions
              addMsg={t("add_limit_key")}
              onClickAdd={() => setShowModal(true)}
              onClickPrint={exportPDF}
              isDisabledPrint={!limits?.length}
              onClickExport={handleExportExcel}
              isDisabledExport={exportingExcel || !limits?.length}
            />
          }
        />
      </div>
      <LimitPrintView ref={printViewRef} language={language} data={limits} />

      {showModal && (
        <Modal
          title={t("add_amount_key")}
          show={showModal}
          footer={false}
          onClose={closeModal}
          onUpdate={addLimit}
        >
          <div className="flex flex-col gap-4 p-4 w-96">
            <Input
              mandatory
              label={t("add_limit_for_the_customer_key")}
              placeholder={t("enter_wallet_amount_key")}
              {...limit_amount_gross.bind}
            />

            <DateInput
              mandatory
              minDate={moment().add(3, "days").toDate()}
              label={t("expiration_date_key")}
              placeholder={t("enter_expiration_date_key")}
              value={valid_until.value}
              onChange={(date) => valid_until.changeValue(date)}
            />
          </div>

          <div className="flex items-center justify-center gap-4 px-4">
            <Button
              onClick={closeModal}
              className="btn--secondary basis-1/2"
              type="button"
            >
              {t("cancel_key")}
            </Button>
            <Button
              disabled={
                submitted || !+limit_amount_gross.value || !valid_until.value
              }
              onClick={addLimit}
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
        </Modal>
      )}

      {
        showLicense.isOpen && (
          <Modal title={`${t("license_number_key")}: ${showLicense?.number}`} show={showLicense.isOpen} footer={false} onClose={() => setShowLicense({ isOpen: false, url: "" })}>
            <ViewLicense url={showLicense?.url} />
          </Modal>
        )
      }
    </>
  );
};

Update.propTypes = {
  session: PropTypes.object.isRequired,
  statusCode: PropTypes.number,
  error: PropTypes.string,
  customer: PropTypes.object,
  corporateUUID: PropTypes.string,
  customerUUID: PropTypes.string,
  limit: PropTypes.array,
};
Update.defaultProps = {
  error: null,
  customer: "",
  corporateUUID: {},
  limit: [],
};

Update.getLayout = function PageLayout(page) {
  return (
    <Layout>
      <LayoutWithSidebar>{page}</LayoutWithSidebar>
    </Layout>
  );
};

export default Update;
export const getServerSideProps = async (context) => {
  const session = await getSession({ req: context.req });
  const customerUUID = context.query?.cus || "";
  const loginUrl =
    context.locale === "ar" ? "/login" : `/${context.locale}/login`;

  if (!session || session?.user?.role[0] != "corporate_coordinator") {
    return {
      redirect: {
        destination: loginUrl,
        permanent: false,
      },
    };
  } else {
    try {
      const corporateUUID = session?.user?.corporate?.uuid;
      const { data: customer } = await axios.get(
        `${config.apiGateway.API_URL_TELGANI}/dashboard/b2b/corporate/${corporateUUID}/customer/${customerUUID}`,
        {
          headers: {
            Authorization: `Bearer ${session.user?.token}`,
          },
        }
      );
      return {
        props: {
          customer: customer || {},
          corporateUUID,
          customerUUID,
          limit: [],
          error: null,
          statusCode: null,
          ...(await serverSideTranslations(context.locale, ["common"])),
        },
      };
    } catch ({ response }) {
      return {
        props: {
          customer: {},
          corporateUUID: "",
          customerUUID: "",
          limit: [],
          error: response?.data.message,
          statusCode: response ? response?.status : "",
          ...(await serverSideTranslations(context.locale, ["common"])),
        },
      };
    }
  }
};
