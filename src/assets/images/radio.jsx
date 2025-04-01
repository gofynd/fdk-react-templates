import React from 'react'

function RadioIcon({
  checked = false,
  className = "",
  width = 20,
  height = width,
  color,
  ...rest
}) {
  if (checked) {
    return (
      <svg
        className={className}
        xmlns="http://www.w3.org/2000/svg"
        width={width}
        height={height}
        viewBox="0 0 20 20"
        fill="none"
        {...rest}
      >
        <rect
          x="0.5"
          y="0.5"
          width="19"
          height="19"
          rx="9.5"
          stroke={color ?? "currentColor"}
        />
        <rect
          x="4.78613"
          y="4.78906"
          width="10.4286"
          height="10.4286"
          rx="5.21428"
          fill={color ?? "currentColor"}
          stroke={color ?? "currentColor"}
        />
      </svg>
    );
  }

  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 20 20"
      fill="none"
      {...rest}
    >
      <rect
        x="0.5"
        y="0.5"
        width="19"
        height="19"
        rx="9.5"
        stroke={color ?? "currentColor"}
      />
    </svg>
  );
}

export default RadioIcon;