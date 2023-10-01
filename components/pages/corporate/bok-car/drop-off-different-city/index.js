import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { Button, Checkbox, LocationSearch, Modal } from 'components/UI';
import { useCheckbox } from 'hooks';
import dynamic from 'next/dynamic';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { usePlacesWidget } from 'react-google-autocomplete';
const MapComponent = dynamic(() => import('components/Map/mapGoogle'), {
  ssr: false,
})
const DriverTheCarToYourLocation = ({ setLocation, location, apiKey }) => {
  const { t } = useTranslation('common');
  const showModal = useCheckbox(false, 'agreement', 'checked', true);

  const { ref } = usePlacesWidget({
    apiKey: apiKey,
    onPlaceSelected: (place) => {
      if (place?.geometry?.location) {
        setLocation({
          ...location,
          address: place.formatted_address,
          "lat": place.geometry.location.lat(),
          "lng": place.geometry.location.lng()
        })
      }
    }
  });

  return (
    <>
      <div
        className="mt-2">
        <Checkbox
          label={t('drop_off_different_city_key')}
          {...showModal
            .bind}
        />
      </div>

      {location.address && <div className="flex items-center justify-center pt-2 ">

        <div className="relative border shadow-lg rounded-lg p-2 w-full">
          <button
            onClick={() => setLocation({})}
            className={`z-50 duration-200 hover:rotate-180 transition-all hover:text-white hover:bg-hoverPrimary absolute flex items-center justify-center w-10 h-10 rounded-full -top-3 -right-3 rtl:right-auto rtl:-left-3 text-primary bg-secondary`}
          >
            <XMarkIcon width={25} />
          </button>
          <div onDoubleClick={() => showModal.changeValue(true)} className="flex justify-between items-center h-12">
            <span>{location?.address}</span>
          </div>
        </div>
      </div>}
      {showModal.checked ? (
        <Modal
          footer={false}
          title={t("location_key")}
          show={showModal.checked}
          onClose={() => showModal.changeValue(false)}

        >
          <div className=''>
            <LocationSearch
              labelKey={t("delivery_address_key")}
              ref={ref} />

            <MapComponent
              apiKey={apiKey}
              location={location}
              setLocation={setLocation}
              className="w-[55vh] md:w-[70vh] h-[60vh] md:h-[400px]"
            />
            <Button disabled={!location?.lat} onClick={() => showModal.changeValue(false)} className='btn--primary mx-auto w-40 block mt-8'>{t("submit_key")}</Button>
          </div>
        </Modal>
      ) : null}
    </>
  );
};

DriverTheCarToYourLocation.propTypes = {
  apiKey: PropTypes.string.isRequired,
  setLocation: PropTypes.func.isRequired,
  location: PropTypes.object.isRequired,
};

export default DriverTheCarToYourLocation;
