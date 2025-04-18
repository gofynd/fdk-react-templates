import React from "react";
import * as styles from "./tool-tip.less";

function Tooltip({ position = "right", title, children }) {
  return (
    <div className={styles.tooltipWrapper}>
      <div className={styles.tooltipTrigger}>
        {children}
        <span className={`${styles.tooltipText} ${styles[position]}`}>
          <div className={styles.tooltipContent}>{title}</div>
          <span
            className={`${styles.tooltipArrow} ${styles[`${position}Arrow`]}`}
          ></span>
        </span>
      </div>
    </div>
  );
}

export default Tooltip;


//?New Tooltip 2
// import React, { useRef, useState, useEffect } from "react";
// import { createPortal } from "react-dom";
// import * as styles from "./tool-tip.less";

// function Tooltip({ title, children, position = "top", offset = 8 }) {
//   const triggerRef = useRef(null);
//   const tooltipRef = useRef(null);
//   const [visible, setVisible] = useState(false);
//   const [style, setStyle] = useState({});

//   useEffect(() => {
//     if (visible && triggerRef.current && tooltipRef.current) {
//       const triggerRect = triggerRef.current.getBoundingClientRect();
//       const tooltipRect = tooltipRef.current.getBoundingClientRect();
//       const calculatedStyle = { position: "fixed", zIndex: 1000 };

//       if (position === "top") {
//         calculatedStyle.top =
//           triggerRect.top - tooltipRect.height - offset + "px";
//         calculatedStyle.left =
//           triggerRect.left +
//           triggerRect.width / 2 -
//           tooltipRect.width / 2 +
//           "px";
//       } else if (position === "bottom") {
//         calculatedStyle.top = triggerRect.bottom + offset + "px";
//         calculatedStyle.left =
//           triggerRect.left +
//           triggerRect.width / 2 -
//           tooltipRect.width / 2 +
//           "px";
//       } else if (position === "left") {
//         calculatedStyle.top =
//           triggerRect.top +
//           triggerRect.height / 2 -
//           tooltipRect.height / 2 +
//           "px";
//         calculatedStyle.left =
//           triggerRect.left - tooltipRect.width - offset + "px";
//       } else if (position === "right") {
//         calculatedStyle.top =
//           triggerRect.top +
//           triggerRect.height / 2 -
//           tooltipRect.height / 2 +
//           "px";
//         calculatedStyle.left = triggerRect.right + offset + "px";
//       }

//       setStyle(calculatedStyle);
//     }
//   }, [visible, position, offset]);

//   const renderTooltip = () => {
//     if (!visible) return null;

//     return createPortal(
//       <div
//         ref={tooltipRef}
//         style={style}
//         className={`${styles.tooltipBox} ${styles[position]}`}
//       >
//         <div className={styles.tooltipContent}>{title}</div>
//         <span
//           className={`${styles.tooltipArrow} ${styles[position + "Arrow"]}`}
//         />
//       </div>,
//       typeof window !== "undefined" ? document.body : null
//     );
//   };

//   return (
//     <>
//       <div
//         ref={triggerRef}
//         className={styles.tooltipWrapper}
//         onMouseEnter={() => setVisible(true)}
//         onMouseLeave={() => setVisible(false)}
//         onMouseOver={() => setVisible(true)}
//         onMouseOut={() => setVisible(false)}
//         // onScroll={() => setVisible(false)}
//       >
//         {children}
//       </div>
//       {renderTooltip()}
//     </>
//   );
// }

// export default Tooltip;
