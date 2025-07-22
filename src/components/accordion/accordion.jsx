import React from "react";
import SvgWrapper from "../core/svgWrapper/SvgWrapper";
import * as styles from "./accordion.less";

const Accordion = ({ items, onItemClick }) => {
  return (
    <div className={styles.accordionList}>
      <ul>
        {items?.map((item, index) => (
          <li
            className={styles.accordionItem}
            key={index}
            onClick={() => onItemClick(index)}
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
                                          >
                                            <img
                                              src={imageObj.imageUrl}
                                              alt={content.alt || content.key}
                                              className={
                                                styles.accordionContentImg
                                              }
                                            />
                                          </div>
                                        )
                                      )}
                                    </div>
                                  ) : (
                                    // Single image
                                    <img
                                      src={content.value}
                                      alt={content.alt || content.key}
                                      className={styles.accordionContentImg}
                                    />
                                  )}
                                </span>
                              </li>
                            );
                          } else {
                            return (
                              <li
                                key={content.key || i}
                                className={styles.accordionContentRow}
                              >
                                <span className={styles.accordionContentInner}>
                                  {content.key && (
                                    <span className={styles.accordionContentKey}>
                                      {content.key}:{" "}
                                    </span>
                                  )}
                                  <span className={styles.accordionContentValue}>
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
