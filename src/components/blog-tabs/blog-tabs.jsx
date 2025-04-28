/**
 * BlogTabs is a React functional component that renders a set of tabs for a blog interface.
 * It conditionally displays different sections based on the provided props.
 *
 * @param {Object} props - The properties object.
 * @param {boolean} props.show_recent_blog - Determines if the recent blog tab should be displayed.
 * @param {boolean} props.show_top_blog - Determines if the top blog tab should be displayed.
 * @param {string} [props.fallback_image=""] - A fallback image URL to be used if no image is provided.
 * @param {Array} [props.topViewedBlogs=[]] - An array of top viewed blog objects.
 * @param {Array} [props.recentBlogs=[]] - An array of recent blog objects.
 *
 * @returns {JSX.Element|null} A JSX element representing the blog tabs, or null if no tabs are to be shown.
 */

import React, { useState, useMemo } from "react";
import { FDKLink } from "fdk-core/components";
import * as styles from "./blog-tabs.less";
import FyImage from "../core/fy-image/fy-image";
import { useGlobalTranslation } from "fdk-core/utils";

function BlogTabs({
  className = "",
  show_top_blog,
  topViewedBlogs = [],
  show_recent_blog,
  recentBlogs = [],
  fallback_image = "",
}) {
  const [sideTab, setSideTab] = useState(0);
  const { t } = useGlobalTranslation("translation");

  const blogTabsList = useMemo(() => {
    let list = [];
    if (show_top_blog && topViewedBlogs?.length) {
      list.push({
        label: t("resource.blog.top_viewed"),
        list: topViewedBlogs,
      });
    }
    if (show_recent_blog && recentBlogs?.length) {
      list.push({
        label: t("resource.blog.recently_published"),
        list: recentBlogs,
      });
    }
    return list;
  }, [show_top_blog, topViewedBlogs, show_recent_blog, recentBlogs]);

  if (!blogTabsList.length) {
    return null;
  }

  return (
    <div className={`${styles.sideTabs} ${className}`}>
      <div className={`${styles.sideTabs__menu}`} role="tablist">
        {blogTabsList.map(({ label }, index) => (
          <button
            type="button"
            className={sideTab === index ? `${styles.active}` : ""}
            role="tab"
            onClick={() => setSideTab(index)}
          >
            <div>{label}</div>
          </button>
        ))}
      </div >

      <div className={`${styles.sideTabs__content}`}>
        {blogTabsList.map(
          ({ list }, index) =>
            sideTab === index && (
              <div role="tabpanel">
                <div className={`${styles.sideTabs__list}`} role="list">
                  {list.map((blog) => (
                    <div role="listitem" key={blog?.id}>
                      <FDKLink to={`/blog/${blog.slug}`} title={blog.title}>
                        <div className={`${styles.blogHorizontal}`}>
                          <FyImage
                            src={
                              blog?.feature_image?.secure_url || fallback_image
                            }
                            alt={blog.title}
                            sources={[{ width: 80 }]}
                            placeholder={fallback_image}
                            isFixedAspectRatio={false}
                            customClass={`${styles.blogHorizontal__image}`}
                            isImageFill={true}
                            isLazyLoaded={false}
                          />

                          <div className={`${styles.blogHorizontal}`}>
                            {blog.title}
                          </div>
                        </div>
                      </FDKLink>
                    </div>
                  ))}
                </div>
              </div>
            )
        )}
      </div>
    </div >
  );
}

export default BlogTabs;
