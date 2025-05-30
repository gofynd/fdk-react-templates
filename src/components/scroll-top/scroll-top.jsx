/**
 * ScrollTop component provides a button that appears when the user scrolls down the page
 * and allows the user to smoothly scroll back to the top of the page.
 *
 * @returns {JSX.Element} A button element that becomes visible when the page is scrolled
 * more than 200 pixels down. Clicking the button scrolls the page to the top smoothly.
 */

import React, { useState, useEffect } from "react";
import * as styles from "./scroll-top.less";
import { isRunningOnClient } from "../../helper/utils";
import ScrollTopIcon from "../../assets/images/scroll-top.svg";
import { useGlobalTranslation } from "fdk-core/utils";

function ScrollTop() {
  const { t } = useGlobalTranslation("translation");
  const [isActive, setIsActive] = useState(false);

  const scrollToTop = () => {
    if (!isRunningOnClient()) return;
    window?.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  };

  const handleScroll = () => {
    if (window?.scrollY > 200) {
      setIsActive(true);
    } else {
      setIsActive(false);
    }
  };

  useEffect(() => {
    if (isRunningOnClient()) {
      handleScroll();
      window?.addEventListener("scroll", handleScroll);
      return () => {
        window?.removeEventListener("scroll", handleScroll);
      };
    }
  }, []);

  return (
    <button
      className={`${styles.scrollTop} ${isActive ? styles.isVisible : ""}`}
      onClick={scrollToTop}
    >
      <span className={styles.scrollTopIcon}>
        <ScrollTopIcon />
      </span>
      <span className={styles.scrollTopText}>{t("resource.common.back_to_top")}</span>
    </button>
  );
}

export default ScrollTop;
