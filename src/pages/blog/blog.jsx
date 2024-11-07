import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
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
import Loader from "../../components/loader/loader";

import {
  isRunningOnClient,
  throttle,
  convertUTCDateToLocalDate,
} from "../../helper/utils";

function MemoizedSlide({ blog, index, sliderProps }) {
  const getFormattedDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return isRunningOnClient()
      ? convertUTCDateToLocalDate(dateString, options)
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
        <h1 className={`${styles.blogItem__title}`}>{blog?.title}</h1>
        {blog?.summary && (
          <p className={`${styles.blogItem__content}`}>{blog?.summary}</p>
        )}
        <FDKLink
          className={`${styles.blogItem__button} ${styles.btnPrimary}`}
          title={blog?.title}
          to={`/blog/${blog?.slug}`}
        >
          {sliderProps?.btn_text}
        </FDKLink>
      </div>
      <FyImage
        customClass={styles.blogItem__image}
        src={blog?.feature_image?.secure_url || sliderProps?.fallback_image}
        isFixedAspectRatio={false}
        defer={false}
        alt={`slide-${index}`}
        showSkeleton={false}
        isImageFill
      />
    </div>
  );
}

function BlogList({
  blogs,
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
  const navigate = useNavigate();
  const location = useLocation();
  const [blogFilter, setBlogFilter] = useState(ssrFilters || []);
  const [searchText, setSearchText] = useState(ssrSearch || "");
  const [blogCount, setBlogCount] = useState(
    sliderBlogs?.page?.item_total || 0
  );
  const [windowWidth, setWindowWidth] = useState(0);
  const [config, setConfig] = useState({
    dots: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    swipeToSlide: true,
    autoplay: false,
    pauseOnHover: true,
    cssEase: "linear",
    arrows: false,
    nextArrow: <SvgWrapper svgSrc="arrow-right" />,
    prevArrow: <SvgWrapper svgSrc="arrow-left" />,
    infinite: sliderBlogs?.tems?.length > 1,
  });

  useEffect(() => {
    setBlogCount(sliderBlogs?.page?.item_total);
    setConfig((prevConfig) => ({
      ...prevConfig,
      infinite: sliderBlogs?.items?.length > 1,
    }));
  }, [sliderBlogs]);

  useEffect(() => {
    if (sliderProps?.autoplay) {
      setConfig((prevConfig) => ({
        ...prevConfig,
        autoplay: sliderProps.autoplay,
        speed: sliderProps.slide_interval * 100,
      }));
    }
  }, [sliderProps?.autoplay]);

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
      ? convertUTCDateToLocalDate(dateString, options)
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
      title?.length > 50 ? `${title.slice(0, 50).trim()}...` : title;
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
  const tagsList = () => {
    if (sliderProps?.show_tags) {
      return (blogs?.filters?.tags || [])?.reduce((tagObj, tag) => {
        tag = tag?.trim();
        if (tag) {
          const tagKey = tag?.replace(/ /g, "_")?.toLowerCase();
          tagObj[tagKey] = {
            key: tagKey,
            display: tag,
            // isSelected: false,
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

  const isSidebarDisplayed = () => {
    return sliderProps?.show_recent_blog || sliderProps?.show_top_blog;
  };

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
    return (
      <div className={styles.loader}>
        <Loader
          containerClassName={styles.loaderContainer}
          loaderClassName={styles.customLoader}
        />
      </div>
    );
  }

  return (
    <div>
      <div className={styles.blogContainer}>
        {blogFilter?.length === 0 && blogs?.page?.item_total === 0 && (
          <EmptyState title="No blogs found"></EmptyState>
        )}
        {sliderProps?.show_blog_slide_show && (
          <div className={styles.sliderWrapper}>
            <Slider
              {...config}
              initialSlide={0}
              className={
                sliderBlogs?.length <= 3 || windowWidth <= 480 ? "no-nav" : ""
              }
            >
              {sliderBlogs?.items?.map((blog, index) => (
                <MemoizedSlide
                  key={index}
                  blog={blog}
                  index={index}
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
                <span>Showing {blogs?.page?.item_total} results of </span>
              )}
              {blogCount > 0 && (
                <>
                  <span>{blogCount}</span> items
                </>
              )}
            </div>
            {blogFilter?.length > 0 && (
              <span className={`${styles.resetBtn}`} onClick={resetFilters}>
                Reset All
              </span>
            )}
          </div>

          <div className={`${styles.filterWrapper__content}`}>
            <div className={`${styles.tagList}`}>
              {blogs &&
                Object.values(tagsList())?.map((tag, index) => (
                  <button
                    key={index}
                    type="button"
                    className={`${styles.tagBtn} ${blogFilter?.some((item) => item.key === tag?.key) ? `${styles.tagBtnSelected}` : ""}`}
                    onClick={() => toggleTagFilter(tag)}
                  >
                    {tag.display}
                  </button>
                ))}
            </div>
            {sliderProps?.show_search && (
              <div className={`${styles.blogSearch}`}>
                <input
                  type="text"
                  className={`${styles.blogSearch__input}`}
                  placeholder="Search here..."
                  maxLength="80"
                  value={searchText}
                  onChange={(e) => searchTextUpdate(e?.target?.value)}
                />
              </div>
            )}
          </div>
        </div>
        <div
          className={`${styles.blog__content} ${!isSidebarDisplayed() ? `${styles.blog__contentFull}` : ""}`}
        >
          <div className={`${styles.blog__contentLeft}`}>
            <div className={`${styles.filterList}`}>
              {sliderProps?.show_filters && blogFilter?.length > 0 && (
                <div>Filtering by:</div>
              )}
              {sliderProps?.show_filters &&
                [...blogFilter].map((filter, index) => (
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
              <EmptyState title="No blogs found"></EmptyState>
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
            {sliderProps?.loadingOption === "pagination" && (
              <div className={styles.paginationWrapper}>
                <Pagination {...paginationProps} />
              </div>
            )}
          </div>
          {isSidebarDisplayed() && (
            <div className={`${styles.blog__contentRight}`}>
              <BlogTabs {...sliderProps}></BlogTabs>
            </div>
          )}
        </div>
      </div>
      <BlogFooter {...footerProps}></BlogFooter>
    </div>
  );
}

export default BlogList;
