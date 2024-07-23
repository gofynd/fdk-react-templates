import React from "react";
import SvgWrapper from "../../../components/core/svgWrapper/SvgWrapper";

import * as styles from "./single-address-content.less";
import Loader from "../../../components/loader/loader";

function SingleAddressContent({
  allAddresses = [],
  addressLoading = false,
  editAddress,
  removeAddress,
  addressLoader,
  setAddressError,
  addressError,
  addressMsg,
  selectAddress,
  selectedAddressId,
  setSelectedAddressId,
  getOtherAddress,
  getDefaultAddress,
}) {
  return (
    <>
      {allAddresses && allAddresses.length && !addressLoader ? (
        <div className={styles.addressContentConitainer}>
          {getDefaultAddress.length ? (
            <div className={styles.heading}>Default Address</div>
          ) : null}
          {getDefaultAddress?.length > 0
            ? getDefaultAddress.map((item, index) => {
                return (
                  <>
                    <div
                      key={index}
                      className={styles.addressContent}
                      onClick={() => {
                        setSelectedAddressId(item.id);
                        setAddressError(false);
                      }}
                      style={
                        selectedAddressId !== item.id
                          ? { border: "1px solid #f0f0f0" }
                          : {}
                      }
                    >
                      <div className={styles.addressContentTop}>
                        <div className={styles.addressContentTopLeft}>
                          {selectedAddressId == item.id ? (
                            <SvgWrapper svgSrc={"radio-selected"}></SvgWrapper>
                          ) : (
                            <SvgWrapper svgSrc={"radio"}></SvgWrapper>
                          )}
                          <span className={styles.phnumber}>
                            {item.country_code + item.phone}
                          </span>
                          <span className={styles.lable}>
                            {item.address_type}
                          </span>
                        </div>
                        {selectedAddressId == item.id && (
                          <div className={styles.addressContentTopRight}>
                            <span
                              className={styles.edit}
                              onClick={() => editAddress(item)}
                            >
                              edit
                            </span>
                            <span>|</span>
                            <span
                              className={styles.remove}
                              onClick={removeAddress}
                            >
                              Remove
                            </span>
                          </div>
                        )}
                      </div>
                      <div className={styles.addressMid}>{`${item.address}, ${
                        item.area
                      } ${item.landmark ? "," + item.landmark : ""} ${
                        item.city ? "," + item.city : ""
                      } - ${item.area_code}`}</div>
                      <div className={styles.phEnd}>
                        {"+" + item.country_code + "-" + item.phone}
                      </div>
                      {addressError && selectedAddressId == item.id && (
                        <div className={styles.errorMsg}>{addressMsg}</div>
                      )}
                      {selectedAddressId == item.id && (
                        <div
                          className={styles.deliverToThis}
                          onClick={selectAddress}
                        >
                          {" "}
                          DELIVER TO THIS ADDRESS
                        </div>
                      )}
                    </div>
                  </>
                );
              })
            : null}
          {getOtherAddress.length ? (
            <div className={styles.heading}>Other Address</div>
          ) : null}
          {getOtherAddress?.length > 0
            ? getOtherAddress.map((item, index) => {
                return (
                  <div
                    key={item.id}
                    className={styles.addressContent}
                    onClick={() => {
                      setSelectedAddressId(item.id);
                      setAddressError(false);
                    }}
                    style={
                      selectedAddressId !== item.id
                        ? { border: "1px solid #f0f0f0" }
                        : {}
                    }
                  >
                    <div className={styles.addressContentTop}>
                      <div className={styles.addressContentTopLeft}>
                        {selectedAddressId == item.id ? (
                          <SvgWrapper svgSrc={"radio-selected"}></SvgWrapper>
                        ) : (
                          <SvgWrapper svgSrc={"radio"}></SvgWrapper>
                        )}
                        <span className={styles.phnumber}>
                          {item.country_code + item.phone}
                        </span>
                        <span className={styles.lable}>
                          {item.address_type}
                        </span>
                      </div>
                      {selectedAddressId == item.id && (
                        <div className={styles.addressContentTopRight}>
                          <span
                            className={styles.edit}
                            onClick={() => editAddress(item)}
                          >
                            edit
                          </span>
                          <span>|</span>
                          <span
                            className={styles.remove}
                            onClick={removeAddress}
                          >
                            Remove
                          </span>
                        </div>
                      )}
                    </div>
                    <div className={styles.addressMid}>{`${item.address}, ${
                      item.area
                    } ${item.landmark ? "," + item.landmark : ""} ${
                      item.city ? "," + item.city : ""
                    } - ${item.area_code}`}</div>
                    <div className={styles.phEnd}>
                      {"+" + item.country_code + "-" + item.phone}
                    </div>
                    {addressError && selectedAddressId == item.id && (
                      <div className={styles.errorMsg}>{addressMsg}</div>
                    )}
                    {selectedAddressId == item.id && (
                      <div
                        className={styles.deliverToThis}
                        onClick={selectAddress}
                      >
                        {" "}
                        DELIVER TO THIS ADDRESS
                      </div>
                    )}
                  </div>
                );
              })
            : ""}
        </div>
      ) : (
        <>
          {addressLoading || addressLoader ? (
            <Loader></Loader>
          ) : (
            <div
              className={styles.addressContentConitainer}
              style={{ textAlign: "center", color: "var(--textLabel)" }}
            >
              {" "}
              No Address Found, Please Add Address
            </div>
          )}
        </>
      )}
    </>
  );
}

export default SingleAddressContent;
