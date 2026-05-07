import React, { useState, useEffect, useMemo } from "react";
import * as styles from "./size-guide.less";
import Modal from "../../../../components/core/modal/modal";

const SIZE_GUIDE_TABS = [
  { id: "size_guide", label: "Size guide" },
  { id: "product_measurements", label: "Product measurements" },
  { id: "reviews", label: "Reviews" },
];

const FALLBACK_SIZE_GUIDE_COLUMNS = [
  "Size",
  "EU",
  "UK",
  "US",
  "FR",
  "IT",
  "Waist",
  "Hip",
];

const FALLBACK_SIZE_GUIDE_ROWS = {
  in: [
    ["XS", "32", "4", "2", "34", "38", '25"', '34 1/2"'],
    ["XS", "34", "6", "4", "36", "40", '26"', '35 1/2"'],
    ["S", "36", "8", "8", "38", "42", '27 1/2"', '37"'],
    ["M", "38", "10", "10", "40", "44", '29"', '38 1/2"'],
    ["L", "40", "12", "12", "42", "46", '30 1/2"', '40"'],
    ["L", "42", "14", "14", "44", "48", '32"', '41 1/2"'],
    ["XL", "44", "16", "16", "46", "50", '33 1/2"', '43"'],
  ],
  cm: [
    ["XS", "32", "4", "2", "34", "38", "63.5", "87.5"],
    ["XS", "34", "6", "4", "36", "40", "66", "90"],
    ["S", "36", "8", "8", "38", "42", "70", "94"],
    ["M", "38", "10", "10", "40", "44", "73.5", "97.5"],
    ["L", "40", "12", "12", "42", "46", "77.5", "101.5"],
    ["L", "42", "14", "14", "44", "48", "81.5", "105.5"],
    ["XL", "44", "16", "16", "46", "50", "85", "109"],
  ],
};

function SizeGuide({
  isOpen,
  productMeta,
  selectedSize = "",
  onCloseDialog = () => {},
}) {
  const [previewSelectedMetric, setPreviewSelectedMetric] = useState("in");
  const [selectedMetric, setSelectedMetric] = useState("in");
  const [activeTab, setActiveTab] = useState("size_guide");
  const [touched, setTouched] = useState(false);

  const values = {
    in: "inch",
    cm: "cm",
  };

  const headers = useMemo(
    () =>
      Object.entries(productMeta?.size_chart?.headers ?? {}).filter(
        ([key, val]) => !key?.includes("__") && val !== null
      ),
    [productMeta]
  );

  useEffect(() => {
    if (productMeta?.size_chart?.unit) {
      const metric = productMeta.size_chart.unit === "cm" ? "cm" : "in";
      setPreviewSelectedMetric(metric);
      setSelectedMetric(metric);
    }
  }, [productMeta]);

  const normalizedMetric = previewSelectedMetric === "cm" ? "cm" : "in";

  const changeSelectedMetric = (val) => {
    setPreviewSelectedMetric(val);

    if (selectedMetric === val) {
      setTouched(false);
    } else {
      setTouched(true);
    }
  };

  const isSizeChartAvailable = useMemo(() => {
    const sizeChartHeader = productMeta?.size_chart?.headers || {};
    return Object.keys(sizeChartHeader).length > 0;
  }, [productMeta]);

  const convertMetrics = (val) => {
    if (previewSelectedMetric === "cm" && touched) {
      let finalVal = "";
      val = val.split("-");
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

    if (previewSelectedMetric === "in" && touched) {
      let finalVal = "";
      val = val.split("-");
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

  const selectedSizeLabel = useMemo(() => {
    const options = productMeta?.sizes || [];
    const selectedOption = options.find(
      (size) => size?.value === selectedSize || size?.display === selectedSize
    );
    const firstAvailable =
      options.find((size) => size?.quantity > 0) || options[0];

    return (
      selectedOption?.display ||
      selectedOption?.value ||
      selectedSize ||
      firstAvailable?.display ||
      firstAvailable?.value ||
      "S"
    );
  }, [productMeta, selectedSize]);

  const chartColumns = useMemo(() => {
    if (!isSizeChartAvailable) return FALLBACK_SIZE_GUIDE_COLUMNS;

    const configuredColumns = headers
      .map(([, val]) => val?.value)
      .filter(Boolean);

    return configuredColumns.length
      ? configuredColumns
      : FALLBACK_SIZE_GUIDE_COLUMNS;
  }, [headers, isSizeChartAvailable]);

  const chartRows = useMemo(() => {
    const configuredRows = productMeta?.size_chart?.sizes || [];

    if (isSizeChartAvailable && configuredRows.length) {
      return configuredRows.map((row) =>
        Object.entries(row)
          .filter(([key, val]) => !key?.includes("__") && val !== null)
          .map(([, val], index) =>
            headers[index]?.[1]?.convertable
              ? convertMetrics(String(val))
              : String(val)
          )
      );
    }

    return FALLBACK_SIZE_GUIDE_ROWS[normalizedMetric];
  }, [
    productMeta,
    headers,
    isSizeChartAvailable,
    normalizedMetric,
    previewSelectedMetric,
    touched,
  ]);

  const handleClose = (event) => {
    onCloseDialog(event);
    setActiveTab("size_guide");
  };

  return (
    <>
      {isOpen && (
        <Modal
          modalType="right-modal"
          isOpen={isOpen}
          hideHeader={true}
          closeDialog={handleClose}
          customClassName={styles.sizeGuideModal}
          containerClassName={styles.sizeGuideModalContainer}
          bodyClassName={styles.sizeContainer}
        >
          <div className={styles.sizeGuideShell}>
            <div className={styles.sizeGuideTopBar}>
              <div className={styles.sizeGuideTabBar} role="tablist">
                {SIZE_GUIDE_TABS.map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    role="tab"
                    aria-selected={activeTab === tab.id}
                    className={`${styles.sizeGuideMainTab} ${
                      activeTab === tab.id ? styles.sizeGuideMainTabActive : ""
                    }`}
                    onClick={() => setActiveTab(tab.id)}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
              <button
                type="button"
                className={styles.sizeGuideClose}
                aria-label="Close size guide"
                onClick={handleClose}
              >
                <span aria-hidden="true" />
              </button>
            </div>

            <div className={styles.sizeGuideScrollArea}>
              {activeTab !== "reviews" && (
                <div className={styles.sizeGuideNotice}>
                  <span className={styles.sizeGuideNoticeIcon} aria-hidden="true">
                    i
                  </span>
                  <p>
                    We've updated our sizes based on your feedback. Please refer
                    to the size chart.
                  </p>
                </div>
              )}

              {activeTab === "size_guide" && (
                <>
                  <div className={styles.sizeGuideSelectedSize}>
                    <button type="button" aria-label="Selected size">
                      <span>selected size :</span>
                      <strong>{selectedSizeLabel}</strong>
                      <span className={styles.sizeGuideSelectChevron} />
                    </button>
                  </div>

                  <div className={styles.sizeGuideUnitRow}>
                    {Object.entries(values).map(([key, val]) => (
                      <button
                        key={key}
                        type="button"
                        className={`${styles.sizeGuideUnitButton} ${
                          previewSelectedMetric === key
                            ? styles.sizeGuideUnitButtonActive
                            : ""
                        }`}
                        onClick={() => changeSelectedMetric(key)}
                      >
                        {val}
                      </button>
                    ))}
                  </div>

                  <div className={styles.sizeGuideTableWrap}>
                    <table className={styles.sizeGuideTable}>
                      <thead>
                        <tr>
                          {chartColumns.map((column) => (
                            <th key={column}>{column}</th>
                          ))}
                        </tr>
                      </thead>

                      <tbody>
                        {chartRows.map((row, rowIndex) => (
                          <tr key={`size-guide-row-${rowIndex}`}>
                            {row.map((cell, cellIndex) => (
                              <td key={`${rowIndex}-${cellIndex}`}>{cell}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/*
                    Temporarily hidden. The body measurement illustration needs
                    a dedicated pass before it can match the COS/Figma quality bar.
                  */}
                  {/* <div className={styles.sizeGuideIllustration}>
                    <SizeGuideBodyDiagram />
                  </div> */}

                  <div className={styles.sizeGuideMeasure}>
                    <h3>How to measure your body</h3>
                    <div className={styles.sizeGuideMeasureList}>
                      <div>
                        <span>Chest</span>
                        <p>
                          Measure around the fullest part of your chest, keeping
                          the tape measure horizontal.
                        </p>
                      </div>
                      <div>
                        <span>Waist</span>
                        <p>
                          Measure around your natural waistline, at the narrowest
                          point.
                        </p>
                      </div>
                      <div>
                        <span>Arm length</span>
                        <p>Measure from shoulder point to just below the wrist.</p>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {activeTab === "product_measurements" && (
                <div className={styles.sizeGuideEmptyState}>
                  <span>Coming soon...</span>
                </div>
              )}

              {activeTab === "reviews" && (
                <div className={styles.sizeGuideEmptyState}>
                  <span>Coming soon...</span>
                </div>
              )}
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}

// const SizeGuideBodyDiagram = () => (
//   <svg
//     className={styles.sizeGuideBodyDiagram}
//     viewBox="0 0 420 260"
//     role="img"
//     aria-label="How to measure your body"
//   >
//     <defs>
//       <marker
//         id="size-guide-arrow"
//         markerWidth="6"
//         markerHeight="6"
//         refX="3"
//         refY="3"
//         orient="auto"
//       >
//         <path d="M0 0 L6 3 L0 6 Z" fill="#c8c8c8" />
//       </marker>
//     </defs>
//
//     <path
//       d="M203 21C203 36 197 43 184 49C170 55 158 58 153 74C149 89 150 111 145 133C139 160 131 179 132 210C132 227 136 239 136 248M217 21C217 36 223 43 236 49C250 55 262 58 267 74C271 89 270 111 275 133C281 160 289 179 288 210C288 227 284 239 284 248M197 248C198 228 198 213 202 195M223 248C222 228 222 213 218 195M202 195C205 198 215 198 218 195M136 248C134 254 131 257 128 252C125 246 122 237 126 230M284 248C286 254 289 257 292 252C295 246 298 237 294 230"
//       fill="none"
//       stroke="#111"
//       strokeWidth="0.8"
//       strokeLinecap="round"
//       strokeLinejoin="round"
//     />
//     <path
//       d="M153 92C166 102 185 106 210 106C235 106 254 102 267 92M149 143C166 153 186 156 210 156C234 156 254 153 271 143M137 191C158 202 182 206 210 206C238 206 262 202 283 191"
//       fill="none"
//       stroke="#c8c8c8"
//       strokeWidth="1"
//     />
//     <path
//       d="M154 86L148 94L157 95M266 86L272 94L263 95M147 138L140 146L150 147M273 138L280 146L270 147M137 186L130 194L140 195M283 186L290 194L280 195"
//       fill="none"
//       stroke="#c8c8c8"
//       strokeWidth="1"
//       strokeLinecap="round"
//       strokeLinejoin="round"
//     />
//     <line x1="292" y1="52" x2="292" y2="120" stroke="#c8c8c8" />
//     <line
//       x1="292"
//       y1="52"
//       x2="292"
//       y2="120"
//       stroke="#c8c8c8"
//       markerStart="url(#size-guide-arrow)"
//       markerEnd="url(#size-guide-arrow)"
//     />
//     <line x1="292" y1="145" x2="292" y2="214" stroke="#c8c8c8" />
//     <line
//       x1="292"
//       y1="145"
//       x2="292"
//       y2="214"
//       stroke="#c8c8c8"
//       markerStart="url(#size-guide-arrow)"
//       markerEnd="url(#size-guide-arrow)"
//     />
//
//     <text x="210" y="101" textAnchor="middle" className={styles.sizeGuideDiagramText}>
//       Chest
//     </text>
//     <text x="210" y="151" textAnchor="middle" className={styles.sizeGuideDiagramText}>
//       Waist
//     </text>
//     <text x="210" y="201" textAnchor="middle" className={styles.sizeGuideDiagramText}>
//       Hips
//     </text>
//     <text x="325" y="142" textAnchor="middle" className={styles.sizeGuideDiagramText}>
//       Arm length
//     </text>
//   </svg>
// );

export default SizeGuide;
