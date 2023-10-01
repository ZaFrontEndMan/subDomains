import React, { useCallback, useEffect, useState } from "react";
import { getSession } from "next-auth/react";
import moment from "moment";
import DatePicker from 'react-datepicker';
import { useTranslation } from "react-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import PropTypes from "prop-types";

// Custom
import { Layout, LayoutWithSidebar } from "components/layout";
import { Date } from "components/icons";
import config from "config/config";
import { useHandleMessage, useSavedState } from "hooks";
import { getFirstError, percentageChange, sum } from "utils/utils";
import axiosInstance from "auth/axiosInstance";
import { MinimizedBox, Spinner } from "components/UI";

const Index = ({ corporateUUid }) => {
  const { t } = useTranslation("common");
  const [loading, setLoading] = useState(true);
  const [tableData, setTableData] = useSavedState([
    {
      title: 'total_customers_key',
      count: 0,
      desc: 'customers_key',
      percentage: 0,
      duration: moment().startOf("month").fromNow(),
    },
    {
      title: 'total_remaining_balance_key',
      count: 0,
      desc: 'sar_key',
      percentage: 0,
      duration: moment().startOf("month").fromNow(),
    },
    {
      title: 'total_number_of_booking_key',
      count: 0,
      desc: 'bookings_key',
      percentage: 0,
      duration: moment().startOf("month").fromNow(),
    },

  ], "telgani-b2b-over-view-2-cache");

  const [activeTime, setActiveTime] = useState(null);
  const handleMessage = useHandleMessage();

  // filters
  const [dateRange, setDateRange] = useState([moment().startOf("month").toDate(), moment().endOf("month").toDate()]);
  const [startDate, endDate] = dateRange;



  const setLast = useCallback(() => {
    setActiveTime(1);

    const from = moment().subtract(1, "months").startOf("month").toDate();
    const to = moment().subtract(1, "months").endOf("month").toDate();
    setDateRange([from, to]);
    fetchReport(from, to);
    setDateRange([from, to]);
  }, [],);
  const setCurrent = useCallback(() => {
    setActiveTime(2);
    const from = moment().startOf("month").toDate();
    const to = moment().endOf("month").toDate()
    setDateRange([from, to]);
    fetchReport(from, to);
  }, [],);

  const fetchReport = async (from, to) => {
    setLoading(true);
    try {
      const { data } = await axiosInstance.get(`${config.apiGateway.API_URL_TELGANI}/dashboard/b2b/corporate/${corporateUUid}/overview`, {
        params: {
          from: moment(from).format("YYYY-MM-DD"),
          until: moment(to || moment().toDate()).format("YYYY-MM-DD"),
        },
      });
      // data?.customer_count?.current_period
      const totals = [
        data?.customer_count,
        data?.booking_sum,
        data?.booking_count,
      ];

      setTableData(prev => {
        const updatedData = prev.map((p, i) => {
          return {
            ...p,
            // eslint-disable-next-line react/prop-types
            percentage: percentageChange(totals[i]["previous_period"], totals[i]["current_period"]),
            // eslint-disable-next-line react/prop-types
            count: totals[i]["current_period"]
          }
        })
        return updatedData
      });
      setLoading(false);
    } catch ({ data }) {
      if (data?.message == "CanceledError") {
        return;
      }
      handleMessage(getFirstError(data?.errors) || data?.message || data?.error);
      setLoading(false);
    }
  };
  useEffect(() => {
    setCurrent();
  }, []);
  return (
    <div className="">
      <MinimizedBox>
        <div className="flex flex-wrap items-end justify-start">
          <div className="flex flex-col mr-2 basis-full md:basis-7/12 rtl:mr-0 rtl:ml-2" >
            <label className="">{t("date_key")}</label>
            <DatePicker
              disabled={loading}
              placeholderText={"00/00/000 - 00/00/000"}
              wrapperClassName='date_picker_icon'
              className="w-full px-6 py-2 bg-gray-100 border rounded outline-none dark:text-white dark:bg-gray-800 hover:border-primary focus:border-primary focus:outline-none"
              selectsRange={true}
              startDate={startDate}
              endDate={endDate}
              onChange={(update) => {
                setDateRange(update || null);
                if ((update[0] && update[1]) || (!update[0] && !update[1])) {
                  fetchReport(update[0], update[1])
                }
              }}
              dateFormat="dd/MM/yyyy"
            />
          </div>
          <button disabled={activeTime == 1 || loading} onClick={setLast} className={`${activeTime == 1 ? "border-gray-400 bg-gray-300" : "border-gray-300 bg-gray-100"} flex justify-center h-[42px] border  items-center rounded-s text-black  basis-1/2 mt-2 md:mt-0  md:basis-1/6`} >
            <Date className="mx-2" />
            <span>{t("last_month_key")}</span>
          </button>
          <button disabled={activeTime == 2 || loading} onClick={setCurrent} className={`${activeTime == 2 ? "border-gray-400 bg-gray-300" : "border-gray-300 bg-gray-100"} flex justify-center h-[42px] border  items-center rounded-e text-black  basis-1/2 mt-2 md:mt-0  md:basis-1/6`} >
            <Date className="mx-2" />
            <span>{t("current_month_key")}</span>
          </button>
        </div>

      </MinimizedBox>

      <div className="grid grid-rows-2 gap-4 mb-8 sm:grid-cols-2 md:grid-cols-3">
        {
          tableData.map((card, idx) => <React.Fragment key={`${card.count}-${idx}`}>
            <div className='p-4 bg-white rounded-lg shadow-sm dark:bg-slate-800'>
              <div className="font-bold text-slate-600 dark:text-slate-200">{t(card?.title)}</div>
              <div className="mt-3 text-3xl font-semibold text-primary">
                <span className={`${loading && " opacity-50"}`}>{card?.count}</span>
                {/* {loading ? <Spinner className="w-5 h-5 text-primary" /> : <span>{card?.count}</span>} */}
                <span className="px-2 text-sm text-slate-400 dark:text-slate-200">{t(card?.desc)}</span>
              </div>
              <div className="flex mt-3">
                <span className={`p-1 text-sm ${card.percentage < 0 ? "text-red-600 font-bold bg-red-100" : "text-green-600 font-bold bg-green-100"} rounded-md`}>

                  <span className={`${loading && " opacity-50"}`} dir="ltr">{`${card?.percentage}%`}</span>
                  {/* {loading ? <Spinner className={`w-10 h-5 ${card.percentage < 0 ? "text-red-600" : "text-green-600"}`} /> : <span dir="ltr">{`${card?.percentage}%`}</span>} */}

                </span>

                <span className="mx-2 font-thin text-gray-300">{moment(startDate || moment().startOf("month").toDate()).startOf("month").fromNow()}</span>
              </div>
            </div>
          </React.Fragment>)
        }
      </div>
    </div>
  );
};


Index.getLayout = function PageLayout(page) {
  return (
    <Layout>
      <LayoutWithSidebar>{page}</LayoutWithSidebar>
    </Layout>
  );
};
Index.propTypes = {
  corporateUUid: PropTypes.string.isRequired,
};

export default Index;

export const getServerSideProps = async (context) => {
  const session = await getSession({ req: context.req });
  const loginUrl = context.locale === "ar" ? "/login" : `/${context.locale}/login`;
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
        corporateUUid: session?.user?.corporate?.uuid,
        ...(await serverSideTranslations(context.locale, ["common"])),
      },
    };
  }
}