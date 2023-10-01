import React, { useState } from "react";
import { useRouter } from "next/router";
import {
  ChevronRightIcon,
  UsersIcon,

  ArrowRightCircleIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { useMemo } from "react";
import { useSession } from "next-auth/react";
import { Car, Overview, Settlement, Bookings, Corporates, Companies } from "components/icons";
import moment from "moment";
// import { ClearStorageButton } from "components/global";


const Sidebar = React.memo(() => {
  const { data: session } = useSession()
  const isAdmin = (session?.user?.role && session?.user?.role[0]) == "admin"
  const router = useRouter();
  const [activeAdminSubMenu, setActiveAdminSubMenu] = useState(null);

  const AdminNav = useMemo(() => [
    {
      nameAR: "لوحة القيادة",
      nameEN: "Dashboard",
      href: "/",
      current: router.pathname == "/",
      icon: <Overview className="w-5 h-5" />,
      submenuOpen: false,
    },
    {
      nameAR: "المؤسسات",
      nameEN: "Corporate",
      icon: <Corporates className="w-5 h-5" />,

      submenu: [
        {
          nameAR: "قائمة المؤسسات",
          nameEN: "Corporate List",
          href: "/corporate-list",
          // icon: <TruckIcon className="w-5 h-5" />,
          current: router.pathname === "/corporate-list",
        },
        {
          nameEN: 'Corporate Bookings',
          nameAR: 'حجوزات المؤسسات',
          href: '/corporate-bookings',
          // // icon: <TruckIcon className="w-5 h-5" />,
          current: router.pathname === "/corporate-bookings",
        },
        {
          nameEN: 'Registration Requests',
          nameAR: 'طلبات التسجيل',
          href: '/registration-requests',
          // // icon: <TruckIcon className="w-5 h-5" />,
          current: router.pathname === "/registration-requests",
        },
        {
          nameEN: 'Settlements',
          nameAR: 'التسويات',
          href: '/settlements',
          // // icon: <TruckIcon className="w-5 h-5" />,
          current: router.pathname === "/settlements",// // icon: <TruckIcon className="w-5 h-5" />,
        },
        {
          nameEN: 'Select Rental Companies',
          nameAR: 'أختيار شركات التأجير',
          href: '/select-rental-companies',
          // // icon: <TruckIcon className="w-5 h-5" />,
          current: router.pathname === "/select-rental-companies",
        },
      ],
      submenuOpen: activeAdminSubMenu == 1,
    },
    {
      nameAR: "الشركات",
      nameEN: "Companies",
      icon: <Companies className="w-5 h-5" />,
      submenu: [
        {
          nameAR: "قائمة الشركات",
          nameEN: "Companies list",
          href: "/companies-list",
          // icon: <TruckIcon className="w-5 h-5" />,
          current: router.pathname === "/companies-list",
        },

      ],
      submenuOpen: activeAdminSubMenu == 2,
    },
    {
      nameAR: "شركات الصيانة",
      nameEN: "Maintenance Corporates",
      href: "/maintenance-corporates",
      current: router.pathname == "/maintenance-corporates",
      icon: <UserGroupIcon className="w-5 h-5" />,
      submenuOpen: false,
    }
  ], [router.pathname, activeAdminSubMenu]);


  const CorporateNav = useMemo(() => [
    {
      nameAR: "حجز سيارة",
      nameEN: "Book a Car",
      href: "/corporate/book-car",
      current: router.pathname == "/corporate/book-car",
      icon: <Car className="w-5 h-5" />,
      submenuOpen: false,
    },
    {
      nameAR: "ملخص",
      nameEN: "overView",
      href: "/corporate",
      current: router.pathname == "/corporate",
      icon: <Overview className="w-5 h-5" />,
      submenuOpen: false,
    },
    {
      nameAR: "الحجوزات",
      nameEN: "Bookings",
      href: "/corporate/bookings",
      current: router.pathname == "/corporate/bookings",
      icon: <Bookings className="w-5 h-5" />,
      submenuOpen: false,
    },
    {
      nameAR: "عملاء",
      nameEN: "Customers",
      href: "/corporate/customers-list",
      current: router.pathname == "/corporate/customers-list",
      icon: <UsersIcon className="w-5 h-5" />,
      submenuOpen: false,
    },
    {
      nameAR: "تسوية",
      nameEN: "Settlement",
      href: "/corporate/settlement",
      current: router.pathname == "/corporate/settlement",
      icon: <Settlement className="w-5 h-5" />,
      submenuOpen: false,
    },
  ], [router.pathname]);



  return (
    // w-14 hover:w-64
    <div className="hover:w-64 w-14 md:w-64 flex flex-col flex-shrink-0 min-h-full transition-all duration-300 bg-white border-none sidebar  text-text  dark:bg-gray-900 ">
      <div className="flex flex-col flex-grow overflow-x-hidden overflow-y-auto">
        <ul className="flex flex-col py-4 space-y-1">
          {isAdmin ? (
            <>
              {AdminNav.map((tab, index) => (
                <React.Fragment key={tab.href}>
                  {tab.submenu ? (
                    <React.Fragment key={tab.href}>
                      <div className="relative flex flex-row items-center h-11">
                        <button
                          onClick={() =>
                            setActiveAdminSubMenu(() =>
                              tab.submenuOpen ? null : index
                            )
                          }
                          className={`w-full focus:outline-none relative flex h-11 flex-row items-center border-l-4 pr-6 rtl:pr-4 rtl:border-l-0 rtl:border-r-4 dark:text-white dark:hover:text-white hover:border-primary ${tab.submenuOpen ? 'border-primary' : 'border-transparent'
                            }`}
                        >
                          <span className="inline-flex items-center justify-center ml-4">
                            {tab.icon}
                          </span>
                          <span className="ml-2 text-sm tracking-wide truncate">
                            {router.locale === 'en' ? tab.nameEN : tab.nameAR}
                          </span>
                          <span className="absolute inset-y-0 items-center flex pl-2 duration-300 opacity-0 md:opacity-100 arrow-icon right-2 rtl:pr-2 rtl:right-auto rtl:left-2">
                            <ChevronRightIcon
                              className={`duration-200 w-5 h-5 ${tab.submenuOpen ? 'rtl:rotate-90' : 'rotate-90 rtl:-rotate-180'}`}
                            />
                          </span>
                        </button>
                      </div>
                      {tab.submenuOpen && (
                        <ul className="flex flex-col px-2 py-4 space-y-1">
                          {tab.submenu.map((subTab) => (
                            <li key={subTab.href}>
                              <Link href={subTab.href}>
                                <a
                                  className={`${subTab.current
                                    ? 'dark:text-gray-100 border-primary'
                                    : 'dark:text-white border-transparent hover:border-primary dark:hover:border-primary'
                                    } text-white-600 relative flex h-11 flex-row items-center border-l-4 focus:outline-none rtl:border-l-0 rtl:border-r-4 rtl:pr-2`}
                                >
                                  <span className="inline-flex items-center justify-center ml-4 duration-500 sub-menu-icon">
                                    {/* <ArrowRightCircleIcon className="w-5 h-5 rtl:rotate-180 opacity-0" /> */}
                                    <ArrowRightCircleIcon className="w-5 h-5 rtl:rotate-180 md:hidden" />
                                  </span>
                                  <span className="ml-2 text-sm tracking-wide truncate">
                                    {router.locale === 'en' ? subTab.nameEN : subTab.nameAR}
                                  </span>
                                </a>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </React.Fragment>
                  ) : (
                    <li key={tab.href} onClick={() => activeAdminSubMenu && setActiveAdminSubMenu(null)}>
                      <Link href={tab.href}>
                        <a
                          className={`${tab.current
                            ? 'dark:text-gray-100 border-primary'
                            : 'dark:text-white border-transparent hover:border-primary dark:hover:border-primary'
                            } text-white-600 relative flex h-11 flex-row items-center border-l-4 pr-6 focus:outline-none rtl:border-l-0 rtl:border-r-4 rtl:pr-4`}
                        >
                          <span className="inline-flex items-center justify-center ml-4">
                            {tab.icon}
                          </span>
                          <span className="ml-2 text-sm tracking-wide truncate">
                            {router.locale === 'en' ? tab.nameEN : tab.nameAR}
                          </span>
                        </a>
                      </Link>
                    </li>
                  )}
                </React.Fragment>
              ))}
            </>
          ) : (
            <>
              {CorporateNav.map((tab) => (
                <li key={tab.href}>
                  <Link href={tab.href}>
                    <a
                      className={`${tab.current
                        ? 'dark:text-gray-100 border-primary'
                        : 'dark:text-white border-transparent hover:border-primary dark:hover:border-primary'
                        } text-white-600 relative flex h-11 flex-row items-center border-l-4 pr-6 focus:outline-none rtl:border-l-0 rtl:border-r-4 rtl:pr-4`}
                    >
                      <span className="inline-flex items-center justify-center ml-4">
                        {tab.icon}
                      </span>
                      <span className="ml-2 text-sm tracking-wide truncate">
                        {router.locale === 'en' ? tab.nameEN : tab.nameAR}
                      </span>
                    </a>
                  </Link>
                </li>
              ))}
            </>
          )}
        </ul>

        <p className="px-5 py-3 mt-auto text-xs tracking-wide text-center truncate mb-14 dark:text-white">
          © Copyright: <a target="_blank" rel="noreferrer" className="text-primary" href="https://www.telgani.com">Telgani</a> {moment().format("YYYY")}
        </p> 
        {/* <ClearStorageButton /> */}
      </div>
    </div>
  );
});
Sidebar.displayName = 'Sidebar';

export default Sidebar;