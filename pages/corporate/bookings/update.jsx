import React, { useEffect, useState } from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { getSession, signOut } from "next-auth/react";
import PropTypes from "prop-types"
// Custom
import { Layout, LayoutWithSidebar } from "components/layout";
import config from "config/config";
import axios from "axios";
import { ExtendModal, Header } from "components/global";
import { useTranslation } from "react-i18next";
import { MinimizedBox, Button, ViewLicense, CancelReasons, Modal } from "components/UI";
import { useHandleMessage } from "hooks";
import { IdentificationIcon } from "@heroicons/react/24/outline";

const Index = ({ error, statusCode, details = {} }) => {
  const [bookingDetails, setBookingDetails] = useState(details);
  const { customer, item, period, company } = bookingDetails;
  const { t } = useTranslation("common");


  // modals
  const [showLicense, setShowLicense] = useState({ isOpen: false, url: "" })


  const [extendModal, setExtendModal] = useState({
    isOpen: false,
    id: null
  });
  const [cancelModal, setCancelModal] = useState({
    isOpen: false,
    id: null
  });

  const handleMessage = useHandleMessage();

  const handleReject = async (uuid) => {
    setCancelModal({
      id: uuid,
      isOpen: true
    })
  }

  useEffect(() => {
    if (statusCode == 401) {
      signOut();
      return;
    }
    error && handleMessage(error);
  }, []);
  return (
    <>
      <div className="min-h-full bg-gray-100 rounded-md dark:bg-gray-700">
        <Header
          title={t("home_key")}
          path="/"
          links={[
            { label: t("bookings_key"), path: "/corporate/bookings" },
            { label: t("edit_key") }
          ]}
          classes="bg-gray-100 dark:bg-gray-700 border-none"
        />

        <div className="flex flex-col gap-5">
          {/* booking info */}
          <div className="bg-white rounded-md dark:bg-gray-800">
            <div className="flex items-center justify-between p-4 pb-0">
              <h2 className="font-bold">{t("booking_info_key")}</h2>
              <Button className="bg-blue-gray-100">
                <span className=" text-blue-gray-500">{t("status_key")}: {t("edit_key")}</span>
              </Button>
            </div>
            <hr className="my-5 border-gray-400 border-1" />

            <div className="flex items-start justify-between p-5 pt-0">
              <div className="flex flex-col justify-start gap-4 border-r basis-1/4">
                <p>{t("booking_id_key")}</p>
                <p className="text-xl text-primary font-body">{bookingDetails?.individual_number}</p>
                {bookingDetails.corporate.can_cancel && <Button
                  onClick={() => handleReject(bookingDetails?.uuid)}
                  className={`bg-red-600 w-40 text-white p-2`}>
                  <span>{t(`cancel_key`)}</span>
                </Button>}
                {bookingDetails?.corporate?.can_extend && <Button
                  onClick={() => setExtendModal({ isOpen: true, id: bookingDetails.uuid })}
                  className="w-40 btn--primary">
                  {t("extend_key")}
                </Button>}



              </div>
              <div className="flex flex-col gap-3 px-5 basis-3/4">
                <p>{t("booking_status_key")}</p>
                <Button
                  className={`${bookingDetails?.state?.toLowerCase() == "accepted" ? "bg-green-100 text-green-500" : (bookingDetails?.state?.toLowerCase() == "canceled" || bookingDetails?.state?.toLowerCase() == "rejected") ? "bg-red-100 text-red-500" : "bg-blue-100 text-blue-500"} w-40  p-2 cursor-default`}>
                  <span>{t(`${bookingDetails.state}_key`)}</span>
                </Button>

              </div>
            </div>
          </div>

          {/* customer && invoice */}
          <div className="flex items-start justify-between">
            {/* customer */}
            <div className="bg-white rounded-md dark:bg-gray-800 basis-6/12">
              <h2 className="p-4 font-bold">{t("customer_key")}</h2>
              <hr className="my-5 border-gray-400 border-1" />

              <div className="flex flex-col p-5 pt-0">

                <p className="flex items-center justify-between px-2 mb-2">
                  <span>{t("id_key")}</span>
                  <span>{customer?.user_uuid}</span>
                </p>
                <p className="flex items-center justify-between px-2 mb-2">
                  <span>{t("full_name_key")}</span>
                  <span>{customer?.full_name}</span>
                </p>
                <p className="flex items-center justify-between px-2 mb-2">
                  <span>{t("birth_date_key")}</span>
                  <span>{customer?.birth_date}</span>
                </p>
                <p className="flex items-center justify-between px-2 mb-2">
                  <span>{t("email_key")}</span>
                  <span>{customer?.email}</span>
                </p>
                <p className="flex items-center justify-between px-2 mb-2">
                  <span>{t("license_key")}</span>
                  <Button className="flex items-center justify-between gap-2 text-xs btn--primary" disabled={!customer?.license} onClick={() => setShowLicense({ number: customer?.license_number, isOpen: true, url: customer?.license })}>
                    <IdentificationIcon className="w-6" />

                    {t("view_license_key")}
                  </Button>

                  {/* <ViewLicense number={customer?.license_number} url={customer?.license} /> */}
                </p>
                <p className="flex items-center justify-between px-2 mb-2">
                  <span>{t("license_number_key")}</span>
                  <span>{customer?.license_number}</span>
                </p>
                <p className="flex items-center justify-between px-2 mb-2">
                  <span>{t("phone_key")}</span>
                  <span dir="ltr">{customer?.phone_prefix}{customer?.phone}</span>
                </p>
              </div>
            </div>
            {/* invoice */}
            <div className="bg-white rounded-md dark:bg-gray-800 basis-5/12">
              <h2 className="p-4 font-bold">{t("invoice_key")}</h2>
              <hr className="my-5 border-gray-400 border-1" />

              <div className="flex flex-col p-5 pt-0">

                <p className="flex items-center justify-between px-2 mb-2">
                  <span>{t("payment_method_key")}</span>
                  <span>{"B2B"}</span>
                  {/* <span>{payment?.method}</span> */}
                </p>
                <p className="flex items-center justify-between px-2 mb-2">
                  <span>{t("rent_price_key")}</span>
                  {/* check */}
                  <span>{item?.base_nett_price} {t("sar_key")}</span>
                </p>
                <p className="flex items-center justify-between px-2 mb-2">
                  <span>{t("total_rent_price_key")}</span>
                  {/* check */}
                  <span>{item?.period_nett_price} {t("sar_key")}</span>
                </p>
                <p className="flex items-center justify-between px-2 mb-2">
                  <span>{t("total_vat_key")}</span>
                  <span>{item?.total_base_vat_price} {t("sar_key")}</span>
                </p>
                <p className="flex items-center justify-between px-2 mb-2">
                  <span>{t("total_gross_price_key")}</span>
                  <span>{item?.total_base_gross_price} {t("sar_key")}</span>
                </p>
                <p className="flex items-center justify-between px-2 mb-2">
                  <span>{t("total_discount_gross_price_key")}</span>
                  <span>{item?.total_discount_gross_price} {t("sar_key")}</span>
                </p>


                {/* <hr className="border-2" />

                <p className="flex items-center justify-between px-2 mb-2">
                  <span>{t("total_base_vat_price_key")}</span>
                  <span>{item?.total_base_vat_price}</span>
                </p>
                <p className="flex items-center justify-between px-2 mb-2">
                  <span>{t("total_base_gross_price_key")}</span>
                  <span>{item?.total_base_gross_price}</span>
                </p> */}

              </div>
            </div>
          </div>
          {/* period */}
          <div className="bg-white rounded-md dark:bg-gray-800 basis-5/12">
            <h2 className="p-4 font-bold">{t("period_key")}</h2>
            <hr className="my-5 border-gray-400 border-1" />

            <div className="flex flex-col p-5 pt-0">
              <p className="flex items-center justify-between px-2 mb-2">
                <span>{t("days_key")}</span>
                <span>{period?.days}</span>
              </p>
              <p className="flex items-center justify-between px-2 mb-2">
                <span>{t("pick_date_key")}</span>
                <span>{period?.pick_date}</span>
              </p>
              <p className="flex items-center justify-between px-2 mb-2">
                <span>{t("drop_date_key")}</span>
                <span>{period?.drop_date}</span>
              </p>
              <p className="flex items-center justify-between px-2 mb-2">
                <span>{t("pick_time_key")}</span>
                <span>{period?.pick_time}</span>
              </p>
            </div>
          </div>

          <MinimizedBox title={t("company_and_car_key")}>
            {/* car and company */}
            <div className="flex items-start justify-between p-5 border-t-2">
              {/* Car */}
              <div className="bg-white rounded-md shadow-md dark:bg-gray-800 basis-6/12">
                <h2 className="p-4 font-bold">{t("car_key")}</h2>
                <hr className="my-5 border-gray-400 border-1" />
                <div className="flex flex-col p-5 pt-0">
                  <p className="flex items-center justify-between px-2 mb-2">
                    <span>{t("manufacturer_key")}</span>
                    <span>{item?.name}</span>
                  </p>
                  <p className="flex items-center justify-between px-2 mb-2">
                    <span>{t("delivery_key")}</span>
                    <span>{bookingDetails?.delivery ? t("yes_key") : t("no_key")}</span>
                  </p>
                  <p className="flex items-center justify-between px-2 mb-2">
                    <span>{t("unlimited_km_key")}</span>
                    {/* check */}
                    <span>{t("yes")}</span>
                  </p>
                  <p className="flex items-center justify-between px-2 mb-2">
                    <span>{t("cdw_insurance_key")}</span>
                    {/* check */}
                    <span>{t("no_key")}</span>
                  </p>
                  <p className="flex items-center justify-between px-2 mb-2">
                    <span>{t("driver_key")}</span>
                    {/* check */}
                    <span>{t("no_key")}</span>
                  </p>
                  <p className="flex items-center justify-between px-2 mb-2">
                    <span>{t("drop_city_key")}</span>
                    {/* check */}
                    <span>{t("no_key")}</span>
                  </p>
                </div>
              </div>
              {/* company */}
              <div className="bg-white rounded-md shadow-md dark:bg-gray-800 basis-5/12">
                <h2 className="p-4 font-bold">{t("company_key")}</h2>
                <hr className="my-5 border-gray-400 border-1" />

                <div className="flex flex-col p-5 pt-0">

                  <p className="flex items-center justify-between px-2 mb-2">
                    <span>{t("name_key")}</span>
                    <span>{company?.name}</span>
                  </p>
                  <p className="flex items-center justify-between px-2 mb-2">
                    <span>{t("office_name_key")}</span>
                    {/* check */}
                    <span>{bookingDetails?.office?.name}</span>
                  </p>
                  <p className="flex items-center justify-between px-2 mb-2">
                    <span>{t("office_address_key")}</span>
                    {/* check */}
                    <span>{bookingDetails?.office?.address}</span>
                  </p>
                </div>
              </div>
            </div>
          </MinimizedBox>
        </div>
      </div >

      {
        cancelModal.isOpen && <Modal
          title={t("cancel_booking_key")}
          show={cancelModal.isOpen}
          footer={false}
          onClose={() => setCancelModal({ isOpen: false, id: null })}
        >
          <CancelReasons
            bookingDetails={bookingDetails}
            setBookingDetails={setBookingDetails}
            handleClose={() => setCancelModal({ isOpen: false, id: null })}
            bookingId={cancelModal?.id}
          />
        </Modal>
      }


      {
        showLicense.isOpen && (
          <Modal title={`${t("license_number_key")}: ${showLicense?.number}`} show={showLicense.isOpen} footer={false} onClose={() => setShowLicense({ isOpen: false, url: "" })}>
            <ViewLicense url={showLicense?.url} />
          </Modal>
        )
      }

      {
        extendModal.isOpen && (
          <Modal
            title={`${t("extend_key")}`}
            show={extendModal.isOpen}
            footer={false}
            onClose={() => setExtendModal({ isOpen: false, id: "" })}
          >
            <ExtendModal
              setBookingDetails={setBookingDetails}
              drop_date={period?.drop_date}
              closeModal={() => setExtendModal({ isOpen: false, id: "" })}
            />
          </Modal>
        )
      }


    </>


  );
};

Index.propTypes = {
  error: PropTypes.string,
  statusCode: PropTypes.number,
  session: PropTypes.object.isRequired,
  details: PropTypes.shape({
    customer: PropTypes.shape({
      user_uuid: PropTypes.string.isRequired,
      full_name: PropTypes.string.isRequired,
      birth_date: PropTypes.string.isRequired,
      email: PropTypes.string.isRequired,
      license: PropTypes.bool.isRequired,
      license_number: PropTypes.string.isRequired,
      phone_prefix: PropTypes.string.isRequired,
      phone: PropTypes.string.isRequired,
    }).isRequired,
    payment: PropTypes.shape({
      method: PropTypes.string.isRequired,
      // ... (add more PropTypes if needed)
    }).isRequired,
    item: PropTypes.shape({
      name: PropTypes.string.isRequired,
      base_nett_price: PropTypes.string.isRequired,
      period_nett_price: PropTypes.string.isRequired,
      total_base_vat_price: PropTypes.string.isRequired,
      total_base_gross_price: PropTypes.string.isRequired,
      total_discount_gross_price: PropTypes.string.isRequired,
      // ... (add more PropTypes if needed)
    }).isRequired,
    period: PropTypes.shape({
      days: PropTypes.number.isRequired,
      pick_date: PropTypes.string.isRequired,
      drop_date: PropTypes.string.isRequired,
      pick_time: PropTypes.string.isRequired,
      // ... (add more PropTypes if needed)
    }).isRequired,
    company: PropTypes.shape({
      name: PropTypes.string.isRequired,
    }).isRequired,
    state: PropTypes.string.isRequired,
    can_cancel: PropTypes.bool.isRequired,
    can_edit: PropTypes.bool.isRequired,
    delivery: PropTypes.bool.isRequired,
    uuid: PropTypes.string.isRequired,
    individual_number: PropTypes.string.isRequired,
    office: PropTypes.shape({
      name: PropTypes.string.isRequired,
      address: PropTypes.string.isRequired,
    }).isRequired,
    corporate: PropTypes.shape({
      can_cancel: PropTypes.bool.isRequired,
      can_extend: PropTypes.bool.isRequired,
    }).isRequired,
    // ... (add more PropTypes as needed for nested objects)
  }).isRequired,
};

Index.getLayout = function PageLayout(page) {
  return (
    <Layout>
      <LayoutWithSidebar>{page}</LayoutWithSidebar>
    </Layout>
  );
};

export default Index;

export const getServerSideProps = async (context) => {
  const session = await getSession({ req: context.req });
  const bookingUUID = context.query?.uuid || "";
  const loginUrl = context.locale === "ar" ? "/login" : `/${context.locale}/login`;
  if (!session || session?.user?.role[0] != "corporate_coordinator") {
    return {
      redirect: {
        destination: loginUrl,
        permanent: false,
      },
    };
  } else {
    try {
      const apiUrl = config.apiGateway.API_URL_TELGANI;
      const { data: { data } } = await axios.get(`${apiUrl}/v2/booking/${bookingUUID}/preview`, {
        headers: { Authorization: `Bearer ${session.user?.token}` },
      });
      return {
        props: {
          details: data || {},
          error: null,
          statusCode: null,
          ...(await serverSideTranslations(context.locale, ["common"])),
        },
      };
    } catch ({ response }) {
      return {
        props: {
          details: {},
          error: response?.data.message,
          statusCode: response ? response?.status : "",
          ...(await serverSideTranslations(context.locale, ["common"])),
        },
      };
    }
  }
}