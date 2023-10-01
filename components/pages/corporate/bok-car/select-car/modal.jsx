import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import InfiniteScroll from 'react-infinite-scroll-component';

// Custom
import { useHandleMessage, useSavedState } from "hooks"
import { Spinner } from "components/UI";
import { useTranslation } from "react-i18next";
import { getFirstError } from "utils/utils";
import CarCard from "./CarCard";
import { getAllCars, getFilters } from "helper/apis/booking";
import { Header } from "./header";
import FiltersComponent from "./FiltersComponent";
import moment from "moment";


export default function SelectCarModal({ handleClose, selectedCar, setSelectedCar, summary }) {
  const { t } = useTranslation("common");
  const handleMessage = useHandleMessage();

  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [vehicles, setVehicles] = useState([]);
  const [filters, setFilters] = useSavedState({}, "telgani-b2b-cancel-car-filters-cache", { expirationDays: 10 });
  const [showFilter, setShowFilter] = useState(true);
  const [gridFilter, setGridFilter] = useState({});
  const fetchCars = async (filter = {}) => {
    const _filter = { ...gridFilter, ...filter }
    try {
      const cars = await getAllCars({
        order_by: _filter?.order_by || "price_asc",
        group_by: "vehicle",
        

        limit: _filter?.limit || 5,
        "offset": vehicles.length,

        "airport": summary.selectedService == 3 ? 1 : 0,
        "is_airport": summary.selectedService == 3 ? 1 : 0,
        "delivery": summary.selectedReceiveType == 1 ? 1 : 0,

        "unlimited_km": summary.isUnlimitedKm ? 1 : 0,
        "child_seat": summary?.isBabySeat ? 1 : 0,
        "insurance": summary?.isExtraInsurance ? 1 : 0,

        "address": summary?.deliveryLocation?.address,
        "latitude": summary?.deliveryLocation?.lat,
        "longitude": summary?.deliveryLocation?.lng,


        "pickup_date": moment(summary?.pickUpDate).format("YYYY-MM-DD"),
        "drop_date": moment(summary?.dropUpDate).format("YYYY-MM-DD"),
        ..._filter
      })
      if (!cars.length) {
        setHasMore(false);
        setLoading(false);
        return;
      }
      setVehicles(prev => [...prev, ...cars]);
      setLoading(false);
    } catch ({ data = {} }) {
      if (data?.message == "CanceledError") {
        return;
      }
      handleMessage(getFirstError(data?.errors) || data?.message || data?.error);
      setLoading(false);
    }
  };
  const fetchFromFilter = (filter) => {
    setGridFilter({ ...gridFilter, ...filter });
    fetchCars(filter)
  }


  const fetchFilters = async () => {
    try {
      const { data } = await getFilters();
      setFilters(data);
    } catch ({ data }) {
      handleMessage(getFirstError(data?.errors) || data?.message || data?.error);
    }
  };
  useEffect(() => {
    fetchCars();
    !filters.length && fetchFilters();
  }, []);



  const handleChoose = (car) => {
    setSelectedCar(car);
    handleClose();
  }
  return (
    <div className="lg:min-w-[1200px] max-h-[600px] p-2  ">
      <Header showFilter={showFilter} setShowFilter={setShowFilter} fetchFromFilter={fetchFromFilter} />

      <div className="flex justify-around mt-4">
        <div className={`${showFilter ? "basis-full md:basis-3/12" : "hidden"} overflow-auto max-h-[500px]`}>
          <FiltersComponent
            title={t("location_key")}
            loading={loading}
            filterKey={"city"}
            searchable
            data={filters?.cities || {}}
            gridFilter={gridFilter}
            fetchFromFilter={fetchFromFilter}
          />

          <FiltersComponent
            title={t("car_brand_key")}
            loading={loading}
            filterKey={"manufacturer"}
            searchable
            data={filters?.makers || {}}
            gridFilter={gridFilter}
            fetchFromFilter={fetchFromFilter}
          />
          <FiltersComponent
            title={t("type_key")}
            loading={loading}
            filterKey={"types"}
            searchable
            data={filters?.types || {}}
            gridFilter={gridFilter}
            fetchFromFilter={fetchFromFilter}
          />


        </div>
        <div className={`${showFilter ? "text-center basis-0 md:basis-8/12" : "basis-12/12"} overflow-auto max-h-[500px]`}>
          {loading ? <Spinner className="w-10 my-44 " /> : (

            <div id="scrollableDiv" style={{ height: "500px", overflow: "auto" }}>
              <InfiniteScroll
                dataLength={vehicles.length}
                next={fetchCars}
                hasMore={hasMore}
                loader={<Spinner className="w-10 my-4 " />}
                endMessage={vehicles.length ? <p className="text-center mt-10">
                  <b>{t("yay!_you_have_seen_it_all_key")}</b>
                </p> : ""}
                scrollableTarget="scrollableDiv"
              >
                {
                  vehicles?.length ? (
                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
                      {vehicles.map(car => {
                        return (
                          <CarCard key={car.uuid} car={car} setSelectedCar={(car) => handleChoose(car)} />
                        )
                      })}
                    </div>
                  ) : <p className="w-full py-20 ">{t("table_no_data_message_key")}</p>

                }
              </InfiniteScroll>


            </div>
          )}
        </div>
      </div>
    </div >
  )
}
SelectCarModal.propTypes = {
  handleClose: PropTypes.func.isRequired,
  selectedCar: PropTypes.object.isRequired,
  setSelectedCar: PropTypes.func.isRequired
};