/**
 * ShipmentItem component renders a shipment item with various details and allows for interaction.
 *
 * @param {Object} props - The properties object.
 * @param {Object} props.bag - The bag object containing details of the shipment item.
 * @param {Object} props.initial - The initial state or configuration for the shipment item.
 * @param {Object} props.shipment - The shipment details associated with the item.
 * @param {Object} props.deliveryAddress - The delivery address for the shipment.
 * @param {string} props.selectId - The identifier for selecting the shipment item.
 * @param {Function} props.onChangeValue - Callback function to handle changes in the shipment item.
 * @param {string} props.type - The type of the shipment item.
 *
 * @returns {JSX.Element} A JSX element representing the shipment item.
 *
 */

import React, { useMemo } from "react";
import { FDKLink } from "fdk-core/components";
import * as styles from "./shipment-item.less";
import SvgWrapper from "../../components/core/svgWrapper/SvgWrapper";
import {
  numberWithCommas,
  priceFormatCurrencySymbol,
} from "../../helper/utils";
import { useGlobalTranslation } from "fdk-core/utils";
import ScheduleIcon from "../../assets/images/schedule.svg";
import { BagImage, BundleBagImage } from "../../components/bag/bag";
import { getProductImgAspectRatio } from "../../helper/utils";

function ShipmentItem({
  bag,
  bundleGroups,
  bundleGroupArticles,
  initial,
  selectId,
  onChangeValue,
  type,shipmentDetails,
  globalConfig,
}) {
  const { t } = useGlobalTranslation("translation");
  const getPriceValue = (item) => {
    return numberWithCommas(item);
  };
  const getPriceCurrencyFormat = (symbol, price) => {
    return priceFormatCurrencySymbol(symbol, price);
  };
  const onChange = (id) => {
    onChangeValue(id);
  };

    function formatUTCToDateString(utcString) {
    if (!utcString) return "";

    const date = new Date(utcString);

    const options = {
      day: "2-digit",
      month: "short",
      year: "numeric",
    };

    return date
      .toLocaleDateString("en-GB", options)
      .replace(" ", " ")
      .replace(",", ",");
  }

  const ndrWindowExhausted = () => {
    const endDateStr =
      shipmentDetails?.ndr_details?.allowed_delivery_window?.end_date;
    if (!endDateStr) return false;

    const endDate = new Date(endDateStr);
    const now = new Date();

    return endDate < now;
  };


  const bundleGroupId = bag?.bundle_details?.bundle_group_id;
  const isBundleItem =
    bundleGroupId &&
    bundleGroups &&
    bundleGroups[bundleGroupId]?.length > 0;

  const { name, size, quantity, price } = useMemo(() => {
    if (isBundleItem) {
      // For bundles, sum all individual bag prices from the bundleGroups
      // This avoids the mutation issue where getGroupedShipmentBags modifies bundle_details
      const bundleBags = bundleGroups[bundleGroupId] || [];
      
      // Sum the ORIGINAL individual bag prices (not the modified base bag price)
      const totalEffectivePrice = bundleBags.reduce((sum, bundleBag) => {
        // If base bag has been aggregated by getGroupedShipmentBags, use financial_breakup instead
        const isAggregated = bundleBag?.bundle_details?.is_base && 
                             bundleBag?.prices?.price_effective > (bundleBag?.financial_breakup?.[0]?.price_effective || bundleBag?.prices?.price_effective);
        
        if (isAggregated) {
          // Use financial_breakup which contains the original individual bag price
          return sum + (bundleBag?.financial_breakup?.[0]?.price_effective || 0);
        }
        
        return sum + (bundleBag?.prices?.price_effective || 0);
      }, 0);
      
      return {
        name: bag?.bundle_details?.name,
        size: bag?.bundle_details?.size,
        quantity: bag?.bundle_details?.bundle_count,
        price: totalEffectivePrice,
      };
    }
    return {
      name: bag?.item?.name,
      size: bag?.item?.size,
      quantity: bag?.quantity,
      price: bag?.prices?.price_effective,
    };
  }, [bag, bundleGroups, bundleGroupId, isBundleItem]);

  return (
    <div className={`${styles.bagItem}`}>
      <div className={`${styles.label}`}>
        {!initial &&
          type === "my-orders" &&
          (bag.can_cancel || bag.can_return) && (
            <div className={`${styles.radiobtn}`}>
              <input
                type="radio"
                value={bag.id}
                onChange={() => onChange(bag.id)}
                name="reasoncheckbox"
                id={bag.id}
              />
              {selectId !== bag.id && (
                <SvgWrapper
                  className={styles.regularRadio}
                  svgSrc="regular"
                  onClick={() => onChange(bag.id)}
                />
              )}
              {selectId === bag.id && (
                <SvgWrapper
                  className={styles.returnRadioSelected}
                  svgSrc="returnRadioSelected"
                />
              )}
            </div>
          )}
        <ShipmentImage
          bag={bag}
          type={type}
          isBundleItem={isBundleItem}
          bundleGroupId={bag?.bundle_details?.bundle_group_id}
          bundleGroups={bundleGroups}
          bundleGroupArticles={bundleGroupArticles}
          globalConfig={globalConfig}
        />
        <div className={`${styles.bagInfo}`}>
          <FDKLink
            to={`/product/${isBundleItem ? bag?.bundle_details?.slug : bag?.item?.slug_key}`}
            className={`${styles.bagImg}`}
            state={{
              product: isBundleItem
                ? {
                    ...bag?.bundle_details,
                    media:
                      bag?.bundle_details?.images?.map((i) => ({
                        url: i,
                        type: "image",
                      })) || [],
                  }
                : {
                    ...bag?.item,
                    media:
                      bag?.item?.image?.map((i) => ({
                        url: i,
                        type: "image",
                      })) || [],
                  },
            }}
          >
            <div className={`${styles.brand}`}>{name}</div>{" "}
          </FDKLink>
          <div className={`${styles.bagDetails}`}>
            <div className={`${styles.chip} ${styles.regularxxs}`}>
              <span className={`${styles.itemSize}`}>{size}</span>
              {size && quantity && (
                <span className={styles.itemSeparator}>{` | `}</span>
              )}
              <span className={`${styles.itemQty}`}>
                {quantity}{" "}
                {quantity === 1
                  ? t("resource.common.single_piece")
                  : t("resource.common.multiple_piece")}
              </span>
            </div>
            {bag?.prices?.currency_symbol !== null && price !== null && (
              <div className={`${styles.effectivePrice}`}>
                <span className={`${styles.effectivePrice}`}>
                  {getPriceCurrencyFormat(
                    bag?.prices?.currency_symbol,
                    getPriceValue(price)
                  )}
                </span>
              </div>
            )}
          </div>
            <div className={styles.buttonContainer}>
            <div
              className={`${styles.requestReattempt} ${
                shipmentDetails?.shipment_status?.value ===
                "delivery_reattempt_requested"
                  ? styles.deliveryReattemptRequested
                  : ""
              }`}
            >
          
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const ShipmentImage = ({
  bag,
  type,
  bundleGroupId,
  isBundleItem,
  bundleGroupArticles,
  globalConfig,
}) => {
  const aspectRatio = getProductImgAspectRatio(globalConfig);
  const getItemImage = () => {
    return (
      <BagImage bag={bag} isBundle={isBundleItem} aspectRatio={aspectRatio} />
    );
  };

  return (
    <FDKLink
      to={`/product/${isBundleItem ? bag?.bundle_details?.slug : bag?.item?.slug_key}`}
      className={`${styles.bagImg}`}
      state={{
        product: isBundleItem
          ? {
              ...bag?.bundle_details,
              media:
                bag?.bundle_details?.images?.map((i) => ({
                  url: i,
                  type: "image",
                })) || [],
            }
          : {
              ...bag?.item,
              media:
                bag?.item?.image?.map((i) => ({
                  url: i,
                  type: "image",
                })) || [],
            },
      }}
    >
      {getItemImage()}
    </FDKLink>
  );
};

export default ShipmentItem;
