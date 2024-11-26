import React from 'react';

export default function Logo({ variant = "gradient", width = 40, height = 40, className = "" }) {
  const getGradientColors = () => {
    switch (variant) {
      case "white":
        return {
          stopColors: [
            { offset: "0.11", color: "#ffffff" },
            { offset: "0.48", color: "#ffffff" },
            { offset: "0.58", color: "#ffffff" },
            { offset: "0.73", color: "#ffffff" },
            { offset: "0.93", color: "#ffffff" },
            { offset: "1", color: "#ffffff" }
          ]
        };
      default:
        return {
          stopColors: [
            { offset: "0.11", color: "#3b0189" },
            { offset: "0.48", color: "#720a80" },
            { offset: "0.58", color: "#7b0b7e" },
            { offset: "0.73", color: "#930f7a" },
            { offset: "0.93", color: "#ba1574" },
            { offset: "1", color: "#c91771" }
          ]
        };
    }
  };

  const { stopColors } = getGradientColors();

  return (
    <div className={`relative ${className}`} style={{ width, height }}>
      <svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 199.64 143.02" width={width} height={height}>
        <defs>
          <linearGradient id="linear-gradient" x1="428.45" y1="169.03" x2="149.25" y2="368.34" gradientUnits="userSpaceOnUse">
            {stopColors.map(({ offset, color }) => (
              <stop key={offset} offset={offset} stopColor={color} />
            ))}
          </linearGradient>
          {['linear-gradient-2', 'linear-gradient-3', 'linear-gradient-4', 'linear-gradient-5', 'linear-gradient-6'].map(id => (
            <linearGradient key={id} id={id} xlinkHref="#linear-gradient" />
          ))}
        </defs>
        <path
          fill="url(#linear-gradient)"
          stroke="url(#linear-gradient)"
          strokeWidth="2"
          d="m 128.16,30.9 c 17.6,0 31.87,12.83 31.87,28.66 v 27 c 0,11.41 -7.41,21.26 -18.15,25.87 -8.5,3.64 -15.62,9.45 -20,16.95 l -0.07,0.12 c -5.14,-8.79 -15.27,-14.29 -26.3,-14.29 H 38.85 C 21.25,115.21 6.98,102.38 6.98,86.56 V 59.55 C 6.98,43.73 21.24,30.9 38.84,30.9 h 89.32 m 0,-6.27 H 38.84 C 17.42,24.63 0,40.3 0,59.55 v 27.06 c 0,19.25 17.43,34.92 38.85,34.92 H 95.5 c 8.47,0 16.19,4.19 20.13,10.94 l 6.18,10.55 6.17,-10.56 0.08,-0.12 c 3.56,-6.09 9.38,-11 16.84,-14.21 13.42,-5.79 22.16,-18.14 22.16,-31.52 v -27 c 0,-19.26 -17.43,-34.93 -38.85,-34.93 z"
        />
        <path
          fill="url(#linear-gradient-2)"
          stroke="url(#linear-gradient-2)"
          strokeWidth="2"
          d="m 43.39,49.7 c 13.42,0 24.31,9.79 24.31,21.86 0,12.07 -10.89,21.85 -24.31,21.85 -13.42,0 -24.33,-9.78 -24.33,-21.85 0,-12.07 10.89,-21.86 24.31,-21.86 m 0,-6.46 c -17.37,0 -31.49,12.7 -31.49,28.32 0,15.62 14.12,28.31 31.49,28.31 17.37,0 31.49,-12.7 31.49,-28.31 0,-15.61 -14.13,-28.32 -31.49,-28.32 z"
        />
        <path
          fill="url(#linear-gradient-3)"
          stroke="url(#linear-gradient-3)"
          strokeWidth="2"
          d="m 122.62,50.34 c 13,0 23.58,9.49 23.58,21.21 0,11.72 -10.56,21.21 -23.58,21.21 -13.02,0 -23.56,-9.49 -23.56,-21.2 0,-11.71 10.53,-21.22 23.56,-21.22 m 0,-6.27 c -16.86,0 -30.57,12.32 -30.57,27.48 0,15.16 13.71,27.48 30.57,27.48 16.86,0 30.56,-12.33 30.56,-27.48 0,-15.15 -13.71,-27.48 -30.56,-27.48 z"
        />
        <path
          fill="url(#linear-gradient-4)"
          stroke="url(#linear-gradient-4)"
          strokeWidth="2"
          d="m 167.91,3.52 -12.12,18.41 a 42.73,42.73 0 0 0 -5.72,-2.31 L 160.76,0 Z"
        />
        <path
          fill="url(#linear-gradient-5)"
          stroke="url(#linear-gradient-5)"
          strokeWidth="2"
          d="m 188.91,21.48 -19.28,12 a 36.37,36.37 0 0 0 -3.87,-4.47 l 18.3,-13.41 z"
        />
        <path
          fill="url(#linear-gradient-6)"
          stroke="url(#linear-gradient-6)"
          strokeWidth="2"
          d="m 199.64,45.34 -23.85,3.85 a 29.92,29.92 0 0 0 -1.1,-5.53 l 23.25,-5.48 z"
        />
      </svg>
    </div>
  );
}