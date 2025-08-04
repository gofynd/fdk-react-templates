import React, { useState, useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";
import Slider from "react-slick";
import { FDKLink } from "fdk-core/components";
import * as styles from "./blog.less";
import SvgWrapper from "../../components/core/svgWrapper/SvgWrapper";
import FyImage from "../../components/core/fy-image/fy-image";
import BlogTabs from "../../components/blog-tabs/blog-tabs";
import BlogFooter from "../../components/blog-footer/blog-footer";
import EmptyState from "../../components/empty-state/empty-state";
import InfiniteLoader from "../../components/core/infinite-loader/infinite-loader";
import Pagination from "../../page-layouts/plp/Components/pagination/pagination";
import {
  useNavigate,
  useGlobalStore,
  useFPI,
  useGlobalTranslation,
} from "fdk-core/utils";

import {
  isRunningOnClient,
  throttle,
  convertUTCDateToLocalDate,
  formatLocale,
  translateDynamicLabel,
} from "../../helper/utils";
import Shimmer from "../../components/shimmer/shimmer";
import {
  SliderNextArrow,
  SliderPrevArrow,
} from "../../components/slider-arrow/slider-arrow";

function MemoizedSlide({ blog, index, sliderProps, getBlogTitle }) {
  const { t } = useGlobalTranslation("translation");
  const fpi = useFPI();
  const i18nDetails = useGlobalStore(fpi?.getters?.i18N_DETAILS) || {};
  const locale = i18nDetails?.language?.locale || "en";
  const countryCode = i18nDetails?.countryCode || "IN";
  const getFormattedDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return isRunningOnClient()
      ? convertUTCDateToLocalDate(
          dateString,
          options,
          formatLocale(locale, countryCode, true)
        )
      : "";
  };
  const getBlogTag = (tags) => {
    if (tags?.[0] && tags?.[0]?.toLowerCase() !== "top5") {
      return tags?.[0];
    }
    return tags?.[1] || "";
  };

  return (
    <div className={styles.blogItem}>
      <div className={`${styles.blogItem__info}`}>
        <div className={`${styles.blogItem__meta}`}>
          {getBlogTag(blog?.tags) && (
            <span className={`${styles.blogItem__tag}`}>
              {getBlogTag(blog?.tags)}
            </span>
          )}
          {getBlogTag(blog?.tags) && getFormattedDate(blog?.publish_date) && (
            <span className={`${styles.divider}`}>|</span>
          )}
          <span className={`${styles.blogItem__publishDate}`}>
            {getFormattedDate(blog?.publish_date)}
          </span>
        </div>
        <h1 className={`${styles.blogItem__title} ${styles.titleMobile}`}>
          {getBlogTitle(blog?.title)}
        </h1>
        <h1 className={`${styles.blogItem__title} ${styles.titleDesktop}`}>
          {blog?.title}
        </h1>
        {blog?.summary && (
          <p className={`${styles.blogItem__content}`}>{blog?.summary}</p>
        )}
        <FDKLink
          className={`${styles.blogItem__button} ${styles.btnPrimary}`}
          title={blog?.title}
          to={`/blog/${blog?.slug}`}
        >
          {translateDynamicLabel(sliderProps?.btn_text, t)}
        </FDKLink>
      </div>
      <FyImage
        customClass={styles.blogItem__image}
        src={blog?.feature_image?.secure_url || sliderProps?.fallback_image}
        isFixedAspectRatio={false}
        defer={false}
        alt={`${t("resource.blog.slide_alt")}-${index}`}
        showSkeleton={false}
        isImageFill
      />
    </div>
  );
}

function BlogList({
  blogs,
  totalBlogsList,
  sliderBlogs,
  footerProps,
  sliderProps,
  paginationProps,
  onLoadMoreProducts,
  isLoading,
  isBlogPageLoading,
  ssrSearch,
  ssrFilters,
}) {
  const { t } = useGlobalTranslation("translation");
  const fpi = useFPI();
  const i18nDetails = useGlobalStore(fpi?.getters?.i18N_DETAILS) || {};
  const locale = i18nDetails?.language?.locale || "en";
  const countryCode = i18nDetails?.countryCode || "IN";
  const navigate = useNavigate();
  const location = useLocation();
  const [blogFilter, setBlogFilter] = useState(ssrFilters || []);
  const [searchText, setSearchText] = useState(ssrSearch || "");
  const [blogCount, setBlogCount] = useState(
    totalBlogsList?.page?.item_total || 0
  );
  const {
    show_top_blog,
    topViewedBlogs = [],
    show_recent_blog,
    recentBlogs = [],
  } = sliderProps;

  const showRecentBlog =
    typeof show_recent_blog === "boolean" || show_recent_blog === ""
      ? show_recent_blog
      : true;
  const showTopBlogs =
    typeof show_top_blog === "boolean" || show_top_blog === ""
      ? show_top_blog
      : true;
  const [windowWidth, setWindowWidth] = useState(0);
  const [config, setConfig] = useState({
    dots: false,
    speed: Number(sliderProps?.slide_interval * 1000),
    slidesToShow: 1,
    slidesToScroll: 1,
    swipeToSlide: false,
    autoplay: sliderProps?.autoplay,
    pauseOnHover: true,
    cssEase: "linear",
    centerPadding: "75px",
    arrows: !sliderProps?.autoplay,
    nextArrow: <SliderNextArrow />,
    prevArrow: <SliderPrevArrow />,
    infinite: sliderBlogs?.tems?.length > 1,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          arrows: false,
          centerPadding: "32px",
        },
      },
      {
        breakpoint: 480,
        settings: {
          arrows: false,
          centerPadding: "20px",
        },
      },
    ],
  });

  useEffect(() => {
    setConfig((prevConfig) => ({
      ...prevConfig,
      infinite: sliderBlogs?.items?.length > 1,
    }));
  }, [sliderBlogs]);

  useEffect(() => {
    setBlogCount(totalBlogsList?.page?.item_total);
  }, [totalBlogsList]);

  useEffect(() => {
    if (sliderProps?.autoplay) {
      setConfig((prevConfig) => ({
        ...prevConfig,
        autoplay: sliderProps.autoplay,
        speed: Number(sliderProps.slide_interval * 1000),
      }));
    }
  }, [sliderProps.autoplay, sliderProps.slide_interval]);

  useEffect(() => {
    const handleResize = throttle(() => {
      setWindowWidth(isRunningOnClient() ? window.innerWidth : 0);
    }, 500);

    if (isRunningOnClient()) {
      window.addEventListener("resize", handleResize);
      handleResize();
    }

    return () => {
      if (isRunningOnClient()) {
        window.removeEventListener("resize", handleResize);
      }
    };
  }, []);

  useEffect(() => {
    const searchParams = isRunningOnClient()
      ? new URLSearchParams(location?.search)
      : null;
    const search = searchParams?.get("search");
    setSearchText(search || "");

    const tagBlogFilters = searchParams?.getAll("tag")?.map((item) => ({
      display: item,
      pretext: "tag",
      key: item?.toLowerCase(),
    }));

    setBlogFilter([
      ...(tagBlogFilters || []),
      ...(search
        ? [
            {
              display: search,
              pretext: "text",
              key: "search_text",
            },
          ]
        : []),
    ]);
  }, [location?.search]);

  const removeFilter = (filter) => {
    const searchParams = isRunningOnClient()
      ? new URLSearchParams(location?.search)
      : null;
    searchParams?.delete("page_no");
    if (filter.key === "search_text") {
      searchParams?.delete("search", filter?.display);
      setSearchText("");
    } else {
      searchParams?.delete(filter?.pretext, filter?.display);
    }
    navigate?.({
      pathname: location?.pathname,
      search: searchParams?.toString(),
    });
  };
  const searchTextUpdate = (value) => {
    if (value.length > 90) {
      value = value.substring(0, 80);
    }
    setSearchText(value);

    const searchParams = isRunningOnClient()
      ? new URLSearchParams(location?.search)
      : null;
    searchParams?.delete("page_no");
    if (value) {
      searchParams?.set("search", value);
    } else {
      searchParams?.delete("search");
    }
    navigate?.({
      pathname: location?.pathname,
      search: searchParams?.toString(),
    });
  };
  const resetFilters = () => {
    setSearchText("");
    navigate?.({
      pathname: location?.pathname,
    });
  };

  const getFormattedDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return isRunningOnClient()
      ? convertUTCDateToLocalDate(
          dateString,
          options,
          formatLocale(locale, countryCode, true)
        )
      : "";
  };
  const getBlogTag = (tags) => {
    if (tags?.[0] && tags?.[0]?.toLowerCase() !== "top5") {
      return tags?.[0];
    }
    return tags?.[1] || "";
  };
  const escapeRegExp = (str) => str.replace(/([.?*+^$[\]\\(){}|-])/g, "\\$1");
  const getBlogTitle = (title) => {
    const blogTitle =
      title?.length > 45 ? `${title.slice(0, 45).trim()}...` : title;
    const pattern = new RegExp(`(${escapeRegExp(searchText)})`, "i");

    if (searchText) {
      return title.split(pattern).map((alphabet, index) =>
        pattern.test(alphabet) ? (
          <span className={`${styles.blog__highlight}`} key={index}>
            {alphabet}
          </span>
        ) : (
          alphabet
        )
      );
    }
    return blogTitle;
  };
  const showTags =
    typeof sliderProps?.show_tags === "boolean" || sliderProps?.show_tags === ""
      ? sliderProps?.show_tags
      : true;
  const tagsList = () => {
    if (showTags) {
      return (blogs?.filters?.tags || [])?.reduce((tagObj, tag) => {
        tag = tag?.trim();
        if (tag) {
          const tagKey = tag?.replace(/ /g, "_")?.toLowerCase();
          tagObj[tagKey] = {
            key: tagKey,
            display: tag,
            pretext: "tag",
          };
        }
        return tagObj;
      }, {});
    }
    return {};
  };
  const toggleTagFilter = (tag) => {
    const searchParams = isRunningOnClient()
      ? new URLSearchParams(location?.search)
      : null;
    searchParams?.delete("page_no");
    if (searchParams?.has(tag?.pretext, tag?.display)) {
      searchParams?.delete(tag?.pretext, tag?.display);
    } else {
      searchParams?.append(tag?.pretext, tag?.display);
    }

    navigate?.({
      pathname: location?.pathname,
      search: searchParams?.toString(),
    });
  };

  const isSidebarDisplayed = useMemo(
    () =>
      (showTopBlogs && topViewedBlogs?.length) ||
      (showRecentBlog && recentBlogs?.length),
    [showTopBlogs, topViewedBlogs, showRecentBlog, recentBlogs]
  );

  const renderBlogs = () => {
    return (
      <>
        {blogs?.items?.map((blog, index) => (
          <FDKLink
            key={`${blog.title}_${index}`}
            to={`/blog/${blog.slug}`}
            title={blog.title}
          >
            <div className={`${styles.blog}`}>
              <FyImage
                src={
                  blog?.feature_image?.secure_url || sliderProps?.fallback_image
                }
                alt={blog.title}
                placeholder={sliderProps?.fallback_image}
                customClass={styles.blog__image}
                isImageFill
                isFixedAspectRatio={false}
                defer={false}
              />
              <div className={`${styles.blog__info}`}>
                <div className={`${styles.blog__meta}`}>
                  <span className={`${styles.blog__tag}`}>
                    {getBlogTag(blog?.tags)}
                  </span>
                  <span className={`${styles.blog__publishDate}`}>
                    {getFormattedDate(blog?.publish_date)}
                  </span>
                </div>
                <h2 className={`${styles.blog__title} ${styles.fontHeader}`}>
                  {getBlogTitle(blog?.title)}
                </h2>
              </div>
            </div>
          </FDKLink>
        ))}
      </>
    );
  };

  if (isBlogPageLoading) {
    return <Shimmer />;
  }
  const showBlogSlideShow =
    typeof sliderProps?.show_blog_slide_show === "boolean" ||
    sliderProps?.show_blog_slide_show === ""
      ? sliderProps?.show_blog_slide_show
      : true;
  const showSearch =
    typeof sliderProps?.show_search === "boolean" ||
    sliderProps?.show_search === ""
      ? sliderProps?.show_search
      : true;
  const showFilters =
    typeof sliderProps?.show_filters === "boolean" ||
    sliderProps?.show_filters === ""
      ? sliderProps?.show_filters
      : true;
  return (
    <div>
      <div className={styles.blogContainer}>
        {blogFilter?.length === 0 && blogs?.page?.item_total === 0 && (
          <EmptyState title={t("resource.blog.no_blogs_found")}></EmptyState>
        )}
        {showBlogSlideShow && (
          <div className={styles.sliderWrapper}>
            <Slider
              {...config}
              initialSlide={0}
              className={`${styles.hideOnMobile}
                ${sliderBlogs?.length <= 3 || windowWidth <= 480 ? "no-nav" : ""}
              `}
            >
              {sliderBlogs?.items?.map((blog, index) => (
                <MemoizedSlide
                  key={index}
                  blog={blog}
                  index={index}
                  getBlogTitle={getBlogTitle}
                  sliderProps={sliderProps}
                />
              ))}
            </Slider>
            <Slider
              {...config}
              initialSlide={0}
              className={`${styles.hideOnDesktop}
                ${sliderBlogs?.length <= 3 || windowWidth <= 480 ? "no-nav" : ""}
              `}
            >
              {sliderBlogs?.items?.map((blog, index) => (
                <MemoizedSlide
                  key={index}
                  blog={blog}
                  index={index}
                  getBlogTitle={getBlogTitle}
                  sliderProps={sliderProps}
                />
              ))}
            </Slider>
          </div>
        )}
        <div className={styles.filterWrapper}>
          <div className={`${styles.filterWrapper__header}`}>
            <div>
              {blogFilter?.length > 0 && (
                <span>
                  {t("resource.blog.showing_results", {
                    count: blogs?.page?.item_total,
                  })}{" "}
                </span>
              )}
              {blogCount > 0 && (
                <>
                  <span>{blogCount}</span> {t("resource.common.items")}
                </>
              )}
            </div>

            <span className={`${styles.resetBtn}`} onClick={resetFilters}>
              {blogFilter?.length > 0 && t("resource.facets.reset_all")}
            </span>
          </div>

          <div className={`${styles.filterWrapper__content}`}>
            <div className={`${styles.tagList}`}>
              {blogs &&
                Object.values(tagsList())?.map((tag, index) => (
                  <button
                    key={index}
                    type="button"
                    className={`${styles.tagBtn} ${blogFilter?.some((item) => item.display === tag?.display) ? `${styles.tagBtnSelected}` : ""}`}
                    onClick={() => toggleTagFilter(tag)}
                  >
                    {tag.display}
                  </button>
                ))}
            </div>
            {showSearch && (
              <div className={`${styles.blogSearch}`}>
                <input
                  type="text"
                  className={`${styles.blogSearch__input}`}
                  placeholder={`${t("resource.common.search_here")}...`}
                  maxLength="80"
                  value={searchText}
                  onChange={(e) => searchTextUpdate(e?.target?.value)}
                />
              </div>
            )}
          </div>
        </div>
        <div
          className={`${styles.blog__content} ${!isSidebarDisplayed ? `${styles.blog__contentFull}` : ""}`}
        >
          <div className={`${styles.blog__contentLeft}`}>
            <div className={`${styles.filterList}`}>
              {showFilters && blogFilter?.length > 0 && (
                <div>{t("resource.facets.filtering_by")}:</div>
              )}
              {showFilters &&
                [...blogFilter].map((filter) => (
                  <div className={`${styles.filterItem}`} key={filter?.key}>
                    <span>{`${filter?.pretext}: ${filter?.display}`}</span>
                    <SvgWrapper
                      className={`${styles.filterItem__icon}`}
                      svgSrc="close"
                      onClick={() => removeFilter(filter)}
                    />
                  </div>
                ))}
            </div>

            {blogFilter?.length > 0 && blogs?.page?.item_total === 0 && (
              <EmptyState
                title={t("resource.blog.no_blogs_found")}
                customClassName={styles.emptyBlog}
              ></EmptyState>
            )}
            <div className={`${styles.blogContainer__grid}`}>
              {sliderProps?.loadingOption === "infinite" ? (
                <InfiniteLoader
                  hasNext={paginationProps?.hasNext}
                  isLoading={isLoading}
                  loadMore={onLoadMoreProducts}
                >
                  {renderBlogs()}
                </InfiniteLoader>
              ) : (
                renderBlogs()
              )}
            </div>
            {sliderProps?.loadingOption === "pagination" &&
              blogs?.page?.item_total !== 0 && (
                <div className={styles.paginationWrapper}>
                  <Pagination {...paginationProps} />
                </div>
              )}
          </div>
          <BlogTabs
            className={styles.blog__contentRight}
            {...sliderProps}
          ></BlogTabs>
        </div>
      </div>
      <BlogFooter {...footerProps}></BlogFooter>
    </div>
  );
}

export default BlogList;
