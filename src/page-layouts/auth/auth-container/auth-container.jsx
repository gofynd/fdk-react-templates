import React from "react";
import * as styles from "./auth-container.less";

function AuthContainer({ children }) {
	return (
		<div className={styles.loginWrapper}>
			<div className={styles.loginCard}>
				{/* <div className={styles.loginBannerWrapper}>
					<img
						src="https://hdn-1.addsale.com/x0/company/164/applications/5efc9913f474c329718e3690/application/pictures/free-logo/original/olqHM8LNr-JioMart-Groceries.png"
						alt="logo"
						className={styles.desktopImg}
					/>
				</div> */}

				<div className="loginContent">{children}</div>
			</div>
		</div>
	);
}

export default AuthContainer;
