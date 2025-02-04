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

import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import * as styles from "./order-shipment.less";
import SvgWrapper from "../../components/core/svgWrapper/SvgWrapper";
import { convertUTCDateToLocalDate } from "../../helper/utils";

function OrderShipment({
  orderInfo,
  onBuyAgainClick = () => {},
  isBuyAgainEligible,
}) {
  const [isOpen, setIsOpen] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [selectedShipment, setSelectedShipment] = useState("");
  const navigate = useNavigate();
  const params = useParams();

  useEffect(() => {
    if (params?.orderId) {
      setSelectedShipment(orderInfo?.shipments[0]?.shipment_id);
    }
  }, [params?.orderId]);

  const getTime = (time) => {
    return convertUTCDateToLocalDate(time);
  };
  const clickopen = () => {
    setIsOpen(!isOpen);
  };
  const naivgateToShipment = (item) => {
    let link = "";
    setSelectedShipment(item?.shipment_id);
    if (isBuyAgainEligible) {
      link = `/profile/orders/shipment/${item?.shipment_id}`;
    } else {
      link = `/order-tracking/${item?.order_id}/${item?.shipment_id}`;
    }
    navigate(link);
  };
  const getProductsName = (bags) => {
    let items = bags.map((it) => {
      return it.item;
    });
    items = items.filter(Boolean);

    if (items && items.length) {
      const productNames = items.map((it) => {
        return it.name;
      });

      return [...new Set(productNames)];
    }
    return [];
  };
  const getTotalItems = (items) => {
    return items === 1 ? `${items} Item` : `${items} Items`;
  };
  const getTotalPieces = (pieces) => {
    const total = pieces.reduce((pre, curr) => {
      return pre + curr.quantity;
    }, 0);

    return total === 1 ? `${total} Piece` : `${total} Pieces`;
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
        <h3 className={`${styles.bold}`}>{orderInfo?.order_id}</h3>
        <h4 className={`${styles.light}`}>
          {getTime(orderInfo?.order_created_ts)}
        </h4>
      </div>
      {isOpen && (
        <div>
          {Object.keys(orderInfo)?.length !== 0 &&
            orderInfo?.shipments?.length !== 0 &&
            orderInfo?.shipments?.map((item, index) => {
              return (
                <div
                  className={`${styles.shipmentData} ${selectedShipment === item.shipment_id ? styles.selectedto : ""}`}
                  key={`${item.shipment_id}`}
                >
                  <div onClick={() => naivgateToShipment(item)}>
                    <div className={`${styles.shipmentLeft}`}>
                      <img
                        className={`${isOpen ? styles.filterArrowUp : styles.filterArrowdown}`}
                        src={item?.bags?.[0]?.item?.image?.[0]}
                        alt={item?.shipment_images?.[0]}
                      />
                      {item?.bags?.length > 1 && (
                        <div id="total-item">
                          +{item?.bags?.length - 1 + " "}
                          more
                        </div>
                      )}
                    </div>
                    <div className={`${styles.shipmentRight}`}>
                      <div className={`${styles.uktLinks}`}>
                        {item?.bags?.length > 1 ? (
                          <div>
                            {getProductsName(item?.bags)?.[0]} +
                            {item.bags.length - 1 + " "}
                            more
                          </div>
                        ) : (
                          <div>{getProductsName(item?.bags)?.[0]}</div>
                        )}
                      </div>
                      <div
                        className={`${styles.shipmentId} ${styles.boldls} ${styles.uktLinks}`}
                      >
                        Shipment: {item?.shipment_id}
                      </div>
                      <div
                        className={`${styles.shipmentStats} ${styles.light}`}
                      >
                        <span>{getTotalItems(item?.bags?.length)}</span>
                        <span>{` | `}</span>
                        <span>{getTotalPieces(item?.bags)}</span>
                      </div>
                      <div
                        className={`${styles.status} ${styles.regular}`}
                        style={{
                          backgroundColor:
                            item.shipment_status.hex_code || "green",
                        }}
                      >
                        {item?.shipment_status?.title}
                      </div>
                      {isAdmin && (
                        <div className={`${styles.shipmentBrands}`}>
                          <span className={`${styles.bold}`}>Brand</span> :
                          {item?.brand_name}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
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
                BUY AGAIN
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default OrderShipment;
