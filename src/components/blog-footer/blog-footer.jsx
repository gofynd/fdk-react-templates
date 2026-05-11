/**
 * BlogFooter is a React functional component that renders a footer section for a blog.
 * It displays a title, description, and an optional call-to-action button.
 *
 * @param {Object} props - The properties object.
 * @param {string} props.title - The title to be displayed in the footer.
 * @param {string} props.description - The description text to be displayed in the footer.
 * @param {string} props.button_text - The text to be displayed on the call-to-action button.
 * @param {string} props.button_link - The URL to which the call-to-action button should link.
 *
 * @returns {JSX.Element|null} A JSX element representing the footer, or null if no title, description, or button text is provided.
 */

import React from "react";
import { FDKLink } from "fdk-core/components";
import * as styles from "./blog-footer.less";

function BlogFooter({ title, description, button_text, button_link }) {
  if (!title && !description && !button_text) {
    return null;
  }
  return (
    <div className={`${styles.footer}`}>
      <div className={`${styles.footer__container}`}>
        <h2 className={`${styles.footer__title}`}>{title}</h2>
        <p
          className={`${styles.footer__description} ${styles.textBody} ${styles.breakWords}`}
        >
          {description}
        </p>
        {button_text && (
          <div className={`${styles.footer__ctaWrapper} `}>
            <FDKLink
              className={`${styles.footer__cta} ${styles.btnPrimary} ${styles.breakWords}`}
              to={button_link}
            >
              {button_text}
            </FDKLink>
          </div>
        )}
      </div>
    </div>
  );
}

export default BlogFooter;
