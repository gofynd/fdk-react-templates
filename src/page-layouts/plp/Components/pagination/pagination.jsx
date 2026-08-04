import React, { useCallback } from "react";
import { FDKLink } from "fdk-core/components";
import SvgWrapper from "../../../../components/core/svgWrapper/SvgWrapper";
import * as styles from "./pagination.less";
import { useGlobalTranslation } from "fdk-core/utils";

const Pagination = ({
  current = 1,
  hasPrevious = false,
  hasNext = true,
  pages = [],
  prevPageLink = "",
  nextPageLink = "",
}) => {
  const { t } = useGlobalTranslation("translation");
  const scrollToTop = useCallback(() => {
    if (window) {
      setTimeout(() => {
        window.scrollTo({
          top: 0,
          behavior: "auto",
        });
      }, 500);
    }
  }, []);

  return (
    <div className={styles.pagination}>
      <FDKLink
        className={`${!hasPrevious ? styles.disable : ""}`}
        to={prevPageLink}
        onClick={scrollToTop}
        aria-label={t("resource.facets.prev")}
      >
        <SvgWrapper
          className={`${styles.arrowIcon} ${styles.leftArrow}`}
          svgSrc="arrow-down"
        />
      </FDKLink>
      <div className={styles.pageContainer}>
        {pages.map((page) => (
          <FDKLink
            key={page.index}
            className={`${styles.pageBtn} ${current === page.index ? styles.active : ""
              }`}
            to={page.link}
            onClick={scrollToTop}
          >
            {page.index}
          </FDKLink>
        ))}
      </div>
      <FDKLink
        className={`${!hasNext ? styles.disable : ""}`}
        to={nextPageLink}
        aria-label={t("resource.facets.next")}
        onClick={scrollToTop}
      >
        <SvgWrapper
          className={`${styles.arrowIcon} ${styles.rightArrow}`}
          svgSrc="arrow-down"
        />
      </FDKLink>
    </div>
  );
};

export default Pagination;
