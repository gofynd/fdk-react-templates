import React from 'react'

function RadioIcon({ checked = false, ...props }) {
  if (checked) {
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      {...props}
    >
      <rect
        x="0.5"
        y="0.5"
        width="19"
        height="19"
        rx="9.5"
        stroke="var(--primaryColor)"
      />
      <rect
        x="4.78613"
        y="4.78906"
        width="10.4286"
        height="10.4286"
        rx="5.21428"
        fill="var(--primaryColor)"
        stroke="var(--primaryColor)"
      />
    </svg>;
  }

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      {...props}
    >
      <rect
        x="0.5"
        y="0.5"
        width="19"
        height="19"
        rx="9.5"
        stroke="var(--dividerStokes, #d4d1d1)"
      />
    </svg>
  );
}

export default RadioIcon;