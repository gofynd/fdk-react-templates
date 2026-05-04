/**
 * ShipmentTracking is a React component that provides tracking information and actions for a shipment.
 * It displays links for tracking, canceling, returning, or downloading the invoice of a shipment.
 *
 * @param {Object} props - The properties object.
 * @param {Object} props.tracking - The tracking information for the shipment.
 * @param {Object} props.shipmentInfo - Contains details about the shipment, such as whether it can be canceled or returned.
 * @param {Function} props.changeinit - A function to handle changes in the shipment status.
 * @param {Object} props.invoiceDetails - Contains details about the invoice, including a presigned URL for downloading.
 *
 * @returns {JSX.Element} A React component that renders the shipment tracking interface.
 *
 */

import React, { useState, Fragment } from "react";
import * as styles from "./shipment-tracking.less";
import { convertUTCDateToLocalDate, formatLocale } from "../../helper/utils";
import TickActiveIcon from "../../assets/images/tick-black-active.svg";
import {
  useNavigate,
  useGlobalStore,
  useFPI,
  useGlobalTranslation,
} from "fdk-core/utils";

function ShipmentTracking({
  tracking,
  shipmentInfo = {},
  changeinit,
  invoiceDetails,
  customNeedHelpLink,
  availableFOCount,
  bagLength = 0,
}) {
  const { t } = useGlobalTranslation("translation");
  const fpi = useFPI();
  const { language, countryCode } = useGlobalStore(fpi.getters.i18N_DETAILS);
  const locale = language?.locale;
  const navigate = useNavigate();
  const [showDetailedTracking, setShowDetailedTracking] = useState(false);
  const getTime = (item) => {
    return convertUTCDateToLocalDate(
      item?.created_ts ? item?.created_ts : item?.time,
      "",
      formatLocale(locale, countryCode, true)
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
        text: t("resource.common.track"),
        link: shipmentInfo?.track_url ? shipmentInfo?.track_url : "",
      });
    }
    // if (shipmentInfo?.need_help_url) {
    //   arrLinks.push({
    //     type: "internal",
    //     text: t("resource.common.need_help"),
    //     link: "/faq/" || shipmentInfo?.need_help_url,
    //   });
    // }
    if (invoiceDetails?.success) {
      arrLinks.push({
        text: t("resource.common.download_invoice"),
        link: invoiceDetails?.presigned_url,
      });
    }
    arrLinks.push({
      type: "internal",
      text: t("resource.common.need_help"),
      newTab: !!customNeedHelpLink?.value,
      link: customNeedHelpLink?.value || "/faq/",
    });
    return arrLinks;
  };

  const updateType = () => {
    return shipmentInfo?.can_return ? "RETURN" : "CANCEL";
  };

  // const updateTypeText = () => {
  //   return shipmentInfo?.can_return ? "resource.facets.return_caps" : "resource.facets.cancel_caps";
  // };

  const update = (item) => {
    if (["CANCEL", "RETURN"].includes(item?.text)) {
      const firstBag = shipmentInfo?.bags?.[0];
      const isBundleItem = firstBag?.bundle_details?.bundle_group_id;
      const isPartialReturnBundle =
        isBundleItem &&
        firstBag?.bundle_details?.return_config?.allow_partial_return;

      // Direct navigate if: single bag OR bundle with allow_partial_return: false
      if (bagLength === 1 && (!isBundleItem || !isPartialReturnBundle)) {
        // Find the base bag for bundles, otherwise use first bag
        const selectedBag = isBundleItem
          ? shipmentInfo.bags.find(
              (bag) => bag?.bundle_details?.is_base === true
            ) || firstBag
          : firstBag;

        const bagId = selectedBag?.id;
        const querParams = new URLSearchParams(location.search);
        if (bagId) {
          querParams.set("selectedBagId", bagId);
        }
        const finalLink = `/profile/orders/shipment/update/${shipmentInfo?.shipment_id}/${updateType()?.toLowerCase()}`;
        navigate(
          finalLink +
            (querParams?.toString() ? `?${querParams.toString()}` : "")
        );
      } else {
        // Multiple bags OR bundle with allow_partial_return: true - show selection UI
        changeinit({
          ...item,
          link: `/profile/orders/shipment/update/${shipmentInfo?.shipment_id}/${updateType()?.toLowerCase()}`,
        });
      }
      window.scrollTo(0, 0);
    } else {
      if (item?.newTab) {
        window.open(item?.link, "_blank");
      } else {
        navigate(item?.link);
      }
    }
  };

  return (
    <div className={`${styles.shipmentTracking}`}>
      <div className={`${styles.status}`}>
        <div>
          <div
            className={`${styles.title} ${styles.shipmentTitle} ${styles.boldsm}`}
          >
            <div>
              {t("resource.common.shipment")}: {shipmentInfo?.shipment_id}
            </div>
            {availableFOCount > 1 && shipmentInfo.fulfillment_option?.name && (
              <div className={styles.foName}>
                {shipmentInfo.fulfillment_option?.name}
              </div>
            )}
          </div>
          {shipmentInfo?.awb_no && (
            <div className={`${styles.awbText} ${styles.lightxxs}`}>
              {t("resource.common.awb")}: {shipmentInfo?.awb_no}
            </div>
          )}
        </div>
      </div>
      <div className={styles.trackingItemContainer}>
        {tracking?.map((item, index) => (
          <div
            key={index}
            className={`${styles.trackItem} ${item?.is_current || item?.is_passed ? styles.title : ""} ${
              item?.status === "In Transit" ? styles.detailedTracking : ""
            }`}
          >
            {item?.status === "In Transit" &&
              (item?.is_current?.toString() || item?.is_passed?.toString()) && (
                <div className={`${styles.inTransitItem}`}>
                  <>
                    <div className={`${styles.trackingDetails}`}>
                      <div>
                        <TickActiveIcon />
                      </div>
                      <div className={`${styles.trackInfo}`}>
                        <div className={`${styles.boldsm}`}>{item?.status}</div>
                        {(item?.created_ts || item?.time) && (
                          <div className={`${styles.time} ${styles.lightxxs}`}>
                            {getTime(item)}
                          </div>
                        )}
                      </div>
                      {!(
                        (item?.is_current || item?.is_passed) &&
                        showDetailedTracking
                      ) && (
                        <></>
                        // <SvgWrapper
                        //   className={`${styles.dropdownaArow}`}
                        //   svgSrc="dropdown-arrow"
                        // />
                      )}
                      {(item?.is_current || item?.is_passed) &&
                        showDetailedTracking && (
                          <></>
                          // <SvgWrapper
                          //   className={`${styles.dropdownaArow}`}
                          //   svgSrc="arrow-top-black"
                          // />
                        )}
                    </div>
                  </>
                </div>
              )}
            {item?.status !== "In Transit" &&
              (item?.is_current?.toString() || item?.is_passed?.toString()) && (
                <>
                  <div>
                    <TickActiveIcon />
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
          <Fragment key={`${item?.text}_${index}`}>
            {item?.type === "internal" ? (
              <>
                {index === 0 && (
                  <div
                    className={`${styles.productExchangeBox} productExchangeContainer`}
                  ></div>
                )}
                <div
                  key={index}
                  onClick={() => update(item)}
                  className={`${styles.regularsm}`}
                >
                  {item?.text === "RETURN"
                    ? t("resource.facets.return_caps")
                    : item?.text === "CANCEL"
                      ? t("resource.facets.cancel_caps")
                      : item?.text}
                </div>
              </>
            ) : (
              <a
                key={index}
                href={`${item?.link}`}
                className={`${styles.regularsm}`}
              >
                {item?.text === "RETURN"
                  ? t("resource.facets.return_caps")
                  : item?.text === "CANCEL"
                    ? t("resource.facets.cancel_caps")
                    : item?.text}
              </a>
            )}
          </Fragment>
        ))}
      </div>
    </div>
  );
}

export default ShipmentTracking;
