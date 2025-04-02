import React from "react";

type Props = {
  color?: string;
};

function Stretcher({ color }: Props) {
  return (
    <svg
      fill={color ? color : "#515D6B"}
      height='24'
      width='24'
      version='1.1'
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 512.00 512.00'
      //   xmlns:xlink='http://www.w3.org/1999/xlink'
      enable-background='new 0 0 512 512'
      transform='rotate(0)matrix(-1, 0, 0, 1, 0, 0)'
      stroke={color ? color : "#515D6B"}
      stroke-width='0.00512'
    >
      <g id='SVGRepo_bgCarrier' stroke-width='0' />

      <g
        id='SVGRepo_tracerCarrier'
        stroke-linecap='round'
        stroke-linejoin='round'
        fill={color ? color : "#515D6B"}
        stroke-width='1.024'
      />

      <g id='SVGRepo_iconCarrier'>
        {" "}
        <g>
          {" "}
          <g>
            {" "}
            <path d='m328.2,89.4h49.7c11.3,0 20.4-9.1 20.4-20.4s-9.1-20.4-20.4-20.4h-49.7c-11.3,0-20.4,9.1-20.4,20.4s9.1,20.4 20.4,20.4z' />{" "}
            <path d='m310.4,339.5c-4.6,0-9.2,0.6-13.5,1.5l-41.7-50.6 57.8-70.2h-52.9l-31.4,38.1-31.4-38.1h-52.9l57.8,70.2-41.5,50.6c-4.4-1-8.9-1.5-13.5-1.5-34.2,0-62,27.8-62,62s27.8,62 62,62 62-27.8 62-62c0-14.6-5.1-28-13.6-38.6l33.2-40.3 33.2,40.3c-8.5,10.6-13.6,24-13.6,38.6 0,34.2 27.8,62 62,62s62-27.8 62-62-27.9-62-62-62z' />{" "}
            <path d='m491.6,51.8c-9.5-6.1-22.1-3.3-28.2,6.3l-51.4,80.6h-380.6c-11.3,0-20.4,9.1-20.4,20.4 0,11.3 9.1,20.4 20.4,20.4h391.8c7,0 13.5-3.6 17.2-9.5l57.4-90c6.1-9.5 3.3-22.2-6.2-28.2z' />{" "}
          </g>{" "}
        </g>{" "}
      </g>
    </svg>
  );
}

export default Stretcher;
