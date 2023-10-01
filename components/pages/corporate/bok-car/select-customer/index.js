import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { Button, Modal } from 'components/UI';
import CustomerOptions from './CustomerOptions';
import { useCheckbox, useHandleMessage } from 'hooks';
import { AddModal } from '../../customers-list';
import { CustomerSearch } from 'components/global';
import { useRouter } from 'next/router';
import axiosInstance from 'auth/axiosInstance';
import config from 'config/config';
import { getFirstError } from 'utils/utils';

const SelectCustomerSection = ({ customerId, corporateUUID }) => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const customerUUID = router?.query?.cus || "";
  const handleMessage = useHandleMessage();
  useEffect(() => {
    if (customerUUID) {
      const fetch = async () => {
        try {
          const { data } =
            await axiosInstance.get(`${config.apiGateway.API_URL_TELGANI}/dashboard/b2b/corporate/${corporateUUID}/customer/${customerUUID}`) 
          customerId.changeValue({
            ...data,
            label: data.name,
            uuid: customerUUID,
            value: customerUUID,
          })
          

        } catch ({ data }) {
          handleMessage(getFirstError(data?.errors) || data?.message || data?.error);
        }
      }
      fetch();
    }
  }, [customerUUID]);

  const showModal = useCheckbox(false, 'agreement', 'checked', true);

  return (
    <>
      <div className="flex justify-between items-center">
        <div className="basis-8/12 mb-3 ">
          {!showModal.checked && (
            <CustomerSearch
              mandatory
              corporateUUID={corporateUUID}
              customerId={customerId}
              components={{ Option: CustomerOptions }}
            />
          )}
        </div>
        <div className="flex items-center justify-center pt-2 basis-3/12">

          <Button
            label={t('add_customer_key')}
            value={showModal.checked}
            onClick={() => {
              customerId.reset();
              showModal.changeValue(true)
            }}>
            {t('add_customer_key')}

          </Button>
        </div>
      </div>
      {showModal.checked && (
        <Modal
          footer={false}
          title={t("add_customer_key")}
          show={showModal.checked}
          onClose={() => showModal.changeValue(false)}

        >
          <AddModal
            isFromBook={true}
            customerId={customerId}
            corporateUUID={corporateUUID}
            handleClose={() => showModal.changeValue(false)}

          />
        </Modal>
      )}
    </>
  );
};

SelectCustomerSection.propTypes = {
  customerId: PropTypes.object.isRequired,
  corporateUUID: PropTypes.string.isRequired,
};

export default SelectCustomerSection;
