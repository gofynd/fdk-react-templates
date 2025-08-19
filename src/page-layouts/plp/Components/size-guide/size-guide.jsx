import React, { useState, useEffect, useMemo } from "react";
import { FDKLink } from "fdk-core/components";
import * as styles from "./size-guide.less";
import FyImage from "../../../../components/core/fy-image/fy-image";
import FyHTMLRenderer from "../../../../components/core/fy-html-renderer/fy-html-renderer";
import { useGlobalTranslation } from "fdk-core/utils";
import Modal from "../../../../components/core/modal/modal";

function SizeGuide({ isOpen, productMeta, onCloseDialog }) {
  const { t } = useGlobalTranslation("translation");
  const [previewSelectedMetric, setPreviewSelectedMetric] = useState("cm");
  const [selectedMetric, setSelectedMetric] = useState("cm");
  const [activeTab, setActiveTab] = useState("size_guide");
  const values = {
    in: t("resource.common.inch"),
    cm: t("resource.common.cm"),
  };

  const headers = Object.entries(productMeta?.size_chart?.headers ?? {}).filter(
    ([key, val]) => !key?.includes("__") && val !== null
  );

  useEffect(() => {
    if (productMeta?.size_chart?.unit) {
      setPreviewSelectedMetric(productMeta?.size_chart.unit);
      setSelectedMetric(productMeta?.size_chart.unit);
    }
  }, [productMeta]);

  const changeSelectedMetric = (val) => {
    setPreviewSelectedMetric(val);
  };

  const isSizeChartAvailable = () => {
    const sizeChartHeader = productMeta?.size_chart?.headers || {};
    return Object.keys(sizeChartHeader).length > 0;
  };

  const convertMetrics = (val) => {
    let value = null;
    if (previewSelectedMetric === "cm") {
      let finalVal = "";
      value = val.split("-");
      for (let i = 0; i < val.length; i += 1) {
        if (i !== 0 && i < val.length) {
          finalVal += "-";
        }
        if (!Number.isNaN(Number(val[i]))) {
          finalVal += (Number(val[i]) * 2.54).toFixed(1); // inches to cm
        } else {
          finalVal += val[i];
        }
      }
      return finalVal;
    }

    if (previewSelectedMetric === "in") {
      let finalVal = "";
      for (let i = 0; i < val.length; i += 1) {
        if (i !== 0 && i < val.length) {
          finalVal += "-";
        }
        if (!Number.isNaN(Number(val[i]))) {
          finalVal += (Number(val[i]) / 2.54).toFixed(1); // cm to inches
        } else {
          finalVal += val[i];
        }
      }
      return finalVal;
    }

    return val;
  };

  const displayStyle = useMemo(() => {
    let displayStyle = "none";
    if (activeTab === "measure") {
      displayStyle = "block";
    }
    return displayStyle;
  }, [activeTab]);

  return (
    <>
      {isOpen && (
        <Modal
          modalType="right-modal"
          isOpen={isOpen}
          title=""
          closeDialog={(e) => {
            onCloseDialog(e);
            setActiveTab("size_guide");
          }}
          headerClassName={styles.sidebarHeader}
          bodyClassName={styles.sizeContainer}
        >
          {/* Size Guide Dialog */}
          <div>
            {/* Tabs */}
            <div className={styles.sizeTabs}>
              {/* Size Guide Tab */}
              {/* {isSizeChartAvailable() && ( */}
              <button
                type="button"
                className={`${styles.b2} ${styles.tab} ${styles.tabSizeGuide} ${
                  activeTab === "size_guide" ? styles.active : ""
                }`}
                onClick={() => setActiveTab("size_guide")}
              >
                {t("resource.product.size_guide_lower")}
              </button>
              {/* )} */}

              {/* Measure Tab */}
              {/* {productMeta?.size_chart && ( */}
              <button
                type="button"
                className={`${styles.b2} ${styles.tab} ${styles.tabMeasure} ${
                  activeTab === "measure" ? styles.active : ""
                }`}
                onClick={() => setActiveTab("measure")}
              >
                {t("resource.product.how_to_measure")}
              </button>
              {/* )} */}
            </div>

            {/* Body */}
            <div className={styles.sidebarBody}>
              {/* Left Container */}
              <div
                className={`${styles.leftContainer} ${
                  !productMeta?.size_chart?.image ? styles.cstLw : ""
                } ${!isSizeChartAvailable() ? styles.paddingTopUnset : ""}`}
                style={{
                  display: activeTab === "size_guide" ? "block" : "none",
                }}
              >
                {/* Button Group */}
                {(isSizeChartAvailable() || productMeta?.size_chart?.title) && (
                  <div className={styles.btnGroup}>
                    {productMeta?.size_chart?.title && (
                      <h4
                        className="h4 fontHeader"
                        style={{ marginBottom: "16px" }}
                      >
                        {productMeta?.size_chart?.title}
                      </h4>
                    )}
                    <div className={styles.btnContainer}>
                      {isSizeChartAvailable() &&
                        Object.entries(values)?.map(([key, val]) => (
                          <button
                            key={key}
                            type="button"
                            onClick={() => {
                              changeSelectedMetric(key);
                            }}
                            className={`${styles.h5} ${styles.unitBtn} ${
                              styles.fontBody
                            } ${
                              previewSelectedMetric === key
                                ? styles.unitBtnSelected
                                : ""
                            }`}
                          >
                            {val}
                          </button>
                        ))}
                    </div>
                  </div>
                )}
                {/* Size Description */}
                {productMeta?.size_chart &&
                  productMeta?.size_chart?.description && (
                    <div className={styles.sizeDesc}>
                      <FyHTMLRenderer
                        htmlContent={productMeta?.size_chart?.description}
                      />
                    </div>
                  )}

                {isSizeChartAvailable() && (
                  <div className={styles.sizeInfo}>
                    <table className={styles.sizeTable}>
                      <thead>
                        <tr>
                          {headers?.map(
                            ([key, val]) =>
                              val !== null && (
                                <th
                                  key={`column${key}`}
                                  className={`${styles.b2} ${styles.sizeHeader}`}
                                >
                                  {val?.value}
                                </th>
                              )
                          )}
                        </tr>
                      </thead>

                      <tbody>
                        {productMeta?.size_chart?.sizes?.map((row, index) => (
                          <tr key={`row_${index}`} className={styles.sizeRow}>
                            {Object.entries(row)
                              .filter(
                                ([key, val]) =>
                                  !key?.includes("__") && val !== null
                              )
                              ?.map(([key, val], index2) => (
                                <td
                                  key={`cell_${key}`}
                                  className={`${styles.captionNormal} ${styles.sizeCell}`}
                                >
                                  {headers[index2][1]?.convertable
                                    ? convertMetrics(val)
                                    : val}
                                </td>
                              ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {!isSizeChartAvailable() && (
                  <div className={styles.notAvailable}>
                    <h3 className={`${styles.fontHeader} fontHeader`}>
                      {t("resource.common.size_not_available_info_heading")}
                    </h3>
                    <p className="fontBody">
                      {" "}
                      {t("resource.common.size_not_available_info_description")}
                    </p>
                    <FDKLink link="/contact-us" target="_blank">
                      <button
                        type="button"
                        className={`${styles.contactUs} ${styles.btnPrimary} ${styles.fontBody}`}
                      >
                        {t("resource.common.contact_us_caps")}
                      </button>
                    </FDKLink>
                  </div>
                )}
              </div>

              <div
                className={`${styles.rightContainer}`}
                style={{
                  display: displayStyle,
                }}
              >
                {productMeta &&
                  productMeta.size_chart &&
                  productMeta.size_chart.image && (
                    <div className={styles.sizeGuideImage}>
                      <FyImage
                        src={productMeta.size_chart.image}
                        alt={productMeta.size_chart.title}
                        sources={[{ width: 500 }]}
                        aspectRatio="0.8"
                        mobileAspectRatio="0.8"
                      />
                    </div>
                  )}

                {/* Not Available */}
                {!productMeta ||
                  !productMeta.size_chart ||
                  (!productMeta.size_chart.image && (
                    <div className={styles.notAvailable}>
                      <h3 className={`${styles.fontHeader} fontHeader`}>
                        {t(
                          "resource.common.size_measure_not_available_info_heading"
                        )}
                      </h3>
                      <p className={`${styles.fontBody} fontBody`}>
                        {" "}
                        {t(
                          "resource.common.size_measure_not_available_info_description"
                        )}
                      </p>
                      <FDKLink link="/contact-us" target="_blank">
                        <button
                          type="button"
                          className={`${styles.contactUs} ${styles.btnPrimary} ${styles.fontBody}`}
                        >
                          {t("resource.common.contact_us_caps")}
                        </button>
                      </FDKLink>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}

export default SizeGuide;
