import React, { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { getSession, signOut } from "next-auth/react";
import PropTypes from "prop-types"
import axios from "axios";

// Custom
import { Header } from "components/global";
import { Layout, LayoutWithSidebar } from "components/layout";
import { PhoneInput, Input, Button, Spinner, Actions, Modal, ViewLicense } from "components/UI";
import Table from "components/Table/Table";
import { limitColumns } from "components/columns";
import { LimitPrintView } from "components/pages/admin/corporate-list";
import config from "config/config";
import exportExcel from "utils/useExportExcel";
import { useHandleMessage, useInput } from "hooks";
import { IdentificationIcon, PaperClipIcon, PlusSmallIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { addCoordinator, addCorporateLimit, deleteCoordinator, editCoordinator, editCorporate } from "helper/apis/corporate";
import { getFirstError } from "utils/utils";
import moment from "moment";
// import sendPasswordResetEmail from "utils/sendPasswordResetEmail";

const Update = ({ session, error, statusCode, corporate, limit, coordinatorsList }) => {
  const { t } = useTranslation("common");
  const router = useRouter();
  const language = router.locale.toLowerCase();
  const date_format = language === 'en' ? 'DD/MM/YYYY' : 'YYYY/MM/DD';
  const handleMessage = useHandleMessage();

  const [submitted, setSubmitted] = useState(false);
  const [exportingExcel, setExportingExcel] = useState(false);
  const printViewRef = useRef(null);

  // inputs
  const name = useInput(corporate.name, "", true);
  const [logo, setLogo] = useState(null);
  const total_limit_amount_gross = useInput(corporate.total_limit_amount_gross, "number", true);
  const vat_number = useInput(corporate.vat_number, "number", true);
  const commercial_registration_number = useInput(corporate?.commercial_registration_number, "number", true);

  const columns = limitColumns(t, date_format);

  const handleExportExcel = async () => {
    setExportingExcel(true);
    await exportExcel(limit, columns, `${t("corporates_key")} - ${t("limit_key")}`, handleMessage);
    setTimeout(() => {
      setExportingExcel(false);
    }, 1000);
  };

  const exportPDF = useCallback(() => {
    if (printViewRef.current) {
      printViewRef.current.print();
    }
  }, [printViewRef.current]);


  // **************************************  coordinators logic **************************************
  const [coordinators, setCoordinators] = useState([...coordinatorsList]);
  const handleAddCoordinator = () => {
    setCoordinators((prev) => [...prev, { name: "", email: "", limit: "", phone: "", isNew: true }])
  };
  const handleRemoveCoordinator = useCallback(async (uuid, coordinatorIndex) => {
    if (!uuid) {
      setCoordinators((prev) => {
        return prev.filter((_, i) => i !== coordinatorIndex);
      });
      return;
    }
    setSubmitted(true);
    try {
      const deletedCoordinator = await deleteCoordinator(corporate.uuid, uuid);
      setCoordinators((prev) => {
        return prev.filter((_, i) => i !== coordinatorIndex);
      });
    } catch ({ data }) {
      handleMessage(getFirstError(data?.errors) || data?.message || data?.error);
    } finally {
      setSubmitted(false);
    }
  }, []);
  const handleEditCoordinator = useCallback((field, value, index) => {
    setCoordinators((prev) => {
      const theCoordinator = prev.find((e, i) => i == index);
      theCoordinator[field] = value
      return [
        ...prev.slice(0, index),
        theCoordinator,
        ...prev.slice(index + 1)
      ]
    })
  }, []);
  const validationAddCoordinator = useCallback(() => {
    const theLastCoordinator = coordinators[coordinators.length - 1];
    if (name.value && +total_limit_amount_gross.value && +vat_number.value && +commercial_registration_number.value) {
      if (!coordinators.length) {
        return true
      } else if (theLastCoordinator.name && theLastCoordinator.phone && +theLastCoordinator.limit && theLastCoordinator.email) {
        return true
      }
    }
  }, [name.value, total_limit_amount_gross.value, vat_number.value, commercial_registration_number.value, coordinators]);
  // **************************************  coordinators logic **************************************

  const validation = useCallback(() => {
    if (name.value && +total_limit_amount_gross.value && +vat_number.value && +commercial_registration_number.value) {
      if (coordinators.length > 1) {
        return true
      } else if (coordinators.length == 1) {
        if (coordinators[0].name && +coordinators[0].limit) {
          return true
        }
      } else {
        return true
      }
    }
  }, [name.value, total_limit_amount_gross.value, vat_number.value, commercial_registration_number.value, coordinators.length])
  const handleSubmit = async () => {
    setSubmitted(true);
    const formData = new FormData();
    formData.append('name', name.value);
    formData.append('total_limit_amount_gross', total_limit_amount_gross.value);
    formData.append('vat_number', vat_number.value);
    formData.append('commercial_registration_number', commercial_registration_number.value);
    formData.append('_method', "PUT");
    logo && formData.append('logo', logo);

    try {
      const updatedCorporate = await editCorporate(formData, corporate.uuid);

      if (coordinators?.length) {
        const newCoordinators = coordinators.filter(n => n.isNew);
        const oldCoordinators = coordinators.filter(n => !n.isNew);
        const newCoordinatorPromises = newCoordinators?.map(async (c, i) => {
          const coordinatorData = {
            name: c?.name,
            email: c?.email,
            phone: `${c?.country?.country_code}${c?.phone}`,
            booking_limit_amount_gross: c?.limit,
          };
          const newCoordinators = await addCoordinator(coordinatorData, corporate.uuid);
          coordinators[i].UUID = newCoordinators.uuid;
          coordinators[i].isNew = false;
          // try {
          //   await sendPasswordResetEmail(c?.name, c?.email, newCoordinators.uuid);
          // } catch ({ data }) {
          //   handleMessage(getFirstError(data?.errors) || data?.message || data?.error);
          // }
          return newCoordinators;
        });
        const oldCoordinatorPromises = oldCoordinators?.map(async (c) => {
          const coordinatorData = {
            name: c?.name,
            email: c?.email,
            phone: `${c?.country?.country_code}${c?.phone}`,
            booking_limit_amount_gross: c?.limit,
            UUID: c?.UUID || null
          };
          const oldCoordinators = await editCoordinator(coordinatorData, corporate.uuid, coordinatorData.UUID);
          return oldCoordinators;
        });
        await Promise.all([...newCoordinatorPromises, ...oldCoordinatorPromises]);
      }
      handleMessage(t("your_data_saved_successfully_key"), "success");
      router.push("/corporate-list");
    } catch ({ data }) {
      handleMessage(getFirstError(data?.errors) || data?.message || data?.error);
    } finally {
      setSubmitted(false);
    }
  }

  // modals
  const [showLogo, setShowLogo] = useState({ isOpen: false, url: "" })

  // **************************************  add limit modal **************************************
  const [showModal, setShowModal] = useState(false);
  const limit_amount_gross = useInput("", "number", true);
  const valid_until = useInput("", "", false);
  const closeModal = () => {
    limit_amount_gross.reset();
    valid_until.reset();
    setSubmitted(false);
    setShowModal(false);
  }

  const addLimit = async () => {
    const userId = session.user?.uuid || "";
    setSubmitted(true);
    const data = {
      user_uuid: userId,
      limit_amount_gross: limit_amount_gross.value,
      valid_until: moment(valid_until).format("YYYY-MM-DD")
    }
    try {
      await addCorporateLimit(data, corporate.uuid);
      closeModal();
    } catch ({ data }) {
      handleMessage(getFirstError(data?.errors) || data?.message || data?.error);
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
          path="/corporate-list"
          links={[{ label: t("corporates_list_key"), path: "/corporate-list" }, { label: t("edit_key") }]}
          classes="bg-gray-100 dark:bg-gray-700 border-none"
        />
        <div className="p-4 md:p-8">

          <div className="grid grid-cols-1 gap-4 mb-4 md:grid-cols-2">
            <div>
              <Input label={t("corporate_name_key")} {...name.bind} />
            </div>

            <div>
              <Input
                label={t("corporate_limit_key")}
                {...total_limit_amount_gross.bind}
                submitted={!!total_limit_amount_gross.value}
                validator={{ valid: +total_limit_amount_gross.value, message: t('value_is_invalid_key') }}
              />
            </div>
            <div>
              <Input label={t("vat_number_key")} {...vat_number.bind} />
            </div>
            <div>
              <Input label={t("cr_key")} {...commercial_registration_number.bind} />
            </div>

            <div className=" flex justify-start flex-col gap-2">
              <label className="block text-sm text-gray-800 dark:text-white">{t("corporate_logo_key")}</label>
              <div className="flex justify-start gap-4">
                <Button
                  className="flex  w-40 items-center justify-start gap-2 text-xs btn--primary"
                  disabled={!corporate?.logo_url}
                  onClick={() =>
                    setShowLogo({
                      isOpen: true,
                      url: corporate?.logo_url,
                    })
                  }
                >
                  <IdentificationIcon className="w-6" />
                  {t("preview_key")}
                </Button>
                <div>
                  <label
                    htmlFor="corporate-logo"
                    className="flex  cursor-pointer w-44 items-center justify-between gap-2 text-xs btn btn--secondary">
                    {logo?.name || t("choose_a_file_key")}
                    <PaperClipIcon className="w-6" />
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setLogo(e?.target?.files[0])}
                    className="hidden"
                    id="corporate-logo"
                  />
                </div>
              </div>
            </div>
          </div>


          <hr className="my-4 border" />

          {coordinators.map((c, i) => {
            return <>
              <h3 className="font-bold">{t("coordinator_key")} {i + 1}</h3>
              <div className="relative p-4 mt-2 mb-6 border rounded-lg shadow md:p-8">

                <button disabled={submitted} onClick={() => handleRemoveCoordinator(c.uuid, i)} className={`${submitted ? "cursor-not-allowed" : "cursor-pointer"} duration-200 hover:rotate-180 hover:text-white hover:bg-hoverPrimary absolute flex items-center justify-center w-10 h-10 rounded-full  -top-3 -right-3 rtl:right-auto rtl:-left-3 text-primary bg-secondary`}>
                  {submitted ? (<Spinner className="w-4 h-4" />) : (<XMarkIcon width={25} />)}
                </button>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <Input
                      label={t("name_key")}
                      value={
                        c.name} onChange={(e) => handleEditCoordinator("name", e.target.value, i)}
                    />
                  </div>
                  <div>
                    <Input
                      label={t("coordinator_limit_key")}
                      value={c.limit}
                      onChange={(e) => handleEditCoordinator("limit", e.target.value, i)}
                      submitted={!!c.limit}
                      validator={{ valid: +c.limit, message: t('value_is_invalid_key') }}
                    />
                  </div>
                  <div>
                    <PhoneInput
                      label={t("phone_number_key")}
                      value={c.phone}
                      setValue={(value) => handleEditCoordinator("phone", value, i)}
                      country={c.country}
                      setCountry={(country) => handleEditCoordinator("country", country, i)}
                    />
                  </div>
                  <div>
                    <Input
                      label={t("email_key")}
                      value={c.email}
                      onChange={(e) => handleEditCoordinator("email", e.target.value, i)}
                      submitted={c.email}
                      validator={{ valid: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(c.email), message: t('value_is_invalid_key') }}
                    />
                  </div>
                </div>
              </div>
            </>
          })}
          <Button disabled={coordinators.length == 10 || !validationAddCoordinator()} onClick={handleAddCoordinator} className={"flex w-full justify-center items-center bg-transparent hover:bg-transparent disabled:hover:bg-transparent border  "}>
            <PlusSmallIcon width={25} color="#15A9BE" />
            <span className="font-semibold text-primary">{t("add_a_new_coordinator_key")}</span>
          </Button>

          <div className='flex items-center justify-end gap-4 mt-10'>
            <Button
              onClick={() => router.push("/corporate-list")}
              className="w-32 btn--secondary"
              type="button"
            >{t("cancel_key")}</Button>
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
                t("save_key")
              )}
            </Button>
          </div>
        </div>
      </div>
      <div className="p-1 mt-4 bg-white rounded-md md:p-5 dark:bg-gray-800">
        <Table
          columns={columns}
          data={limit || []}
          noHeader={true}
          pagination={true}
          searchAble={true}
          actions={
            <Actions
              addMsg={t("add_limit_key")}
              onClickAdd={() => setShowModal(true)}
              onClickPrint={exportPDF}
              isDisabledPrint={!limit?.length}
              onClickExport={handleExportExcel}
              isDisabledExport={exportingExcel || !limit?.length}
            />
          }
        />
      </div>
      <LimitPrintView ref={printViewRef} language={language} data={limit} />



      {showModal && <Modal
        title={t("add_amount_key")}
        show={showModal}
        footer={false}
        onClose={closeModal}
        onUpdate={addLimit}
      >
        <div className="flex flex-col gap-4 p-4 w-96">

          <Input
            label={t("add_limit_for_the_coordinator")}
            placeholder={t("enter_wallet_amount_key")}
            {...limit_amount_gross.bind}
          />

          <Input
            label={t("expiration_date_key")}
            placeholder={t("enter_expiration_date_key")}
            {...valid_until.bind}
            type="date"
          />
        </div>

        <div className='flex items-center justify-center gap-4 px-4'>
          <Button
            onClick={closeModal}
            className="basis-1/2 btn--secondary"
            type="button"
          >{t("cancel_key")}</Button>
          <Button
            disabled={submitted || !+limit_amount_gross.value || !valid_until.value}
            onClick={addLimit}
            className="basis-1/2 btn--primary"
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
      </Modal>}

      {
        showLogo.isOpen && (
          <Modal title={t("preview_key")} show={showLogo.isOpen} footer={false} onClose={() => setShowLogo({ isOpen: false, url: "" })}>
            <ViewLicense url={showLogo?.url} />
          </Modal>
        )
      }
    </>
  );
};

Update.propTypes = {
  session: PropTypes.object.isRequired,
  error: PropTypes.string,
  statusCode: PropTypes.number,
  corporate: PropTypes.object,
  limit: PropTypes.array,
  coordinatorsList: PropTypes.array,
};
Update.defaultProps = {
  error: null,
  corporate: {},
  limit: [],
  coordinatorsList: [],
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
  const corporateUUID = context.query?.cor || "";
  const loginUrl =
    context.locale === "ar" ? "/login" : `/${context.locale}/login`;

  if (!session || session?.user?.role[0] !== "admin") {
    return {
      redirect: {
        destination: loginUrl,
        permanent: false,
      },
    };
  } else {
    try {
      const apiUrl = config.apiGateway.API_URL_TELGANI;
      const { data: corporate } = await axios.get(`${apiUrl}/dashboard/b2b/corporate/${corporateUUID}`, {
        headers: { Authorization: `Bearer ${session.user?.token}` },
      });
      const { data: coordinators } = await axios.get(`${apiUrl}/dashboard/b2b/corporate/${corporateUUID}/coordinator`, {
        headers: { Authorization: `Bearer ${session.user?.token}` },
      });
      const { data: { data: limit } } = await axios.get(`${apiUrl}/dashboard/b2b/corporate/${corporateUUID}/limit`, {
        headers: { Authorization: `Bearer ${session.user?.token}` },
      });

      return {
        props: {
          corporate: corporate || {},
          limit: limit.map(l => { return { created_at: l.created_at, limit_amount_gross: l.limit_amount_gross, valid_until: l.valid_until, remaining_amount_gross: l.remaining_amount_gross } }) || [],
          coordinatorsList: coordinators.map(c => { return { ...c, UUID: c.uuid, limit: c.booking_limit_amount_gross } }) || [],
          error: null,
          statusCode: null,
          session,
          ...(await serverSideTranslations(context.locale, ["common"])),
        },
      };
    } catch ({ response }) {
      return {
        props: {
          corporate: {},
          limit: [],
          coordinatorsList: [],
          error: response?.data.message,
          statusCode: response ? response?.status : "",
          session,
          ...(await serverSideTranslations(context.locale, ["common"])),
        },
      };
    }
  }
}