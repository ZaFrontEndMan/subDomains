import React from "react"
import Link from "next/link"
import { formatComma, getRandomCompanyName } from "utils/utils"
import { BanknotesIcon, CheckBadgeIcon, CheckCircleIcon, ClockIcon, PencilSquareIcon, PrinterIcon, UserPlusIcon, XCircleIcon, XMarkIcon } from "@heroicons/react/24/outline";
import moment from "moment";
import { CarNote, License, Star } from "components/icons";
import { Button } from "components/UI";
import Image from "next/image";

export const getSettlement = (status) => {
  switch (status) {
    case 1:
      return { class: `settlement settlement-settled`, text: `settled_key` };
    case 2:
      return { class: `settlement settlement-not-settled`, text: `not_settled_key` };
    default:
      return { class: `settlement settlement-partially-settled`, text: `partially_settled_key` };
  }
};



const corporateColumns = (t) => [
  {
    name: t("corporate_name_key"),
    selector: row => row?.name.toString().toLowerCase(""),
    // cell: (row) =>
    //   <span className="font-bold text-primary">
    //     {row?.name}
    //   </span>
    // ,
    cell: (row) => <Link href={`/corporate-bookings/booking-id?cor=${row?.uuid}`}>
      <span className="font-bold cursor-pointer text-primary">
        {row?.name}
      </span>
    </Link>,
    sortable: true,
    minWidth: "200px"
  },
  {
    name: t("total_customers_key"),
    selector: (row) => row?.customers_count,
    sortable: true,
    minWidth: "150px"

  },
  {
    name: t("number_of_bookings_key"),
    selector: (row) => row?.bookings_count,
    sortable: true,
    minWidth: "160px"
  },
  {
    name: t("maximum_limits_key"),
    selector: (row) => formatComma(row?.total_limit_amount_gross),
    sortable: true,
    minWidth: "150px"
  },
  {
    name: t("balance_key"),
    selector: (row) => formatComma(row?.currently_used_amount_gross),
    sortable: true,
  },
  {
    name: t("total_amount_key"),
    selector: (row) => formatComma(row?.total_settled_amount_gross),
    sortable: true,
    minWidth: "150px"
  },
  {
    name: t("actions_key"),
    selector: row => row?.uuid,
    noExport: true,

    cell: (row) => <Link href={`/corporate-list/update?cor=${row?.uuid}`}>
      <span className="font-bold cursor-pointer text-primary">
        <PencilSquareIcon width={25} />
      </span>
    </Link>,
    sortable: false,
    width: "180px"
  },
];

const bookingsColumns = (
  t,
  handleAccept,
  handleApprove,
  handleReject,
  actionLoading,
  setHistoryModal,
  setTransactionModal,
  openPrintModal,
  printModal,
  date_format
) => [
    {
      name: t("note_key"),
      selector: row => row?.uuid,
      noExport: true,
      cell: row =>
        <div
          title={row.corporate_name}
          className=" cursor-default flex items-center justify-center p-2 rounded-full w-25 h-25 bg-secondary text-primary hover:bg-hoverPrimary hover:text-white">
          B2B
        </div>

    },
    {
      name: t("booking_id_key"),
      selector: (row) => row?.individual_number,
      cell: (row) => <Link href={`/corporate-bookings/preview?uuid=${row?.uuid}`}>
        <span className="font-bold cursor-pointer text-primary">
          {row?.individual_number}
        </span>
      </Link>,
      sortable: true,


      width: "150px"
    },
    {
      name: t("customer_name_key"),
      selector: (row) => row?.customer_name,
      cell: (row) => <div className="flex flex-col">
        <span>{row?.customer_name}</span>
        <span dir="ltr">{row?.customer_phone}</span>
      </div>,
      sortable: true,
      width: "180px"
    },
    {
      name: t("company_name_key"),
      selector: (row) => row?.company_name,
      sortable: true,
      width: "180px"
    },
    {
      name: t("office_name_key"),
      selector: (row) => row?.office_name,
      cell: (row) =>
        <span className="font-bold text-primary">
          {row?.office_name}
        </span>,
      sortable: true,
      width: "180px"
    },
    {
      name: t("city_key"),
      selector: (row) => row?.office_city,
      sortable: true,
    },
    {
      name: t("rating_key"),
      selector: (row) => row?.blamable_rating,
      cell: (row) => <div className="flex items-center justify-center gap-1">
        <Star width={22} height={22} />
        <span> {row?.blamable_rating ? row?.blamable_rating : ""}</span>

      </div>,
      sortable: true,
    },
    {
      name: t("pick_date_key"),
      selector: (row) => row?.pick_date,
      getValue: (row) => `${row?.pick_date} ${row?.pick_time}`,
      cell: (row) => <div className="flex flex-col items-center justify-center gap-1">
        <span>{row?.pick_date}</span>
        <span>{row.pick_time}</span>
      </div>,
      sortable: true,
      width: "160px"
    },
    {
      name: t("drop_date_key"),
      selector: (row) => row?.drop_date,
      getValue: (row) => `${row?.drop_date} ${row?.drop_time}`,
      cell: (row) => <div className="flex flex-col items-center justify-center gap-1">
        <span>{row?.drop_date}</span>
        <span>{row.drop_time}</span>
      </div>,
      sortable: true,
      width: "160px"
    },
    {
      name: t("created_at_key"),
      selector: (row) => row?.created_at,
      getValue: (row) => moment(row?.created_at).format(date_format),
      cell: (row) => <div className="flex flex-col items-center justify-center gap-1">
        <span>{moment(row?.created_at).format(date_format)}</span>
        <span>{moment(row?.created_at).format("HH:mm")}</span>
      </div>,
      sortable: true,
      width: "160px"
    },
    {
      name: t("status_key"),
      sortable: true,
      selector: row => row?.state,
      cell: (row) => (
        <div className="flex flex-col gap-2 py-4">
          {row.state != "pending" && <Button
            disabled
            className={`${row?.state?.toLowerCase() == "accepted" ? "bg-primary" : (row?.state?.toLowerCase() == "canceled" || row?.state?.toLowerCase() == "rejected") ? "bg-red-500" : "bg-blue-500"} text-white flex gap-1 text-xs p-2 px-4`}
            onClick={() => handleAccept(row?.uuid)}
          >
            {/* <CheckCircleIcon className="w-4" /> */}
            <span>{t(`${row.state}_key`)}</span>
          </Button>}

          {row.can_approve_reject_booking && (
            <Button
              disabled={actionLoading}
              className={`bg-primary text-white flex gap-1 text-xs p-2 px-4`}
              onClick={() => handleApprove(row?.uuid)}
            >
              <CheckCircleIcon className="w-4" />
              <span>{t("approve_key")}</span>
            </Button>
          )}
          {row.can_accept && (
            <Button
              disabled={actionLoading}
              className={`bg-primary text-white flex gap-1 text-xs p-2 px-4`}
              onClick={() => handleAccept(row?.uuid)}
            >
              <CheckCircleIcon className="w-4" />
              <span>{t("accept_key")}</span>
            </Button>
          )}
          {row.can_cancel && (row.state !== "contract_opened" && row.state !== "early_return") && (
            <Button
              disabled={actionLoading}
              className={`bg-red-500 text-white flex gap-1 text-xs p-2 px-4`}
              onClick={() => handleReject(row?.uuid)}
            >
              <XMarkIcon className="w-4" />
              <span>{row.state?.toLowerCase() == "pending" ? t("reject_key") : t("cancel_key")}</span>
            </Button>
          )}
        </div >
      ),
      width: "150px"
    },
    {
      name: t("actions_key"),
      selector: row => row?.uuid,
      noExport: true,
      cell: (row) => <div className="flex flex-col items-center justify-center py-2">

        <Link href={`/corporate-bookings/edit?uuid=${row?.uuid}`}>
          <Button disabled={!row.can_edit} className="px-6 py-0 text-sm btn--secondary">
            {t("edit_key")}
          </Button>
        </Link>


        <div className="flex gap-2 pt-2">
          <Button
            className="px-1"
            onClick={() => setHistoryModal({ isOpen: true, id: row?.uuid })}
          >
            <ClockIcon color="#1E85A5" width={18} />
          </Button>
          <Button
            className="px-1"
            onClick={() => setTransactionModal({ isOpen: true, id: row?.uuid })}
          >
            <BanknotesIcon color="#1E85A5" width={18} />
          </Button>
          <Button
            className="px-1"
            disabled={printModal.id}
            onClick={() => openPrintModal(row?.uuid)}
          >
            <PrinterIcon color="#1E85A5" width={18} />
          </Button>
        </div>


      </div>
      ,
      sortable: false,
      width: "180px"
    },
    {
      name: t("settlement_key"),
      selector: (row) => row?.is_settled,
      getValue: (row) => {
        const status = getSettlement(row?.payment?.is_partial ? 3 : row.is_settled ? 1 : 2);
        return t(status.text)
      },
      width: "160px",
      cell: (row) => {
        const status = getSettlement(row?.payment?.is_partial ? 3 : row.is_settled ? 1 : 2);
        return <span className={status.class}>
          {t(status.text)}
        </span>
      },
      sortable: true,
    }
  ];


const registrationRequestsColumns = (t, handleAccept, handleReject, actionLoading) => [
  {
    name: t("corporate_name_key"),
    selector: (row) => row?.request_body.name,
    sortable: true,
    minWidth: "160px"
  },
  {
    name: t("coordinator_key"),
    selector: (row) => row?.request_body.coordinators[0]["name"],
    sortable: true,
    minWidth: "160px"
  },
  {
    name: t("email_key"),
    selector: (row) => row?.request_body.coordinators[0]["email"],
    sortable: true,
    minWidth: "160px"
  },
  {
    name: t("phone_number_key"),
    selector: (row) => row?.request_body.coordinators[0]["phone"],
    cell: (row) => <span dir="ltr">{row?.request_body.coordinators[0]["phone"]}</span>,
    sortable: true,
    minWidth: "160px"
  },
  {
    name: t("actions_key"),
    sortable: true,
    selector: row => row?.status,
    cell: (row) => (
      <div className="flex flex-col gap-2 py-2">
        {row?.status != "PENDING" ? <Button
          disabled
          className={`${row?.status == "ACCEPTED" ? "bg-primary" : "bg-red-500"} text-white flex gap-1 text-xs p-2`}
        >
          {/* <CheckCircleIcon className="w-4" /> */}
          <span>{row?.status == "ACCEPTED" ? t("accepted_key") : t("rejected_key")}</span>
        </Button>
          : <>
            <Button
              disabled={actionLoading}
              className={`bg-primary text-white flex gap-1 text-xs p-2`}
              onClick={() => handleAccept(row?.request_body?.name, row?.request_body?.coordinators[0]["email"], row?.uuid)}
            >
              <CheckCircleIcon className="w-4" />
              <span>{t("accept_key")}</span>
            </Button>
            <Button
              disabled={actionLoading}
              className={`bg-red-500 text-white flex gap-1 text-xs p-2`}
              onClick={() => handleReject(row?.request_body?.name, row?.request_body?.coordinators[0]["email"], row?.uuid)}
            >
              <XMarkIcon className="w-4" />
              <span>{t("reject_key")}</span>
            </Button>
          </>}
      </div >
    ),
  },
];

const settlementsColumns = (t, formatDate, moment, router, token) => [
  {
    name: t("year_month_key"),
    selector: (row) => `${formatDate(moment().month(row?.month - 1), "MMMM", router.locale)} - ${row?.year}`,
    sortable: true,
    minWidth: "160px"
  },
  {
    name: t("id_key"),
    selector: (row) => row?.uuid,
    sortable: true,
    cell: (row) => <span className="text-primary">{row?.uuid}</span>,
    minWidth: "180px"
  },
  {
    name: t("booking_id_key"),
    selector: (row) => "",
    sortable: true,
    // cell: (row) => <p className="text-primary">{row.corporate_limits.map(c => c.booking_individual_number)?.join(", ")}</p>,
    cell: (row) => <p className="text-primary">{row?.corporate_limits.map((c, i) => {
      return <Link key={i} href={`/corporate-bookings/preview?uuid=${c?.booking_uuid}`}>
        <p className="inline-block">
          <span className="cursor-pointer">{c?.booking_individual_number}</span>
          {i + 1 < row?.corporate_limits?.length && <span className="text-black dark:text-white mx-1">,</span>}

        </p>
      </Link>
    })}</p>,
    minWidth: "160px"
  },
  {
    name: t("amount_key"),
    selector: (row) => <p className="flex flex-col gap-1">
      <span>{formatComma(row?.settled_amount_gross)}</span>
      <span className="text-gray-600">{t("sar_key").toLowerCase()}</span>
    </p>,
    sortable: true,
    minWidth: "160px"

  },
  {
    name: t("attachment_key"),
    selector: (row) => row?.attachment_url,
    sortable: true,
    cell: (row) => (
      <a target="_blank" rel="noreferrer" download={"wire_transfer"} href={`${row?.attachment_url}?token=${token}`}>
        <Button disabled={!row?.attachment_url} className="text-xs btn--primary" >
          {t("settled_pdf_key")}
        </Button>
      </a>
    ),
  },
];

const settlementsDetailsColumns = (
  t,
  date_format,
  setHistoryModal,
  setTransactionModal,
  openPrintModal,
  printModal
) => [
    {
      name: t("booking_id_key"),
      selector: (row) => row?.booking_individual_number,
      sortable: true,
    },
    {
      name: t("customer_name_key"),
      selector: (row) => row?.user_name,
      sortable: true,
      cell: (row) => (
        <div className="flex flex-col" >
          <span className="block">{row?.user_name}</span>
          <span dir="ltr" className="block">{row?.customer_phone}</span>
        </div>
      ),
      minWidth: "160px"
    },
    {
      name: t("corporate_key"),
      selector: (row) => row?.corporate_name,
      sortable: true,
      minWidth: "160px"
    },
    {
      name: t("company_name_key"),
      selector: (row) => row?.company_name,
      sortable: true,
      minWidth: "160px"
    },
    {
      name: t("city_key"),
      selector: (row) => row?.office_city,
      sortable: true,
    },
    {
      name: t("amount_key"),
      selector: (row) => row?.limit_amount_gross,
      sortable: true,
    },
    {
      name: t("settlement_key"),
      selector: (row) => row?.is_settled,
      sortable: true,
      cell: (row) => {
        const status = getSettlement(2);
        return <span className={`${status.class}`}>
          {t(status.text)}
        </span>
      },
      minWidth: "160px"
    },
    {
      name: t("pick_date_key"),
      selector: (row) => row?.pick_date,
      getValue: (row) => `${row?.pick_date} ${row?.pick_time}`,
      cell: (row) => <div className="flex flex-col items-center justify-center gap-1">
        <span>{row?.pick_date}</span>
        <span>{row.pick_time}</span>
      </div>,
      sortable: true,
      width: "160px"
    },
    {
      name: t("drop_date_key"),
      selector: (row) => row?.drop_date,
      getValue: (row) => `${row?.drop_date} ${row?.drop_time}`,
      cell: (row) => <div className="flex flex-col items-center justify-center gap-1">
        <span>{row?.drop_date}</span>
        <span>{row.drop_time}</span>
      </div>,
      sortable: true,
      width: "160px"
    },
    {
      name: t("actions_key"),
      sortable: true,
      cell: (row) => (
        <div className="flex gap-2">
          <Button
            className="px-1"
            onClick={() => setHistoryModal({ isOpen: true, id: row?.booking_uuid })}
          >
            <ClockIcon color="#1E85A5" width={18} />
          </Button>
          <Button
            className="px-1"
            onClick={() => setTransactionModal({ isOpen: true, id: row?.booking_uuid })}
          >
            <BanknotesIcon color="#1E85A5" width={18} />
          </Button>
          <Button
            className="px-1"
            disabled={printModal.id}
            onClick={() => openPrintModal(row?.booking_uuid)}
          >
            <PrinterIcon color="#1E85A5" width={18} />
          </Button>
        </div>
      ),
    },
  ];
const settlementsByMonthColumns = (t) => [
  {
    name: t("corporate_key"),
    selector: (row) => getRandomCompanyName(),
    sortable: true,
    width: "200px",
  },
  {
    name: `${moment().month(0).format('MMM')}`,
    selector: (row) => row.settlement,
    sortable: true,
    width: "160px",
    cell: (row) => {
      const status = getSettlement(row.settlement);
      return <span className={status.class}>
        {t(status.text)}
      </span>
    },
  },
  {
    name: `${moment().month(1).format('MMM')}`,
    selector: (row) => row.settlement,
    sortable: true,
    width: "160px",
    cell: (row) => {
      const status = getSettlement(row.settlement);
      return <span className={status.class}>
        {t(status.text)}
      </span>
    },
  },
  {
    name: `${moment().month(2).format('MMM')}`,
    selector: (row) => row.settlement,
    sortable: true,
    width: "160px",
    cell: (row) => {
      const status = getSettlement(row.settlement);
      return <span className={status.class}>
        {t(status.text)}
      </span>
    },
  },
  {
    name: `${moment().month(3).format('MMM')}`,
    selector: (row) => row.settlement,
    sortable: true,
    width: "160px",
    cell: (row) => {
      const status = getSettlement(row.settlement);
      return <span className={status.class}>
        {t(status.text)}
      </span>
    },
  },
  {
    name: `${moment().month(4).format('MMM')}`,
    selector: (row) => row.settlement,
    sortable: true,
    width: "160px",
    cell: (row) => {
      const status = getSettlement(row.settlement);
      return <span className={status.class}>
        {t(status.text)}
      </span>
    },
  },
  {
    name: `${moment().month(5).format('MMM')}`,
    selector: (row) => row.settlement,
    sortable: true,
    width: "160px",
    cell: (row) => {
      const status = getSettlement(row.settlement);
      return <span className={status.class}>
        {t(status.text)}
      </span>
    },
  },
  {
    name: `${moment().month(6).format('MMM')}`,
    selector: (row) => row.settlement,
    sortable: true,
    width: "160px",
    cell: (row) => {
      const status = getSettlement(row.settlement);
      return <span className={status.class}>
        {t(status.text)}
      </span>
    },
  },
  {
    name: `${moment().month(7).format('MMM')}`,
    selector: (row) => row.settlement,
    sortable: true,
    width: "160px",
    cell: (row) => {
      const status = getSettlement(row.settlement);
      return <span className={status.class}>
        {t(status.text)}
      </span>
    },
  },
  {
    name: `${moment().month(8).format('MMM')}`,
    selector: (row) => row.settlement,
    sortable: true,
    width: "160px",
    cell: (row) => {
      const status = getSettlement(row.settlement);
      return <span className={status.class}>
        {t(status.text)}
      </span>
    },
  },
  {
    name: `${moment().month(9).format('MMM')}`,
    selector: (row) => row.settlement,
    sortable: true,
    width: "160px",
    cell: (row) => {
      const status = getSettlement(row.settlement);
      return <span className={status.class}>
        {t(status.text)}
      </span>
    },
  },
  {
    name: `${moment().month(10).format('MMM')}`,
    selector: (row) => row.settlement,
    sortable: true,
    width: "160px",
    cell: (row) => {
      const status = getSettlement(row.settlement);
      return <span className={status.class}>
        {t(status.text)}
      </span>
    },
  },
  {
    name: `${moment().month(11).format('MMM')}`,
    selector: (row) => row.settlement,
    sortable: true,
    width: "160px",
    cell: (row) => {
      const status = getSettlement(row.settlement);
      return <span className={status.class}>
        {t(status.text)}
      </span>
    },
  },
];

const limitColumns = (t, date_format) => [
  {
    name: t("transaction_key"),
    selector: row => t("deposit_key"),
    sortable: true,
  },
  {
    name: t("date_key"),
    selector: (row) => moment(row?.created_at).format(date_format),
    sortable: true,
  },
  {
    name: t("amount_key"),
    selector: (row) => formatComma(row?.limit_amount_gross),
    sortable: true,
  },
  {
    name: t("expiry_date_key"),
    selector: (row) => moment(row?.valid_until).format(date_format),
    sortable: true,
  },
  {
    name: t("balance_key"),
    selector: (row) => formatComma(row?.remaining_amount_gross),
    sortable: true,
  }
];

const customerColumns = (t, showLicense, setShowLicense) => [
  {
    name: t("customer_name_key"),
    selector: row => row?.full_name,
    cell: (row) => <span className="font-bold text-primary">{row?.full_name}</span>,
    sortable: true,
    width: "160px"
  },
  {
    name: t("phone_number_key"),
    selector: (row) => row?.phone,
    cell: (row) => <span dir="ltr">{row?.phone}</span>,
    sortable: true,
    width: "160px"
  },
  {
    name: t("email_key"),
    selector: (row) => row?.email,
    sortable: true,
    width: "160px"
  },
  {
    name: t("national_or_iqma_id_key"),
    selector: (row) => "",
    sortable: true,
  },
  {
    name: t("birth_date_key"),
    selector: (row) => "",
    // selector: (row) => moment(row?.birth_date).format(date_format),
    sortable: true,
  },
  {
    name: t("driver_license_key"),
    selector: row => row?.uuid,
    noExport: true,
    cell: (row) => <button disabled={showLicense?.loading} onClick={() => setShowLicense({ uuid: row?.uuid })} className={`${showLicense?.loading && showLicense.uuid == row.uuid && " opacity-40"} h-10  text-primary border items-center border-gray-300 px-3  rounded-xl flex flex-row gap-2`} >
      <License width={23} />
      <span>{t("view_license_key")}</span>
    </button>,
    sortable: false,
    width: "180px"
  },
  {
    name: t("actions_key"),
    selector: row => row?.uuid,
    noExport: true,
    cell: (row) => <Link href={`/corporate/customers-list/update?cus=${row?.uuid}`}>
      <span className="font-bold cursor-pointer text-primary">
        <PencilSquareIcon width={25} />
      </span>
    </Link>,
    sortable: false,
    // button: true,
    width: "180px"
  },
];


const coordinatorBookingsColumns = (t, date_format) => [
  {
    name: t("note_key"),
    noExport: false,
    selector: row => row?.uuid,
    cell: row => <div className="flex items-center justify-center p-2 rounded-full w-25 h-25 bg-secondary text-primary">
      {/* B2B */}
      <CarNote width={20} height={20} />
    </div>,

  },
  {
    name: t("customer_name_key"),
    selector: row => row?.customer_name,
    cell: (row) =>
      <span className="font-bold">
        {`${row?.customer_name}`}
      </span>,


    sortable: true,

  },

  {
    name: t("created_at_key"),
    selector: (row) => moment(row?.created_at).format(date_format),

    sortable: true,

  },
  {
    name: t("pickup_date_key"),
    selector: (row) => moment(row?.pick_date).format(date_format),
    sortable: true,

  },
  {
    name: t("booking_id_key"),
    selector: (row) => row?.individual_number,
    cell: (row) => <Link href={`/corporate/bookings/preview?uuid=${row?.uuid}`}>
      <span className="font-bold cursor-pointer text-primary">
        {row?.individual_number}
      </span>
    </Link>,
    sortable: true,


  },
  {
    name: t("car_name_key"),
    selector: (row) => row?.vehicle,
    sortable: true,

  },
  {
    name: t("amount_of_booking_key"),
    selector: (row) => row?.total_discounted_gross_price,
    sortable: true,

  },
  {
    name: t("settlement_key"),
    selector: row => row.is_settled,
    getValue: row => row.is_settled,
    cell: (row) => (
      <>
        {row.is_settled && <CheckCircleIcon width={25} className={`text-green-600`} />}
        {!row.is_settled && <XCircleIcon width={25} className={`text-red-600`} />}
        {row.payment.is_partial && <CheckBadgeIcon width={25} className={`text-purple-300`} />}
      </>
    ),
    sortable: false,

  },
  {
    name: t("ratings_key"),
    selector: (row) => row?.blamable_rating,
    cell: (row) => <div className="flex items-center justify-center gap-1">
      <Star width={22} height={22} />
      <span> {row?.blamable_rating}</span>

    </div>,
    sortable: true,

  },
  {
    name: t("actions_key"),
    selector: row => row?.uuid,
    noExport: true,
    cell: (row) => <Link href={`/corporate/bookings/update?uuid=${row?.uuid}`}>
      <span className="font-bold cursor-pointer text-primary">
        <PencilSquareIcon width={25} />
      </span>
    </Link>,
    sortable: false,
  },
];


const settlementsCoordinatorColumns = (t, formatDate, moment, router) => [
  {
    name: t("year_month_key"),
    selector: (row) => `${formatDate(moment().month(row?.month - 1), "MMMM", router.locale)} - ${row?.year}`,
    sortable: true,
    minWidth: "160px"
  },
  {
    name: t("amount_key"),
    selector: (row) => "",
    // cell: (row) => `${formatComma(+row?.amount)} ${t("sar_key")}`,
    sortable: true,
    minWidth: "160px"
  },
  {
    name: t("settlement_key"),
    selector: (row) => "",
    sortable: true,
    cell: (row) => {
      const status = getSettlement((row?.settled_status == "settled" ? 1 : row.settled_status == "not settled" ? 2 : 3));
      return <span className={status.class}>
        {t(`${status.text}`)}
      </span>
    },
    minWidth: "180px"
  },
  {
    name: t("settled_amount_key"),
    selector: (row) => row?.settled_amount_gross,
    cell: (row) => formatComma(row?.settled_amount_gross),
    sortable: true,

  },
  {
    name: t("not_settled_amount_key"),
    selector: (row) => "",
    // cell: (row) => formatComma(+row.amount),
    sortable: true,

  }
];


const maintenanceCompaniesColumns = (t) => [
  {
    name: t("company_name_key"),
    selector: row => row.uuid.slice(0, 4),
    sortable: true,
    minWidth: "160px",
    cell: (row) => (
      <div>
        {row?.companyName}
      </div>
      
    )
  },
  {
    name: t("customer_name_key"),
    selector: (row) => row.customerName,
    cell: (row) => (
      <div className="flex flex-col" >
        <span className="block">{row?.customerName}</span>
        <span dir="ltr" className="block">{row?.phone}</span>
      </div>
    ),
    sortable: true,
    minWidth: "160px"
  },
  {
    name: t("service_type_key"),
    selector: (row) => row.serviceType,
    sortable: true,
    minWidth: "160px" , 
    cell: (row) => (
    <div>
        {row?.companyName}
      </div> )
  },
  {
    name: t("amount_key"),
    selector: (row) => formatComma(row?.amount),
    sortable: true,
    minWidth: "160px" , 
    cell: (row) => (
      <div>
          {row?.amount}
        </div> )
  },
];
const companiesColumns = (
  t,
  language,
  activation,
  actionLoading
) => [

    {
      name: t("logo_key"),
      selector: (row) => row?.media,
      cell: (row) => <Image
        width={50}
        height={50}
        className="rounded"
        src={row.media}
      />,

      sortable: false,
      width: "100px"
    },
    {
      name: t("company_name_key"),
      selector: (row) => row?.name.en,
      cell: (row) =>
        <>
          <span>{language == "en" ? row?.name.en : row?.name.ar}</span>
        </>,
      sortable: true,
      width: "200px"
    },
    {
      name: t("contact_person_key"),
      selector: (row) => row?.contact_person,
      cell: (row) =>
        <>
          <span>{row?.contact_person}</span>
        </>,
      sortable: true,
      width: "180px"
    },
    {
      name: t("contact_phone_key"),
      selector: (row) => row?.contact_phone,
      cell: (row) =>
        <>
          <span dir="ltr">{row?.contact_phone}</span>
        </>,
      sortable: true,
      width: "150px"
    },
    {
      name: t("city_key"),
      selector: (row) => row.city,
      cell: (row) =>
        <>
          <span>{(row.city).toUpperCase()}</span>
        </>,
      sortable: true,
      width: "180px"
    },
    // {
    //   name: t("users_key"),
    //   selector: (row) => row?.name.en,
    //   cell: (row) =>
    //     <>
    //       <span className=" cursor-pointer text-primary">{t("users_key")}</span>
    //     </>,
    //   sortable: true,
    //   width: "150px"
    // },
    // {
    //   name: t("drop_city_key"),
    //   selector: (row) => row?.name.en,
    //   cell: (row) =>
    //     <>
    //       <span className=" cursor-pointer text-primary">{t("drop_city_key")}</span>
    //     </>,
    //   sortable: true,
    //   width: "150px"
    // },
    {
      name: t("offices_key"),
      selector: (row) => row?.name.en,
      cell: (row) => <Link href={`/offices?com=${row?.uuid}`}>
        <span className="font-bold cursor-pointer text-primary">
          {t("offices_key")}
        </span>
      </Link>,
      sortable: true,
      width: "150px"
    },
    {
      name: t("activation_key"),
      selector: (row) => row?.uuid,
      noExport: true,
      cell: (row) =>
        <>
          <span>{row?.active ?
            <Button disabled={actionLoading == row?.uuid}
              onClick={() => activation(row?.uuid)} className="btn--primary p-1 btn-sm text-sm w-24"> {t("active_key")}</Button>
            :
            <Button disabled={actionLoading == row?.uuid}
              onClick={() => activation(row?.uuid, true)} className=" btn--secondary p-1 btn-sm text-sm w-24">{t("inactive_key")}</Button>}</span>

        </>,
      sortable: true,
      width: "200px"
    },
    // {
    //   name: t("employee_performance_key"),
    //   selector: (row) => row?.name.en,
    //   cell: (row) =>
    //     <>
    //       <span className=" cursor-pointer text-primary">{t("employee_performance_key")}</span>
    //     </>,
    //   sortable: true,
    //   width: "150px"
    // },
    {
      name: t("active_cars_count_key"),
      selector: (row) => row?.active_cars_count,
      cell: (row) =>
        <>
          <span>{row?.active_cars_count}</span>
        </>,
      sortable: true,
      width: "150px"
    },
    // {
    //   name: t("rewards_settings_key"),
    //   selector: (row) => row?.name.en,
    //   cell: (row) =>
    //     <>
    //       <span className=" cursor-pointer text-primary">{t("rewards_settings_key")}</span>
    //     </>,
    //   sortable: true,
    //   width: "150px"
    // },
  ];

const officesColumns = (
  t,
  activation,
  actionLoading
) => [
    {
      name: t("name_key"),
      selector: (row) => row?.name,
      cell: (row) =>
        <>
          <span >{row?.name}</span>
        </>,
      sortable: true,
      width: "220px"
    },
    {
      name: t("note_key"),
      selector: (row) => row?.name,
      cell: (row) =>
        <>
          {/* <span>{row?.name}</span> */}
        </>,
      sortable: true,
      width: "150px"
    },
    {
      name: t("city_key"),
      selector: (row) => row?.city,
      cell: (row) =>
        <>
          <span>{(row.city).toUpperCase()}</span>
        </>,
      sortable: true,
      width: "150px"
    },
    {
      name: t("contact_person_key"),
      selector: (row) => row?.contact_person,
      cell: (row) =>
        <>
          <span>{row?.contact_person}</span>
        </>,
      sortable: true,
      width: "150px"
    },
    {
      name: t("contact_phone_key"),
      selector: (row) => row?.contact_number,
      cell: (row) =>
        <>
          <span dir="ltr">{row?.contact_number}</span>
        </>,
      sortable: true,
      width: "150px"
    },
    {
      name: t("available_key"),
      selector: (row) => row?.regular_stats?.available,
      cell: (row) =>
        <>
          <span dir="ltr">{row?.regular_stats?.available}</span>
        </>,
      sortable: true,
      width: "150px"
    },
    {
      name: t("bookings_key"),
      selector: (row) => row?.regular_stats?.taken,
      cell: (row) =>
        <>
          <span dir="ltr">{row?.regular_stats?.taken}</span>
        </>,
      sortable: true,
      width: "150px"
    },
    {
      name: t("cars_key"),
      selector: (row) => row?.name.en,
      cell: (row) => <Link href={`/cars?office=${row?.uuid}`}>
        <span className="font-bold cursor-pointer text-primary">
          {t("cars_key")}
        </span>
      </Link>,
      sortable: true,
      width: "150px"
    },

    {
      name: t("activation_key"),
      selector: (row) => row?.uuid,
      noExport: true,
      cell: (row) =>
        <>
          <span>{row?.active ?
            <Button disabled={actionLoading == row?.uuid}
              onClick={() => activation(row?.uuid)} className="btn--primary p-1 btn-sm text-sm w-24"> {t("active_key")}</Button>
            :
            <Button disabled={actionLoading == row?.uuid}
              onClick={() => activation(row?.uuid, true)} className=" btn--secondary p-1 btn-sm text-sm w-24">{t("inactive_key")}</Button>}</span>

        </>,
      sortable: true,
      width: "200px"
    },
    {
      name: t("edit_key"),
      selector: (row) => row?.available,
      noExport: true,
      cell: (row) =>
        <span className="font-bold cursor-pointer text-primary">
          <PencilSquareIcon width={25} />
        </span>,


      sortable: true,
      width: "220px"
    },

  ];


const carsColumns = (
  t,
  activation,
  actionLoading

) => [
    {
      name: t("maker_key"),
      selector: (row) => row?.maker,
      cell: (row) =>
        <>
          <span >{row?.maker}</span>
        </>,
      sortable: true,
      width: "220px"
    },
    {
      name: t("model_key"),
      selector: (row) => row?.model,
      cell: (row) =>
        <>
          <span >{row?.model}</span>
        </>,
      sortable: true,
      width: "220px"
    },

    {
      name: t("year_key"),
      selector: (row) => row?.year,
      cell: (row) =>
        <>
          <span >{row?.year}</span>
        </>,
      sortable: true,
      width: "220px"
    },
    {
      name: t("available_key"),
      selector: (row) => row?.available,
      cell: (row) =>
        <>
          <span >{row?.available}</span>
        </>,
      sortable: true,
      width: "220px"
    },

    {
      name: t("taken_key"),
      selector: (row) => row?.taken,
      cell: (row) =>
        <>
          <span >{row?.taken}</span>
        </>,
      sortable: true,
      width: "220px"
    },
    {
      name: t("active_key"),
      selector: (row) => row?.active,
      cell: (row) =>
        <>
          <span>{row?.active ?
            <Button disabled={actionLoading == row?.uuid}
              onClick={() => activation(row?.uuid)} className="btn--primary p-1 btn-sm text-sm w-24"> {t("active_key")}</Button>
            :
            <Button disabled={actionLoading == row?.uuid}
              onClick={() => activation(row?.uuid, true)} className=" btn--secondary p-1 btn-sm text-sm w-24">{t("inactive_key")}</Button>}</span>

        </>,
      sortable: true,
      width: "220px"
    },
    {
      name: t("edit_key"),
      selector: (row) => row?.taken,
      noExport: true,
      cell: (row) =>

        <>  <span className="font-bold cursor-pointer text-primary">
          <PencilSquareIcon width={25} />
        </span>
        </>
      //  <Link href={`/cars/update?car=${row?.uuid}/edit`}>

      // </Link> 

      ,

      sortable: true,
      width: "220px"
    },

  ];






export {
  corporateColumns,
  registrationRequestsColumns,
  settlementsColumns,
  settlementsDetailsColumns,
  settlementsByMonthColumns,
  bookingsColumns,
  limitColumns,
  customerColumns,
  coordinatorBookingsColumns,
  settlementsCoordinatorColumns,
  maintenanceCompaniesColumns,
  companiesColumns,
  officesColumns,
  carsColumns
}
