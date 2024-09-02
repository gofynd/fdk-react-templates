import React, { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { ALL_PROFILE_MENU } from "../../helper/constant";
import SvgWrapper from "../core/svgWrapper/SvgWrapper";
import { FDKLink } from "fdk-core/components";
import * as styles from "./profile-navigation.less";
import { detectMobileWidth } from "../../helper/utils";

function ProfileNavigation({ children, signOut, userProfilePicUrl, userName }) {
  const [isMobile, setIsMobile] = useState(true);
  const { pathname } = useLocation();

  const hideProfileContent = useMemo(
    () => pathname === "/profile/profile-tabs",
    [pathname]
  );
  const hideNavBar = useMemo(
    () => isMobile && pathname !== "/profile/profile-tabs",
    [isMobile, pathname]
  );

  const handleSignOut = () => {
    signOut();
  };

  useEffect(() => {
    setIsMobile(detectMobileWidth());
  }, []);

  return (
    <div
      className={`${styles.profilePageContainer} ${styles.margin0auto} ${styles.basePageContainer}`}
    >
      <div className={styles.mainView}>
        {!hideProfileContent && (
          <div className={styles.profileContent}>{children}</div>
        )}
        {!hideNavBar && (
          <div className={styles.navContainer}>
            <div className={styles.userData}>
              <div className={`${styles.defaultImage} ${styles.flexCenter}`}>
                <img
                  className={styles.accountIcon}
                  src={userProfilePicUrl}
                  alt="user"
                />
              </div>
              <div className={styles.nameContainer}>
                <p className={styles.name}>{userName}</p>
                <FDKLink
                  className={styles.flexAlignCenter}
                  to="/profile/details"
                >
                  <p className={styles.editLink}>Edit Profile</p>
                </FDKLink>
              </div>
            </div>
            <div className={styles.accountHeader}>My Account</div>
            <ul>
              {ALL_PROFILE_MENU.map((item) => (
                <li
                  className={`${styles.nav} ${pathname === item.link ? styles.selected : ""}`}
                  key={item.display}
                >
                  <FDKLink className={styles.flexAlignCenter} to={item.link}>
                    <span className={styles.menuIcon}>
                      <SvgWrapper svgSrc={item.icon} />
                    </span>
                    <span className={styles.itemTitle}>{item.display}</span>
                  </FDKLink>
                </li>
              ))}
            </ul>
            <div className={styles.versionContainer}>
              <div className={styles.signOut} onClick={handleSignOut}>
                Sign Out
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProfileNavigation;
