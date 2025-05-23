// import React from "react";
// import * as styles from "./tool-tip.less";

// function Tooltip({ position = "right", title, children }) {
//   return (
//     <div className={styles.tooltipWrapper}>
//       <div className={styles.tooltipTrigger}>
//         {children}
//         <span className={`${styles.tooltipText} ${styles[position]}`}>
//           <div className={styles.tooltipContent}>{title}</div>
//           <span
//             className={`${styles.tooltipArrow} ${styles[`${position}Arrow`]}`}
//           ></span>
//         </span>
//       </div>
//     </div>
//   );
// }

// export default Tooltip;


//?New Tooltip 2
import React, { useRef, useState, useEffect } from "react";
import { createPortal } from "react-dom";
import * as styles from "./tool-tip.less";

function Tooltip({ title, children, position = "top", offset = 8, showTooltip = true }) {
  const triggerRef = useRef(null);
  const tooltipRef = useRef(null);
  const [visible, setVisible] = useState(false);
  const [style, setStyle] = useState({});
  const [portalContainer, setPortalContainer] = useState(null);

  useEffect(() => {
    // Set the portal container to document.body for more reliable positioning
    setPortalContainer(document.body);
  }, []);

  useEffect(() => {
    if (visible && triggerRef.current && tooltipRef.current && portalContainer) {
      const triggerRect = triggerRef.current.getBoundingClientRect();
      const tooltipRect = tooltipRef.current.getBoundingClientRect();
      
      // Calculate position relative to the viewport since we're attaching to body
      const calculatedStyle = { position: "fixed", zIndex: 1000 };
      
      if (position === "top") {
        calculatedStyle.top = triggerRect.top - tooltipRect.height - offset;
        calculatedStyle.left = triggerRect.left + (triggerRect.width / 2) - (tooltipRect.width / 2);
      } else if (position === "bottom") {
        calculatedStyle.top = triggerRect.bottom + offset;
        calculatedStyle.left = triggerRect.left + (triggerRect.width / 2) - (tooltipRect.width / 2);
      } else if (position === "left") {
        calculatedStyle.top = triggerRect.top + (triggerRect.height / 2) - (tooltipRect.height / 2);
        calculatedStyle.left = triggerRect.left - tooltipRect.width - offset;
      } else if (position === "right") {
        calculatedStyle.top = triggerRect.top + (triggerRect.height / 2) - (tooltipRect.height / 2);
        calculatedStyle.left = triggerRect.right + offset;
      }
      
      setStyle(calculatedStyle);
    }
  }, [visible, position, offset, portalContainer]);

  // Add scroll event listener to hide tooltip on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (visible) {
        setVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll, true);
    
    return () => {
      window.removeEventListener('scroll', handleScroll, true);
    };
  }, [visible]);

  const renderTooltip = () => {
    if (!visible || !portalContainer || !showTooltip) return null;

    return createPortal(
      <div
        ref={tooltipRef}
        style={style}
        className={`${styles.tooltipBox} ${styles[position]}`}
      >
        <div className={styles.tooltipContent}>{title}</div>
        <span
          className={`${styles.tooltipArrow} ${styles[position + "Arrow"]}`}
        />
      </div>,
      portalContainer
    );
  };

  return (
    <>
      <div
        ref={triggerRef}
        className={styles.tooltipWrapper}
        onMouseEnter={() => showTooltip && setVisible(true)}
        onMouseLeave={() => showTooltip && setVisible(false)}
        // Remove these as they can cause issues with scrolling
        // onMouseOver={() => showTooltip && setVisible(true)}
        // onMouseOut={() => showTooltip && setVisible(false)}
      >
        {children}
      </div>
      {renderTooltip()}
    </>
  );
}

export default Tooltip;
