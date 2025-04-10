/**
 * Dropdown component that manages the display and behavior of a dropdown menu.
 * It allows users to select options and updates the URL query parameters based on the selection.
 *
 * @param {Object} props - The properties object.
 * @param {string} props.type - The type of dropdown, which determines the query parameter to update ('time' or 'status').
 * @param {Object} props.selectedOption - The currently selected option in the dropdown.
 * @param {Array} props.dropdownData - The data used to populate the dropdown options.
 *
 * @returns {JSX.Element} The rendered dropdown component.
 *
 */

import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import OutsideClickHandler from "react-outside-click-handler";
import * as styles from "./dropdown.less";
import SvgWrapper from "../../components/core/svgWrapper/SvgWrapper";
import { useNavigate, useGlobalTranslation } from "fdk-core/utils";
import { startsWithResource } from "../../helper/utils";

function Dropdown({ type, selectedOption, dropdownData }) {
  const { t } = useGlobalTranslation("translation");
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const openDropdown = () => {
    setIsOpen(!isOpen);
  };
  const replaceQueryParam = (key, value) => {
    const querParams = new URLSearchParams(location.search);
    querParams.set(key, value);
    navigate({
      pathname: "/profile/orders",
      search: querParams.toString(),
    });
    close();
    getOrderDataWithFilterQuery();
  };
  const getOrderDataWithFilterQuery = () => { };
  const replaceQuery = (option) => {
    switch (type) {
      case "time": {
        replaceQueryParam("selected_date_filter", option.value);
        break;
      }
      case "status": {
        replaceQueryParam("status", option.value);
        break;
      }
      default:
        break;
    }
  };
  const close = () => {
    setIsOpen(false);
  };
  return (
    <OutsideClickHandler onOutsideClick={() => setIsOpen(false)}>
      <div className={`${styles.selected}`} onClick={openDropdown}>
        {startsWithResource(selectedOption) ? t(selectedOption) : selectedOption}
        <SvgWrapper svgSrc="arrowDropdownBlack" onBlur={close} />
        {isOpen && (
          <ul className={`${styles.menu}`}>
            {dropdownData.map((option, index) => (
              <li key={index} onClick={() => replaceQuery(option)}>
                {!option.is_selected && <SvgWrapper svgSrc="radio" />}
                {option.is_selected && <SvgWrapper svgSrc="radio-selected" />}
                <span>{startsWithResource(option.display) ? t(option.display) : option.display}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </OutsideClickHandler>
  );
}

export default Dropdown;
