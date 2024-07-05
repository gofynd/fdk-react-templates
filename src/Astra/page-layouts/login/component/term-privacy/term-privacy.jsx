import React from "react";
import { FDKLink } from "fdk-core/components";
import * as styles from "./term-privacy.less";

function TermPrivacy() {
	return (
		<div className={styles.midLinks}>
			By continuing, I agree to the&nbsp;
			<FDKLink to="/terms-and-conditions" target="_blank">
				Terms of Service
			</FDKLink>
			&nbsp;&amp;&nbsp;
			<FDKLink to="/privacy-policy" target="_blank">
				Privacy Policy
			</FDKLink>
		</div>
	);
}

export default TermPrivacy;
