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
