import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { Button, Modal } from 'components/UI';
import { Car } from 'components/icons';
import SelectCarModal from './modal';
import { CarImage } from 'components/global';

const SelectCarSection = ({ selectedCar, setSelectedCar, summary }) => {
  const { t } = useTranslation('common');
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <h4 className="">{t('select_car_key')}</h4>
      {!selectedCar.uuid ? (
        <Button
          onClick={() => setShowModal(true)}
          className="text-primary flex w-full justify-center mt-5 gap-2 btn--secondary"
        >
          <Car width={25} />
          <span>{t('select_car_key')}</span>
        </Button>
      ) : (
        <div className="relative border shadow-lg rounded-lg p-5">
          <button
            onClick={() => setSelectedCar({})}
            className={`z-50 duration-200 hover:rotate-180 transition-all hover:text-white hover:bg-hoverPrimary absolute flex items-center justify-center w-10 h-10 rounded-full -top-3 -right-3 rtl:right-auto rtl:-left-3 text-primary bg-secondary`}
          >
            <XMarkIcon width={25} />
          </button>
          <div className="flex justify-between items-center h-16">
            <span>{selectedCar.vehicle?.name}</span>

            <CarImage
              width={130}
              height={70}
              imageUrl={selectedCar.vehicle?.image_url}
              alt={selectedCar.vehicle?.name}
              className="rounded-lg"
            />
          </div>
        </div>
      )}
      {showModal && (
        <Modal
          title={t('select_car_key')}
          show={showModal}
          footer={false}
          onClose={() => setShowModal(false)}
        >
          <SelectCarModal
            selectedCar={selectedCar}
            setSelectedCar={setSelectedCar}
            summary={summary}
            handleClose={() => setShowModal(false)}
          />
        </Modal>
      )}
    </>
  );
};

SelectCarSection.propTypes = {
  selectedCar: PropTypes.object.isRequired,
  setSelectedCar: PropTypes.func.isRequired,
  summary: PropTypes.object.isRequired
};

export default SelectCarSection;
