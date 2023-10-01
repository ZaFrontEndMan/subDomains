import React, { useState } from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { getSession } from "next-auth/react";
import PropTypes from "prop-types"
import dynamic from "next/dynamic";

// Custom
import { Layout, LayoutWithSidebar } from "components/layout";

// const MapComponent = dynamic(() => import('components/Map/map'), {
//   ssr: false,
// })

const Map = () => {
  const [location, setLocation] = useState({});
  const [address, setAddress] = useState("");
  return (
    <div className="container">
      {/* <MapComponent location={location} setLocation={setLocation} setAddress={setAddress} /> */}
    </div>
  );
};

Map.propTypes = {
  session: PropTypes.object.isRequired
};
Map.getLayout = function PageLayout(page) {
  return (
    <Layout>
      <LayoutWithSidebar>{page}</LayoutWithSidebar>
    </Layout>
  );
};

export default Map;
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
    return {
      props: {
        session,
        ...(await serverSideTranslations(context.locale, [
          "common",
          "dashboard",
        ])),
      },
    };
  }
}