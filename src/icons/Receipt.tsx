import { motion } from "framer-motion";
import React from "react";

type Props = {
  color?: string;
};

function Receipt({ color }: Props) {
  return (
    <svg
      width='24'
      height='26'
      viewBox='0 0 24 26'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      <foreignObject x='1' y='0.5' width='22' height='25.1724'>
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
      <g filter='url(#filter0_di_40_132)' data-figma-bg-blur-radius='2'>
        <path
          d='M5 4.5H19V20.4656C19 21.2959 18.0466 21.7645 17.3892 21.2574L16.0584 20.2307C15.7236 19.9725 15.2625 19.9527 14.9068 20.1813L13.0815 21.3547C12.4227 21.7783 11.5773 21.7783 10.9185 21.3547L9.0932 20.1813C8.73751 19.9527 8.27644 19.9725 7.94164 20.2307L6.6108 21.2574C5.95338 21.7645 5 21.2959 5 20.4656V4.5Z'
          fill={color ? color : "#515D6B"}
        />
        <path
          d='M5.125 4.625H18.875V20.4656C18.875 21.1921 18.0408 21.6022 17.4655 21.1584L16.1347 20.1318C15.7581 19.8412 15.2394 19.819 14.8392 20.0762L13.0139 21.2496C12.3963 21.6466 11.6037 21.6466 10.9861 21.2496L9.16079 20.0762C8.76064 19.819 8.24194 19.8412 7.86529 20.1318L6.53445 21.1584C5.9592 21.6022 5.125 21.1921 5.125 20.4656V4.625Z'
          stroke='url(#paint0_linear_40_132)'
          stroke-opacity='0.7'
          stroke-width='0.25'
        />
      </g>
      <g filter='url(#filter1_d_40_132)'>
        <path
          d='M9 10.5H12'
          stroke='#E9EBED'
          stroke-width='1.5'
          stroke-linecap='round'
          stroke-linejoin='round'
          shape-rendering='crispEdges'
        />
      </g>
      <g filter='url(#filter2_d_40_132)'>
        <path
          d='M3 4.5H21'
          stroke={color ? color : "#515D6B"}
          stroke-width='1.5'
          stroke-linecap='round'
          stroke-linejoin='round'
          shape-rendering='crispEdges'
        />
      </g>
      <g filter='url(#filter3_d_40_132)'>
        <path
          d='M9 14.5H12'
          stroke='#E9EBED'
          stroke-width='1.5'
          stroke-linecap='round'
          stroke-linejoin='round'
          shape-rendering='crispEdges'
        />
      </g>
      <g filter='url(#filter4_d_40_132)'>
        <path
          d='M15 10.5H15.5'
          stroke='#E9EBED'
          stroke-width='1.5'
          stroke-linecap='round'
          stroke-linejoin='round'
          shape-rendering='crispEdges'
        />
      </g>
      <g filter='url(#filter5_d_40_132)'>
        <path
          d='M15 14.5H15.5'
          stroke='#E9EBED'
          stroke-width='1.5'
          stroke-linecap='round'
          stroke-linejoin='round'
          shape-rendering='crispEdges'
        />
      </g>
      <defs>
        <filter
          id='filter0_di_40_132'
          x='1'
          y='0.5'
          width='22'
          height='25.1724'
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
            result='effect1_dropShadow_40_132'
          />
          <feBlend
            mode='normal'
            in='SourceGraphic'
            in2='effect1_dropShadow_40_132'
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
            result='effect2_innerShadow_40_132'
          />
        </filter>
        <clipPath id='bgblur_0_40_132_clip_path' transform='translate(-1 -0.5)'>
          <path d='M5 4.5H19V20.4656C19 21.2959 18.0466 21.7645 17.3892 21.2574L16.0584 20.2307C15.7236 19.9725 15.2625 19.9527 14.9068 20.1813L13.0815 21.3547C12.4227 21.7783 11.5773 21.7783 10.9185 21.3547L9.0932 20.1813C8.73751 19.9527 8.27644 19.9725 7.94164 20.2307L6.6108 21.2574C5.95338 21.7645 5 21.2959 5 20.4656V4.5Z' />
        </clipPath>
        <filter
          id='filter1_d_40_132'
          x='6.25'
          y='7.75'
          width='8.5'
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
            result='effect1_dropShadow_40_132'
          />
          <feBlend
            mode='normal'
            in='SourceGraphic'
            in2='effect1_dropShadow_40_132'
            result='shape'
          />
        </filter>
        <filter
          id='filter2_d_40_132'
          x='0.25'
          y='1.75'
          width='23.5'
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
            result='effect1_dropShadow_40_132'
          />
          <feBlend
            mode='normal'
            in='SourceGraphic'
            in2='effect1_dropShadow_40_132'
            result='shape'
          />
        </filter>
        <filter
          id='filter3_d_40_132'
          x='6.25'
          y='11.75'
          width='8.5'
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
            result='effect1_dropShadow_40_132'
          />
          <feBlend
            mode='normal'
            in='SourceGraphic'
            in2='effect1_dropShadow_40_132'
            result='shape'
          />
        </filter>
        <filter
          id='filter4_d_40_132'
          x='12.25'
          y='7.75'
          width='6'
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
            result='effect1_dropShadow_40_132'
          />
          <feBlend
            mode='normal'
            in='SourceGraphic'
            in2='effect1_dropShadow_40_132'
            result='shape'
          />
        </filter>
        <filter
          id='filter5_d_40_132'
          x='12.25'
          y='11.75'
          width='6'
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
            result='effect1_dropShadow_40_132'
          />
          <feBlend
            mode='normal'
            in='SourceGraphic'
            in2='effect1_dropShadow_40_132'
            result='shape'
          />
        </filter>
        <linearGradient
          id='paint0_linear_40_132'
          x1='5.35'
          y1='7.2'
          x2='20.0615'
          y2='17.0077'
          gradientUnits='userSpaceOnUse'
        >
          <stop stop-color='white' stop-opacity='0.15' />
          <stop offset='1' stop-color='white' stop-opacity='0.44' />
        </linearGradient>
      </defs>
    </svg>
  );
}

export default Receipt;
