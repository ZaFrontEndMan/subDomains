import React from "react";
import { useTranslation } from "next-i18next";
import { UserCircleIcon, KeyIcon } from "@heroicons/react/24/outline";

// Custom
import Tabs from "components/UI/Tabs";
import EditProfileForm from "components/profile-page/EditProfileForm";
import ChangePassword from "components/profile-page/ChangePassword";


const Settings = () => {
  const { t } = useTranslation("common");

  const tabsData = [
    {
      label: t("general_key"),
      icon: <UserCircleIcon className="w-5 h-5" />,
      content: <EditProfileForm />,
    },
    {
      label: t("change_password_key"),
      icon: <KeyIcon className="w-5 h-5" />,
      content: <ChangePassword />,
    },
  ];

  return (
    <div className="mb-4">
      <Tabs tabsData={tabsData} />
    </div>
  );
};

export default Settings;
