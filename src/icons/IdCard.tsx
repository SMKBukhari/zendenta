import React from "react";

type Props = {
  color?: string;
};

function IdCard({ color }: Props) {
  return (
    <svg
      width='24'
      height='24'
      viewBox='0 0 24 24'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      <path
        d='M1.25534 8.75C1.38623 5.69035 3.90813 3.25 7 3.25H17C20.0919 3.25 22.6138 5.69035 22.7447 8.75H1.25534Z'
        fill={color ? color : "#515D6B"}
      />
      <path
        fill-rule='evenodd'
        clip-rule='evenodd'
        d='M22.75 10.25V15C22.75 18.1756 20.1756 20.75 17 20.75H7C3.82436 20.75 1.25 18.1756 1.25 15V10.25H22.75ZM6 14.75C5.58579 14.75 5.25 15.0858 5.25 15.5C5.25 15.9142 5.58579 16.25 6 16.25H11C11.4142 16.25 11.75 15.9142 11.75 15.5C11.75 15.0858 11.4142 14.75 11 14.75H6Z'
        fill={color ? color : "#515D6B"}
      />
    </svg>
  );
}

export default IdCard;
