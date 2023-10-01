
const coordinator = [
  {
    title: 'Total Customers',
    count: "5250",
    desc: 'Corporate',
    percentage: `+3,5%`,
    duration: `Since Last Month`,
  },
  {
    title: 'Total Customers Save',
    count: "7,800",
    desc: 'SAR',
    percentage: `+3,5%`,
    duration: `Since Last Month`,
  },
  {
    title: 'Total Number Of Booking',
    count: "9160",
    desc: 'Bookings',
    percentage: `-3,5%`,
    duration: `Since Last Month`,
  },
  {
    title: 'Total Remaining Balance',
    count: "15,000",
    desc: 'SAR',
    percentage: `+3,5%`,
    duration: `Since Last Month`,
  },
]

const months = [
  {
    label: "JAN",
    value: 1,
  },
  {
    label: "FEB",
    value: 2,
  },
  {
    label: "MAR",
    value: 3,
  },
  {
    label: "APR",
    value: 4,
  },
  {
    label: "MAY",
    value: 5,
  },
  {
    label: "JUNE",
    value: 6,
  },
  {
    label: "JULY",
    value: 7,
  },
  {
    label: "AUG",
    value: 8,
  },
  {
    label: "SEP",
    value: 9,
  },
  {
    label: "OCT",
    value: 10,
  },
  {
    label: "NOV",
    value: 11,
  },
  {
    label: "DEC",
    value: 12,
  },
];

const years = [
  {
    label: "2023",
    value: 2023,
  },
  {
    label: "2022",
    value: 2022,
  },
  {
    label: "2021",
    value: 2021,
  },
  {
    label: "2020",
    value: 2020,
  },
];




const countries = [
  {
    "name": "Kenya",
    "flags": {
      "png": "https://flagcdn.com/w320/ke.png",
      "svg": "https://flagcdn.com/ke.svg"
    },
    "countryCallingCode": "+254"
  },
  {
    "name": "San Marino",
    "flags": {
      "png": "https://flagcdn.com/w320/sm.png",
      "svg": "https://flagcdn.com/sm.svg"
    },
    "countryCallingCode": "+378"
  },
  {
    "name": "French Polynesia",
    "flags": {
      "png": "https://flagcdn.com/w320/pf.png",
      "svg": "https://flagcdn.com/pf.svg"
    },
    "countryCallingCode": "+689"
  },
  {
    "name": "Sierra Leone",
    "flags": {
      "png": "https://flagcdn.com/w320/sl.png",
      "svg": "https://flagcdn.com/sl.svg"
    },
    "countryCallingCode": "+232"
  },
  {
    "name": "Madagascar",
    "flags": {
      "png": "https://flagcdn.com/w320/mg.png",
      "svg": "https://flagcdn.com/mg.svg"
    },
    "countryCallingCode": "+261"
  },
  {
    "name": "Nigeria",
    "flags": {
      "png": "https://flagcdn.com/w320/ng.png",
      "svg": "https://flagcdn.com/ng.svg"
    },
    "countryCallingCode": "+234"
  },
  {
    "name": "Jordan",
    "flags": {
      "png": "https://flagcdn.com/w320/jo.png",
      "svg": "https://flagcdn.com/jo.svg"
    },
    "countryCallingCode": "+962"
  },
  {
    "name": "Libya",
    "flags": {
      "png": "https://flagcdn.com/w320/ly.png",
      "svg": "https://flagcdn.com/ly.svg"
    },
    "countryCallingCode": "+218"
  },
  {
    "name": "Guyana",
    "flags": {
      "png": "https://flagcdn.com/w320/gy.png",
      "svg": "https://flagcdn.com/gy.svg"
    },
    "countryCallingCode": "+592"
  },
  {
    "name": "Mexico",
    "flags": {
      "png": "https://flagcdn.com/w320/mx.png",
      "svg": "https://flagcdn.com/mx.svg"
    },
    "countryCallingCode": "+52"
  },
  {
    "name": "Turkmenistan",
    "flags": {
      "png": "https://flagcdn.com/w320/tm.png",
      "svg": "https://flagcdn.com/tm.svg"
    },
    "countryCallingCode": "+993"
  },
  {
    "name": "Christmas Island",
    "flags": {
      "png": "https://flagcdn.com/w320/cx.png",
      "svg": "https://flagcdn.com/cx.svg"
    },
    "countryCallingCode": "+61"
  },
  {
    "name": "Panama",
    "flags": {
      "png": "https://flagcdn.com/w320/pa.png",
      "svg": "https://flagcdn.com/pa.svg"
    },
    "countryCallingCode": "+507"
  },
  {
    "name": "Vatican City",
    "flags": {
      "png": "https://flagcdn.com/w320/va.png",
      "svg": "https://flagcdn.com/va.svg"
    },
    "countryCallingCode": ""
  },
  {
    "name": "Seychelles",
    "flags": {
      "png": "https://flagcdn.com/w320/sc.png",
      "svg": "https://flagcdn.com/sc.svg"
    },
    "countryCallingCode": "+248"
  },
  {
    "name": "Algeria",
    "flags": {
      "png": "https://flagcdn.com/w320/dz.png",
      "svg": "https://flagcdn.com/dz.svg"
    },
    "countryCallingCode": "+213"
  },
  {
    "name": "Guam",
    "flags": {
      "png": "https://flagcdn.com/w320/gu.png",
      "svg": "https://flagcdn.com/gu.svg"
    },
    "countryCallingCode": "+1 671"
  },
  {
    "name": "Sweden",
    "flags": {
      "png": "https://flagcdn.com/w320/se.png",
      "svg": "https://flagcdn.com/se.svg"
    },
    "countryCallingCode": "+46"
  },
  {
    "name": "Antarctica",
    "flags": {
      "png": "https://flagcdn.com/w320/aq.png",
      "svg": "https://flagcdn.com/aq.svg"
    },
    "countryCallingCode": "+672"
  },
  {
    "name": "Switzerland",
    "flags": {
      "png": "https://flagcdn.com/w320/ch.png",
      "svg": "https://flagcdn.com/ch.svg"
    },
    "countryCallingCode": "+41"
  },
  {
    "name": "Ethiopia",
    "flags": {
      "png": "https://flagcdn.com/w320/et.png",
      "svg": "https://flagcdn.com/et.svg"
    },
    "countryCallingCode": "+251"
  },
  {
    "name": "Somalia",
    "flags": {
      "png": "https://flagcdn.com/w320/so.png",
      "svg": "https://flagcdn.com/so.svg"
    },
    "countryCallingCode": "+252"
  },
  {
    "name": "France",
    "flags": {
      "png": "https://flagcdn.com/w320/fr.png",
      "svg": "https://flagcdn.com/fr.svg"
    },
    "countryCallingCode": "+33"
  },
  {
    "name": "Russia",
    "flags": {
      "png": "https://flagcdn.com/w320/ru.png",
      "svg": "https://flagcdn.com/ru.svg"
    },
    "countryCallingCode": ""
  },
  {
    "name": "Western Sahara",
    "flags": {
      "png": "https://flagcdn.com/w320/eh.png",
      "svg": "https://flagcdn.com/eh.svg"
    },
    "countryCallingCode": "+212"
  },
  {
    "name": "Åland Islands",
    "flags": {
      "png": "https://flagcdn.com/w320/ax.png",
      "svg": "https://flagcdn.com/ax.svg"
    },
    "countryCallingCode": "+358"
  },
  {
    "name": "Tokelau",
    "flags": {
      "png": "https://flagcdn.com/w320/tk.png",
      "svg": "https://flagcdn.com/tk.svg"
    },
    "countryCallingCode": "+690"
  },
  {
    "name": "Chad",
    "flags": {
      "png": "https://flagcdn.com/w320/td.png",
      "svg": "https://flagcdn.com/td.svg"
    },
    "countryCallingCode": "+235"
  },
  {
    "name": "Trinidad and Tobago",
    "flags": {
      "png": "https://flagcdn.com/w320/tt.png",
      "svg": "https://flagcdn.com/tt.svg"
    },
    "countryCallingCode": ""
  },
  {
    "name": "Central African Republic",
    "flags": {
      "png": "https://flagcdn.com/w320/cf.png",
      "svg": "https://flagcdn.com/cf.svg"
    },
    "countryCallingCode": "+236"
  },
  {
    "name": "North Macedonia",
    "flags": {
      "png": "https://flagcdn.com/w320/mk.png",
      "svg": "https://flagcdn.com/mk.svg"
    },
    "countryCallingCode": ""
  },
  {
    "name": "El Salvador",
    "flags": {
      "png": "https://flagcdn.com/w320/sv.png",
      "svg": "https://flagcdn.com/sv.svg"
    },
    "countryCallingCode": "+503"
  },
  {
    "name": "Turks and Caicos Islands",
    "flags": {
      "png": "https://flagcdn.com/w320/tc.png",
      "svg": "https://flagcdn.com/tc.svg"
    },
    "countryCallingCode": ""
  },
  {
    "name": "Kosovo",
    "flags": {
      "png": "https://flagcdn.com/w320/xk.png",
      "svg": "https://flagcdn.com/xk.svg"
    },
    "countryCallingCode": "+383"
  },
  {
    "name": "Colombia",
    "flags": {
      "png": "https://flagcdn.com/w320/co.png",
      "svg": "https://flagcdn.com/co.svg"
    },
    "countryCallingCode": "+57"
  },
  {
    "name": "Palau",
    "flags": {
      "png": "https://flagcdn.com/w320/pw.png",
      "svg": "https://flagcdn.com/pw.svg"
    },
    "countryCallingCode": "+680"
  },
  {
    "name": "Iran",
    "flags": {
      "png": "https://flagcdn.com/w320/ir.png",
      "svg": "https://flagcdn.com/ir.svg"
    },
    "countryCallingCode": ""
  },
  {
    "name": "French Southern and Antarctic Lands",
    "flags": {
      "png": "https://flagcdn.com/w320/tf.png",
      "svg": "https://flagcdn.com/tf.svg"
    },
    "countryCallingCode": ""
  },
  {
    "name": "Bouvet Island",
    "flags": {
      "png": "https://flagcdn.com/w320/bv.png",
      "svg": "https://flagcdn.com/bv.svg"
    },
    "countryCallingCode": ""
  },
  {
    "name": "British Virgin Islands",
    "flags": {
      "png": "https://flagcdn.com/w320/vg.png",
      "svg": "https://flagcdn.com/vg.svg"
    },
    "countryCallingCode": ""
  },
  {
    "name": "United Arab Emirates",
    "flags": {
      "png": "https://flagcdn.com/w320/ae.png",
      "svg": "https://flagcdn.com/ae.svg"
    },
    "countryCallingCode": "+971"
  },
  {
    "name": "South Africa",
    "flags": {
      "png": "https://flagcdn.com/w320/za.png",
      "svg": "https://flagcdn.com/za.svg"
    },
    "countryCallingCode": "+27"
  },
  {
    "name": "Czechia",
    "flags": {
      "png": "https://flagcdn.com/w320/cz.png",
      "svg": "https://flagcdn.com/cz.svg"
    },
    "countryCallingCode": ""
  },
  {
    "name": "Hungary",
    "flags": {
      "png": "https://flagcdn.com/w320/hu.png",
      "svg": "https://flagcdn.com/hu.svg"
    },
    "countryCallingCode": "+36"
  },
  {
    "name": "Peru",
    "flags": {
      "png": "https://flagcdn.com/w320/pe.png",
      "svg": "https://flagcdn.com/pe.svg"
    },
    "countryCallingCode": "+51"
  },
  {
    "name": "Benin",
    "flags": {
      "png": "https://flagcdn.com/w320/bj.png",
      "svg": "https://flagcdn.com/bj.svg"
    },
    "countryCallingCode": "+229"
  },
  {
    "name": "South Sudan",
    "flags": {
      "png": "https://flagcdn.com/w320/ss.png",
      "svg": "https://flagcdn.com/ss.svg"
    },
    "countryCallingCode": "+211"
  },
  {
    "name": "Heard Island and McDonald Islands",
    "flags": {
      "png": "https://flagcdn.com/w320/hm.png",
      "svg": "https://flagcdn.com/hm.svg"
    },
    "countryCallingCode": ""
  },
  {
    "name": "Solomon Islands",
    "flags": {
      "png": "https://flagcdn.com/w320/sb.png",
      "svg": "https://flagcdn.com/sb.svg"
    },
    "countryCallingCode": "+677"
  },
  {
    "name": "Sint Maarten",
    "flags": {
      "png": "https://flagcdn.com/w320/sx.png",
      "svg": "https://flagcdn.com/sx.svg"
    },
    "countryCallingCode": "+1 721"
  },
  {
    "name": "Turkey",
    "flags": {
      "png": "https://flagcdn.com/w320/tr.png",
      "svg": "https://flagcdn.com/tr.svg"
    },
    "countryCallingCode": "+90"
  },
  {
    "name": "Ireland",
    "flags": {
      "png": "https://flagcdn.com/w320/ie.png",
      "svg": "https://flagcdn.com/ie.svg"
    },
    "countryCallingCode": "+353"
  },
  {
    "name": "Botswana",
    "flags": {
      "png": "https://flagcdn.com/w320/bw.png",
      "svg": "https://flagcdn.com/bw.svg"
    },
    "countryCallingCode": "+267"
  },
  {
    "name": "Haiti",
    "flags": {
      "png": "https://flagcdn.com/w320/ht.png",
      "svg": "https://flagcdn.com/ht.svg"
    },
    "countryCallingCode": "+509"
  },
  {
    "name": "Japan",
    "flags": {
      "png": "https://flagcdn.com/w320/jp.png",
      "svg": "https://flagcdn.com/jp.svg"
    },
    "countryCallingCode": "+81"
  },
  {
    "name": "Norfolk Island",
    "flags": {
      "png": "https://flagcdn.com/w320/nf.png",
      "svg": "https://flagcdn.com/nf.svg"
    },
    "countryCallingCode": "+672"
  },
  {
    "name": "Sudan",
    "flags": {
      "png": "https://flagcdn.com/w320/sd.png",
      "svg": "https://flagcdn.com/sd.svg"
    },
    "countryCallingCode": "+249"
  },
  {
    "name": "Uganda",
    "flags": {
      "png": "https://flagcdn.com/w320/ug.png",
      "svg": "https://flagcdn.com/ug.svg"
    },
    "countryCallingCode": "+256"
  },
  {
    "name": "Kazakhstan",
    "flags": {
      "png": "https://flagcdn.com/w320/kz.png",
      "svg": "https://flagcdn.com/kz.svg"
    },
    "countryCallingCode": "+7"
  },
  {
    "name": "Northern Mariana Islands",
    "flags": {
      "png": "https://flagcdn.com/w320/mp.png",
      "svg": "https://flagcdn.com/mp.svg"
    },
    "countryCallingCode": "+1 670"
  },
  {
    "name": "Moldova",
    "flags": {
      "png": "https://flagcdn.com/w320/md.png",
      "svg": "https://flagcdn.com/md.svg"
    },
    "countryCallingCode": "+373"
  },
  {
    "name": "Paraguay",
    "flags": {
      "png": "https://flagcdn.com/w320/py.png",
      "svg": "https://flagcdn.com/py.svg"
    },
    "countryCallingCode": "+595"
  },
  {
    "name": "Estonia",
    "flags": {
      "png": "https://flagcdn.com/w320/ee.png",
      "svg": "https://flagcdn.com/ee.svg"
    },
    "countryCallingCode": "+372"
  },
  {
    "name": "Greenland",
    "flags": {
      "png": "https://flagcdn.com/w320/gl.png",
      "svg": "https://flagcdn.com/gl.svg"
    },
    "countryCallingCode": "+299"
  },
  {
    "name": "Palestine",
    "flags": {
      "png": "https://flagcdn.com/w320/ps.png",
      "svg": "https://flagcdn.com/ps.svg"
    },
    "countryCallingCode": ""
  },
  {
    "name": "Finland",
    "flags": {
      "png": "https://flagcdn.com/w320/fi.png",
      "svg": "https://flagcdn.com/fi.svg"
    },
    "countryCallingCode": "+358"
  },
  {
    "name": "São Tomé and Príncipe",
    "flags": {
      "png": "https://flagcdn.com/w320/st.png",
      "svg": "https://flagcdn.com/st.svg"
    },
    "countryCallingCode": ""
  },
  {
    "name": "Honduras",
    "flags": {
      "png": "https://flagcdn.com/w320/hn.png",
      "svg": "https://flagcdn.com/hn.svg"
    },
    "countryCallingCode": "+504"
  },
  {
    "name": "Dominican Republic",
    "flags": {
      "png": "https://flagcdn.com/w320/do.png",
      "svg": "https://flagcdn.com/do.svg"
    },
    "countryCallingCode": "+1 809"
  },
  {
    "name": "British Indian Ocean Territory",
    "flags": {
      "png": "https://flagcdn.com/w320/io.png",
      "svg": "https://flagcdn.com/io.svg"
    },
    "countryCallingCode": "+246"
  },
  {
    "name": "Rwanda",
    "flags": {
      "png": "https://flagcdn.com/w320/rw.png",
      "svg": "https://flagcdn.com/rw.svg"
    },
    "countryCallingCode": "+250"
  },
  {
    "name": "Comoros",
    "flags": {
      "png": "https://flagcdn.com/w320/km.png",
      "svg": "https://flagcdn.com/km.svg"
    },
    "countryCallingCode": "+269"
  },
  {
    "name": "Oman",
    "flags": {
      "png": "https://flagcdn.com/w320/om.png",
      "svg": "https://flagcdn.com/om.svg"
    },
    "countryCallingCode": "+968"
  },
  {
    "name": "Portugal",
    "flags": {
      "png": "https://flagcdn.com/w320/pt.png",
      "svg": "https://flagcdn.com/pt.svg"
    },
    "countryCallingCode": "+351"
  },
  {
    "name": "American Samoa",
    "flags": {
      "png": "https://flagcdn.com/w320/as.png",
      "svg": "https://flagcdn.com/as.svg"
    },
    "countryCallingCode": "+1 684"
  },
  {
    "name": "Thailand",
    "flags": {
      "png": "https://flagcdn.com/w320/th.png",
      "svg": "https://flagcdn.com/th.svg"
    },
    "countryCallingCode": "+66"
  },
  {
    "name": "Timor-Leste",
    "flags": {
      "png": "https://flagcdn.com/w320/tl.png",
      "svg": "https://flagcdn.com/tl.svg"
    },
    "countryCallingCode": ""
  },
  {
    "name": "Armenia",
    "flags": {
      "png": "https://flagcdn.com/w320/am.png",
      "svg": "https://flagcdn.com/am.svg"
    },
    "countryCallingCode": "+374"
  },
  {
    "name": "Kuwait",
    "flags": {
      "png": "https://flagcdn.com/w320/kw.png",
      "svg": "https://flagcdn.com/kw.svg"
    },
    "countryCallingCode": "+965"
  },
  {
    "name": "South Georgia",
    "flags": {
      "png": "https://flagcdn.com/w320/gs.png",
      "svg": "https://flagcdn.com/gs.svg"
    },
    "countryCallingCode": ""
  },
  {
    "name": "Saint Martin",
    "flags": {
      "png": "https://flagcdn.com/w320/mf.png",
      "svg": "https://flagcdn.com/mf.svg"
    },
    "countryCallingCode": "+590"
  },
  {
    "name": "Georgia",
    "flags": {
      "png": "https://flagcdn.com/w320/ge.png",
      "svg": "https://flagcdn.com/ge.svg"
    },
    "countryCallingCode": "+995"
  },
  {
    "name": "Burundi",
    "flags": {
      "png": "https://flagcdn.com/w320/bi.png",
      "svg": "https://flagcdn.com/bi.svg"
    },
    "countryCallingCode": "+257"
  },
  {
    "name": "Anguilla",
    "flags": {
      "png": "https://flagcdn.com/w320/ai.png",
      "svg": "https://flagcdn.com/ai.svg"
    },
    "countryCallingCode": "+1 264"
  },
  {
    "name": "Cambodia",
    "flags": {
      "png": "https://flagcdn.com/w320/kh.png",
      "svg": "https://flagcdn.com/kh.svg"
    },
    "countryCallingCode": "+855"
  },
  {
    "name": "Lesotho",
    "flags": {
      "png": "https://flagcdn.com/w320/ls.png",
      "svg": "https://flagcdn.com/ls.svg"
    },
    "countryCallingCode": "+266"
  },
  {
    "name": "Cayman Islands",
    "flags": {
      "png": "https://flagcdn.com/w320/ky.png",
      "svg": "https://flagcdn.com/ky.svg"
    },
    "countryCallingCode": "+1 345"
  },
  {
    "name": "Vanuatu",
    "flags": {
      "png": "https://flagcdn.com/w320/vu.png",
      "svg": "https://flagcdn.com/vu.svg"
    },
    "countryCallingCode": "+678"
  },
  {
    "name": "Bolivia",
    "flags": {
      "png": "https://flagcdn.com/w320/bo.png",
      "svg": "https://flagcdn.com/bo.svg"
    },
    "countryCallingCode": ""
  },
  {
    "name": "United Kingdom",
    "flags": {
      "png": "https://flagcdn.com/w320/gb.png",
      "svg": "https://flagcdn.com/gb.svg"
    },
    "countryCallingCode": "+44"
  },
  {
    "name": "Tonga",
    "flags": {
      "png": "https://flagcdn.com/w320/to.png",
      "svg": "https://flagcdn.com/to.svg"
    },
    "countryCallingCode": "+676"
  },
  {
    "name": "Spain",
    "flags": {
      "png": "https://flagcdn.com/w320/es.png",
      "svg": "https://flagcdn.com/es.svg"
    },
    "countryCallingCode": "+34"
  },
  {
    "name": "Israel",
    "flags": {
      "png": "https://flagcdn.com/w320/il.png",
      "svg": "https://flagcdn.com/il.svg"
    },
    "countryCallingCode": "+972"
  },
  {
    "name": "Malaysia",
    "flags": {
      "png": "https://flagcdn.com/w320/my.png",
      "svg": "https://flagcdn.com/my.svg"
    },
    "countryCallingCode": "+60"
  },
  {
    "name": "Curaçao",
    "flags": {
      "png": "https://flagcdn.com/w320/cw.png",
      "svg": "https://flagcdn.com/cw.svg"
    },
    "countryCallingCode": ""
  },
  {
    "name": "DR Congo",
    "flags": {
      "png": "https://flagcdn.com/w320/cd.png",
      "svg": "https://flagcdn.com/cd.svg"
    },
    "countryCallingCode": ""
  },
  {
    "name": "Cuba",
    "flags": {
      "png": "https://flagcdn.com/w320/cu.png",
      "svg": "https://flagcdn.com/cu.svg"
    },
    "countryCallingCode": "+53"
  },
  {
    "name": "Djibouti",
    "flags": {
      "png": "https://flagcdn.com/w320/dj.png",
      "svg": "https://flagcdn.com/dj.svg"
    },
    "countryCallingCode": "+253"
  },
  {
    "name": "Chile",
    "flags": {
      "png": "https://flagcdn.com/w320/cl.png",
      "svg": "https://flagcdn.com/cl.svg"
    },
    "countryCallingCode": "+56"
  },
  {
    "name": "Bosnia and Herzegovina",
    "flags": {
      "png": "https://flagcdn.com/w320/ba.png",
      "svg": "https://flagcdn.com/ba.svg"
    },
    "countryCallingCode": ""
  },
  {
    "name": "Singapore",
    "flags": {
      "png": "https://flagcdn.com/w320/sg.png",
      "svg": "https://flagcdn.com/sg.svg"
    },
    "countryCallingCode": "+65"
  },
  {
    "name": "French Guiana",
    "flags": {
      "png": "https://flagcdn.com/w320/gf.png",
      "svg": "https://flagcdn.com/gf.svg"
    },
    "countryCallingCode": "+594"
  },
  {
    "name": "Suriname",
    "flags": {
      "png": "https://flagcdn.com/w320/sr.png",
      "svg": "https://flagcdn.com/sr.svg"
    },
    "countryCallingCode": "+597"
  },
  {
    "name": "Eswatini",
    "flags": {
      "png": "https://flagcdn.com/w320/sz.png",
      "svg": "https://flagcdn.com/sz.svg"
    },
    "countryCallingCode": ""
  },
  {
    "name": "Belgium",
    "flags": {
      "png": "https://flagcdn.com/w320/be.png",
      "svg": "https://flagcdn.com/be.svg"
    },
    "countryCallingCode": "+32"
  },
  {
    "name": "China",
    "flags": {
      "png": "https://flagcdn.com/w320/cn.png",
      "svg": "https://flagcdn.com/cn.svg"
    },
    "countryCallingCode": "+86"
  },
  {
    "name": "Saint Vincent and the Grenadines",
    "flags": {
      "png": "https://flagcdn.com/w320/vc.png",
      "svg": "https://flagcdn.com/vc.svg"
    },
    "countryCallingCode": ""
  },
  {
    "name": "Nicaragua",
    "flags": {
      "png": "https://flagcdn.com/w320/ni.png",
      "svg": "https://flagcdn.com/ni.svg"
    },
    "countryCallingCode": "+505"
  },
  {
    "name": "Canada",
    "flags": {
      "png": "https://flagcdn.com/w320/ca.png",
      "svg": "https://flagcdn.com/ca.svg"
    },
    "countryCallingCode": "+1"
  },
  {
    "name": "Togo",
    "flags": {
      "png": "https://flagcdn.com/w320/tg.png",
      "svg": "https://flagcdn.com/tg.svg"
    },
    "countryCallingCode": "+228"
  },
  {
    "name": "Ivory Coast",
    "flags": {
      "png": "https://flagcdn.com/w320/ci.png",
      "svg": "https://flagcdn.com/ci.svg"
    },
    "countryCallingCode": ""
  },
  {
    "name": "Slovenia",
    "flags": {
      "png": "https://flagcdn.com/w320/si.png",
      "svg": "https://flagcdn.com/si.svg"
    },
    "countryCallingCode": "+386"
  },
  {
    "name": "Sri Lanka",
    "flags": {
      "png": "https://flagcdn.com/w320/lk.png",
      "svg": "https://flagcdn.com/lk.svg"
    },
    "countryCallingCode": "+94"
  },
  {
    "name": "Greece",
    "flags": {
      "png": "https://flagcdn.com/w320/gr.png",
      "svg": "https://flagcdn.com/gr.svg"
    },
    "countryCallingCode": "+30"
  },
  {
    "name": "Jamaica",
    "flags": {
      "png": "https://flagcdn.com/w320/jm.png",
      "svg": "https://flagcdn.com/jm.svg"
    },
    "countryCallingCode": "+1 876"
  },
  {
    "name": "Italy",
    "flags": {
      "png": "https://flagcdn.com/w320/it.png",
      "svg": "https://flagcdn.com/it.svg"
    },
    "countryCallingCode": "+39"
  },
  {
    "name": "Croatia",
    "flags": {
      "png": "https://flagcdn.com/w320/hr.png",
      "svg": "https://flagcdn.com/hr.svg"
    },
    "countryCallingCode": "+385"
  },
  {
    "name": "New Caledonia",
    "flags": {
      "png": "https://flagcdn.com/w320/nc.png",
      "svg": "https://flagcdn.com/nc.svg"
    },
    "countryCallingCode": "+687"
  },
  {
    "name": "Pakistan",
    "flags": {
      "png": "https://flagcdn.com/w320/pk.png",
      "svg": "https://flagcdn.com/pk.svg"
    },
    "countryCallingCode": "+92"
  },
  {
    "name": "Hong Kong",
    "flags": {
      "png": "https://flagcdn.com/w320/hk.png",
      "svg": "https://flagcdn.com/hk.svg"
    },
    "countryCallingCode": "+852"
  },
  {
    "name": "Latvia",
    "flags": {
      "png": "https://flagcdn.com/w320/lv.png",
      "svg": "https://flagcdn.com/lv.svg"
    },
    "countryCallingCode": "+371"
  },
  {
    "name": "Lebanon",
    "flags": {
      "png": "https://flagcdn.com/w320/lb.png",
      "svg": "https://flagcdn.com/lb.svg"
    },
    "countryCallingCode": "+961"
  },
  {
    "name": "Mauritius",
    "flags": {
      "png": "https://flagcdn.com/w320/mu.png",
      "svg": "https://flagcdn.com/mu.svg"
    },
    "countryCallingCode": "+230"
  },
  {
    "name": "Guinea",
    "flags": {
      "png": "https://flagcdn.com/w320/gn.png",
      "svg": "https://flagcdn.com/gn.svg"
    },
    "countryCallingCode": "+224"
  },
  {
    "name": "Republic of the Congo",
    "flags": {
      "png": "https://flagcdn.com/w320/cg.png",
      "svg": "https://flagcdn.com/cg.svg"
    },
    "countryCallingCode": ""
  },
  {
    "name": "Grenada",
    "flags": {
      "png": "https://flagcdn.com/w320/gd.png",
      "svg": "https://flagcdn.com/gd.svg"
    },
    "countryCallingCode": "+473"
  },
  {
    "name": "Eritrea",
    "flags": {
      "png": "https://flagcdn.com/w320/er.png",
      "svg": "https://flagcdn.com/er.svg"
    },
    "countryCallingCode": "+291"
  },
  {
    "name": "Barbados",
    "flags": {
      "png": "https://flagcdn.com/w320/bb.png",
      "svg": "https://flagcdn.com/bb.svg"
    },
    "countryCallingCode": "+1 246"
  },
  {
    "name": "Tajikistan",
    "flags": {
      "png": "https://flagcdn.com/w320/tj.png",
      "svg": "https://flagcdn.com/tj.svg"
    },
    "countryCallingCode": "+992"
  },
  {
    "name": "Burkina Faso",
    "flags": {
      "png": "https://flagcdn.com/w320/bf.png",
      "svg": "https://flagcdn.com/bf.svg"
    },
    "countryCallingCode": "+226"
  },
  {
    "name": "Macau",
    "flags": {
      "png": "https://flagcdn.com/w320/mo.png",
      "svg": "https://flagcdn.com/mo.svg"
    },
    "countryCallingCode": ""
  },
  {
    "name": "Marshall Islands",
    "flags": {
      "png": "https://flagcdn.com/w320/mh.png",
      "svg": "https://flagcdn.com/mh.svg"
    },
    "countryCallingCode": "+692"
  },
  {
    "name": "Belarus",
    "flags": {
      "png": "https://flagcdn.com/w320/by.png",
      "svg": "https://flagcdn.com/by.svg"
    },
    "countryCallingCode": "+375"
  },
  {
    "name": "Mayotte",
    "flags": {
      "png": "https://flagcdn.com/w320/yt.png",
      "svg": "https://flagcdn.com/yt.svg"
    },
    "countryCallingCode": "+262"
  },
  {
    "name": "Zambia",
    "flags": {
      "png": "https://flagcdn.com/w320/zm.png",
      "svg": "https://flagcdn.com/zm.svg"
    },
    "countryCallingCode": "+260"
  },
  {
    "name": "Iceland",
    "flags": {
      "png": "https://flagcdn.com/w320/is.png",
      "svg": "https://flagcdn.com/is.svg"
    },
    "countryCallingCode": "+354"
  },
  {
    "name": "Saint Lucia",
    "flags": {
      "png": "https://flagcdn.com/w320/lc.png",
      "svg": "https://flagcdn.com/lc.svg"
    },
    "countryCallingCode": "+1 758"
  },
  {
    "name": "Vietnam",
    "flags": {
      "png": "https://flagcdn.com/w320/vn.png",
      "svg": "https://flagcdn.com/vn.svg"
    },
    "countryCallingCode": ""
  },
  {
    "name": "Brazil",
    "flags": {
      "png": "https://flagcdn.com/w320/br.png",
      "svg": "https://flagcdn.com/br.svg"
    },
    "countryCallingCode": "+55"
  },
  {
    "name": "Myanmar",
    "flags": {
      "png": "https://flagcdn.com/w320/mm.png",
      "svg": "https://flagcdn.com/mm.svg"
    },
    "countryCallingCode": "+95"
  },
  {
    "name": "Senegal",
    "flags": {
      "png": "https://flagcdn.com/w320/sn.png",
      "svg": "https://flagcdn.com/sn.svg"
    },
    "countryCallingCode": "+221"
  },
  {
    "name": "Slovakia",
    "flags": {
      "png": "https://flagcdn.com/w320/sk.png",
      "svg": "https://flagcdn.com/sk.svg"
    },
    "countryCallingCode": "+421"
  },
  {
    "name": "Philippines",
    "flags": {
      "png": "https://flagcdn.com/w320/ph.png",
      "svg": "https://flagcdn.com/ph.svg"
    },
    "countryCallingCode": "+63"
  },
  {
    "name": "Albania",
    "flags": {
      "png": "https://flagcdn.com/w320/al.png",
      "svg": "https://flagcdn.com/al.svg"
    },
    "countryCallingCode": "+355"
  },
  {
    "name": "Montenegro",
    "flags": {
      "png": "https://flagcdn.com/w320/me.png",
      "svg": "https://flagcdn.com/me.svg"
    },
    "countryCallingCode": "+382"
  },
  {
    "name": "Gabon",
    "flags": {
      "png": "https://flagcdn.com/w320/ga.png",
      "svg": "https://flagcdn.com/ga.svg"
    },
    "countryCallingCode": "+241"
  },
  {
    "name": "Qatar",
    "flags": {
      "png": "https://flagcdn.com/w320/qa.png",
      "svg": "https://flagcdn.com/qa.svg"
    },
    "countryCallingCode": "+974"
  },
  {
    "name": "Venezuela",
    "flags": {
      "png": "https://flagcdn.com/w320/ve.png",
      "svg": "https://flagcdn.com/ve.svg"
    },
    "countryCallingCode": ""
  },
  {
    "name": "Gibraltar",
    "flags": {
      "png": "https://flagcdn.com/w320/gi.png",
      "svg": "https://flagcdn.com/gi.svg"
    },
    "countryCallingCode": "+350"
  },
  {
    "name": "Niue",
    "flags": {
      "png": "https://flagcdn.com/w320/nu.png",
      "svg": "https://flagcdn.com/nu.svg"
    },
    "countryCallingCode": "+683"
  },
  {
    "name": "Samoa",
    "flags": {
      "png": "https://flagcdn.com/w320/ws.png",
      "svg": "https://flagcdn.com/ws.svg"
    },
    "countryCallingCode": "+685"
  },
  {
    "name": "Antigua and Barbuda",
    "flags": {
      "png": "https://flagcdn.com/w320/ag.png",
      "svg": "https://flagcdn.com/ag.svg"
    },
    "countryCallingCode": ""
  },
  {
    "name": "Liberia",
    "flags": {
      "png": "https://flagcdn.com/w320/lr.png",
      "svg": "https://flagcdn.com/lr.svg"
    },
    "countryCallingCode": "+231"
  },
  {
    "name": "Belize",
    "flags": {
      "png": "https://flagcdn.com/w320/bz.png",
      "svg": "https://flagcdn.com/bz.svg"
    },
    "countryCallingCode": "+501"
  },
  {
    "name": "Equatorial Guinea",
    "flags": {
      "png": "https://flagcdn.com/w320/gq.png",
      "svg": "https://flagcdn.com/gq.svg"
    },
    "countryCallingCode": "+240"
  },
  {
    "name": "Yemen",
    "flags": {
      "png": "https://flagcdn.com/w320/ye.png",
      "svg": "https://flagcdn.com/ye.svg"
    },
    "countryCallingCode": "+967"
  },
  {
    "name": "Tanzania",
    "flags": {
      "png": "https://flagcdn.com/w320/tz.png",
      "svg": "https://flagcdn.com/tz.svg"
    },
    "countryCallingCode": ""
  },
  {
    "name": "Australia",
    "flags": {
      "png": "https://flagcdn.com/w320/au.png",
      "svg": "https://flagcdn.com/au.svg"
    },
    "countryCallingCode": "+61"
  },
  {
    "name": "Bermuda",
    "flags": {
      "png": "https://flagcdn.com/w320/bm.png",
      "svg": "https://flagcdn.com/bm.svg"
    },
    "countryCallingCode": "+1 441"
  },
  {
    "name": "Saint Pierre and Miquelon",
    "flags": {
      "png": "https://flagcdn.com/w320/pm.png",
      "svg": "https://flagcdn.com/pm.svg"
    },
    "countryCallingCode": ""
  },
  {
    "name": "Mongolia",
    "flags": {
      "png": "https://flagcdn.com/w320/mn.png",
      "svg": "https://flagcdn.com/mn.svg"
    },
    "countryCallingCode": "+976"
  },
  {
    "name": "Malta",
    "flags": {
      "png": "https://flagcdn.com/w320/mt.png",
      "svg": "https://flagcdn.com/mt.svg"
    },
    "countryCallingCode": "+356"
  },
  {
    "name": "Luxembourg",
    "flags": {
      "png": "https://flagcdn.com/w320/lu.png",
      "svg": "https://flagcdn.com/lu.svg"
    },
    "countryCallingCode": "+352"
  },
  {
    "name": "Liechtenstein",
    "flags": {
      "png": "https://flagcdn.com/w320/li.png",
      "svg": "https://flagcdn.com/li.svg"
    },
    "countryCallingCode": "+423"
  },
  {
    "name": "Poland",
    "flags": {
      "png": "https://flagcdn.com/w320/pl.png",
      "svg": "https://flagcdn.com/pl.svg"
    },
    "countryCallingCode": "+48"
  },
  {
    "name": "Brunei",
    "flags": {
      "png": "https://flagcdn.com/w320/bn.png",
      "svg": "https://flagcdn.com/bn.svg"
    },
    "countryCallingCode": ""
  },
  {
    "name": "Nepal",
    "flags": {
      "png": "https://flagcdn.com/w320/np.png",
      "svg": "https://flagcdn.com/np.svg"
    },
    "countryCallingCode": "+977"
  },
  {
    "name": "Argentina",
    "flags": {
      "png": "https://flagcdn.com/w320/ar.png",
      "svg": "https://flagcdn.com/ar.svg"
    },
    "countryCallingCode": "+54"
  },
  {
    "name": "Guernsey",
    "flags": {
      "png": "https://flagcdn.com/w320/gg.png",
      "svg": "https://flagcdn.com/gg.svg"
    },
    "countryCallingCode": "+44"
  },
  {
    "name": "Maldives",
    "flags": {
      "png": "https://flagcdn.com/w320/mv.png",
      "svg": "https://flagcdn.com/mv.svg"
    },
    "countryCallingCode": "+960"
  },
  {
    "name": "Malawi",
    "flags": {
      "png": "https://flagcdn.com/w320/mw.png",
      "svg": "https://flagcdn.com/mw.svg"
    },
    "countryCallingCode": "+265"
  },
  {
    "name": "Nauru",
    "flags": {
      "png": "https://flagcdn.com/w320/nr.png",
      "svg": "https://flagcdn.com/nr.svg"
    },
    "countryCallingCode": "+674"
  },
  {
    "name": "Syria",
    "flags": {
      "png": "https://flagcdn.com/w320/sy.png",
      "svg": "https://flagcdn.com/sy.svg"
    },
    "countryCallingCode": ""
  },
  {
    "name": "Kiribati",
    "flags": {
      "png": "https://flagcdn.com/w320/ki.png",
      "svg": "https://flagcdn.com/ki.svg"
    },
    "countryCallingCode": "+686"
  },
  {
    "name": "Martinique",
    "flags": {
      "png": "https://flagcdn.com/w320/mq.png",
      "svg": "https://flagcdn.com/mq.svg"
    },
    "countryCallingCode": "+596"
  },
  {
    "name": "Kyrgyzstan",
    "flags": {
      "png": "https://flagcdn.com/w320/kg.png",
      "svg": "https://flagcdn.com/kg.svg"
    },
    "countryCallingCode": "+996"
  },
  {
    "name": "Saint Kitts and Nevis",
    "flags": {
      "png": "https://flagcdn.com/w320/kn.png",
      "svg": "https://flagcdn.com/kn.svg"
    },
    "countryCallingCode": ""
  },
  {
    "name": "Uzbekistan",
    "flags": {
      "png": "https://flagcdn.com/w320/uz.png",
      "svg": "https://flagcdn.com/uz.svg"
    },
    "countryCallingCode": "+998"
  },
  {
    "name": "Netherlands",
    "flags": {
      "png": "https://flagcdn.com/w320/nl.png",
      "svg": "https://flagcdn.com/nl.svg"
    },
    "countryCallingCode": "+31"
  },
  {
    "name": "United States Minor Outlying Islands",
    "flags": {
      "png": "https://flagcdn.com/w320/um.png",
      "svg": "https://flagcdn.com/um.svg"
    },
    "countryCallingCode": "+1"
  },
  {
    "name": "Niger",
    "flags": {
      "png": "https://flagcdn.com/w320/ne.png",
      "svg": "https://flagcdn.com/ne.svg"
    },
    "countryCallingCode": "+227"
  },
  {
    "name": "Bahrain",
    "flags": {
      "png": "https://flagcdn.com/w320/bh.png",
      "svg": "https://flagcdn.com/bh.svg"
    },
    "countryCallingCode": "+973"
  },
  {
    "name": "Indonesia",
    "flags": {
      "png": "https://flagcdn.com/w320/id.png",
      "svg": "https://flagcdn.com/id.svg"
    },
    "countryCallingCode": "+62"
  },
  {
    "name": "Guadeloupe",
    "flags": {
      "png": "https://flagcdn.com/w320/gp.png",
      "svg": "https://flagcdn.com/gp.svg"
    },
    "countryCallingCode": "+590"
  },
  {
    "name": "Réunion",
    "flags": {
      "png": "https://flagcdn.com/w320/re.png",
      "svg": "https://flagcdn.com/re.svg"
    },
    "countryCallingCode": ""
  },
  {
    "name": "Pitcairn Islands",
    "flags": {
      "png": "https://flagcdn.com/w320/pn.png",
      "svg": "https://flagcdn.com/pn.svg"
    },
    "countryCallingCode": ""
  },
  {
    "name": "Aruba",
    "flags": {
      "png": "https://flagcdn.com/w320/aw.png",
      "svg": "https://flagcdn.com/aw.svg"
    },
    "countryCallingCode": "+297"
  },
  {
    "name": "Bangladesh",
    "flags": {
      "png": "https://flagcdn.com/w320/bd.png",
      "svg": "https://flagcdn.com/bd.svg"
    },
    "countryCallingCode": "+880"
  },
  {
    "name": "Guatemala",
    "flags": {
      "png": "https://flagcdn.com/w320/gt.png",
      "svg": "https://flagcdn.com/gt.svg"
    },
    "countryCallingCode": "+502"
  },
  {
    "name": "Bahamas",
    "flags": {
      "png": "https://flagcdn.com/w320/bs.png",
      "svg": "https://flagcdn.com/bs.svg"
    },
    "countryCallingCode": "+1 242"
  },
  {
    "name": "Uruguay",
    "flags": {
      "png": "https://flagcdn.com/w320/uy.png",
      "svg": "https://flagcdn.com/uy.svg"
    },
    "countryCallingCode": "+598"
  },
  {
    "name": "Morocco",
    "flags": {
      "png": "https://flagcdn.com/w320/ma.png",
      "svg": "https://flagcdn.com/ma.svg"
    },
    "countryCallingCode": "+212"
  },
  {
    "name": "Germany",
    "flags": {
      "png": "https://flagcdn.com/w320/de.png",
      "svg": "https://flagcdn.com/de.svg"
    },
    "countryCallingCode": "+49"
  },
  {
    "name": "Saint Helena, Ascension and Tristan da Cunha",
    "flags": {
      "png": "https://flagcdn.com/w320/sh.png",
      "svg": "https://flagcdn.com/sh.svg"
    },
    "countryCallingCode": ""
  },
  {
    "name": "Montserrat",
    "flags": {
      "png": "https://flagcdn.com/w320/ms.png",
      "svg": "https://flagcdn.com/ms.svg"
    },
    "countryCallingCode": "+1 664"
  },
  {
    "name": "United States",
    "flags": {
      "png": "https://flagcdn.com/w320/us.png",
      "svg": "https://flagcdn.com/us.svg"
    },
    "countryCallingCode": "+1"
  },
  {
    "name": "Falkland Islands",
    "flags": {
      "png": "https://flagcdn.com/w320/fk.png",
      "svg": "https://flagcdn.com/fk.svg"
    },
    "countryCallingCode": "+500"
  },
  {
    "name": "Bulgaria",
    "flags": {
      "png": "https://flagcdn.com/w320/bg.png",
      "svg": "https://flagcdn.com/bg.svg"
    },
    "countryCallingCode": "+359"
  },
  {
    "name": "Papua New Guinea",
    "flags": {
      "png": "https://flagcdn.com/w320/pg.png",
      "svg": "https://flagcdn.com/pg.svg"
    },
    "countryCallingCode": "+675"
  },
  {
    "name": "Costa Rica",
    "flags": {
      "png": "https://flagcdn.com/w320/cr.png",
      "svg": "https://flagcdn.com/cr.svg"
    },
    "countryCallingCode": "+506"
  },
  {
    "name": "Ecuador",
    "flags": {
      "png": "https://flagcdn.com/w320/ec.png",
      "svg": "https://flagcdn.com/ec.svg"
    },
    "countryCallingCode": "+593"
  },
  {
    "name": "Svalbard and Jan Mayen",
    "flags": {
      "png": "https://flagcdn.com/w320/sj.png",
      "svg": "https://flagcdn.com/sj.svg"
    },
    "countryCallingCode": ""
  },
  {
    "name": "Fiji",
    "flags": {
      "png": "https://flagcdn.com/w320/fj.png",
      "svg": "https://flagcdn.com/fj.svg"
    },
    "countryCallingCode": "+679"
  },
  {
    "name": "South Korea",
    "flags": {
      "png": "https://flagcdn.com/w320/kr.png",
      "svg": "https://flagcdn.com/kr.svg"
    },
    "countryCallingCode": ""
  },
  {
    "name": "Puerto Rico",
    "flags": {
      "png": "https://flagcdn.com/w320/pr.png",
      "svg": "https://flagcdn.com/pr.svg"
    },
    "countryCallingCode": "+1 787"
  },
  {
    "name": "Wallis and Futuna",
    "flags": {
      "png": "https://flagcdn.com/w320/wf.png",
      "svg": "https://flagcdn.com/wf.svg"
    },
    "countryCallingCode": ""
  },
  {
    "name": "North Korea",
    "flags": {
      "png": "https://flagcdn.com/w320/kp.png",
      "svg": "https://flagcdn.com/kp.svg"
    },
    "countryCallingCode": ""
  },
  {
    "name": "Taiwan",
    "flags": {
      "png": "https://flagcdn.com/w320/tw.png",
      "svg": "https://flagcdn.com/tw.svg"
    },
    "countryCallingCode": "+886"
  },
  {
    "name": "Isle of Man",
    "flags": {
      "png": "https://flagcdn.com/w320/im.png",
      "svg": "https://flagcdn.com/im.svg"
    },
    "countryCallingCode": ""
  },
  {
    "name": "United States Virgin Islands",
    "flags": {
      "png": "https://flagcdn.com/w320/vi.png",
      "svg": "https://flagcdn.com/vi.svg"
    },
    "countryCallingCode": ""
  },
  {
    "name": "Lithuania",
    "flags": {
      "png": "https://flagcdn.com/w320/lt.png",
      "svg": "https://flagcdn.com/lt.svg"
    },
    "countryCallingCode": "+370"
  },
  {
    "name": "Angola",
    "flags": {
      "png": "https://flagcdn.com/w320/ao.png",
      "svg": "https://flagcdn.com/ao.svg"
    },
    "countryCallingCode": "+244"
  },
  {
    "name": "Tunisia",
    "flags": {
      "png": "https://flagcdn.com/w320/tn.png",
      "svg": "https://flagcdn.com/tn.svg"
    },
    "countryCallingCode": "+216"
  },
  {
    "name": "Faroe Islands",
    "flags": {
      "png": "https://flagcdn.com/w320/fo.png",
      "svg": "https://flagcdn.com/fo.svg"
    },
    "countryCallingCode": "+298"
  },
  {
    "name": "Ghana",
    "flags": {
      "png": "https://flagcdn.com/w320/gh.png",
      "svg": "https://flagcdn.com/gh.svg"
    },
    "countryCallingCode": "+233"
  },
  {
    "name": "Iraq",
    "flags": {
      "png": "https://flagcdn.com/w320/iq.png",
      "svg": "https://flagcdn.com/iq.svg"
    },
    "countryCallingCode": "+964"
  },
  {
    "name": "New Zealand",
    "flags": {
      "png": "https://flagcdn.com/w320/nz.png",
      "svg": "https://flagcdn.com/nz.svg"
    },
    "countryCallingCode": "+64"
  },
  {
    "name": "Serbia",
    "flags": {
      "png": "https://flagcdn.com/w320/rs.png",
      "svg": "https://flagcdn.com/rs.svg"
    },
    "countryCallingCode": "+381"
  },
  {
    "name": "Bhutan",
    "flags": {
      "png": "https://flagcdn.com/w320/bt.png",
      "svg": "https://flagcdn.com/bt.svg"
    },
    "countryCallingCode": "+975"
  },
  {
    "name": "Romania",
    "flags": {
      "png": "https://flagcdn.com/w320/ro.png",
      "svg": "https://flagcdn.com/ro.svg"
    },
    "countryCallingCode": "+40"
  },
  {
    "name": "Afghanistan",
    "flags": {
      "png": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Flag_of_the_Taliban.svg/320px-Flag_of_the_Taliban.svg.png",
      "svg": "https://upload.wikimedia.org/wikipedia/commons/5/5c/Flag_of_the_Taliban.svg"
    },
    "countryCallingCode": "+93"
  },
  {
    "name": "India",
    "flags": {
      "png": "https://flagcdn.com/w320/in.png",
      "svg": "https://flagcdn.com/in.svg"
    },
    "countryCallingCode": "+91"
  },
  {
    "name": "Denmark",
    "flags": {
      "png": "https://flagcdn.com/w320/dk.png",
      "svg": "https://flagcdn.com/dk.svg"
    },
    "countryCallingCode": "+45"
  },
  {
    "name": "Jersey",
    "flags": {
      "png": "https://flagcdn.com/w320/je.png",
      "svg": "https://flagcdn.com/je.svg"
    },
    "countryCallingCode": "+44"
  },
  {
    "name": "Saudi Arabia",
    "flags": {
      "png": "https://flagcdn.com/w320/sa.png",
      "svg": "https://flagcdn.com/sa.svg"
    },
    "countryCallingCode": "+966"
  },
  {
    "name": "Saint Barthélemy",
    "flags": {
      "png": "https://flagcdn.com/w320/bl.png",
      "svg": "https://flagcdn.com/bl.svg"
    },
    "countryCallingCode": "+590"
  },
  {
    "name": "Guinea-Bissau",
    "flags": {
      "png": "https://flagcdn.com/w320/gw.png",
      "svg": "https://flagcdn.com/gw.svg"
    },
    "countryCallingCode": ""
  },
  {
    "name": "Norway",
    "flags": {
      "png": "https://flagcdn.com/w320/no.png",
      "svg": "https://flagcdn.com/no.svg"
    },
    "countryCallingCode": "+47"
  },
  {
    "name": "Monaco",
    "flags": {
      "png": "https://flagcdn.com/w320/mc.png",
      "svg": "https://flagcdn.com/mc.svg"
    },
    "countryCallingCode": "+377"
  },
  {
    "name": "Cocos (Keeling) Islands",
    "flags": {
      "png": "https://flagcdn.com/w320/cc.png",
      "svg": "https://flagcdn.com/cc.svg"
    },
    "countryCallingCode": "+61"
  },
  {
    "name": "Egypt",
    "flags": {
      "png": "https://flagcdn.com/w320/eg.png",
      "svg": "https://flagcdn.com/eg.svg"
    },
    "countryCallingCode": "+20"
  },
  {
    "name": "Cyprus",
    "flags": {
      "png": "https://flagcdn.com/w320/cy.png",
      "svg": "https://flagcdn.com/cy.svg"
    },
    "countryCallingCode": "+357"
  },
  {
    "name": "Dominica",
    "flags": {
      "png": "https://flagcdn.com/w320/dm.png",
      "svg": "https://flagcdn.com/dm.svg"
    },
    "countryCallingCode": "+1 767"
  },
  {
    "name": "Azerbaijan",
    "flags": {
      "png": "https://flagcdn.com/w320/az.png",
      "svg": "https://flagcdn.com/az.svg"
    },
    "countryCallingCode": "+994"
  },
  {
    "name": "Zimbabwe",
    "flags": {
      "png": "https://flagcdn.com/w320/zw.png",
      "svg": "https://flagcdn.com/zw.svg"
    },
    "countryCallingCode": "+263"
  },
  {
    "name": "Tuvalu",
    "flags": {
      "png": "https://flagcdn.com/w320/tv.png",
      "svg": "https://flagcdn.com/tv.svg"
    },
    "countryCallingCode": "+688"
  },
  {
    "name": "Mali",
    "flags": {
      "png": "https://flagcdn.com/w320/ml.png",
      "svg": "https://flagcdn.com/ml.svg"
    },
    "countryCallingCode": "+223"
  },
  {
    "name": "Mauritania",
    "flags": {
      "png": "https://flagcdn.com/w320/mr.png",
      "svg": "https://flagcdn.com/mr.svg"
    },
    "countryCallingCode": "+222"
  },
  {
    "name": "Ukraine",
    "flags": {
      "png": "https://flagcdn.com/w320/ua.png",
      "svg": "https://flagcdn.com/ua.svg"
    },
    "countryCallingCode": "+380"
  },
  {
    "name": "Cameroon",
    "flags": {
      "png": "https://flagcdn.com/w320/cm.png",
      "svg": "https://flagcdn.com/cm.svg"
    },
    "countryCallingCode": "+237"
  },
  {
    "name": "Caribbean Netherlands",
    "flags": {
      "png": "https://flagcdn.com/w320/bq.png",
      "svg": "https://flagcdn.com/bq.svg"
    },
    "countryCallingCode": ""
  },
  {
    "name": "Micronesia",
    "flags": {
      "png": "https://flagcdn.com/w320/fm.png",
      "svg": "https://flagcdn.com/fm.svg"
    },
    "countryCallingCode": ""
  },
  {
    "name": "Mozambique",
    "flags": {
      "png": "https://flagcdn.com/w320/mz.png",
      "svg": "https://flagcdn.com/mz.svg"
    },
    "countryCallingCode": "+258"
  },
  {
    "name": "Namibia",
    "flags": {
      "png": "https://flagcdn.com/w320/na.png",
      "svg": "https://flagcdn.com/na.svg"
    },
    "countryCallingCode": "+264"
  },
  {
    "name": "Gambia",
    "flags": {
      "png": "https://flagcdn.com/w320/gm.png",
      "svg": "https://flagcdn.com/gm.svg"
    },
    "countryCallingCode": "+220"
  },
  {
    "name": "Cook Islands",
    "flags": {
      "png": "https://flagcdn.com/w320/ck.png",
      "svg": "https://flagcdn.com/ck.svg"
    },
    "countryCallingCode": "+682"
  },
  {
    "name": "Cape Verde",
    "flags": {
      "png": "https://flagcdn.com/w320/cv.png",
      "svg": "https://flagcdn.com/cv.svg"
    },
    "countryCallingCode": ""
  },
  {
    "name": "Laos",
    "flags": {
      "png": "https://flagcdn.com/w320/la.png",
      "svg": "https://flagcdn.com/la.svg"
    },
    "countryCallingCode": ""
  },
  {
    "name": "Austria",
    "flags": {
      "png": "https://flagcdn.com/w320/at.png",
      "svg": "https://flagcdn.com/at.svg"
    },
    "countryCallingCode": "+43"
  },
  {
    "name": "Andorra",
    "flags": {
      "png": "https://flagcdn.com/w320/ad.png",
      "svg": "https://flagcdn.com/ad.svg"
    },
    "countryCallingCode": "+376"
  }
]
export { coordinator, years, months, countries }