import React, { useState, useEffect } from "react";
import * as styles from "./scroll-top.less";
import SvgWrapper from "../core/svgWrapper/SvgWrapper";

function ScrollTop() {
  const [isActive, setIsActive] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  };

  const handleScroll = () => {
    if (window.scrollY > 200) {
      setIsActive(true);
    } else {
      setIsActive(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <button
      className={`${styles.scrollTop} ${isActive ? styles.isVisible : ""}`}
      onClick={scrollToTop}
    >
      <span className={styles.scrollTopIcon}>
        <SvgWrapper svgSrc="scroll-top" />
      </span>
      <span className={styles.scrollTopText}>Back to top</span>
    </button>
  );
}

export default ScrollTop;
