import React, { useState } from "react";
import { FDKLink } from "fdk-core/components";
import * as styles from "./blog-tabs.less";
import FyImage from "../core/fy-image/fy-image";

function BlogTabs({
  show_filters,
  show_recent_blog,
  show_search,
  show_tags,
  show_top_blog,
  fallback_image = "",
  topViewedBlogs = [],
  recentBlogs = [],
}) {
  const [sideTab, setSideTab] = useState(show_top_blog ? "tab1" : "");

  if (
    !show_filters &&
    !show_recent_blog &&
    !show_search &&
    !show_tags &&
    !show_top_blog
  ) {
    return null;
  }

  return (
    <div className={`${styles.sideTabs}`}>
      <div className={`${styles.sideTabs__menu}`} role="tablist">
        {show_top_blog && topViewedBlogs?.length > 0 && (
          <button
            type="button"
            className={sideTab === "tab1" ? `${styles.active}` : ""}
            role="tab"
            onClick={() => setSideTab("tab1")}
          >
            <div>Top viewed</div>
          </button>
        )}
        {show_recent_blog && recentBlogs?.length > 0 && (
          <button
            type="button"
            className={sideTab === "tab2" ? `${styles.active}` : ""}
            role="tab"
            onClick={() => setSideTab("tab2")}
          >
            <div>Recently Published</div>
          </button>
        )}
      </div>

      <div className={`${styles.sideTabs__content}`}>
        {show_top_blog && topViewedBlogs?.length > 0 && sideTab === "tab1" && (
          <div role="tabpanel">
            <div className={`${styles.sideTabs__list}`} role="list">
              {topViewedBlogs.map((blog, item) => (
                <div role="listitem" key={blog?.id}>
                  <FDKLink to={`/blog/${blog.slug}`} title={blog.title}>
                    <div className={`${styles.blogHorizontal}`}>
                      <FyImage
                        src={blog?.feature_image?.secure_url || fallback_image}
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
        )}
        {show_recent_blog && recentBlogs?.length > 0 && sideTab === "tab2" && (
          <div role="tabpanel">
            <div className={`${styles.sideTabs__list}`} role="list">
              {recentBlogs.map((blog, item) => (
                <div role="listitem" key={blog?.id}>
                  <FDKLink to={`/blog/${blog.slug}`} title={blog.title}>
                    <div className={`${styles.blogHorizontal}`}>
                      <FyImage
                        src={blog?.feature_image?.secure_url || fallback_image}
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
        )}
      </div>
    </div>
  );
}

export default BlogTabs;
