import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as styles from "./shipment-tracking.less";
import SvgWrapper from "../../components/core/svgWrapper/SvgWrapper";
import { convertUTCDateToLocalDate } from "../../helper/utils";

function ShipmentTracking({
  tracking,
  shipmentInfo,
  changeinit,
  invoiceDetails,
}) {
  const navigate = useNavigate();
  const [showDetailedTracking, setShowDetailedTracking] = useState(false);
  const getTime = (item) => {
    return convertUTCDateToLocalDate(
      item?.created_ts ? item?.created_ts : item?.time
    );
  };

  const getLinks = () => {
    const arrLinks = [];
    if (shipmentInfo?.can_cancel || shipmentInfo?.can_return) {
      arrLinks.push({
        type: "internal",
        text: updateType(),
        link: `/profile/orders/shipment/${shipmentInfo?.shipment_id}`,
      });
    }
    if (shipmentInfo?.track_url) {
      arrLinks.push({
        text: "TRACK",
        link: shipmentInfo?.track_url ? shipmentInfo?.track_url : "",
      });
    }
    if (shipmentInfo?.need_help_url) {
      arrLinks.push({
        type: "internal",
        text: "NEED HELP",
        link: "/faq/" || shipmentInfo?.need_help_url,
      });
    }
    if (invoiceDetails?.success) {
      arrLinks.push({
        text: "DOWNLOAD INVOICE",
        link: invoiceDetails?.presigned_url,
      });
    }
    return arrLinks;
  };

  const updateType = () => {
    return shipmentInfo?.can_return ? "RETURN" : "CANCEL";
  };
  const update = (item) => {
    if (
      ["CANCEL", "RETURN"].includes(item?.text)
      //    &&
      //    this.$route.meta.available_page_slug === "shipment-details"
    ) {
      changeinit({
        ...item,
        link: `/profile/orders/shipment/update/${shipmentInfo?.shipment_id}/${updateType()?.toLowerCase()}`,
      });
      window.scrollTo(0, 0);
    } else {
      navigate(item?.link);
    }
  };
  return (
    <div className={`${styles.trackingContainer}`}>
      <div className={`${styles.shipmentTracking}`}>
        <div className={`${styles.status}`}>
          <div>
            <div className={`${styles.title} ${styles.boldsm}`}>
              Shipment: {shipmentInfo?.shipment_id}
            </div>
            {shipmentInfo?.awb_no && (
              <div className={`${styles.awbText} ${styles.lightxxs}`}>
                AWB: {shipmentInfo?.awb_no}
              </div>
            )}
          </div>
        </div>
        <div>
          {tracking?.map((item, index) => (
            <div
              key={index}
              className={`${styles.trackItem} ${item?.is_current || item?.is_passed ? styles.title : ""} ${
                item?.status === "In Transit" ? styles.detailedTracking : ""
              }`}
            >
              {item?.status === "In Transit" &&
                (item?.is_current.toString() || item?.is_passed.toString()) && (
                  <div className={`${styles.inTransitItem}`}>
                    <>
                      <div className={`${styles.trackingDetails}`}>
                        <div>
                          <SvgWrapper svgSrc="tick-black-active" />
                        </div>
                        <div className={`${styles.trackInfo}`}>
                          <div className={`${styles.boldsm}`}>
                            {item?.status}
                          </div>
                          {(item?.created_ts || item?.time) && (
                            <div
                              className={`${styles.time} ${styles.lightxxs}`}
                            >
                              {getTime(item)}
                            </div>
                          )}
                        </div>
                        {!(
                          (item?.is_current || item?.is_passed) &&
                          showDetailedTracking
                        ) && (
                          <SvgWrapper
                            className={`${styles.dropdownaArow}`}
                            svgSrc="dropdown-arrow"
                          />
                        )}
                        {(item?.is_current || item?.is_passed) &&
                          showDetailedTracking && (
                            <SvgWrapper
                              className={`${styles.dropdownaArow}`}
                              svgSrc="arrow-top-black"
                            />
                          )}
                      </div>
                      {/* <ukt-accordion>
                            <ul v-if="showDetailedTracking">
                                <li
                                    v-for="(detail, index) in detailedTracking"
                                    :key="index"
                                    class="tracking-item"
                                >
                                    <fdk-inline-svg
                                        :src="'tick-black-active'"
                                    ></fdk-inline-svg>
                                    <div class="track-info">
                                        <div class="dark-sm">
                                            {{ detail.reason }}
                                        </div>
                                        <div class="time light-xxs">
                                            {{ getTime(detail.updated_ts) }}
                                            -
                                            {{
                                                detail.last_location_recieved_at
                                            }}
                                        </div>
                                    </div>
                                </li>
                            </ul>
                        </ukt-accordion> */}
                    </>
                  </div>
                )}
              {item?.status !== "In Transit" &&
                (item?.is_current.toString() || item?.is_passed.toString()) && (
                  <>
                    <div>
                      <SvgWrapper svgSrc="tick-black-active" />
                    </div>
                    <div className={`${styles.trackInfo}`}>
                      <div className={`${styles.boldsm}`}>{item?.status}</div>
                      {(item?.created_ts || item?.time) && (
                        <div className={`${styles.time} ${styles.lightxxs}`}>
                          {getTime(item)}
                        </div>
                      )}
                    </div>
                  </>
                )}
            </div>
          ))}
        </div>
        <div className={`${styles.links}`}>
          {getLinks()?.map((item, index) => (
            <>
              <>
                {item?.type === "internal" && (
                  <div
                    key={index}
                    onClick={() => update(item)}
                    className={`${styles.regularsm}`}
                  >
                    {" "}
                    {item?.text}
                  </div>
                )}
              </>
              <>
                {item?.type !== "internal" && (
                  <a
                    key={index}
                    href={`${item?.link}`}
                    className={`${styles.regularsm}`}
                  >
                    {item?.text}
                  </a>
                )}
              </>
            </>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ShipmentTracking;
