/**
 * Renders a "Page Not Found" component with a customizable title and image.
 *
 * @param {Object} props - The properties object.
 * @param {string} props.title - The title to display on the "Page Not Found" page.
 * @param {string} [props.src] - The optional source URL for the image to display.
 *                               If not provided, a default image URL is used.
 * @returns {JSX.Element} A React component that displays a "Page Not Found" message with an image and a button to navigate back to the home page.
 */

import React from "react";
import * as styles from "./page-not-found.less";
import { FDKLink } from "fdk-core/components";

function PageNotFound({ title, src }) {
  return (
    <div className={styles.emptyContainer}>
      <div className={styles.emptyState}>
        <img
          src={
            src ??
            "https://cdn.pixelbin.io/v2/falling-surf-7c8bb8/fyprod/wrkr/company/884/applications/000000000000000000000004/theme/pictures/free/original/empty-state.dad8145f254f744108af946933831880.png"
          }
          alt=""
        />
        <div className={styles.noItems}>
          <p className={styles.title}>{title}</p>
        </div>
        <FDKLink to={"/"} className={styles.btnLink}>
          <button className={styles.backBtn}>
            <span> Go to Home</span>
          </button>
        </FDKLink>
      </div>
    </div>
  );
}
PageNotFound.defaultProps = {
  title: "Page Not Found",
};

export default PageNotFound;
