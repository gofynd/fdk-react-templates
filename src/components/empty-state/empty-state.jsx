/**
 * A React functional component that displays an error message when no data is found.
 * It adapts its layout based on the device type (mobile or desktop).
 *
 * @param {Object} props - The properties object.
 * @param {string} props.title - The title of the error message, default is "No Data Found".
 * @param {string} props.description - A detailed description of the error.
 * @param {string} props.btnLink - The URL to navigate to when the button is clicked, default is "/".
 * @param {string} props.btnTitle - The text displayed on the button, default is "RETURN TO HOMEPAGE".
 * @param {string} props.iconSrc - The source URL for the icon to be displayed.
 *
 * @returns {JSX.Element} A JSX element that renders the error message with a button.
 *
 */

import React, { useState, useEffect } from "react";
import { FDKLink } from "fdk-core/components";
import * as styles from "./empty-state.less";
import { detectMobileWidth } from "../../helper/utils";

const EmptyState = ({
  title = "No Data Found",
  description,
  btnLink = "/",
  btnTitle = "RETURN TO HOMEPAGE",
  iconSrc,
}) => {
  const [isMobile, setIsMobile] = useState(true);

  useEffect(() => {
    setIsMobile(detectMobileWidth());
  }, []);

  return (
    <div className={`${styles.error} fontBody`}>
      {iconSrc && <img src={iconSrc} alt="" />}
      <h3 className={`${styles.heading} fontHeader`}>{title}</h3>
      {description && (
        <div
          className={`${styles.description} ${isMobile ? styles.b2 : styles.b1}`}
        >
          <p>{description}</p>
        </div>
      )}
      <FDKLink
        to={btnLink}
        className={`${styles.button} ${styles["btn-secondary"]}`}
      >
        {btnTitle}
      </FDKLink>
    </div>
  );
};

export default EmptyState;
