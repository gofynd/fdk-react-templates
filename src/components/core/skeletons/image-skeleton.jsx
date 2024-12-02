/**
 * A React functional component that renders two canvas elements with specified dimensions.
 *
 * @param {Object} props - The properties object.
 * @param {number} [props.aspectRatio=1] - The aspect ratio for the main canvas. Defaults to 1.
 * @param {number} [props.mobileAspectRatio=1] - The aspect ratio for the mobile canvas. Defaults to 1.
 * @param {number} [props.width=100] - The width of both canvas elements. Defaults to 100.
 *
 * @returns {JSX.Element} A JSX element containing two canvas elements with calculated heights based on the provided aspect ratios.
 */

import React from "react";
import PropTypes from "prop-types";
import * as styles from "./skeletons.less";

const ImageSkeleton = ({
  aspectRatio = 1,
  mobileAspectRatio = 1,
  width = 100,
}) => {
  const height = Math.floor(width / aspectRatio);
  const mobileHeight = Math.floor(width / (mobileAspectRatio || aspectRatio));

  return (
    <div className={styles.card}>
      <canvas width={width} height={height}></canvas>
      <canvas
        className={styles.mobileCanvas}
        width={width}
        height={mobileHeight}
      ></canvas>
    </div>
  );
};

ImageSkeleton.propTypes = {
  aspectRatio: PropTypes.number,
  mobileAspectRatio: PropTypes.number,
  width: PropTypes.number,
};

export default ImageSkeleton;
