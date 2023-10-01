import React, { useState } from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { getSession } from "next-auth/react";
import PropTypes from "prop-types";

// Custom
import { Layout, LayoutWithSidebar } from "components/layout";
import { Select } from "components/UI";
import { Header } from "components/global";
import { useTranslation } from "react-i18next";
import { useHandleMessage } from "hooks";
import axios from "auth/axiosInstance";
import config from "config/config";
import { configuration } from "helper/apis/company";
import { getFirstError } from "utils/utils";

const SelectRentalCompanies = ({ session, companies }) => {
  const { t } = useTranslation("common");
  const handleMessage = useHandleMessage();
  const [submitted, setSubmitted] = useState(false);
  const [selectedCompanies, setSelectedCompanies] = useState([...companies.filter(c => c.isSelected)]);

  const handleSelect = async (value) => {
    setSubmitted(true);
    try {
      const updatedCorporate = await configuration(value.map(c => c.uuid));
      handleMessage(t("your_data_saved_successfully_key"), "success");
      const selectedValues = value.map((v) => { return { ...v, isSelected: true } });
      setSelectedCompanies(selectedValues);

    } catch ({ data }) {
      if (data?.message == "CanceledError") {
        return;
      }
      handleMessage(getFirstError(data?.errors) || data?.message || data?.error);
    } finally {
      setSubmitted(false);
    }
  };


  return (
    <div className="min-h-full bg-white rounded-md dark:bg-gray-800">
      <Header
        title={t("corporates_key")}
        path="/corporate-list"
        links={[{ label: t("select_companies_key") }]}
        classes="bg-gray-100 dark:bg-gray-700 border-none"
      />

      <div className="w-full p-4 md:p-8 md:w-3/5">
        <Select
          isClearable={false}
          isDisabled={submitted}
          label={t("select_companies_key")}
          placeholder={t("select_companies_key")}
          isMulti
          autoHeight
          options={companies}
          value={selectedCompanies}
          onChange={(value) => handleSelect(value)}
        />
      </div>
    </div>
  );
};

SelectRentalCompanies.propTypes = {
  session: PropTypes.object.isRequired,
  companies: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    })
  ).isRequired,
};

SelectRentalCompanies.getLayout = function PageLayout(page) {
  return (
    <Layout>
      <LayoutWithSidebar>{page}</LayoutWithSidebar>
    </Layout>
  );
};

export default SelectRentalCompanies;

export const getServerSideProps = async (context) => {
  const session = await getSession({ req: context.req });

  const loginUrl = context.locale === "ar" ? "/login" : `/${context.locale}/login`;

  if (!session || session?.user?.role[0] !== "admin") {
    return {
      redirect: {
        destination: loginUrl,
        permanent: false,
      },
    };
  } else {
    try {
      const access_token = session.user?.meta?.access_token;
      const apiUrl = config.apiGateway.API_URL_TELGANI;

      const { data } = await axios.get(`${apiUrl}/v2/supplier/business/company/collection-active`, { headers: { Authorization: `Bearer ${access_token}` }, });
      const { data: { company_uuids } } = await axios.get(`${apiUrl}/dashboard/b2b/configuration`, { headers: { Authorization: `Bearer ${access_token}` }, });
      return {
        props: {
          companies:
            data?.data?.map((c) => {
              return {
                ...c,
                value: c.uuid,
                label: context.locale === "ar" ? c.name?.ar : c.name?.en,
                isSelected: company_uuids.includes(c.uuid),
              };
            }) || [],
          error: null,
          session,
          ...(await serverSideTranslations(context.locale, ["common"])),
        },
      };
    } catch (data) {
      return {
        props: {
          companies: [],
          error: data?.response?.data?.message,
          session,
          ...(await serverSideTranslations(context.locale, ["common"])),
        },
      };
    }
  }
};