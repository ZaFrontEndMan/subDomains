import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { Modal } from 'components/UI';
import SelectComponent from '../SelectComponent';
import SearchInput from 'components/global/SearchInput';
import { useRouter } from 'next/router';
import { useSavedState } from 'hooks';
import axiosInstance from 'auth/axiosInstance';
import config from 'config/config';
import { AirPlan } from 'components/icons';

const Index = ({
  selectedService,
  setSelectedService,

  airPort,
  setAirPort
}) => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const language = router.locale.toLowerCase();


  const [showModal, setShowModal] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [defaultOptions, setDefaultOptions, clearDefaultOptions] = useSavedState([], "telgani-b2b-air-ports-cache");

  const handleSearch = (e) => {
    setSearchText(e.target.value);
  };

  useEffect(() => {
    const fetchData = async () => {
      await axiosInstance.get(`${config.apiGateway.API_URL_TELGANI}/v1/airport/terminal/collection`)
        .then(({ data }) => {
          const airPorts = (data?.data || [])?.map((c) => {
            return {
              ...c,
              value: c?.airport?.uuid,
              labelEn: c.airport?.details?.name?.en,
              labelAr: new String(c.airport?.details?.name?.ar).toString(),
              detailsEn: c.terminal?.details?.name?.en,
              detailsAr: new String(c.terminal?.details?.name?.ar).toString(),
            };
          });
          setDefaultOptions(airPorts)
        });
    };

    !defaultOptions.length && fetchData();
  }, [])

  const filteredData = useMemo(() => {
    if (!searchText) {
      return defaultOptions;
    }
    return defaultOptions?.filter((item) =>
    (item.labelEn?.toLowerCase().includes(searchText.toLowerCase()) ||
      item.labelAr?.toLowerCase().includes(searchText.toLowerCase()))
    );
  }, [searchText, defaultOptions]);


  return (
    <>
      <SelectComponent
        title="select_services_key"
        options={[
          { label: "daily_rent_key", imageType: "vehicle" },
          { label: "subscription_key", imageType: "vehicle" },
          { label: "airport_key", imageType: "airplane" },
        ]}

        selected={selectedService}
        setSelected={(option) => {
          setSelectedService(option);
          if (option == 3) {
            setShowModal(true);
          } else {
            setAirPort("")
          }
        }}
      />

      {showModal && (
        <Modal
          title={t('select_air_port_key')}
          show={showModal}
          footer={false}
          onClose={() => setShowModal(false)}

        >
          <SearchInput
            searchText={searchText}
            handleSearch={handleSearch}
            id="search-bar"
            name="search-bar"
            maxLength={50}
            autoFocus={true}
          />
          <div className=' h-[500px] overflow-auto'>

            <ul className='px-5'>
              {filteredData.map(air => {
                const isSelected = airPort?.value === air.value;
                return <li
                  onClick={() => {
                    setAirPort(air);
                    setTimeout(() => {
                      setShowModal(false);
                    }, 500);
                  }}
                  key={air.value}
                  className={` ${isSelected ? "opacity-100" : "opacity-60"} relative flex justify-start items-center gap-2 mb-2 dark:bg-gray-700 bg-gray-100 px-4 py-2 cursor-pointer rounded-md`}>
                  {isSelected && (
                    <div
                      className='absolute top-2/4  -translate-y-2/4 -left-1 w-0 h-0 border-solid border-4 border-transparent border-l-primary border-t-primary transform -rotate-45'
                    />
                  )}
                  <div className=' w-10 h-10 rounded-full bg-secondary  flex justify-center items-center'>
                    <AirPlan className='text-primary' width={25} height={25} />
                  </div>
                  <div>
                    <p className='flex flex-col gap-1'>
                      <span className=' font-bold'>{language == "en" ? air.labelEn : air.labelAr}</span>
                      <span className=' dark:text-gray-300 text-gray-600'>{language == "en" ? air.detailsEn : air.detailsAr}</span>
                    </p>
                  </div>
                </li>
              })}
            </ul>

          </div>
        </Modal>
      )}
    </>
  );
};

Index.propTypes = {
  selectedService: PropTypes.number,
  setSelectedService: PropTypes.func,
};

export default Index;
