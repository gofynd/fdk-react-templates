/**
 * OrderShipment component is responsible for displaying and managing the shipment details of an order.
 * It provides functionalities to navigate to shipment details, toggle shipment visibility, and display product names and quantities.
 *
 * @param {Object} props - The properties object.
 * @param {Object} props.orderInfo - Contains information about the order, including shipments.
 * @param {Function} [props.onBuyAgainClick=() => {}] - Callback function to handle the "Buy Again" button click.
 * @param {boolean} props.isBuyAgainEligible - Indicates if the order is eligible for the "Buy Again" feature.
 *
 * @returns {JSX.Element} A React component that renders the shipment details of an order.
 */

import React, { useState, useMemo } from "react";
// import { useParams } from "react-router-dom";
import * as styles from "./order-shipment.less";
import SvgWrapper from "../../components/core/svgWrapper/SvgWrapper";
import { convertUTCDateToLocalDate, formatLocale } from "../../helper/utils";
import Accordion from "../accordion/accordion";
import {
  useNavigate,
  useGlobalStore,
  useFPI,
  useGlobalTranslation,
} from "fdk-core/utils";
import { BundleBagImage, BagImage } from "../bag/bag";
import { getProductImgAspectRatio } from "../../helper/utils";

/**
 * Helper: Get all bags with customization (_custom_json._display)
 */
const getBagsWithCustomization = (bags = []) => {
  return bags.filter(
    (bag) =>
      bag.meta?._custom_json?._display &&
      bag.meta._custom_json._display.length > 0
  );
};

function getProductsName({ bag, isBundleItem }) {
  if (isBundleItem) {
    return bag?.bundle_details?.name;
  }
  return bag?.item?.name;
}

function getTotalItems(items, t) {
  return items === 1
    ? `${items} ${t("resource.common.item_simple_text")}`
    : `${items} ${t("resource.common.item_simple_text_plural")}`;
}

function getTotalPieces(pieces, t) {
  const total = pieces.reduce((pre, curr) => pre + curr.quantity, 0);
  return total === 1
    ? `${total} ${t("resource.common.single_piece")}`
    : `${total} ${t("resource.common.multiple_piece")}`;
}

const getCustomizationOptions = (orderInfo) => {
  if (!orderInfo?.shipments) return [];
  return orderInfo.shipments
    .flatMap((shipment) =>
      shipment.bags?.map((bag) => bag.meta?._custom_json?._display || []).flat()
    )
    .filter(Boolean);
};

const ShipmentDetails = ({
  item,
  bundleGroups,
  bundleGroupArticles,
  aspectRatio,
  naivgateToShipment,
  isAdmin,
  t,
  availableFOCount,
  getTotalItems,
  getTotalPieces,
}) => {
  const [openAccordions, setOpenAccordions] = useState({});
  const customizationOptions = getCustomizationOptions({
    shipments: [item],
  });
  const shipmentItems = [
    {
      title: "Customization",
      content: customizationOptions,
      open: openAccordions[item.shipment_id] || false,
    },
  ];

  const handleShipmentAccordionClick = (shipmentId) => {
    setOpenAccordions((prev) => ({
      ...prev,
      [shipmentId]: !prev[shipmentId],
    }));
  };
  const bagItem = item?.bags?.[0];
  const bundleGroupId = bagItem?.bundle_details?.bundle_group_id;
  const isBundleItem =
    bundleGroupId && bundleGroups && bundleGroups[bundleGroupId]?.length > 0;

  const productName = getProductsName({ bag: item?.bags?.[0], isBundleItem });

  return (
    <>
      <div
        className={styles.shipmentData}
        key={item.shipment_id}
        onClick={() => naivgateToShipment(item)}
      >
        <div className={styles.shipmentLeft}>
          {isBundleItem ? (
            <BundleBagImage
              item={item?.bags?.[0]?.item}
              bundleGroupId={bundleGroupId}
              bundleGroupArticles={bundleGroupArticles}
              aspectRatio={aspectRatio}
            />
          ) : (
            <BagImage item={item?.bags?.[0]?.item} aspectRatio={aspectRatio} />
          )}
          {item?.bags?.length > 1 && (
            <div id="total-item">
              +{item?.bags?.length - 1 + " "}
              {t("resource.facets.more")}
            </div>
          )}
        </div>
        <div className={styles.shipmentRight}>
          <div className={styles.uktLinks}>
            {item?.bags?.length > 1 && customizationOptions.length < 1 ? (
              <div>
                {productName} +{item.bags.length - 1 + " "}
                {t("resource.facets.more")}
              </div>
            ) : (
              <div>{productName}</div>
            )}
          </div>
          <div
            className={`${styles.shipmentId} ${styles.uktLinks} ${styles.boldls}`}
          >
            {t("resource.common.shipment")}: {item?.shipment_id}
          </div>
          {availableFOCount > 1 && item?.fulfillment_option?.name && (
            <div
              className={`${styles.shipmentId} ${styles.uktLinks} ${styles.boldls}`}
            >
              {item?.fulfillment_option?.name}
            </div>
          )}
          <div className={`${styles.shipmentStats} ${styles.light}`}>
            <span>{getTotalItems(item?.bags?.length, t)}</span>
            <span>{` | `}</span>
            <span>{getTotalPieces(item?.bags, t)}</span>
          </div>
          <div className={styles.status}>{item?.shipment_status?.title}</div>
          {isAdmin && (
            <div className={`${styles.shipmentBrands} ${styles.uktLinks}`}>
              <span className={styles.bold}>{t("resource.common.brand")}</span>:
              {item?.brand_name}
            </div>
          )}
        </div>
      </div>
      {customizationOptions.length > 0 && (
        <div className={styles.productCustomizationContainer}>
          <Accordion
            key={`${item.shipment_id}`}
            items={shipmentItems}
            onItemClick={() => handleShipmentAccordionClick(item.shipment_id)}
          />
        </div>
      )}
    </>
  );
};

function OrderShipment({
  orderInfo,
  getGroupedShipmentBags,
  globalConfig,
  onBuyAgainClick = () => {},
  isBuyAgainEligible,
  availableFOCount,
}) {
  const { t } = useGlobalTranslation("translation");
  const fpi = useFPI();
  const { language, countryCode } = useGlobalStore(fpi.getters.i18N_DETAILS);
  const locale = language?.locale;
  const [isOpen, setIsOpen] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  // const [selectedShipment, setSelectedShipment] = useState("");
  const navigate = useNavigate();
  // const params = useParams();
  const aspectRatio = useMemo(
    () => getProductImgAspectRatio(globalConfig),
    [globalConfig]
  );

  // useEffect(() => {
  //   if (params?.orderId) {
  //     setSelectedShipment(orderInfo?.shipments[0]?.shipment_id);
  //   }
  // }, [params?.orderId, orderInfo?.shipments]);

  const getTime = (time) => {
    return convertUTCDateToLocalDate(
      time,
      "",
      formatLocale(locale, countryCode)
    );
  };
  const clickopen = () => {
    setIsOpen(!isOpen);
  };
  const naivgateToShipment = (item) => {
    let link = "";
    // setSelectedShipment(item?.shipment_id);
    if (isBuyAgainEligible) {
      link = `/profile/orders/shipment/${item?.shipment_id}`;
    } else {
      link = `/order-tracking/${item?.order_id}/${item?.shipment_id}`;
    }
    navigate(link);
  };

  return (
    <div className={`${styles.orderItem}`} key={orderInfo?.order_id}>
      <div className={`${styles.orderHeader}`} onClick={clickopen}>
        <span className={`${styles.filter} `}>
          <SvgWrapper
            className={`${isOpen ? styles.filterArrowUp : styles.filterArrowdown}`}
            svgSrc="arrowDropdownBlack"
          />
        </span>
        <h3 className={`${styles.orderId}`}>{orderInfo?.order_id}</h3>
        <h4 className={`${styles.orderTime}`}>
          {getTime(orderInfo?.order_created_ts)}
        </h4>
      </div>

      <div
        className={isOpen ? styles.showAccordionBody : styles.hideAccordionBody}
      >
        {Object.keys(orderInfo)?.length !== 0 &&
          orderInfo?.shipments?.length !== 0 &&
          orderInfo?.shipments?.map((item) => {
            // Main: if bagsWithCustomization exist, render them individually. Else, render the shipment
            const { bags, bundleGroups, bundleGroupArticles } =
              getGroupedShipmentBags(item.bags);
            const bagsWithCustomization = getBagsWithCustomization(bags);

            return (
              <React.Fragment key={item.shipment_id}>
                {bagsWithCustomization.length > 0 ? (
                  bagsWithCustomization.map((el, idx) => (
                    <ShipmentDetails
                      key={item.shipment_id + "-custom-" + idx}
                      item={{
                        ...item,
                        bags: [el], // Only show this bag
                      }}
                      bundleGroups={bundleGroups}
                      bundleGroupArticles={bundleGroupArticles}
                      aspectRatio={aspectRatio}
                      naivgateToShipment={naivgateToShipment}
                      isAdmin={isAdmin}
                      t={t}
                      availableFOCount={availableFOCount}
                      getTotalItems={getTotalItems}
                      getTotalPieces={getTotalPieces}
                    />
                  ))
                ) : (
                  <ShipmentDetails
                    key={item.shipment_id}
                    item={{
                      ...item,
                      bags,
                    }}
                    bundleGroups={bundleGroups}
                    bundleGroupArticles={bundleGroupArticles}
                    aspectRatio={aspectRatio}
                    naivgateToShipment={naivgateToShipment}
                    isAdmin={isAdmin}
                    t={t}
                    availableFOCount={availableFOCount}
                    getTotalItems={getTotalItems}
                    getTotalPieces={getTotalPieces}
                  />
                )}
              </React.Fragment>
            );
          })}
        {isBuyAgainEligible && (
          <div className={`${styles.buttons}`}>
            <button
              type="button"
              className={`${styles.ordercheckout}`}
              onClick={() => onBuyAgainClick(orderInfo)}
            >
              <SvgWrapper
                className={`${styles.reorderIcon}`}
                svgSrc="re-order"
              />
              {t("resource.common.buy_again")}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default OrderShipment;
