import React from "react";

export function GridPattern({
  width = 100,
  height = 100,
  x = 0,
  y = 0,
  strokeDasharray = "4 4",
  className,
  ...props
}) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      {...props}
      style={{
        position: "absolute",
        width: "100%",
        height: "100%",
        inset: 0,
        ...props.style,
      }}
    >
      <defs>
        <pattern
          id="grid-pattern"
          width={width}
          height={height}
          patternUnits="userSpaceOnUse"
          x={x}
          y={y}
        >
          <path
            d={`M ${height} 0 L 0 0 0 ${width}`}
            fill="none"
            stroke="currentColor"
            strokeDasharray={strokeDasharray}
            strokeOpacity={0.3}
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid-pattern)" />
    </svg>
  );
}
