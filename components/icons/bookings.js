import React from 'react'
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

export default function Bookings(props) {
  const { theme } = useSelector ((state) => state.theme);

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={props.width || 24}
      height={props.height || 24}
      viewBox="0 0 24 24"
      fill="none"
      {...props}
    >
      <path
        d="M3.496 19.003V4.997a2 2 0 0 1 2-2h13.006a2 2 0 0 1 2.001 2v10.004a2 2 0 0 1-2 2.001H5.496a2 2 0 0 0-2 2v0a2 2 0 0 0 2 2.002h13.005a2 2 0 0 0 2.001-2.001V14m-4-6.345H7.498M16.502 12H7.498"
        stroke={theme == "dark" ? "#e1e2e4" : "#2E3032"} strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
Bookings.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
};