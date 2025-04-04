import React from "react";

type Props = {
  color?: string;
};

function Category({ color }: Props) {
  return (
    <svg
      width='24'
      height='24'
      viewBox='0 0 24 24'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      <rect
        x='4'
        y='4'
        width='7'
        height='4'
        rx='2'
        fill={color ? color : "#515D6B"}
        stroke={color ? color : "#515D6B"}
        stroke-width='1.5'
      />
      <rect
        x='4'
        y='11'
        width='7'
        height='10'
        rx='2.5'
        fill={color ? color : "#515D6B"}
        stroke={color ? color : "#515D6B"}
        stroke-width='1.5'
      />
      <rect
        x='14'
        y='4'
        width='7'
        height='10'
        rx='2.5'
        fill={color ? color : "#515D6B"}
        stroke={color ? color : "#515D6B"}
        stroke-width='1.5'
      />
      <rect
        x='14'
        y='17'
        width='7'
        height='4'
        rx='2'
        fill={color ? color : "#515D6B"}
        stroke={color ? color : "#515D6B"}
        stroke-width='1.5'
      />
    </svg>
  );
}

export default Category;
