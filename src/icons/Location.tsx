"use client";

import { motion } from "framer-motion";

type Props = {
  color?: string;
};
function Location({ color }: Props) {
  return (
    <svg
      width='26'
      height='28'
      viewBox='0 0 26 28'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      <foreignObject x='0.875' y='0.375' width='24.25' height='27.25'>
        <motion.div
          //   xmlns='http://www.w3.org/1999/xhtml'
          style={{
            backdropFilter: "blur(1px)",
            clipPath: "url(#bgblur_0_12_4051_clip_path)",
            height: "100%",
            width: "100%",
          }}
        ></motion.div>
      </foreignObject>
      <g filter='url(#filter0_di_19_62)' data-figma-bg-blur-radius='2'>
        <path
          d='M21 12.4167C21 17.8445 14.6 23.5 13 23.5C11.4 23.5 5 17.8445 5 12.4167C5 8.04441 8.58172 4.5 13 4.5C17.4183 4.5 21 8.04441 21 12.4167Z'
          fill={color ? color : "#515D6B"}
        />
        <path
          d='M21 12.4167C21 17.8445 14.6 23.5 13 23.5C11.4 23.5 5 17.8445 5 12.4167C5 8.04441 8.58172 4.5 13 4.5C17.4183 4.5 21 8.04441 21 12.4167Z'
          stroke={color ? color : "#515D6B"}
          stroke-width='0.25'
        />
      </g>
      <g filter='url(#filter1_d_19_62)'>
        <circle
          cx='3'
          cy='3'
          r='3'
          transform='matrix(-1 0 0 1 16 9)'
          fill='#EFF7FF'
        />
      </g>
      <defs>
        <filter
          id='filter0_di_19_62'
          x='0.875'
          y='0.375'
          width='24.25'
          height='27.25'
          filterUnits='userSpaceOnUse'
          color-interpolation-filters='sRGB'
        >
          <feFlood flood-opacity='0' result='BackgroundImageFix' />
          <feColorMatrix
            in='SourceAlpha'
            type='matrix'
            values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0'
            result='hardAlpha'
          />
          <feOffset />
          <feGaussianBlur stdDeviation='2' />
          <feComposite in2='hardAlpha' operator='out' />
          <feColorMatrix
            type='matrix'
            values='0 0 0 0 0.231373 0 0 0 0 0.407843 0 0 0 0 1 0 0 0 0.1 0'
          />
          <feBlend
            mode='normal'
            in2='BackgroundImageFix'
            result='effect1_dropShadow_19_62'
          />
          <feBlend
            mode='normal'
            in='SourceGraphic'
            in2='effect1_dropShadow_19_62'
            result='shape'
          />
          <feColorMatrix
            in='SourceAlpha'
            type='matrix'
            values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0'
            result='hardAlpha'
          />
          <feOffset />
          <feGaussianBlur stdDeviation='1.5' />
          <feComposite in2='hardAlpha' operator='arithmetic' k2='-1' k3='1' />
          <feColorMatrix
            type='matrix'
            values='0 0 0 0 0.231373 0 0 0 0 0.407843 0 0 0 0 1 0 0 0 0.38 0'
          />
          <feBlend
            mode='normal'
            in2='shape'
            result='effect2_innerShadow_19_62'
          />
        </filter>
        <clipPath
          id='bgblur_0_19_62_clip_path'
          transform='translate(-0.875 -0.375)'
        >
          <path d='M21 12.4167C21 17.8445 14.6 23.5 13 23.5C11.4 23.5 5 17.8445 5 12.4167C5 8.04441 8.58172 4.5 13 4.5C17.4183 4.5 21 8.04441 21 12.4167Z' />
        </clipPath>
        <filter
          id='filter1_d_19_62'
          x='8'
          y='7'
          width='10'
          height='10'
          filterUnits='userSpaceOnUse'
          color-interpolation-filters='sRGB'
        >
          <feFlood flood-opacity='0' result='BackgroundImageFix' />
          <feColorMatrix
            in='SourceAlpha'
            type='matrix'
            values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0'
            result='hardAlpha'
          />
          <feOffset />
          <feGaussianBlur stdDeviation='1' />
          <feComposite in2='hardAlpha' operator='out' />
          <feColorMatrix
            type='matrix'
            values='0 0 0 0 0.231373 0 0 0 0 0.407843 0 0 0 0 1 0 0 0 0.35 0'
          />
          <feBlend
            mode='normal'
            in2='BackgroundImageFix'
            result='effect1_dropShadow_19_62'
          />
          <feBlend
            mode='normal'
            in='SourceGraphic'
            in2='effect1_dropShadow_19_62'
            result='shape'
          />
        </filter>
      </defs>
    </svg>
  );
}

export default Location;
