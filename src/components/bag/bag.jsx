import React, { useMemo } from "react";
import * as styles from "./bag.less";
import FyImage from "../core/fy-image/fy-image";

export function BagImage({ bag, isBundle, width = 80, aspectRatio }) {
  const src = isBundle
    ? bag?.bundle_details?.images?.[0]
    : bag?.item?.image?.[0];
  const name = isBundle ? bag?.bundle_details?.name : bag?.item?.name;
  return (
    <FyImage
      customClass={styles.bagImg}
      src={src}
      alt={name}
      sources={[{ width }]}
      aspectRatio={aspectRatio}
      isImageFill
    />
  );
};

export function BundleBagImage({
  item,
  bundleGroupId,
  bundleGroupArticles,
  aspectRatio,
}) {
  const uniueBagItems = useMemo(
    () => bundleGroupArticles?.[bundleGroupId] || [],
    [bundleGroupId, bundleGroupArticles]
  );
  const bundleImages = useMemo(() => {
    const articleImages = uniueBagItems.map((bag) => bag?.item?.image);
    const maxLen = Math.max(
      0,
      ...articleImages.map((a) => (Array.isArray(a) ? a.length : 0))
    );
    const bundleImages = [];

    for (let col = 0; col < maxLen && bundleImages.length < 4; col++) {
      for (
        let row = 0;
        row < articleImages.length && bundleImages.length < 4;
        row++
      ) {
        const val = articleImages[row]?.[col];
        if (val !== undefined) bundleImages.push(val);
      }
    }
    return bundleImages;
  }, [uniueBagItems]);

  return (
    <div
      className={`${styles.bagImg} ${styles.bundleImg}`}
      style={{
        "--aspectRatio": `${aspectRatio}`,
      }}
    >
      {bundleImages.map((image, index) => (
        <div className={styles.bundleImgItem} key={index}>
          <FyImage
            customClass={styles.itemImg}
            src={image}
            alt={item?.name}
            sources={[{ width: 80 }]}
            aspectRatio={aspectRatio}
            isImageFill
          />
          {index === 3 && uniueBagItems.length > 4 && (
            <div className={`${styles.bundleCount}`}>
              +{uniueBagItems.length - 4}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
