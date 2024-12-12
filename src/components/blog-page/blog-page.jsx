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
import Loader from "../../components/loader/loader";
import FyImage from "../core/fy-image/fy-image";
import HTMLContent from "../core/html-content/html-content";
import BlogTabs from "../blog-tabs/blog-tabs";
import BlogFooter from "../blog-footer/blog-footer";
import { convertUTCDateToLocalDate } from "../../helper/utils";

function BlogPage({
  contactInfo,
  blogDetails,
  sliderProps,
  footerProps,
  getBlog,
  isBlogDetailsLoading,
}) {
  const params = useParams();
  useEffect(() => {
    if (!blogDetails) {
      getBlog(params?.slug);
    }
  }, [params?.slug]);

  const containerRef = useRef(null);

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
    return convertUTCDateToLocalDate(dateString, options);
  };

  const isSidebarDisplayed = () => {
    return sliderProps?.show_recent_blog || sliderProps?.show_top_blog;
  };
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
    <>
      <div
        className={`${styles.blogContainer} ${!isSidebarDisplayed() ? `${styles.blog__contentFull}` : ""}`}
      >
        <div className={`${styles.leftCol} ${styles.blogPost}`}>
          <div className={`${styles.blogPost__header}`}>
            <div className={`${styles.breadcrumb}`}>
              <FDKLink to="/">
                <span className={`${styles.breadcrumb__label}`}>Home</span>
              </FDKLink>
              <SvgWrapper
                className={`${styles.breadcrumb__icon}`}
                svgSrc="breadcrumb-angle"
              />
              <FDKLink to="/blog">
                <span className={`${styles.breadcrumb__label}`}>Blog</span>
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
                  <span className={`${styles.author__label}`}>By </span>
                  <span className={`${styles.author__label}`}>
                    {blogDetails?.author?.name}
                  </span>
                </div>
                <div className={`${styles.publishDate}`}>
                  <span className={`${styles.publishDate__label}`}>
                    Published{" "}
                  </span>
                  <span className={`${styles.publishDate__label}`}>
                    {getFormattedDate(blogDetails?.publish_date)}
                  </span>
                </div>
              </div>
              {socialLinks?.length > 0 && (
                <div className={`${styles.social}`}>
                  <div className={`${styles.social__label}`}>Follow us </div>
                  {socialLinks?.map(({ link, title }, index) => (
                    <FDKLink
                      key={index}
                      to={link}
                      target="_blank"
                      title={title}
                      className={styles.social__link}
                    >
                      <SvgWrapper
                        className={styles.social__icon}
                        svgSrc={`socail-${title?.toLowerCase()}`}
                      />
                    </FDKLink>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className={`${styles.blogPost__image}`}>
            <FyImage
              key={blogDetails?.slug}
              customClass={`${styles.blogPost__image}`}
              src={
                blogDetails?.feature_image?.secure_url ||
                sliderProps?.fallbackImg
              }
              alt={blogDetails?.title}
              placeholder={sliderProps?.fallbackImg}
              isFixedAspectRatio={false}
            />
          </div>
          <div className={`${styles.blogPost__content}`}>
            {blogDetails?.content && (
              <HTMLContent
                ref={containerRef}
                key="html"
                content={blogDetails?.content?.[0]?.value}
              />
            )}
          </div>
        </div>
        {isSidebarDisplayed() && (
          <div className={`${styles.rightCol}`}>
            <BlogTabs {...sliderProps}></BlogTabs>
          </div>
        )}
      </div>
      <BlogFooter {...footerProps}></BlogFooter>
    </>
  );
}

export default BlogPage;
