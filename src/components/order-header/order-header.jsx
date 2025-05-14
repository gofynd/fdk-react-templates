/**
 * OrdersHeader is a React functional component that displays the header for an orders page.
 * It includes the title, subtitle, and filters for the orders, and manages the selected date and status filters.
 *
 * @param {Object} props - The properties object.
 * @param {string} props.title - The title to be displayed in the header.
 * @param {string} props.subtitle - The subtitle to be displayed in the header.
 * @param {Object} props.filters - An object containing filter options for the orders.
 * @param {boolean} props.flag - A boolean flag for additional functionality (not specified in the code).
 *
 * @returns {JSX.Element} A JSX element representing the orders header.
 */

import React, { useMemo } from "react";
import { useLocation } from "react-router-dom";
import * as styles from "./order-header.less";
import Dropdown from "../dropdown/dropdown";
import { DATE_FILTERS } from "../../helper/constant";

function OrdersHeader({ title, subtitle, filters, flag }) {
  const location = useLocation();
  const getSelectedDateFilter = () => {
    const selectedFilter = getDateFilterOptions()?.find(
      (obj) => obj.is_selected
    );
    return selectedFilter?.display;
  };
  const getSelectedStatus = useMemo(() => {
    return filters?.statuses.find((obj) => obj.is_selected).display;
  }, [filters]);
  const getDateFilterOptions = () => {
    const queryParams = new URLSearchParams(location.search);
    const selected_date_filter = queryParams.get("selected_date_filter") || "";
    if (selected_date_filter) {
      return DATE_FILTERS.map((dateObj) => {
        if (dateObj.value === Number(selected_date_filter)) {
          dateObj.is_selected = true;
        } else {
          dateObj.is_selected = false;
        }
        return dateObj;
      });
    }
    return DATE_FILTERS;
  };
  return (
    <div className={`${styles.orderHeader}`}>
      <div
        className={`${styles.title} ${styles.boldmd}`}
        style={{ marginLeft: flag ? 0 : "15px" }}
      >
        {title}
        <span className={` ${styles.subTitle}`}>{subtitle}</span>
      </div>
      {!flag && <div className={` ${styles.filters}`}></div>}
      {filters?.statuses && (
        <div className={`${styles.rightAlign}`}>
          <div className={`${styles.orderDropdown} ${styles.bold}`}>
            <span>Order Date:</span>
            <Dropdown
              type="time"
              selectedOption={getSelectedDateFilter()}
              dropdownData={DATE_FILTERS}
            ></Dropdown>
          </div>
          <div
            className={`${styles.orderHeader} ${styles.orderDropdown}  ${styles.bold}`}
          >
            <span>Order Status:</span>
            <Dropdown
              type="status"
              selectedOption={getSelectedStatus}
              dropdownData={filters?.statuses}
            ></Dropdown>
          </div>
        </div>
      )}
    </div>
  );
}

export default OrdersHeader;
