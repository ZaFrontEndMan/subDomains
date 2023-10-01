// import React, { useCallback, useRef, useState, useEffect } from "react";
// import { serverSideTranslations } from "next-i18next/serverSideTranslations";
// import { getSession } from "next-auth/react";
// import PropTypes from "prop-types";

// // Custom
// import { Layout, LayoutWithSidebar } from "components/layout";
// import config from "config/config";
// import { Header } from "components/global";
// import { useTranslation } from "react-i18next";
// import { Input, Select, Spinner, Button } from "components/UI";
// import { useRouter } from "next/router";
// import { useHandleMessage, useInput, useSelect } from "hooks";

// import axiosInstance from "auth/axiosInstance";
// import { getFirstError } from "utils/utils";
// import {
//   fetchManfactures,
//   fetchVehicle,
//   fetchYears,
// } from "helper/apis/addition";

// const update = ({ carUUID }) => {
//   const router = useRouter();
//   const { t } = useTranslation("common");
//   const [loading, setLoading] = useState(true);
//   const [manfacturesOptions, setManfacturesOptions] = useState([]);
//   const [yearsOptios, setYearsOptios] = useState([]);
//   const [modelsOptions, setModelsOptions] = useState([]);

//   const [dailyRateOptions, setDailyRateOptions] = useState([]);

//   const daily_rate_price = useInput("", "number", true);
//   const daily_discount_price = useInput("", "number", true);
//   const daily_nett_price_before_markup = useInput("", "number", true);
//   const daily_nett_price_after_markup = useInput("", "number", true);

//   const weekly_rate_price = useInput("", "number", true);
//   const weekly_discount_price = useInput("", "number", true);
//   const weekly_nett_price_before_markup = useInput("", "number", true);
//   const weekly_nett_price_after_markup = useInput("", "number", true);

//   const monthly_rate_price = useInput("", "number", true);
//   const monthly_discount_price = useInput("", "number", true);
//   const monthly_nett_price_before_markup = useInput("", "number", true);
//   const monthly_nett_price_after_markup = useInput("", "number", true);

//   const manufacturer = useSelect("", "select");
//   const year = useSelect("", "select");
//   const model = useSelect("", "select");
//   const daily = useSelect("", "select");
//   const weekly = useSelect("", "select");
//   const monthly = useSelect("", "select");

//   const [dailyRate, setDailyRate] = useState({});
//   const [weeklyRate, setWeeklyRate] = useState({});
//   const [monthlyRate, setMonthlyRate] = useState({});

//   const language = router.locale.toLowerCase();
//   const date_format = language === "en" ? "DD/MM/YYYY" : "YYYY/MM/DD";
//   const handleMessage = useHandleMessage();

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const resp = await axiosInstance.get(
//           `${config.apiGateway.API_URL_TELGANI}/v2/supplier/business/car/${carUUID}/show`
//         );
//         const { data } = resp.data;
//         const vehicle = data.vehicle || {};
//         const prices = data.prices || {};
//         setDailyRate(prices?.daily);
//         setWeeklyRate(prices?.weekly);
//         setMonthlyRate(prices?.monthly);

//         daily_rate_price.changeValue(prices.daily?.nett_price);
//         daily_discount_price.changeValue(prices.daily?.discount_nett_price);
//         daily_nett_price_before_markup.changeValue(
//           prices.daily?.nett_price_before_markup
//         );
//         daily_nett_price_after_markup.changeValue(
//           prices.daily?.nett_price_after_markup
//         );

//         weekly_rate_price.changeValue(prices.weekly?.nett_price);
//         weekly_discount_price.changeValue(prices.weekly?.discount_nett_price);
//         weekly_nett_price_before_markup.changeValue(
//           prices.weekly?.nett_price_before_markup
//         );
//         weekly_nett_price_after_markup.changeValue(
//           prices.weekly?.nett_price_after_markup
//         );

//         monthly_rate_price.changeValue(prices.monthly?.nett_price);
//         monthly_discount_price.changeValue(prices.monthly?.discount_nett_price);
//         monthly_nett_price_before_markup.changeValue(
//           prices.monthly?.nett_price_before_markup
//         );
//         monthly_nett_price_after_markup.changeValue(
//           prices.monthly?.nett_price_after_markup
//         );

//         manufacturer.changeValue({
//           value: vehicle.maker_uuid,
//           label: vehicle.maker_name,
//         });

//         year.changeValue({
//           value: vehicle.year,
//           label: vehicle.year,
//         });

//         model.changeValue({
//           value: vehicle.model_uuid,
//           label:
//             language == "en" ? vehicle.model_name.en : vehicle.model_name.ar,
//         });

//         daily.changeValue({
//           value: prices.daily.days,
//           label: `${prices.daily.days} day/s`,
//         });

//         setLoading(false);
//       } catch ({ data }) {
//         if (data?.message == "CanceledError") {
//           return;
//         }
//         handleMessage(
//           getFirstError(data?.errors) || data?.message || data?.error
//         );
//         setLoading(false);
//       }
//     };

//     const fetchManufacturer = async () => {
//       try {
//         const { data } = await fetchManfactures();
//         const formattedData = data?.map((item) => ({
//           ...item,
//           value: item.uuid,
//           label: item.name,
//         }));
//         setManfacturesOptions(formattedData);
//       } catch ({ data }) {
//         if (data?.message == "CanceledError") {
//           return;
//         }
//         handleMessage(
//           getFirstError(data?.errors) || data?.message || data?.error
//         );
//         setLoading(false);
//       }
//     };

//     if (carUUID) {
//       fetchManufacturer();
//       fetchData();
//     }
//   }, [carUUID]);
//   useEffect(() => {
//     if (manufacturer?.value?.value) {
//       const fetch = async () => {
//         try {
//           const { data } = await fetchYears(manufacturer?.value?.value);
//           const formatedData = data?.map((item) => {
//             return {
//               value: item,
//               label: item,
//             };
//           });
//           setYearsOptios(formatedData);
//         } catch ({ data }) {
//           handleMessage(
//             getFirstError(data?.errors) || data?.message || data?.error
//           );
//         }
//       };
//       fetch();
//     } else {
//       year.reset();
//       model.reset();
//     }
//   }, [manufacturer?.value?.value]);
//   useEffect(() => {
//     if (year.value?.value && manufacturer?.value?.value) {
//       const fetch = async () => {
//         try {
//           const { data } = await fetchVehicle(
//             year.value?.value,
//             manufacturer?.value?.value
//           );

//           const formatedData = data?.map((item) => {
//             return {
//               ...item,
//               value: item.uuid,
//               label: item.model_name,
//             };
//           });
//           setModelsOptions(formatedData);
//           setLoading(false);
//         } catch ({ data }) {
//           handleMessage(
//             getFirstError(data?.errors) || data?.message || data?.error
//           );
//           setLoading(false);
//         }
//       };
//       fetch();
//     } else {
//       model.reset();
//     }
//   }, [year.value?.value, manufacturer?.value?.value]);

//   return (
//     <>
//       <div className="min-h-full bg-gray-100 rounded-md dark:bg-gray-700">
//         <Header
//           title={t("offices_key")}
//           path="/companies-list"
//           links={[
//             { label: t("cars_key"), path: "/edit-cars" },
//             // ...(corporateUUID ? [{ label: tableData[0]["corporate_name"] }] : [])
//           ]}
//           classes="bg-gray-100 dark:bg-gray-700 border-none"
//         />
//         {loading ? (
//           <p className="text-center p-5 mt-20">
//             <Spinner className=" w-12 mx-auto " />
//           </p>
//         ) : (
//           <>
//             {/* Car details */}
//             <div className="flex items-start justify-between mt-4 flex-wrap">
//               <div className=" bg-white rounded-3xl dark:bg-gray-800 basis-full mb-4 lg:mb-0 lg:basis-9/12  ">
//                 <h2 className="p-4 font-bold opacity-70 m-3">
//                   {t("car_details_key")}
//                 </h2>
//                 <hr className="my-5 w-11/12 opacity-50 mx-auto border-gray-400 border-1" />

//                 <div className=" p-6 ">
//                   <Select
//                     className=" py-4"
//                     options={manfacturesOptions}
//                     {...manufacturer.bind}
//                     getOptionLabel={(item) =>
//                       language == "en" ? item.label.en : item.label.ar
//                     }
//                     label={t("manufacturer_key")}
//                   />
//                   <Select
//                     className=" py-4"
//                     options={yearsOptios}
//                     {...year.bind}
//                     label={t("year_key")}
//                     isDisabled={!manufacturer.value?.value}
//                   />
//                   <Select
//                     className=" py-4"
//                     options={modelsOptions}
//                     {...model.bind}
//                     label={t("model_key")}
//                     isDisabled={!year.value?.value}
//                     getOptionLabel={(item) =>
//                       language == "en" ? item.label.en : item.label.ar
//                     }
//                   />
//                 </div>
//               </div>
//             </div>

//             {/* daily rate */}
//             <div className="flex items-start justify-between mt-4 flex-wrap">
//               <div className=" bg-white rounded-3xl dark:bg-gray-800 basis-full mb-4 lg:mb-0 lg:basis-9/12  ">
//                 <h2 className="p-4 font-bold opacity-70 m-3">
//                   {t("daily_rate_key")}
//                 </h2>
//                 <hr className="my-5 w-11/12 opacity-50 mx-auto border-gray-400 border-1" />

//                 {loading ? (
//                   ""
//                 ) : (
//                   <>
//                     <div className="p-6 flex gap-4   ">
//                       <Select
//                         options={dailyRateOptions}
//                         {...daily.bind}
//                         label={t("daily_price_start_from_key")}
//                       />
//                       <Input
//                         label={t("price_key")}
//                         {...daily_rate_price.bind}
//                       />
//                       <Input
//                         label={t("discount_price_key")}
//                         {...daily_discount_price.bind}
//                       />
//                       <Input
//                         label={t("nett_price_before_markup_key")}
//                         {...daily_nett_price_before_markup.bind}
//                       />
//                     </div>
//                     <div className="px-6 flex gap-4 justify-between    ">
//                       <Input
//                         label={t("nett_price_after_markup_key")}
//                         {...daily_nett_price_after_markup.bind}
//                       />
//                       <span className=" cursor-default text-sm  text-primary">
//                         {t("average_price_key")} <br /> 111 {t("sar_key")}
//                       </span>
//                       <span className=" cursor-default text-sm  text-primary">
//                         {t("average_price_key")} <br /> 111 {t("sar_key")}
//                       </span>
//                     </div>
//                   </>
//                 )}
//               </div>
//             </div>

//             {/* weekly rate */}
//             <div className="flex items-start justify-between mt-4 flex-wrap">
//               <div className=" bg-white rounded-3xl dark:bg-gray-800 basis-full mb-4 lg:mb-0 lg:basis-9/12  ">
//                 <h2 className="p-4 font-bold opacity-70 m-3">
//                   {t("weekly_rate_key")}
//                 </h2>
//                 <hr className="my-5 w-11/12 opacity-50 mx-auto border-gray-400 border-1" />

//                 {loading ? (
//                   ""
//                 ) : (
//                   <>
//                     <div className="p-6 flex gap-4   ">
//                       <Select
//                         {...weekly.bind}
//                         label={t("weekly_price_start_from_key")}
//                       />
//                       <Input
//                         weekly_discount_price
//                         {...weekly_rate_price.bind}
//                         label={t("price_key")}
//                       />
//                       <Input
//                         weekly_discount_price
//                         {...weekly_discount_price.bind}
//                         label={t("discount_price_key")}
//                       />
//                       <Input
//                         weekly_discount_price
//                         {...weekly_nett_price_before_markup.bind}
//                         label={t("nett_price_before_markup_key")}
//                       />
//                     </div>
//                     <div className="px-6 flex gap-4 justify-between    ">
//                       <Input
//                         {...weekly_nett_price_after_markup.bind}
//                         label={t("nett_price_after_markup_key")}
//                       />
//                       <span className=" cursor-default text-sm  text-primary">
//                         {t("average_price_key")} <br /> 111 {t("sar_key")}
//                       </span>
//                       <span className=" cursor-default text-sm  text-primary">
//                         {t("average_price_key")} <br /> 111 {t("sar_key")}
//                       </span>
//                     </div>
//                   </>
//                 )}
//               </div>
//             </div>

//             {/* monthly rate */}
//             <div className="flex items-start justify-between mt-4 flex-wrap">
//               <div className=" bg-white rounded-3xl dark:bg-gray-800 basis-full mb-4 lg:mb-0 lg:basis-9/12  ">
//                 <h2 className="p-4 font-bold opacity-70 m-3">
//                   {t("monthly_rate_key")}
//                 </h2>
//                 <hr className="my-5 w-11/12 opacity-50 mx-auto border-gray-400 border-1" />

//                 {loading ? (
//                   ""
//                 ) : (
//                   <>
//                     <div className="p-6 flex gap-4   ">
//                       <Select
//                         {...monthly.bind}
//                         label={t("monthly_price_start_from_key")}
//                       />

//                       <Input
//                         {...monthly_rate_price.bind}
//                         label={t("price_key")}
//                       />

//                       <Input
//                         {...monthly_discount_price.bind}
//                         label={t("discount_price_key")}
//                       />

//                       <Input
//                         {...monthly_nett_price_before_markup.bind}
//                         label={t("nett_price_before_markup_key")}
//                       />
//                     </div>
//                     <div className="px-6 flex gap-4 justify-between    ">
//                       <Input
//                         {...monthly_nett_price_after_markup.bind}
//                         className=" w-4/12 "
//                         label={t("nett_price_after_markup_key")}
//                       />
//                       <span className=" cursor-default text-sm  text-primary">
//                         {t("average_price_key")} <br /> 111 {t("sar_key")}
//                       </span>
//                       <span className=" cursor-default text-sm  text-primary">
//                         {t("popular_price_key")} <br /> 111 {t("sar_key")}
//                       </span>
//                     </div>
                    
//                   </>
//                 )}
//               </div><div className="flex items-start justify-start flex-wrap gap-3  bg-white rounded-3xl dark:bg-gray-800 basis-full p-4 my-4 lg:mb-0 lg:basis-9/12 ">
//                       <Button>{t("save_key")}</Button>
//                       <Button className=" btn--secondary">
//                         {t("discard_key")}
//                       </Button>
//                     </div>
//             </div>
//           </>
//         )}
//       </div>
//     </>
//   );
// };

// update.propTypes = {
//   session: PropTypes.object.isRequired,
//   carUUID: PropTypes.string.isRequired,
// };
// update.getLayout = function PageLayout(page) {
//   return (
//     <Layout>
//       <LayoutWithSidebar>{page}</LayoutWithSidebar>
//     </Layout>
//   );
// };

// export default update;
// export const getServerSideProps = async (context) => {
//   const session = await getSession({ req: context.req });
//   const carUUID = context.query?.car || "";

//   const loginUrl =
//     context.locale === "ar" ? "/login" : `/${context.locale}/login`;

//   if (!session || session?.user?.role[0] !== "admin") {
//     return {
//       redirect: {
//         destination: loginUrl,
//         permanent: false,
//       },
//     };
//   } else {
//     return {
//       props: {
//         session,
//         carUUID,
//         ...(await serverSideTranslations(context.locale, ["common"])),
//       },
//     };
//   }
// };

import React from 'react'

export default function Update() {
  return (
    <div>Update</div>
  )
}
