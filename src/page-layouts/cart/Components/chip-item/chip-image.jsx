import React from "react";
import FyImage from "../../../../components/core/fy-image/fy-image";
import { getProductImgAspectRatio } from "../../../../helper/utils";
import * as styles from "./chip-image.less";

export default function ChipImage({ product, type, imageWidth, globalConfig }) {
  const aspectRatio = getProductImgAspectRatio(globalConfig);
  const productImages = product?.images
    ?.map((image) => image?.url)
    ?.slice(0, 4);

  // if (
  //   (type === "virtual_bundle" || type === "physical_bundle") &&
  //   productImages?.length > 1
  // ) {
  //   return (
  //     <div className={styles.bundleChipImages}>
  //       {productImages?.map((image, index) => (
  //         <FyImage
  //           key={index}
  //           customClass={styles.itemImg}
  //           src={image}
  //           alt={`${product?.name} - ${index + 1}`}
  //           sources={[{ width: imageWidth }]}
  //           aspectRatio={aspectRatio}
  //           isImageFill
  //         />
  //       ))}
  //     </div>
  //   );
  // }

  return (
    <FyImage
      customClass={styles.itemImg}
      src={productImages?.[0]}
      alt={product?.name}
      sources={[{ width: imageWidth }]}
      aspectRatio={aspectRatio}
      isImageFill
    />
  );
};
