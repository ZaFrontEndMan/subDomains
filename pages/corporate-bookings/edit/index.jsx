import React, { useEffect, useState } from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { getSession, signOut } from "next-auth/react";
import PropTypes from "prop-types";
// Custom
import { Layout, LayoutWithSidebar } from "components/layout";
import config from "config/config";
import axios from "axios";
import { ExtendModal, Header } from "components/global";
import { useTranslation } from "react-i18next";
import {
  MinimizedBox,
  Button,
  ViewLicense,
  CancelReasons,
  Modal,
} from "components/UI";
import { useHandleMessage } from "hooks";
import { IdentificationIcon } from "@heroicons/react/24/outline";

const Index = ({ error, statusCode, details = {} }) => {
  const [bookingDetails, setBookingDetails] = useState(details);
  const { customer, item, period, company , corporate } = bookingDetails;

  const { t } = useTranslation("common");

  // modals
  const [showLicense, setShowLicense] = useState({ isOpen: false, url: "" });

  const [extendModal, setExtendModal] = useState({
    isOpen: false,
    id: null,
  });
  const [cancelModal, setCancelModal] = useState({
    isOpen: false,
    id: null,
  });

  const handleMessage = useHandleMessage();

  const handleReject = async (uuid) => {
    setCancelModal({
      id: uuid,
      isOpen: true,
    });
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
      <div className="min-h-full bg-gray-100 rounded-md dark:bg-gray-700">
        <Header
          title={t("home_key")}
          path="/"
          links={[
            { label: t("bookings_key"), path: "/corporate-bookings" },
            { label: t("edit_key") },
          ]}
          classes="bg-gray-100 dark:bg-gray-700 border-none"
        />

        <div className="flex flex-col gap-5">
          {/* booking info */}
          <div className="bg-white rounded-md dark:bg-gray-800">
            <div className="flex items-center justify-between p-4 pb-0">
              <h2 className="font-bold">{t("booking_info_key")}</h2>
              <Button className="bg-blue-gray-100">
                <span className=" text-blue-gray-500">
                  {t("status_key")}: {t("edit_key")}
                </span>
              </Button>
            </div>
            <hr className="my-5 border-gray-400 border-1" />

            <div className="flex items-start justify-between p-5 pt-0">
              <div className="flex flex-col justify-start gap-4 border-r basis-1/4">
                <p>{t("booking_id_key")}</p>
                <p className="text-xl text-primary font-body">
                  {bookingDetails?.individual_number}
                </p>

                {bookingDetails?.can_cancel && (
                  <Button
                    onClick={() => handleReject(bookingDetails?.uuid)}
                    className={`bg-red-600 w-40 text-white p-2`}
                  >
                    <span>{t(`cancel_key`)}</span>
                  </Button>
                )}
                {bookingDetails?.corporate?.can_extend && (
                  <Button
                    onClick={() =>
                      setExtendModal({ isOpen: true, id: bookingDetails.uuid })
                    }
                    className="w-40 btn--primary"
                  >
                    {t("extend_key")}
                  </Button>
                )}
              </div>
              <div className="flex flex-col gap-3 px-5 basis-3/4">
                <p>{t("booking_status_key")}</p>
                <Button
                  className={`${
                    bookingDetails?.state?.toLowerCase() == "accepted"
                      ? "bg-green-100 text-green-500"
                      : bookingDetails?.state?.toLowerCase() == "canceled" ||
                        bookingDetails?.state?.toLowerCase() == "rejected"
                      ? "bg-red-100 text-red-500"
                      : "bg-blue-100 text-blue-500"
                  } w-40  p-2 cursor-default`}
                >
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
                  <Button
                    className="flex items-center justify-between gap-2 text-xs btn--primary"
                    disabled={!customer?.license}
                    onClick={() =>
                      setShowLicense({
                        number: customer?.license_number,
                        isOpen: true,
                        url: customer?.license,
                      })
                    }
                  >
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
                  <span dir="ltr">
                    {customer?.phone_prefix}
                    {customer?.phone}
                  </span>
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
                  <span>{t("payer_key")}</span>
                  <span>{corporate?.name}</span>
                </p>
                <p className="flex items-center justify-between px-2 mb-2">
                  <span>{t("rent_price_key")}</span>
                  {/* check */}
                  <span>
                    {item?.base_nett_price} {t("sar_key")}
                  </span>
                </p>
                <p className="flex items-center justify-between px-2 mb-2">
                  <span>{t("total_rent_price_key")}</span>
                  {/* check */}
                  <span>
                    {item?.period_nett_price} {t("sar_key")}
                  </span>
                </p>
                <p className="flex items-center justify-between px-2 mb-2">
                  <span>{t("total_vat_key")}</span>
                  <span>
                    {item?.total_base_vat_price} {t("sar_key")}
                  </span>
                </p>
                <p className="flex items-center justify-between px-2 mb-2">
                  <span>{t("total_gross_price_key")}</span>
                  <span>
                    {item?.total_base_gross_price} {t("sar_key")}
                  </span>
                </p>
                <p className="flex items-center justify-between px-2 mb-2">
                  <span>{t("total_discount_gross_price_key")}</span>
                  <span>
                    {item?.total_discount_gross_price} {t("sar_key")}
                  </span>
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
                    <span>
                      {bookingDetails?.delivery ? t("yes_key") : t("no_key")}
                    </span>
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
      </div>

      {cancelModal.isOpen && (
        <Modal
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
            isAdmin={true}
          />
        </Modal>
      )}

      {showLicense.isOpen && (
        <Modal
          title={`${t("license_number_key")}: ${showLicense?.number}`}
          show={showLicense.isOpen}
          footer={false}
          onClose={() => setShowLicense({ isOpen: false, url: "" })}
        >
          <ViewLicense url={showLicense?.url} />
        </Modal>
      )}

      {extendModal.isOpen && (
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
      )}
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
    corporate: PropTypes.shape({
      can_extend: PropTypes.bool.isRequired,
    }).isRequired,
    state: PropTypes.string.isRequired,
    can_cancel: PropTypes.bool.isRequired,
    delivery: PropTypes.bool.isRequired,
    uuid: PropTypes.string.isRequired,
    individual_number: PropTypes.string.isRequired,
    office: PropTypes.shape({
      name: PropTypes.string.isRequired,
      address: PropTypes.string.isRequired,
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
  const loginUrl =
    context.locale === "ar" ? "/login" : `/${context.locale}/login`;
  if (!session) {
    return {
      redirect: {
        destination: loginUrl,
        permanent: false,
      },
    };
  } else {
    try {
      const apiUrl = config.apiGateway.API_URL_TELGANI;
      const {
        data: { data },
      } = await axios.get(`${apiUrl}/v2/booking/${bookingUUID}/preview`, {
        headers: { Authorization: `Bearer ${session.user?.token}` },
      });
      return {
        props: {
          details: data || {},
          error: null,
          statusCode: null,
          session,
          ...(await serverSideTranslations(context.locale, ["common"])),
        },
      };
    } catch ({ response }) {
      return {
        props: {
          details: {},
          error: response?.data.message,
          statusCode: response ? response?.status : "",
          session,
          ...(await serverSideTranslations(context.locale, ["common"])),
        },
      };
    }
  }
};

// import React, { useEffect, useState } from "react";
// import { serverSideTranslations } from "next-i18next/serverSideTranslations";
// import { getSession, signOut } from "next-auth/react";
// import PropTypes from "prop-types";
// // Custom
// import { Layout, LayoutWithSidebar } from "components/layout";
// import config from "config/config";
// import axios from "axios";
// import { ExtendModal, Header } from "components/global";
// import { useTranslation } from "react-i18next";
// import {
//   ViewLicense,
//   CancelReasons,
//   Modal,
//   DateInput,
//   Select,
// } from "components/UI";
// import { useHandleMessage, useSelect } from "hooks";
// import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";
// import moment from "moment";
// import DatePicker from "react-datepicker";

// const Index = ({ error, statusCode, bookingDetails }) => {
//   const { customer, payment, item, period, company } = bookingDetails;
//   const { t } = useTranslation("common");
//   const [localPickUpDate, setLocalPickUpDate] = useState(
//     moment(bookingDetails?.period?.pick_date || "").toDate() || ""
//   );
//   const [localDropUpDate, setLocalDropUpDate] = useState(
//     moment(bookingDetails?.period?.drop_date || "").toDate() || ""
//   );

//   const [times, settimes] = useState([
//     { value: "00:00", label: "12:00 am" },
//     { value: "01:00", label: "01:00 am" },
//     { value: "02:00", label: "02:00 am" },
//     { value: "03:00", label: "03:00 am" },
//     { value: "04:00", label: "04:00 am" },
//     { value: "05:00", label: "05:00 am" },
//     { value: "06:00", label: "06:00 am" },
//     { value: "07:00", label: "07:00 am" },
//     { value: "08:00", label: "08:00 am" },
//     { value: "09:00", label: "09:00 am" },
//     { value: "10:00", label: "10:00 am" },
//     { value: "11:00", label: "11:00 am" },
//     { value: "12:00", label: "12:00 pm" },
//     { value: "13:00", label: "01:00 pm" },
//     { value: "14:00", label: "02:00 pm" },
//     { value: "15:00", label: "03:00 pm" },
//     { value: "16:00", label: "04:00 pm" },
//     { value: "17:00", label: "05:00 pm" },
//     { value: "18:00", label: "06:00 pm" },
//     { value: "19:00", label: "07:00 pm" },
//     { value: "20:00", label: "08:00 pm" },
//     { value: "21:00", label: "09:00 pm" },
//     { value: "22:00", label: "10:00 pm" },
//     { value: "23:00", label: "11:00 pm" },
//   ]);
//   const startTime = useSelect(
//     times.find((e) => e.value == bookingDetails?.period?.pick_time),
//     "select",
//     null
//   );
//   console.log("pick_time", startTime);

//   // modals
//   const [showLicense, setShowLicense] = useState({ isOpen: false, url: "" });

//   const [extendModal, setExtendModal] = useState({
//     isOpen: false,
//     id: null,
//   });
//   const [cancelModal, setCancelModal] = useState({
//     isOpen: false,
//     id: null,
//   });

//   const handleMessage = useHandleMessage();

//   const handleReject = async (uuid) => {
//     setCancelModal({
//       id: uuid,
//       isOpen: true,
//     });
//   };

//   useEffect(() => {
//     statusCode == 401 && signOut();
//     error && handleMessage(error);
//   }, []);
//   return (
//     <>
//       <div className="min-h-full bg-gray-100 rounded-md dark:bg-gray-700">
//         <Header
//           title={t("home_key")}
//           path="/"
//           links={[
//             { label: t("bookings_key"), path: "/corporate-bookings" },
//             { label: t("edit_key") },
//           ]}
//           classes="bg-gray-100 dark:bg-gray-700 border-none"
//         />

//         {/* booking && editing */}
//         <div className="flex items-start justify-between mt-4 flex-wrap">
//           {/* booking */}
//           <div className="bg-white rounded-3xl dark:bg-gray-800 basis-full mb-4 lg:mb-0 lg:basis-6/12 ">
//             <h2 className="p-4 font-bold opacity-70 m-3">
//               {t("bookings_key")}
//             </h2>
//             <hr className="my-5 w-11/12 opacity-50 mx-auto border-gray-400 border-1" />

//             <div className="flex flex-col p-5 pt-0">
//               <p className="flex items-center justify-between py-2 px-2 mb-2">
//                 <span>{t("booking_id_key")}</span>
//                 <span>{bookingDetails?.individual_number}</span>
//               </p>
//               <p className="flex items-center justify-between py-2 px-2 mb-2">
//                 <span>{t("customer_name_key")}</span>
//                 <span>{customer?.customer?.full_name}</span>
//               </p>
//               <p className="flex items-center justify-between py-2 px-2 mb-2">
//                 <span>{t("pick_date_key")}</span>
//                 <span dir="ltr">{bookingDetails?.period?.pick_date}</span>
//               </p>
//               <p className="flex items-center justify-between py-2 px-2 mb-2">
//                 <span>{t("drop_date_key")}</span>
//                 <span dir="ltr">{bookingDetails?.period?.drop_date}</span>
//               </p>
//               <p className="flex items-center justify-between py-2 px-2 mb-2">
//                 <span>{t("number_of_days_key")}</span>
//                 <span dir="ltr">{bookingDetails?.period?.days}</span>
//               </p>
//               <p className="flex items-center justify-between py-2 px-2 mb-2">
//                 <span>{t("car_key")}</span>
//                 <span dir="ltr">{bookingDetails?.item?.name}</span>
//               </p>
//               <p className="flex items-center justify-between py-2 px-2 mb-2">
//                 <span>{t("price_key")}</span>
//                 <span dir="ltr">
//                   {bookingDetails?.item?.base_gross_price}{" "}
//                   {bookingDetails?.item?.base_unit}
//                 </span>
//               </p>
//               <p className="flex items-center justify-between py-2 px-2 mb-2">
//                 <span>{t("pick_up_time_key")}</span>
//                 <span dir="ltr">
//                   {
//                     times.find(
//                       (e) => e.value == bookingDetails?.period?.pick_time
//                     )?.label
//                   }
//                 </span>
//               </p>

//               <p className="flex items-center justify-between py-2 px-2 mb-2">
//                 <span>{t("car_driver_key")}</span>
//                 <CheckCircleIcon width={25} className="text-green-600" />
//               </p>
//               <p className="flex items-center justify-between py-2 px-2 mb-2">
//                 <span>{t("car_delivery_key")}</span>
//                 <CheckCircleIcon width={25} className="text-green-600" />
//               </p>
//               <p className="flex items-center justify-between py-2 px-2 mb-2">
//                 <span>{t("insurance_key")}</span>
//                 <XCircleIcon width={25} className="text-red-600" />
//               </p>
//               <p className="flex items-center justify-between py-2 px-2 mb-2">
//                 <span>{t("unlimited_km_key")}</span>
//                 <CheckCircleIcon width={25} className="text-green-600" />
//               </p>
//               <p className="flex items-center justify-between py-2 px-2 mb-2">
//                 <span>{t("vat_key")}</span>
//                 <span>{bookingDetails?.item?.total_base_vat_price}</span>
//               </p>
//               <p className="flex items-center justify-between py-2 px-2 mb-2">
//                 <span>{t("total_price_key")}</span>
//                 <span>{bookingDetails?.item?.period_gross_price}</span>
//               </p>
//             </div>
//           </div>
//           {/* edit */}
//           <div className="bg-white rounded-3xl dark:bg-gray-800 basis-full lg:basis-5/12 ">
//             <h2 className="p-4 font-bold opacity-70 m-3">{t("edit_key")}</h2>
//             <hr className="my-5 w-11/12 opacity-50 mx-auto border-gray-400 border-1" />

//             <div className="flex flex-col p-5 pt-0">
//               <p className="flex items-center justify-between py-2 px-2 mb-2 ">
//                 <span>{t("car_key")}</span>
//                 <span dir="ltr">{bookingDetails?.item?.name}</span>
//               </p>

//               <p className="flex items-center justify-between py-2 px-2 mb-2 font-semibold">
//                 <span className=" basis-6/12">{t("pick_date_key")}</span>

//                 <span dir="ltr">
//                   <div className="basis-4/12">
//                     <DateInput
//                       minDate={new Date()}
//                       className="px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-gray-300 text-black"
//                       value={localPickUpDate}
//                       onChange={(date) => {
//                         setLocalPickUpDate(date);
//                         if (
//                           localDropUpDate &&
//                           moment(localDropUpDate).isBefore(date)
//                         ) {
//                           setLocalDropUpDate(null);
//                         }
//                       }}
//                       withPortal
//                       portalId="root-portal"
//                     />
//                   </div>
//                 </span>
//               </p>
//               <p className="flex items-center justify-between py-2 px-2 mb-2 font-semibold">
//                 <span className=" basis-6/12">{t("drop_date_key")}</span>
//                 <span dir="ltr">
//                   <div className="basis-4/12">
//                     <DateInput
//                       minDate={moment(localPickUpDate).toDate()}
//                       className="px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-gray-300 grow-0 text-black"
//                       value={localDropUpDate}
//                       onChange={(date) => {
//                         setLocalDropUpDate(date);
//                         if (
//                           localDropUpDate &&
//                           moment(localDropUpDate).isBefore(date)
//                         ) {
//                           setLocalDropUpDate(null);
//                         }
//                       }}
//                       withPortal
//                       portalId="root-portal"
//                     />
//                   </div>
//                 </span>
//               </p>
//               <p className="flex items-center justify-between py-2 px-2 mb-2 font-semibold">
//                 <span className="basis-6/12">{t("pick_up_time_key")}</span>
//                 <span dir="ltr">
//                   <div className="basis-4/12">
//                     <Select {...startTime.bind} options={times} />
//                   </div>
//                 </span>
//               </p>
//               <p className="flex items-center justify-between py-2 px-2 mb-2">
//                 <span>{t("period_key")}</span>
//                 <span dir="ltr">{bookingDetails?.period?.days}</span>
//               </p>

//               <p className="flex items-center justify-between py-2 px-2 mb-2">
//                 <span>{t("location_key")}</span>
//                 <span dir="ltr">
//                   {bookingDetails?.pick?.address}{" "}
//                   {bookingDetails?.item?.base_unit}
//                 </span>
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>

//       {cancelModal.isOpen && (
//         <Modal
//           title={t("cancel_booking_key")}
//           show={cancelModal.isOpen}
//           footer={false}
//           onClose={() => setCancelModal({ isOpen: false, id: null })}
//         >
//           <CancelReasons
//             handleClose={() => setCancelModal({ isOpen: false, id: null })}
//             bookingId={cancelModal?.id}
//           />
//         </Modal>
//       )}

//       {showLicense.isOpen && (
//         <Modal
//           title={`${t("license_number_key")}: ${showLicense?.number}`}
//           show={showLicense.isOpen}
//           footer={false}
//           onClose={() => setShowLicense({ isOpen: false, url: "" })}
//         >
//           <ViewLicense url={showLicense?.url} />
//         </Modal>
//       )}

//       {extendModal.isOpen && (
//         <Modal
//           title={`${t("extend_key")}`}
//           show={extendModal.isOpen}
//           footer={false}
//           onClose={() => setExtendModal({ isOpen: false, id: "" })}
//         >
//           <ExtendModal
//             id={extendModal?.id}
//             closeModal={() => setExtendModal({ isOpen: false, id: "" })}
//           />
//         </Modal>
//       )}
//     </>
//   );
// };

// Index.propTypes = {
//   error: PropTypes.string,
//   session: PropTypes.object.isRequired,
//   bookingDetails: PropTypes.shape({
//     customer: PropTypes.shape({
//       user_uuid: PropTypes.string.isRequired,
//       full_name: PropTypes.string.isRequired,
//       birth_date: PropTypes.string.isRequired,
//       email: PropTypes.string.isRequired,
//       license: PropTypes.bool.isRequired,
//       license_number: PropTypes.string.isRequired,
//       phone_prefix: PropTypes.string.isRequired,
//       phone: PropTypes.string.isRequired,
//     }).isRequired,
//     payment: PropTypes.shape({
//       method: PropTypes.string.isRequired,
//       // ... (add more PropTypes if needed)
//     }).isRequired,
//     item: PropTypes.shape({
//       name: PropTypes.string.isRequired,
//       base_nett_price: PropTypes.string.isRequired,
//       period_nett_price: PropTypes.string.isRequired,
//       total_base_vat_price: PropTypes.string.isRequired,
//       total_base_gross_price: PropTypes.string.isRequired,
//       total_discount_gross_price: PropTypes.string.isRequired,
//       // ... (add more PropTypes if needed)
//     }).isRequired,
//     period: PropTypes.shape({
//       days: PropTypes.number.isRequired,
//       pick_date: PropTypes.string.isRequired,
//       drop_date: PropTypes.string.isRequired,
//       pick_time: PropTypes.string.isRequired,
//       // ... (add more PropTypes if needed)
//     }).isRequired,
//     company: PropTypes.shape({
//       name: PropTypes.string.isRequired,
//     }).isRequired,
//     corporate: PropTypes.shape({
//       can_extend: PropTypes.bool.isRequired,
//     }).isRequired,
//     state: PropTypes.string.isRequired,
//     can_cancel: PropTypes.bool.isRequired,
//     delivery: PropTypes.bool.isRequired,
//     uuid: PropTypes.string.isRequired,
//     individual_number: PropTypes.string.isRequired,
//     office: PropTypes.shape({
//       name: PropTypes.string.isRequired,
//       address: PropTypes.string.isRequired,
//     }).isRequired,
//     // ... (add more PropTypes as needed for nested objects)
//   }).isRequired,
// };

// Index.getLayout = function PageLayout(page) {
//   return (
//     <Layout>
//       <LayoutWithSidebar>{page}</LayoutWithSidebar>
//     </Layout>
//   );
// };

// export default Index;

// export const getServerSideProps = async (context) => {
//   const session = await getSession({ req: context.req });
//   const bookingUUID = context.query?.uuid || "";
//   const loginUrl =
//     context.locale === "ar" ? "/login" : `/${context.locale}/login`;
//   if (!session || session?.user?.role[0] != "corporate_coordinator") {
//     return {
//       redirect: {
//         destination: loginUrl,
//         permanent: false,
//       },
//     };
//   } else {
//     try {
//       const apiUrl = config.apiGateway.API_URL_TELGANI;
//       const {
//         data: { data },
//       } = await axios.get(`${apiUrl}/v2/booking/${bookingUUID}/preview`, {
//         headers: {
//           Authorization: `Bearer ${session.user?.meta?.access_token}`,
//         },
//       });
//       return {
//         props: {
//           bookingDetails: data || {},
//           error: null,
//           statusCode: null,
//           // session,
//           ...(await serverSideTranslations(context.locale, ["common"])),
//         },
//       };
//     } catch ({ response }) {
//       return {
//         props: {
//           bookingDetails: {},
//           error: response?.data.message,
//           statusCode: response ? response?.status : "",
//           // session,
//           ...(await serverSideTranslations(context.locale, ["common"])),
//         },
//       };
//     }
//   }
// };
