import React from "react";
import { FDKLink } from "fdk-core/components";
import * as styles from "./breadcrumb.less";

const Breadcrumb = ({ breadcrumb = [] }) => {
  const itemsList = breadcrumb?.slice(0, breadcrumb?.length - 1);

  return (
    <div className={styles.breadcrumbs}>
      {itemsList.map((item, index) => (
        <span key={index}>
          <FDKLink to={item?.link}>{item?.label}</FDKLink>&nbsp; / &nbsp;
        </span>
      ))}
      <span className={styles.active}>
        {breadcrumb?.[breadcrumb?.length - 1]?.label}
      </span>
    </div>
  );
};

export default Breadcrumb;
