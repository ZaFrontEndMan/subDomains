import React, { useCallback, useState } from "react";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { getSession } from "next-auth/react";
// Custom
import { Layout, LayoutWithSidebar } from "components/layout";
import { Header } from "components/global";
import { PhoneInput, Input, Button, Spinner } from "components/UI";
import { getFirstError } from "utils/utils";
import { useHandleMessage, useInput } from "hooks";
import { PaperClipIcon, PlusSmallIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { addCoordinator, addCorporate, editCoordinator, editCorporate } from "helper/apis/corporate";
// import EmailJS from "@emailjs/browser";
// import config from "config/config";
// import sendPasswordResetEmail from "utils/sendPasswordResetEmail";

const Add = () => {
  const { t } = useTranslation("common");
  const [iscCoordinatorAdded, setIscCoordinatorAdded] = useState([]);
  const [isCorporateAdded, setIsCorporateAdded] = useState(null);
  const router = useRouter();
  const [submitted, setSubmitted] = useState(false);

  const handleMessage = useHandleMessage();

  const name = useInput("", "", true);
  const [logo, setLogo] = useState({});
  const total_limit_amount_gross = useInput("", "number", true);
  const vat_number = useInput("", "number", true);
  const commercial_registration_number = useInput("", "number", true);

  // **************************************  coordinators logic **************************************
  const [coordinators, setCoordinators] = useState([]);
  const handleAddCoordinator = () => setCoordinators((prev) => [...prev, { name: "", email: "", limit: "", phone: "" }]);

  const handleRemoveCoordinator = useCallback((coordinatorIndex) => {
    setCoordinators((prev) => prev.filter((_, i) => i !== coordinatorIndex));
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

  // validation Add Coordinator
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


  // main validation
  const validation = useCallback(() => {
    if (name.value && +total_limit_amount_gross.value && +vat_number.value && +commercial_registration_number.value && coordinators.length) {
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
  }, [name.value, total_limit_amount_gross.value, vat_number.value, commercial_registration_number.value, coordinators.length]);

  const handleSubmit = async () => {
    setSubmitted(true);
    try {
      let uuid = "";
      if (isCorporateAdded) {
        const data = {
          name: name.value,
          total_limit_amount_gross: total_limit_amount_gross.value,
          vat_number: vat_number.value,
          commercial_registration_number: commercial_registration_number.value
        }
        await editCorporate(data, isCorporateAdded);
        uuid = isCorporateAdded;
      } else {
        const formData = new FormData();
        formData.append('logo', logo);
        formData.append('name', name.value);
        formData.append('total_limit_amount_gross', total_limit_amount_gross.value);
        formData.append('vat_number', vat_number.value);
        formData.append('commercial_registration_number', commercial_registration_number.value);

        const corporate = await addCorporate(formData);
        uuid = corporate?.uuid;
        setIsCorporateAdded(corporate?.uuid);
      }
      if (coordinators?.length) {
        const coordinatorPromises = coordinators.map(async (c, i) => {
          const coordinatorData = {
            name: c?.name,
            email: c?.email,
            phone: `${c?.country?.country_code}${c?.phone}`,
            booking_limit_amount_gross: c?.limit,
            UUID: c?.UUID || null
          };
          if (!iscCoordinatorAdded.includes(c.UUID)) {
            const coordinator = await addCoordinator(coordinatorData, uuid);
            coordinators[i].UUID = coordinator.uuid;
            // try {
            //   await sendPasswordResetEmail(c?.name, c?.email, coordinator.uuid);
            // } catch ({ data }) {
            //   handleMessage(getFirstError(data?.errors) || data?.message || data?.error);
            // }
            setIscCoordinatorAdded((prev => [...prev, coordinator.uuid]));
            return coordinator;
          } else {
            const coordinator = await editCoordinator(coordinatorData, uuid, coordinatorData?.UUID);
            return coordinator;
          }
        });
        await Promise.all(coordinatorPromises);
      }
      handleMessage(t("your_data_saved_successfully_key"), "success");
      router.push("/corporate-list");
    } catch ({ data }) {
      handleMessage(getFirstError(data?.errors) || data?.message || data?.error);
    } finally {
      setSubmitted(false);
    }
  };


  return (
    <>
      <div className="min-h-full bg-white rounded-md dark:bg-gray-800">
        <Header
          title={t("corporates_key")}
          path="/corporate-list"
          links={[{ label: t("corporates_list_key"), path: "/corporate-list" }, { label: t("add_key") }]}
          classes="bg-gray-100 dark:bg-gray-700 border-none"
        />
        <div className="p-4 md:p-8">

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 ">
            <div>
              <Input label={t("corporate_name_key")} {...name.bind} />
            </div>

            <div >
              <label className="block text-sm text-gray-800 dark:text-white">{t("corporate_logo_key")}</label>
              <div>
                <label
                  htmlFor="corporate-logo"
                  className="flex  cursor-pointer  items-center justify-between gap-2 text-xs btn btn--secondary">
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
          </div>

          <hr className="my-4 border" />
          {coordinators.map((c, i) => {
            return <>
              <h3 className="font-bold">{t("coordinator_key")} {i + 1}</h3>
              <div className="relative p-4 mt-2 mb-6 border rounded-lg shadow md:p-8">
                <span onClick={() => handleRemoveCoordinator(i)} className="absolute flex items-center justify-center w-10 h-10 duration-200 rounded-full cursor-pointer hover:rotate-180 hover:text-white hover:bg-hoverPrimary -top-3 -right-3 rtl:right-auto rtl:-left-3 text-primary bg-secondary">
                  <XMarkIcon width={25} />

                </span>
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
    </>
  );
};


Add.getLayout = function PageLayout(page) {
  return (
    <Layout>
      <LayoutWithSidebar>{page}</LayoutWithSidebar>
    </Layout>
  );
};

export default Add;
export const getServerSideProps = async (context) => {
  const session = await getSession({ req: context.req });

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
    return {
      props: {
        session,
        ...(await serverSideTranslations(context.locale, ["common"])),
      },
    };
  }
}