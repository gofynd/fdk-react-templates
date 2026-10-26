import React, { useState } from "react";
import SvgWrapper from "../core/svgWrapper/SvgWrapper";
import * as styles from "./accordion.less";
import { useViewport } from "../../helper/hooks";

const Accordion = ({ items, onItemClick }) => {
  const [activeIndex, setActiveIndex] = useState("");
  const isTablet = useViewport(0, 768);

  const ImagePreview = ({ data }) => {
    return (
      <>
        {(activeIndex === data?.imgIndex || !isTablet) && (
          <div className={styles.imagePreview}>
            <img
              src={data?.img}
              loading="lazy"
              alt={data?.alt}
              className={styles.largePreviewImg}
            />
          </div>
        )}
      </>
    );
  };
  return (
    <div className={styles.accordionList}>
      <ul>
        {items?.map((item, index) => (
          <li
            className={styles.accordionItem}
            key={index}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onItemClick(index);
              setActiveIndex("");
            }}
            onMouseDown={(e) => { 
              e.preventDefault();
              e.stopPropagation();
            }}
          >
            <div className={styles.accordionRow}>
              <div className={styles.accordionBox}>
                <span className={styles.accordionTitle}>{item.title}</span>
                {item.open && (
                  <div className={styles.accordionContent}>
                    {Array.isArray(item.content) ? (
                      <ul className={styles.accordionContentList}>
                        {item.content.map((content, i) => {
                          if (content.type === "image") {
                            return (
                              <li
                                key={content.key || i}
                                className={styles.accordionContentRow}
                              >
                                <span className={styles.accordionContentInner}>
                                  <span className={styles.accordionContentKey}>
                                    {content.key && (
                                      <span>{content.key}: </span>
                                    )}
                                  </span>
                                  {Array.isArray(content.value) ? (
                                    // Multiple images
                                    <div
                                      className={styles.accordionContentImages}
                                    >
                                      {content.value.map(
                                        (imageObj, imgIndex) => (
                                          <div
                                            key={imageObj.id || imgIndex}
                                            className={
                                              styles.accordionContentImageItem
                                            }
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              setActiveIndex((prev) =>
                                                prev !==
                                                `content-child-${imgIndex}`
                                                  ? `content-child-${imgIndex}`
                                                  : ""
                                              );
                                            }}
                                          >
                                            <img
                                              src={imageObj.imageUrl}
                                              alt={content.alt || content.key}
                                              className={
                                                styles.accordionContentImg
                                              }
                                            />
                                            {typeof imageObj.itemCount !== "undefined" && (
                                              <span className={styles.itemCount}>x {imageObj.itemCount}</span>
                                            )}
                                            <ImagePreview
                                              data={{
                                                img: imageObj.imageUrl,
                                                alt: content.alt || content.key,
                                                imgIndex: `content-child-${imgIndex}`,
                                              }}
                                            />
                                          </div>
                                        )
                                      )}
                                    </div>
                                  ) : (
                                    // Single image
                                    <div
                                      className={
                                        styles.accordionContentImageItem
                                      }
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setActiveIndex((prev) =>
                                          prev !== `content-${i}`
                                            ? `content-${i}`
                                            : ""
                                        );
                                        // setShowPreview((prev) => !prev);
                                      }}
                                    >
                                      <img
                                        src={content.value}
                                        alt={content.alt || content.key}
                                        className={styles.accordionContentImg}
                                      />
                                      <ImagePreview
                                        data={{
                                          img: content.value,
                                          alt: content.alt || content.key,
                                          imgIndex: `content-${i}`,
                                        }}
                                      />
                                    </div>
                                  )}
                                </span>
                              </li>
                            );
                          } else if (content.children) {
                            // Bullet-point rendering: content.children from chip-item
                            const filteredChildren = content.children.filter(
                              (child) => child.key?.toLowerCase() !== "price"
                            );
                            if (filteredChildren.length === 0) return null;
                            return (
                              <li
                                key={content.key || i}
                                className={styles.accordionContentRow}
                              >
                                <span
                                  className={styles.accordionContentLabel}
                                >
                                  {content.key}
                                </span>
                                <ul className={styles.accordionContentSublist}>
                                  {filteredChildren.map((child, j) => {
                                    const val = child.value;
                                    const isImageObj =
                                      val &&
                                      typeof val === "object" &&
                                      !Array.isArray(val) &&
                                      "imageUrl" in val;
                                    const isImageArray =
                                      Array.isArray(val) &&
                                      val.length > 0 &&
                                      val[0] &&
                                      typeof val[0] === "object" &&
                                      "imageUrl" in val[0];
                                    return (
                                      <li
                                        key={child.key || j}
                                        className={
                                          styles.accordionContentSubrow
                                        }
                                      >
                                        <span
                                          className={
                                            styles.accordionContentKey
                                          }
                                        >
                                          {child.key}:{" "}
                                        </span>
                                        <span
                                          className={
                                            styles.accordionContentValue
                                          }
                                        >
                                          {isImageArray ? (
                                            <div
                                              className={
                                                styles.accordionContentImages
                                              }
                                            >
                                              {val.map(
                                                (imageObj, imgIndex) => (
                                                  <div
                                                    key={
                                                      imageObj.id || imgIndex
                                                    }
                                                    className={
                                                      styles.accordionContentImageItem
                                                    }
                                                    onClick={(e) => {
                                                      e.stopPropagation();
                                                      setActiveIndex((prev) =>
                                                        prev !==
                                                        `content-child-${j}-${imgIndex}`
                                                          ? `content-child-${j}-${imgIndex}`
                                                          : ""
                                                      );
                                                    }}
                                                  >
                                                    <img
                                                      src={
                                                        imageObj.imageUrl
                                                      }
                                                      alt={
                                                        child.key ||
                                                        "Customization"
                                                      }
                                                      className={
                                                        styles.accordionContentImg
                                                      }
                                                    />
                                                    {typeof imageObj.itemCount !==
                                                      "undefined" && (
                                                      <span
                                                        className={
                                                          styles.itemCount
                                                        }
                                                      >
                                                        x {imageObj.itemCount}
                                                      </span>
                                                    )}
                                                    <ImagePreview
                                                      data={{
                                                        img: imageObj.imageUrl,
                                                        alt:
                                                          child.key ||
                                                          "Customization",
                                                        imgIndex: `content-child-${j}-${imgIndex}`,
                                                      }}
                                                    />
                                                  </div>
                                                )
                                              )}
                                            </div>
                                          ) : isImageObj ? (
                                            <div
                                              className={
                                                styles.accordionContentImageItem
                                              }
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                setActiveIndex((prev) =>
                                                  prev !== `content-child-${j}`
                                                    ? `content-child-${j}`
                                                    : ""
                                                );
                                              }}
                                            >
                                              <img
                                                src={val.imageUrl}
                                                alt={
                                                  child.key || "Customization"
                                                }
                                                className={
                                                  styles.accordionContentImg
                                                }
                                              />
                                              {typeof val.itemCount !==
                                                "undefined" && (
                                                <span
                                                  className={
                                                    styles.itemCount
                                                  }
                                                >
                                                  x {val.itemCount}
                                                </span>
                                              )}
                                              <ImagePreview
                                                data={{
                                                  img: val.imageUrl,
                                                  alt: child.key || "Customization",
                                                  imgIndex: `content-child-${j}`,
                                                }}
                                              />
                                            </div>
                                          ) : (
                                            val
                                          )}
                                        </span>
                                      </li>
                                    );
                                  })}
                                </ul>
                              </li>
                            );
                          } else {
                            if (content.key?.toLowerCase() === "price") return null;
                            return (
                              <li
                                key={content.key || i}
                                className={styles.accordionContentRow}
                              >
                                <span className={styles.accordionContentInner}>
                                  {content.key && (
                                    <span
                                      className={styles.accordionContentKey}
                                    >
                                      {content.key}:{" "}
                                    </span>
                                  )}
                                  <span
                                    className={styles.accordionContentValue}
                                  >
                                    {content.value}
                                  </span>
                                </span>
                              </li>
                            );
                          }
                        })}
                      </ul>
                    ) : (
                      item.content
                    )}
                  </div>
                )}
              </div>
              <SvgWrapper
                className={item.open && styles.filterArrowUp}
                svgSrc="arrowDropdownBlack"
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Accordion;
