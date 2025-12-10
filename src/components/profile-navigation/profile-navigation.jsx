/**
 * ProfileNavigation component renders the navigation structure for a user's profile page.
 * It adjusts the visibility of profile content and navigation bar based on the current route
 * and device type (mobile or not).
 *
 * @param {Object} props - The properties object.
 * @param {React.ReactNode} props.children - The child components to be rendered within the profile navigation.
 * @param {Function} props.signOut - A function to handle user sign-out.
 * @param {string} props.userProfilePicUrl - The URL of the user's profile picture.
 * @param {string} props.userName - The name of the user.
 * @param {Array} props.leftSections - Array of sections to render in the left panel (children area).
 * @param {Array} props.rightSections - Array of sections to render in the right panel (navigation area).
 * @param {Object} props.fpi - Fynd Platform Interface object.
 * @param {Object} props.globalConfig - Global configuration object.
 *
 * @returns {JSX.Element} The rendered profile navigation component.
 *
 */

import React, { useMemo } from "react";
import { useLocation } from "react-router-dom";
import { SectionRenderer } from "fdk-core/components";
import * as styles from "./profile-navigation.less";
import { useMobile } from "../../helper/hooks/useMobile";
import { useGlobalTranslation, useGlobalStore } from "fdk-core/utils";

function ProfileNavigation({
  children,
  leftSections = [],
  rightSections = [],
  fpi,
  globalConfig,
}) {
  const { t } = useGlobalTranslation("translation");
  const isMobile = useMobile();
  const { pathname } = useLocation();
  const { language } = useGlobalStore(fpi.getters.i18N_DETAILS);
  const locale = language?.locale;

  const hideProfileContent = useMemo(
    () => pathname === "/profile/profile-tabs" && pathname !== `/${locale}/profile/profile-tabs`,
    [pathname]
  );
  const hideNavBar = useMemo(
    () => isMobile && pathname !== "/profile/profile-tabs" && pathname !== `/${locale}/profile/profile-tabs`,
    [isMobile, pathname]
  );

  // Render left content (children or left sections)
  const renderLeftContent = () => {
    if (leftSections.length > 0 && fpi && globalConfig) {
      return (
        <SectionRenderer
          sections={leftSections}
          fpi={fpi}
          globalConfig={globalConfig}
        />
      );
    }
    return children;
  };

  // Render right content (navigation or right sections)
  const renderRightContent = () => {
    if (rightSections.length > 0 && fpi && globalConfig) {
      return (
        <SectionRenderer
          sections={rightSections}
          fpi={fpi}
          globalConfig={globalConfig}
        />
      );
    }
  };

  return (
    <div
      className={`${styles.profilePageContainer} ${styles.margin0auto} ${styles.basePageContainer}`}
    >
      <div className={styles.mainView}>
        {!hideProfileContent && (
          <div className={styles.profileContent}>{renderLeftContent()}</div>
        )}
        {!hideNavBar && (
          <div className={styles.navContainer}>{renderRightContent()}</div>
        )}
      </div>
    </div>
  );
}

export default ProfileNavigation;
