import React, { useCallback } from "react";
import { FDKLink } from "fdk-core/components";
import SvgWrapper from "../../../../components/core/svgWrapper/SvgWrapper";
import * as styles from "./pagination.less";

const Pagination = ({
  current = 1,
  hasPrevious = false,
  hasNext = true,
  pages = [],
  prevPageLink = "",
  nextPageLink = "",
}) => {
  // const getPageUrl = (pageNo) => {
  //   const searchParams = new URLSearchParams(location.search);
  //   searchParams.set("page_no", pageNo);
  //   return `${location.pathname}?${searchParams.toString()}`;
  // };

  // const getStartPage = () => {
  //   let startingPage = 1;
  //   const maxStartingPage = total - PAGES_TO_SHOW + PAGE_OFFSET + 1;

  //   if (current >= maxStartingPage) {
  //     startingPage =
  //       maxStartingPage - PAGE_OFFSET > 0 ? maxStartingPage - PAGE_OFFSET : 1;
  //   } else if (current > PAGE_OFFSET) {
  //     startingPage = current - PAGE_OFFSET;
  //   }
  //   return startingPage;
  // };

  // function getPagesButton() {
  //   if (total && current) {
  //     return total > PAGES_TO_SHOW ? PAGES_TO_SHOW : total;
  //   }
  // }

  const scrollToTop = useCallback(() => {
    if (window) {
      setTimeout(() => {
        window?.scrollTo({
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
        aria-label="prev"
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
            className={`${styles.pageBtn} ${
              current === page.index ? styles.active : ""
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
        aria-label="next"
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
