"use client";

import { motion } from "framer-motion";

type Props = {
  color?: string;
};

function Calendar({ color }: Props) {
  return (
    <svg
      width='26'
      height='27'
      viewBox='0 0 26 27'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      <foreignObject x='0' y='0.5' width='26' height='26'>
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
      <g filter='url(#filter0_di_12_4051)' data-figma-bg-bl ur-radius='2'>
        <rect
          x='4'
          y='4.5'
          width='18'
          height='18'
          rx='5'
          fill={color ? color : "#515D6B"}
        />
        <rect
          x='4.125'
          y='4.625'
          width='17.75'
          height='17.75'
          rx='4.875'
          stroke='#EFF7FF'
          stroke-width='0.25'
        />
      </g>
      <g filter='url(#filter1_d_12_4051)'>
        <path
          fill-rule='evenodd'
          clip-rule='evenodd'
          d='M4.25 10.25V9.5C4.25 9.2448 4.27013 8.9943 4.30888 8.75H21.6911C21.7299 8.9943 21.75 9.2448 21.75 9.5V10.25H4.25Z'
          fill='#EFF7FF'
        />
      </g>
      <g filter='url(#filter2_d_12_4051)'>
        <path
          d='M17.5 3L17.5 6'
          stroke='#EFF7FF'
          stroke-width='1.5'
          stroke-linecap='round'
          stroke-linejoin='round'
          shape-rendering='crispEdges'
        />
      </g>
      <g filter='url(#filter3_d_12_4051)'>
        <path
          d='M8.5 3L8.5 6'
          stroke='#EFF7FF'
          stroke-width='1.5'
          stroke-linecap='round'
          stroke-linejoin='round'
          shape-rendering='crispEdges'
        />
      </g>
      <g filter='url(#filter4_d_12_4051)'>
        <path
          d='M7.5 13.5H8.5'
          stroke='#EFF7FF'
          stroke-width='1.5'
          stroke-linecap='round'
          stroke-linejoin='round'
        />
        <path
          d='M12.5 13.5H13.5'
          stroke='#EFF7FF'
          stroke-width='1.5'
          stroke-linecap='round'
          stroke-linejoin='round'
        />
        <path
          d='M17.5 13.5H18.5'
          stroke='#EFF7FF'
          stroke-width='1.5'
          stroke-linecap='round'
          stroke-linejoin='round'
        />
      </g>
      <g filter='url(#filter5_d_12_4051)'>
        <path
          d='M7.5 17.5H8.5'
          stroke='#EFF7FF'
          stroke-width='1.5'
          stroke-linecap='round'
          stroke-linejoin='round'
        />
        <path
          d='M12.5 17.5H13.5'
          stroke='#EFF7FF'
          stroke-width='1.5'
          stroke-linecap='round'
          stroke-linejoin='round'
        />
        <path
          d='M17.5 17.5H18.5'
          stroke='#EFF7FF'
          stroke-width='1.5'
          stroke-linecap='round'
          stroke-linejoin='round'
        />
      </g>
      <defs>
        <filter
          id='filter0_di_12_4051'
          x='0'
          y='0.5'
          width='26'
          height='26'
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
            result='effect1_dropShadow_12_4051'
          />
          <feBlend
            mode='normal'
            in='SourceGraphic'
            in2='effect1_dropShadow_12_4051'
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
            result='effect2_innerShadow_12_4051'
          />
        </filter>
        <clipPath id='bgblur_0_12_4051_clip_path' transform='translate(0 -0.5)'>
          <rect x='4' y='4.5' width='18' height='18' rx='5' />
        </clipPath>
        <filter
          id='filter1_d_12_4051'
          x='2.25'
          y='6.75'
          width='21.5'
          height='5.5'
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
            result='effect1_dropShadow_12_4051'
          />
          <feBlend
            mode='normal'
            in='SourceGraphic'
            in2='effect1_dropShadow_12_4051'
            result='shape'
          />
        </filter>
        <filter
          id='filter2_d_12_4051'
          x='14.75'
          y='0.25'
          width='5.5'
          height='8.5'
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
            result='effect1_dropShadow_12_4051'
          />
          <feBlend
            mode='normal'
            in='SourceGraphic'
            in2='effect1_dropShadow_12_4051'
            result='shape'
          />
        </filter>
        <filter
          id='filter3_d_12_4051'
          x='5.75'
          y='0.25'
          width='5.5'
          height='8.5'
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
            result='effect1_dropShadow_12_4051'
          />
          <feBlend
            mode='normal'
            in='SourceGraphic'
            in2='effect1_dropShadow_12_4051'
            result='shape'
          />
        </filter>
        <filter
          id='filter4_d_12_4051'
          x='4.75'
          y='10.75'
          width='16.5'
          height='5.5'
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
            result='effect1_dropShadow_12_4051'
          />
          <feBlend
            mode='normal'
            in='SourceGraphic'
            in2='effect1_dropShadow_12_4051'
            result='shape'
          />
        </filter>
        <filter
          id='filter5_d_12_4051'
          x='4.75'
          y='14.75'
          width='16.5'
          height='5.5'
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
            result='effect1_dropShadow_12_4051'
          />
          <feBlend
            mode='normal'
            in='SourceGraphic'
            in2='effect1_dropShadow_12_4051'
            result='shape'
          />
        </filter>
      </defs>
    </svg>
  );
}

export default Calendar;
