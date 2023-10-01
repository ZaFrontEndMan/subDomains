import React from "react"
import Image from "next/image"
import PropTypes from "prop-types"
import { useTranslation } from "react-i18next"
import { CarMeter, Star, Km, Location, Shield, Time } from "components/icons"
import { Button } from "components/UI"
import { CarImage } from "components/global"

const CarCard = ({ car, setSelectedCar }) => {
  const { vehicle, price, office, options: carOptions } = car;
  const options = [
    {
      name: "free_km_key",
      value: carOptions.free_km,
      Icon: <span className=" text-primary font-bold text-md" width={22} > {car.options.free_km} </span>,
    },
    {
      name: "unlimited_km_key",
      value: carOptions.unlimited_km,
      Icon: <span className=" text-primary font-bold text-md" width={22} > {car.options.free_km} </span>,
    },
    {
      name: "drop_city_key",
      value: carOptions.drop_city,
      Icon: <Location width={22} />,
    },
    {
      name: "free_drop_city_key",
      value: carOptions.free_drop_city,
      Icon: <Location width={22} />,
    },
    {
      name: "insurance_key",
      value: carOptions.insurance,
      Icon: <Shield width={22} />,
    },
    {
      name: "free_insurance_key",
      value: carOptions.free_insurance,
      Icon: <Shield width={22} />,
    },
    {
      name: "delivery_key",
      value: carOptions.delivery,
      Icon: <CarMeter width={22} />,
    },
    {
      name: "free_delivery_key",
      value: carOptions.free_delivery,
      Icon: <CarMeter width={22} />,
    },
    {
      name: "delivery_time_minimum_key",
      value: carOptions.delivery_time_minimum,
      Icon: <span className=" text-primary font-bold text-md" width={22} > {car.options.delivery_time_minimum} </span>,
    },
    {
      name: "pickup_time_minimum_key",
      value: carOptions.pickup_time_minimum,
      Icon: <span className=" text-primary font-bold text-md" width={22} > {car.options.pickup_time_minimum} </span>,
    },
  ];

  const { t } = useTranslation("common");
  return (
    <div className="bg-white rounded-lg shadow-md dark:bg-gray-700 rounded-bl-3xl rounded-br-3xl shadow-gray-500 dark:shadow-gray-300">
      <div className="px-5 font-semibold text-xs mx-2 text-center leading-7 w-max  bg-[#763F98] text-white  mr-auto rounded-b-2xl">
        {t("special_offer_key")}
      </div>
      <div className="px-4 mb-2">
        <div className="flex items-center justify-between">
          <div className="flex flex-col items-start">
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-primary">{price.discounted}</span>
              {+price.full ? <span className="text-sm italic text-gray-400 line-through ">{price.full}</span> : ""}
            </div>
            <div className="text-sm text-gray-400 lowercase">
              {t("sar_key")} / {t("day_key")}
            </div>
          </div>

          <div className="flex flex-col w-20 gap-2 px-3 py-2 overflow-auto bg-white border rounded-lg shadow-lg dark:bg-gray-700 border-gray-50 h-92">
            <span className="text-sm border-b-2 border-yellow-300 ">{office?.company?.name}</span>
            <div className="flex items-center justify-center">
              <Star width={22} height={22} />
              <span>{office.average_rating}</span>
            </div>
          </div>
        </div>
        <h2 className="mt-2 text-lg font-semibold text-start">{vehicle.name}</h2>
        <p className="mb-2 text-gray-400 text-start">{vehicle.year}</p>



        <div className="relative " style={{ paddingBottom: "60%" }}>
          <CarImage
            layout="fill"
            imageUrl={vehicle.image_url}
            alt={vehicle.name}
            className="absolute top-0 left-0 object-contain w-full h-full rounded-lg"
          />


        </div>


        <ul className="flex flex-row items-center justify-start gap-2 overflow-x-auto pb-2 h-20">
          {options
            .filter((option) => option.value) // Filter only truthy values
            .map((option) => (
              <li key={option.name} className="flex flex-col items-center justify-center gap-2 p-2 basis-1/5 bg-secondary rounded-xl ">
                {option.Icon}
                <span className="text-xs truncate dark:text-black">{t(option.name)}</span>
              </li>
            ))}

        </ul>
      </div>
      <Button
        onClick={() => setSelectedCar(car)}
        className="w-full btn--primary rounded-bl-3xl rounded-br-3xl">
        {t("select_car_key")}
      </Button>
    </div >
  )
}

CarCard.propTypes = {
  car: PropTypes.shape({
    vehicle: PropTypes.shape({
      name: PropTypes.string.isRequired,
      image_url: PropTypes.string.isRequired,
      model: PropTypes.string.isRequired,
      year: PropTypes.number.isRequired,
    }).isRequired,
    price: PropTypes.shape({
      full: PropTypes.number,
      discounted: PropTypes.number,
    }).isRequired,
    office: PropTypes.shape({
      average_rating: PropTypes.number,
      company: PropTypes.shape({
        name: PropTypes.string,
      }),
    }).isRequired,
    options: PropTypes.object.isRequired,
  }).isRequired,
  setSelectedCar: PropTypes.func.isRequired
};
export default CarCard