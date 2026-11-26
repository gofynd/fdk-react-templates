/**
 * BlogPage component is responsible for rendering the blog page with details, social links, and a sidebar if applicable.
 * It fetches blog details if they are not already available and displays a loader while the data is being fetched.
 *
 * @param {Object} props - The properties passed to the component.
 * @param {Object} props.contactInfo - Contains contact information including social links.
 * @param {Object} props.blogDetails - Details of the blog to be displayed.
 * @param {Object} props.sliderProps - Properties for the slider, determining if recent or top blogs should be shown.
 * @param {Object} props.footerProps - Properties for the footer section.
 * @param {Function} props.getBlog - Function to fetch blog details using a slug.
 * @param {boolean} props.isBlogDetailsLoading - Indicates if the blog details are currently being loaded.
 *
 * @returns {JSX.Element} The rendered blog page component.
 */

import React, { useEffect, useRef, useMemo } from "react";
import { useParams } from "react-router-dom";
import { FDKLink } from "fdk-core/components";
import * as styles from "./blog-page.less";
import SvgWrapper from "../../components/core/svgWrapper/SvgWrapper";
import FyImage from "../core/fy-image/fy-image";
import HTMLContent from "../core/html-content/html-content";
import BlogTabs from "../blog-tabs/blog-tabs";
import BlogFooter from "../blog-footer/blog-footer";
import { convertUTCDateToLocalDate, formatLocale, isRunningOnClient } from "../../helper/utils";
import { useLocation } from "react-router-dom";
import {
  useGlobalStore,
  useFPI,
  useGlobalTranslation
} from "fdk-core/utils";
import Shimmer from "../shimmer/shimmer";

function BlogPage({
  contactInfo,
  blogDetails,
  sliderProps,
  footerProps,
  getBlog,
  isBlogDetailsLoading,
  SocailMedia = () => {},
}) {
  const { t } = useGlobalTranslation("translation");
  const fpi = useFPI();
  const i18nDetails = useGlobalStore(fpi?.getters?.i18N_DETAILS) || {};
  const locale = i18nDetails?.language?.locale || "en";
  const countryCode = i18nDetails?.countryCode || "IN";
  const params = useParams();
  const location = useLocation();
  useEffect(() => {
    if (!blogDetails) {
      const searchParams = new URLSearchParams(location.search);
      const previewFlag = searchParams.get("__preview"); // Extract __preview if exists

      getBlog(params?.slug, previewFlag ? true : false);
    }
  }, [params?.slug, location?.search]);

  const containerRef = useRef(null);

  useEffect(() => {
    if (isRunningOnClient()) {
      setTimeout(() => {
        if (window.instgrm) {
          window.instgrm.Embeds.process(); // Process all embeds
        } else {
          const script = document.createElement("script");
          script.src = "https://www.instagram.com/embed.js";
          script.async = true;
          script.onload = () => {
            if (containerRef.current) {
              window.instgrm.Embeds.process(containerRef.current);
            }
          };
          document.body.appendChild(script);
        }
      }, 0);
    }
  }, [blogDetails?.content?.[0]?.value]);

  const socialLinks = useMemo(() => {
    const socialLinksObj = contactInfo?.social_links || {};
    return Object.entries(socialLinksObj).reduce((acc, [key, value]) => {
      if (value?.link) {
        acc.push({
          ...value,
          key,
          icon: key && typeof key === "string" ? `blog-${key}` : "",
        });
      }
      return acc;
    }, []);
  }, [contactInfo]);

  const getFormattedDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return convertUTCDateToLocalDate(dateString, options, formatLocale(locale, countryCode));
  };

  const {
    show_top_blog,
    topViewedBlogs = [],
    show_recent_blog,
    recentBlogs = [],
  } = sliderProps;

  const isSidebarDisplayed = useMemo(
    () =>
      (show_top_blog && topViewedBlogs?.length) ||
      (show_recent_blog && recentBlogs?.length),
    [show_top_blog, topViewedBlogs, show_recent_blog, recentBlogs]
  );

  const blogTag = () => {
    if (
      blogDetails?.tags?.[0] &&
      blogDetails?.tags?.[0]?.toLowerCase() !== "top5"
    ) {
      return blogDetails?.tags?.[0];
    }
    return blogDetails?.tags?.[1] || "";
  };

  if (isBlogDetailsLoading) {
    return <Shimmer />;
  }

  return (
    <>
      <div
        className={`${styles.blogContainer} ${!isSidebarDisplayed ? `${styles.blog__contentFull}` : ""}`}
      >
        <div className={`${styles.leftCol} ${styles.blogPost}`}>
          <div className={`${styles.blogPost__header}`}>
            <div className={`${styles.breadcrumb}`}>
              <FDKLink to="/">
                <span className={`${styles.breadcrumb__label}`}>{t("resource.common.breadcrumb.home")}</span>
              </FDKLink>
              <SvgWrapper
                className={`${styles.breadcrumb__icon}`}
                svgSrc="breadcrumb-angle"
              />
              <FDKLink to="/blog">
                <span className={`${styles.breadcrumb__label}`}>{t("resource.common.breadcrumb.blog")}</span>
              </FDKLink>
              <SvgWrapper
                className={`${styles.breadcrumb__icon}`}
                svgSrc="breadcrumb-angle"
              />
              <span className={`${styles.breadcrumb__label}`}>
                {blogDetails?.slug?.replace(/-/g, " ")}
              </span>
            </div>
            {blogTag() && (
              <div className={`${styles.blogPost__tag}`}>{blogTag()}</div>
            )}
            <h1 className={`${styles.blogPost__heading}`}>
              {blogDetails?.title}
            </h1>
            <div className={`${styles.blogPost__meta}`}>
              <div>
                <div className={`${styles.author}`}>
                  <span className={`${styles.author__label}`}>{t("resource.common.by")} </span>
                  <span className={`${styles.author__label}`}>
                    {blogDetails?.author?.name}
                  </span>
                </div>
                <div className={`${styles.publishDate}`}>
                  <span className={`${styles.publishDate__label}`}>
                    {t("resource.blog.published")}{" "}
                  </span>
                  <span className={`${styles.publishDate__label}`}>
                    {getFormattedDate(blogDetails?.publish_date)}
                  </span>
                </div>
              </div>
              {socialLinks?.length > 0 && (
                <div className={`${styles.social}`}>
                  <div className={`${styles.social__label}`}>{t("resource.blog.follow_us")}</div>
                  <SocailMedia social_links={contactInfo?.social_links} />
                </div>
              )}
            </div>
          </div>
          {(!!blogDetails?.feature_image?.secure_url ||
            !!sliderProps?.fallback_image) && (
            <div className={`${styles.blogPost__image}`}>
              <FyImage
                key={blogDetails?.slug}
                customClass={`${styles.blogPost__image}`}
                src={
                  blogDetails?.feature_image?.secure_url ||
                  sliderProps?.fallback_image
                }
                alt={blogDetails?.title}
                placeholder={sliderProps?.fallback_image}
                isFixedAspectRatio={false}
                defer={false}
              />
            </div>
          )}
          <div className={`${styles.blogPost__content}`}>
            {blogDetails?.content && (
              <HTMLContent
                ref={containerRef}
                key="html"
                content={blogDetails?.content?.[0]?.value}
              />
            )}
          </div>
        </div >
        <BlogTabs className={`${styles.rightCol}`} {...sliderProps}></BlogTabs>
      </div >
      <BlogFooter {...footerProps}></BlogFooter>
    </>
  );
}

export default BlogPage;
