import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { Button, Modal } from 'components/UI';
import moment from 'moment';
import { PencilSquareIcon } from '@heroicons/react/24/outline';
import DatePicker from 'react-datepicker';

const SelectPickUpDateSection = ({
  pickUpDate,
  setPickUpDate,
  dropUpDate,
  setDropUpDate,
  time,
  setTime
}) => {
  const { t } = useTranslation('common');
  const [showModal, setShowModal] = useState(false);


  const [localPickUpDate, setLocalPickUpDate] = useState(new Date(pickUpDate) || "");
  const [localDropUpDate, setLocalDropUpDate] = useState(new Date(dropUpDate) || "");

  const submit = () => {
    setPickUpDate(localPickUpDate);
    setDropUpDate(localDropUpDate);

    setShowModal(false);
  }

  // Generate hourly time buttons

  const generateTimeButtons = () => {
    const timeButtons = [];

    for (let hour = 0; hour < 24; hour++) {
      const theTime = moment({ hour }).format('HH:mm');
      const isSelectedTime = theTime === time;
      const isDisabled =
        localPickUpDate &&
        moment(localPickUpDate).isSame(moment(), 'day') &&
        moment().format('HH') >= theTime.slice(0, 2);

      const buttonClasses = `px-6 py-1 text-sm rounded-3xl  ${isSelectedTime ? 'bg-primary text-white' : ''}`;
      timeButtons.push(
        <Button
          disabled={isDisabled}
          key={theTime}
          className={buttonClasses}
          onClick={() => setTime(theTime)}
        >
          {theTime}
        </Button>
      );
    }

    return timeButtons;
  };


  return (
    <>
      <div className="border shadow-lg rounded-lg flex justify-between items-center h-16 p-5">
        <div className="flex-grow px-4">
          <p className="text-sm text-gray-400">{t('pick_up_date_and_time_key')}</p>
          <p>
            {pickUpDate && moment(pickUpDate).format('ll')} -{' '}
            {dropUpDate && moment(dropUpDate).format('ll')}
          </p>
        </div>
        <PencilSquareIcon onClick={() => setShowModal(true)} className="text-primary cursor-pointer" width={25} />
      </div>
      {showModal && (
        <Modal
          title={t('pick_up_date_and_time_key')}
          show={showModal}
          footer={false}
          onClose={() => setShowModal(false)}

        >
          <>

            <div className="flex justify-between items-center gap-10 ">
              <div className="basis-5/12">
                <span className="block mb-2 text-sm font-medium text-gray-700 dark:text-white">{t('pick_up_date_key')}</span>
                <DatePicker
                  minDate={new Date()}
                  className="px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-gray-300 text-black"
                  selected={localPickUpDate}
                  onChange={(date) => {
                    setLocalPickUpDate(date);
                    if (localDropUpDate && moment(localDropUpDate).isBefore(date)) {
                      setLocalDropUpDate(null);
                    }
                  }}
                  isClearable
                  placeholderText=""
                  inline
                  dis
                />
              </div>
              <div className="basis-5/12">
                <span className="block mb-2 text-sm font-medium text-gray-700 dark:text-white">{t('drop_off_date_key')}</span>
                <DatePicker
                  minDate={moment(localPickUpDate).add(1, "day").toDate()}
                  className="px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-gray-300 text-black"
                  selected={localDropUpDate}
                  onChange={(date) => setLocalDropUpDate(date)}
                  isClearable
                  placeholderText=""
                  inline
                />

              </div>

            </div>
            <div className="mt-10">
              <span className="text-center block mb-2 text-xl font-medium text-gray-700 dark:text-white">
                {t('time_key')}
              </span>
              <div className="flex w-[600px]  mx-auto overflow-x-scroll px-4 gap-2 shadow-lg py-4">{generateTimeButtons()}</div>
            </div>

            <Button disabled={!localPickUpDate || !localDropUpDate || !time} className='mt-10 mb-4 mx-auto w-full rounded-3xl btn--primary' onClick={submit}>{t("confirm_key")}</Button>
          </>
        </Modal>
      )}
    </>
  );
};

SelectPickUpDateSection.propTypes = {
  pickUpDate: PropTypes.string,
  setPickUpDate: PropTypes.func,
  dropUpDate: PropTypes.string,
  setDropUpDate: PropTypes.func,
  time: PropTypes.string,
  setTime: PropTypes.func,
};

export default SelectPickUpDateSection;
