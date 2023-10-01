import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Image from "next/image";
import { getSession, signOut, useSession } from "next-auth/react";
import dynamic from "next/dynamic";
// Custom
import { Layout, LayoutWithSidebar } from "components/layout";
import config from "config/config";
import {
  useHandleMessage,
  useSelect,
  useCheckbox,
  useInput,
  useSavedState,
} from "hooks";
import {
  SelectComponent,
  SelectCarSection,
  SelectCustomerSection,
  SelectPickUpDateTimeSection,
  Actions,
  DeliverTheCarToYourLocation,
  DropOffDifferentCity,
  SelectService,
} from "components/pages/corporate/bok-car";
import { Checkbox, Input, LocationSearch, Spinner } from "components/UI";
import { formatComma, getFirstError, sum } from "utils/utils";
import { usePlacesWidget } from "react-google-autocomplete";
import moment from "moment";
import axios from "axios";
import { getSelectedCar } from "helper/apis/booking";
const MapComponent = dynamic(() => import("components/Map/mapGoogle"), {
  ssr: false,
});
const customersList = ({ error, statusCode, corporateUUID }) => {
  const { t } = useTranslation("common");
  const handleMessage = useHandleMessage();
  const [updateLocaleStorage, setUpdateLocaleStorage] = useState(true);

  const { data } = useSession();
  const user = data?.user || {};

  // main
  const [selectedService, setSelectedService, clearCacheSelectedService] =
    useSavedState(1, "selected-service");
  const [
    selectedServiceOptionTwo,
    setSelectedServiceOptionTwo,
    clearCacheSelectedServiceOptionTwo,
  ] = useSavedState(2, "selected-service-option-two");
  const [
    selectedReceiveType,
    setSelectedReceiveType,
    clearCacheSelectedReceiveType,
  ] = useSavedState(1, "telgani-b2b-selected-receive-type-cache");

  const [airPort, setAirPort] = useState(null);
  const customerId = useSelect("", "select", null);

  // ================== select car ============
  const [selectedCar, setSelectedCar, clearCacheSelectedCar] = useSavedState(
    {},
    "selected-car"
  );
  // ================== select car ============
  // ================== select pickUpDateTime ============
  const [pickUpDate, setPickUpDate, clearCachePickUpDate] = useSavedState(
    moment().add(1, "day").toDate(),
    "pick-up-date"
  );
  const [dropUpDate, setDropUpDate, clearCacheDropUpDate] = useSavedState(
    moment().add(3, "day").toDate(),
    "drop-up-date"
  );
  const [time, setTime, clearCacheTime] = useSavedState(
    moment().add(1, "hour").startOf("hour").format("HH:mm"),
    "time"
  );
  // ================== select pickUpDateTime ============

  // ================== select booking details ============
  const [
    driverTheCarToYourLocation,
    setDriverTheCarToYourLocation,
    clearCacheDriverTheCarToYourLocation,
  ] = useSavedState({}, "driver-the-car-to-your-location");
  const [
    dropOfDifferentCity,
    setDropOfDifferentCity,
    clearCacheDropOfDifferentCity,
  ] = useSavedState({}, "drop-of-different-city");

  // ================== select booking details ============

  // ================== select extra services ============
  const extraInsurance = useCheckbox(false, "agreement", "checked", true);
  const babySeat = useCheckbox(false, "agreement", "checked", true);
  const unlimitedKm = useCheckbox(false, "agreement", "checked", true);

  const havePromoCode = useCheckbox(false, "agreement", "checked", true);
  const promoCode = useInput("", "", null);

  // ================== select extra services ============

  // ================== map ============
  const [deliveryLocation, setDeliveryLocation, clearCacheDeliveryLocation] =
    useSavedState(null, "telgani-b2b-delivery-location-cache");
  // ================== map ============

  const apiKey = process.env.MAP_API_KEY;
  const { ref } = usePlacesWidget({
    apiKey: apiKey,
    onPlaceSelected: (place) => {
      if (place?.geometry?.location) {
        setDeliveryLocation({
          ...deliveryLocation,
          address: place.formatted_address,
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
        });
      }
    },
  });

  // to update the input search value
  useEffect(() => {
    if (deliveryLocation?.address && ref.current) {
      ref.current.value = deliveryLocation.address;
    }
  }, [deliveryLocation?.address]);

  const summary = useMemo(() => {
    const calculateDurationInDays = () =>
      moment(dropUpDate).endOf("day").diff(pickUpDate, "days") || 1;

    const originalPrice =
      (selectedCar?.price?.discounted || 0) * calculateDurationInDays();
    let amount = originalPrice;

    const extraInsuranceDefaultAmount = 25;
    const extraInsuranceAmount =
      extraInsuranceDefaultAmount * calculateDurationInDays();
    const unlimitedKmDefaultAmount = 20;
    const unlimitedKmAmount =
      unlimitedKmDefaultAmount * calculateDurationInDays();
    const babySeatAmount = 22;
    const serviceFee = 0;

    if (extraInsurance.checked) {
      amount += extraInsuranceAmount;
    }
    if (unlimitedKm.checked) {
      amount += unlimitedKmAmount;
    }
    if (babySeat.checked) {
      amount += babySeatAmount;
    }
    return {
      selectedService,
      selectedReceiveType,
      totalAmount: amount,
      originalPrice,

      vehicle: selectedCar?.vehicle,
      selectedCar,

      limit: user?.corporate?.coordinator_booking_limit,
      promoCode: promoCode.value,
      isExtraInsurance: extraInsurance.checked,
      extraInsuranceAmount,
      extraInsuranceDefaultAmount,

      isUnlimitedKm: unlimitedKm.checked,
      unlimitedKmAmount,
      unlimitedKmDefaultAmount,

      isBabySeat: babySeat.checked,
      babySeatAmount,
      pickUpDate,
      dropUpDate,
      time,
      serviceFee,
      customer: customerId.value,
      days: calculateDurationInDays(),
      deliveryLocation,
      driverTheCarToYourLocation,
      dropOfDifferentCity,
      airPort,
    };
  }, [
    selectedService,
    selectedReceiveType,
    extraInsurance.checked,
    pickUpDate,
    customerId.value,
    dropUpDate,
    time,
    unlimitedKm.checked,
    promoCode.value,
    babySeat.checked,
    selectedCar,
    deliveryLocation,
    driverTheCarToYourLocation,
    dropOfDifferentCity,
    airPort?.value,
  ]);

  const discrad = () => {
    customerId.reset();
    if (ref.current) {
      ref.current.value = "";
    }
    setSelectedCar({});
    setSelectedService(1);
    setSelectedReceiveType(1);
    setPickUpDate(moment().add(1, "day").toDate());
    setDropUpDate(moment().add(3, "day").toDate());
    setTime(moment().add(1, "hour").startOf("hour").format("HH:mm"));
    setDriverTheCarToYourLocation({});
    setDropOfDifferentCity({});
    extraInsurance.changeValue(false);
    babySeat.changeValue(false);
    unlimitedKm.changeValue(false);
    havePromoCode.changeValue(false);
    promoCode.changeValue("");
    setDeliveryLocation(null);

    // clear saved data from local storage
    clearCacheSelectedService();
    clearCacheSelectedServiceOptionTwo();
    clearCacheSelectedReceiveType();
    clearCacheSelectedCar();
    clearCachePickUpDate();
    clearCacheDropUpDate();
    clearCacheTime();
    clearCacheDriverTheCarToYourLocation();
    clearCacheDropOfDifferentCity();
    clearCacheDeliveryLocation();

    localStorage.removeItem("customer-id");
    localStorage.removeItem("extraInsurance");
    localStorage.removeItem("babySeat");
    localStorage.removeItem("unlimitedKm");
  };

  useEffect(() => {
    const storageCustomerId = JSON.parse(
      localStorage.getItem("customer-id") || "{}"
    );
    const storageExtraInsurance = localStorage.getItem("extraInsurance");
    const storageBabySeat = localStorage.getItem("babySeat");
    const storageUnlimitedKm = localStorage.getItem("unlimitedKm");
    if (Object.keys(storageCustomerId)?.length) {
      customerId.changeValue(storageCustomerId);
    }
    storageExtraInsurance === "true" && extraInsurance.changeValue(true);
    storageBabySeat === "true" && babySeat.changeValue(true);
    storageUnlimitedKm === "true" && unlimitedKm.changeValue(true);
  }, []);

  useEffect(() => {
    customerId.value?.value &&
      localStorage.setItem("customer-id", JSON.stringify(customerId.value));
    extraInsurance.checked &&
      localStorage.setItem("extraInsurance", extraInsurance.checked.toString());
    babySeat.checked &&
      localStorage.setItem("babySeat", babySeat.checked.toString());
    unlimitedKm.checked &&
      localStorage.setItem("unlimitedKm", unlimitedKm.checked.toString());
  }, [updateLocaleStorage]);

  useEffect(() => {
    if (statusCode == 401) {
      signOut();
      return;
    }
    error && handleMessage(error);
  }, []);

  useEffect(() => {
    babySeat.reset();
    extraInsurance.reset();
    unlimitedKm.reset();
    setSelectedCar({
      ...selectedCar,
      updated: false,
    });
    const fetchSelectedCar = async (uuid) => {
      const ay7aga = {
        period: {
          pick_date: moment(summary?.pickUpDate).format("YYYY-MM-DD"),
          pick_time: summary?.time,
          drop_date: moment(summary?.dropUpDate).format("YYYY-MM-DD"),
        },
        options: {
          delivery_location: {
            delivery_lat:
              summary?.driverTheCarToYourLocation?.lat ||
              summary?.deliveryLocation?.lat ||
              null,
            delivery_lng:
              summary?.driverTheCarToYourLocation?.lng ||
              summary?.deliveryLocation?.lng ||
              null,
          },
          // cancellation: 1,
          // promo_code: "string",
          // dropCity: null,
          // driver: 1,
          // delivery: summary?.selectedReceiveType == 1 ? 1 : 0,
          unlimitedKm: summary?.isUnlimitedKm ? 1 : 0,
          insurance: summary?.isExtraInsurance ? 1 : 0,
          // tam: 1,
          // extra_driver: 1,
          child_seat: summary?.isBabySeat ? 1 : 0,
          // auth_out_ksa: 1,
          // no_smoking_car: 1,
          // delivery_drop: 1,
          // externals: ["string"],
          // internal: ["string"],
          // rewards: ["string"],
          // fast_delivery_at_airport:
          //   summary?.selectedCar?.office?.fast_delivery_at_airport,
        },
        // subscription: {
        //   period: "1",
        // },
        // airport_uuid: null,
      };
      try {
        const { data: car } = await getSelectedCar(ay7aga, uuid);
        setSelectedCar({
          ...selectedCar,
          updated: true,
          price: {
            ...selectedCar.price,
            discounted: car?.prices?.base_after_markup_gross_price,
          },
        });
      } catch ({ data }) {
        handleMessage(
          getFirstError(data?.errors) || data?.message || data?.error
        );
      }
    };
    selectedCar.uuid && fetchSelectedCar(selectedCar.uuid);
  }, [selectedCar.uuid]);
  return (
    <>
      <div className="relative">
        {/* ${selectedReceiveType == 1 ? "lg:w-5/12" : "lg:w-6/12 lg:ml-[45vh] rtl:lg:mr-[45vh]"} */}
        <div
          className={`overflow-x-hidden  border-gray-200 dark:border-gray-700 border-2 shadow-2xl top-4 min-h-[83vh] bottom-4 overflow-auto w-full p-8 bg-white rounded-md
          lg:w-5/12
          duration-500  md:ml-6 md:rtl:ml-0 md:rtl:mr-6 dark:bg-gray-800 absolute z-50`}
        >
          <h3 className="mb-5">{t("create_new_booking_key")}</h3>
          {/* *************************** start services *************************** */}

          <SelectService
            selectedService={selectedService}
            setSelectedService={setSelectedService}
            airPort={airPort}
            setAirPort={setAirPort}
          />

          <div className="flex mt-4 border rounded-3xl">
            {["chauffeur", "leasing"].map((item, i) => {
              return (
                <button
                  disabled
                  key={item}
                  onClick={() => setSelectedServiceOptionTwo(i + 1)}
                  className={` hover:bg-tranparent duration-100   flex basis-2/4 p-3 rounded-3xl`}
                >
                  <Image width={35} height={25} src={`/images/${item}.png`} />
                  <span className="text-gray-500 dark:text-gray-300">
                    {t(`${item}_key`)}{" "}
                    <span className="text-gray-300 dark:text-gray-500">
                      {t("coming_soon_key")}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
          {/* *************************** end services ************************** */}
          {/* *************************** start receive type *************************** */}
          <SelectComponent
            title="select_receive_type_key"
            options={[
              { label: "delivery_key", imageType: "vehicle" },
              { label: "pick_up_key", imageType: "vehicle", disabled: true },
            ]}
            selected={selectedReceiveType}
            setSelected={setSelectedReceiveType}
            classes="mt-5"
          />
          {/* *************************** start receive type *************************** */}

          {/* *************************** start Delivery address *************************** */}
          {/* ${selectedReceiveType != 1 ? "-translate-x-10 opacity-0 h-5 z-0" : "mb-4"} */}
          <div className={`duration-300  mb-4`}>
            <LocationSearch labelKey={t("delivery_address_key")} ref={ref} />
          </div>

          {/* *************************** end Delivery address *************************** */}

          {/* *************************** start customer logic *************************** */}
          <div className="my-5">
            <SelectCustomerSection
              customerId={customerId}
              corporateUUID={corporateUUID}
            />
          </div>

          {/* *************************** end customer logic *************************** */}
          {/* *************************** start select car *************************** */}
          <hr className="my-5 border-gray-400 border-1" />
          <div className="mb-5">
            <SelectCarSection
              selectedCar={selectedCar}
              setSelectedCar={setSelectedCar}
              summary={summary}
            />
          </div>
          {/* *************************** end select car *************************** */}
          {/* *************************** start booking details *************************** */}
          {selectedCar.uuid && (
            <div className="mb-5">
              <h4 className="mb-3">{t("booking_details_key")}</h4>
              <div className="flex flex-col gap-y-2">
                <SelectPickUpDateTimeSection
                  pickUpDate={pickUpDate}
                  setPickUpDate={setPickUpDate}
                  dropUpDate={dropUpDate}
                  setDropUpDate={setDropUpDate}
                  time={time}
                  setTime={setTime}
                />

                <DeliverTheCarToYourLocation
                  apiKey={apiKey}
                  location={driverTheCarToYourLocation}
                  setLocation={setDriverTheCarToYourLocation}
                />

                <DropOffDifferentCity
                  apiKey={apiKey}
                  location={dropOfDifferentCity}
                  setLocation={setDropOfDifferentCity}
                />
              </div>
            </div>
          )}

          {/* *************************** end booking details *************************** */}
          {/* *************************** start extra services *************************** */}

          {selectedCar.uuid && (
            <>
              <h4 className="mt-6 mb-3">{t("extra_services_key")}</h4>
              <div className="flex flex-col gap-y-2">
                {summary?.selectedCar?.options?.insurance && (
                  <div className="flex items-center justify-between">
                    <Checkbox
                      label={t("extra_insurance_key")}
                      {...extraInsurance.bind}
                    />
                    <span className="text-sm ">{`${t("sar_key")} ${
                      summary?.extraInsuranceDefaultAmount
                    } / ${t("day_key")}`}</span>
                  </div>
                )}
                {summary?.selectedCar?.options?.child_seat && (
                  <div className="flex items-center justify-between">
                    <Checkbox label={t("baby_seat_key")} {...babySeat.bind} />
                    <span className="text-sm ">{`${t("sar_key")} ${formatComma(
                      summary?.babySeatAmount
                    )}`}</span>
                  </div>
                )}
                {summary?.selectedCar?.options?.unlimited_km && (
                  <div className="flex items-center justify-between">
                    <Checkbox
                      label={t("unlimited_km_key")}
                      {...unlimitedKm.bind}
                    />
                    <span className="text-sm ">{`${t("sar_key")} ${
                      summary?.unlimitedKmDefaultAmount
                    } / ${t("day_key")}`}</span>
                  </div>
                )}

                <hr className="my-5 border-gray-400 border-1" />
                <div>
                  <Checkbox
                    label={t("have_promo_code_key")}
                    {...havePromoCode.bind}
                  />
                </div>
                {havePromoCode.checked && (
                  <div>
                    <Input
                      placeholder={t("enter_promo_code_key")}
                      {...promoCode.bind}
                    />
                  </div>
                )}
              </div>
            </>
          )}
          {/* *************************** end extra services *************************** */}
          {/* *************************** start price details *************************** */}

          {selectedCar.uuid && (
            <>
              <h4 className="mt-6 mb-3">{t("price_details_key")}</h4>
              <div className="flex flex-col mb-5 overflow-x-hidden text-sm">
                <p className="flex items-center justify-between px-2 mb-2">
                  <span>{t("original_price_key")}</span>
                  {selectedCar?.updated ? (
                    <span>
                      {`${formatComma(selectedCar?.price?.discounted)} * 
                      ${summary?.days}`}{" "}
                      {t("day_key")}
                    </span>
                  ) : (
                    <Spinner className="w-5" />
                  )}
                </p>

                <p className="flex items-center justify-between px-2 mb-2">
                  <span>{t("service_fee_key")}</span>
                  <span>{formatComma(summary?.serviceFee)}</span>
                </p>

                <p
                  className={`flex items-center justify-between px-2  duration-300  ${
                    !extraInsurance.checked
                      ? "-translate-x-20 opacity-0 h-0 mb-0"
                      : "mb-2"
                  }`}
                >
                  <span>+ {t("extra_insurance_key")}</span>
                  <span>{formatComma(summary?.extraInsuranceAmount)}</span>
                </p>

                <p
                  className={`flex items-center justify-between px-2  duration-300  ${
                    !babySeat.checked
                      ? "-translate-x-20 opacity-0 h-0 mb-0"
                      : "mb-2"
                  }`}
                >
                  <span>+ {t("baby_seat_key")}</span>
                  <span>{formatComma(summary?.babySeatAmount)}</span>
                </p>

                <p
                  className={`flex items-center justify-between px-2  duration-300  ${
                    !unlimitedKm.checked
                      ? "-translate-x-20 opacity-0 h-0 mb-0"
                      : "mb-2"
                  }`}
                >
                  <span>+ {t("unlimited_km_key")}</span>
                  <span>{formatComma(summary?.unlimitedKmAmount)}</span>
                </p>
                <p className="flex items-center justify-between p-2 bg-gray-200 rounded dark:bg-gray-700 dark:text-white">
                  <span>{t("total_price_key")}</span>
                  {selectedCar?.updated ? (
                    <span>{formatComma(summary?.totalAmount)}</span>
                  ) : (
                    <Spinner className="w-5" />
                  )}
                </p>
              </div>
            </>
          )}
          {/* *************************** end price details *************************** */}
          {/* *************************** start actions *************************** */}

          <Actions
            discrad={discrad}
            summary={summary}
            extraInsurance={extraInsurance.checked}
            babySeat={babySeat.checked}
            unlimitedKm={unlimitedKm.checked}
            setUpdateLocaleStorage={setUpdateLocaleStorage}
          />
          {/* *************************** end actions *************************** */}
        </div>

        {/* *************************** start map *************************** */}

        {/* ${selectedReceiveType == 2 && " opacity-50"} */}
        <div
          className={`absolute top-0 left-0 w-full 
        
        `}
        >
          <MapComponent
            // disabled={selectedReceiveType == 2}
            apiKey={apiKey}
            location={deliveryLocation}
            setLocation={setDeliveryLocation}
            className="z-0 w-full h-screen "
          />
        </div>
        {/* )} */}
        {/* )} */}
        {/* *************************** end map *************************** */}
      </div>
    </>
  );
};

customersList.getLayout = function PageLayout(page) {
  return (
    <Layout>
      <LayoutWithSidebar>{page}</LayoutWithSidebar>
    </Layout>
  );
};

export default customersList;
export const getServerSideProps = async (context) => {
  const session = await getSession({ req: context.req });
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
      const apiUrl = config.apiGateway.API_URL_TELGANI;
      const { data: profile } = await axios.get(`${apiUrl}/v2/user/profile`, {
        headers: { Authorization: `Bearer ${session?.user?.token}` },
      });
      const corporateUUID = profile.data?.details?.corporate?.uuid || "";
      return {
        props: {
          corporateUUID: corporateUUID,
          error: null,
          statusCode: null,
          session,
          ...(await serverSideTranslations(context.locale, ["common"])),
        },
      };
    } catch ({ response }) {
      return {
        props: {
          corporateUUID: null,
          error: response?.data.message,
          statusCode: response ? response?.status : "",
          session,
          ...(await serverSideTranslations(context.locale, ["common"])),
        },
      };
    }
  }
};
