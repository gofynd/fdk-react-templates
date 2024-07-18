import React, { useState, useEffect, useRef } from "react";

import * as styles from "./fy-image.less";
import ImageSkeleton from "../skeletons/image-skeleton";
import { getGlobalConfigValue, transformImage } from "../../../helper/utils";
// import PLACEHOLDER_URL from "../../../assets/images/placeholder.png";

const IMAGE_SIZES = [
  "original",
  "30x0",
  "44x0",
  "66x0",
  "50x0",
  "75x0",
  "60x60",
  "90x90",
  "100x0",
  "130x200",
  "135x0",
  "270x0",
  "360x0",
  "500x0",
  "400x0",
  "540x0",
  "720x0",
  "312x480",
  "resize-(w|h)?:[0-9]+(,)?(w|h)*(:)?[0-9]*",
];

function searchStringInArray(str, strArray) {
  for (let j = 0; j < strArray.length; j++) {
    if (str?.match(new RegExp(`/${strArray[j]}/`))) return strArray[j];
  }
  return "";
}

const FyImage = ({
  backgroundColor = "#ffffff",
  src = "",
  placeholder = "",
  alt = "",
  aspectRatio = 1,
  mobileAspectRatio = 1,
  showSkeleton = false,
  showOverlay = false,
  overlayColor = "#ffffff",
  sources = [
    { breakpoint: { min: 780 }, width: 1280 },
    { breakpoint: { min: 600 }, width: 1100 },
    { breakpoint: { min: 480 }, width: 1200 },
    { breakpoint: { min: 361 }, width: 900 },
    { breakpoint: { max: 360 }, width: 640 },
  ],
  isLazyLoaded = true,
  blurWidth = 50,
  customClass,
  globalConfig,
}) => {
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isIntersecting, setIsIntersecting] = useState(false);
  const imgWrapperRef = useRef(null);
  // const THEME = useGlobalStore(fpi.getters.THEME);
  // const globalConfig = THEME?.config?.list[0]?.global_config?.custom?.props;

  useEffect(() => {
    const handleIntersection = (entries) => {
      if (entries?.[0]?.isIntersecting) {
        setIsIntersecting(true);
      }
    };

    const observer = new IntersectionObserver(handleIntersection);

    if (isLazyLoaded) {
      observer.observe(imgWrapperRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [isLazyLoaded]);

  const dynamicStyles = {
    "--aspect-ratio-desktop": `${aspectRatio}`,
    "--aspect-ratio-mobile": `${mobileAspectRatio}`,
    "--bg-color": `${globalConfig?.img_container_bg || backgroundColor}`,
  };

  const overlayStyles = {
    "--overlay-bgcolor": overlayColor,
  };

  const getSrc = () => {
    const key = searchStringInArray(src, IMAGE_SIZES);

    if (isLazyLoaded && !isIntersecting) {
      return transformImage(src, key, blurWidth);
    }

    if (isError) {
      return placeholder;
    } else {
      return transformImage(src,undefined,undefined);
    }
  };

  // const getImageType = () => {
  //   if (src && src !== "") {
  //     console.log(src);
  //     src?.split(/[#?]/)?.[0]?.split(".")?.pop()?.trim() || false;
  //   }
  // };

  const fallbackSrcset = () => {
    let url = src;

    // if (getImageType().toLowerCase() === "gif") {
    //   return "";
    // }

    if (isLazyLoaded && !isIntersecting) {
      return "";
    }

    if (isError) {
      url = placeholder;
    }

    const key = searchStringInArray(url, IMAGE_SIZES);

    return sources
      .map((s) => {
        let src = url;

        if (key) {
          src = transformImage(url, key, s.width);
        }

        return `${src} ${s.width}w`;
      })
      .join(", ");
  };

  const getLazyLoadSources = () =>
    sources?.map((source) => {
      source.media = getMedia(source);
      source.srcset = getUrl(source.blurWidth ?? blurWidth, source.url);
      return source;
    });

  const getSources = () => {
    // if (isLazyLoaded && !isIntersecting) {
    //   return getLazyLoadSources();
    // }

    return getLazyLoadSources().map((source) => {
      source.srcset = getUrl(source.width, source.url);
      return source;
    });
  };

  const getMedia = (source) => {
    if (source.breakpoint) {
      const min =
        (source.breakpoint.min && `(min-width: ${source.breakpoint.min}px)`) ||
        "";
      const max =
        (source.breakpoint.max && `(max-width: ${source.breakpoint.max}px)`) ||
        "";

      if (min && max) {
        return `${min} and ${max}`;
      } else {
        return min || max;
      }
    } else {
      return "";
    }
  };

  const getUrl = (width, url = src) => {
    // if (getImageType().toLowerCase() === "gif") {
    //   return "";
    // }

    if (isError) {
      url = placeholder;
    }

    const key = searchStringInArray(url, IMAGE_SIZES);

    if (key) {
      return transformImage(url, key, width);
    } else {
      return transformImage(url,undefined,undefined);
    }
  };

  const onError = () => {
    if (isLazyLoaded && !isIntersecting) {
      return;
    }
    setIsError(true);
    setIsLoading(false);
  };

  const onLoad = (e) => {
    setIsLoading(false);
    // You can emit events or perform any other actions here
  };

  return (
    <div
      className={`${styles.imageWrapper} ${
        globalConfig?.img_fill ? styles.fill : ""
      } ${customClass}`}
      //@ts-expect-error
      style={dynamicStyles}
      ref={imgWrapperRef}
    >
      {showOverlay && (
        <div className={styles.overlay} 
        //@ts-expect-error
        style={overlayStyles}></div>
      )}
      <picture>
        {getSources().map((source, index) => (
          <source
            key={index}
            media={source.media}
            srcSet={source.srcset}
            type="image/webp"
          />
        ))}
        <img
          className={styles.fyImg}
          style={{
            display: !showSkeleton || !isLoading ? "block" : "none",
          }}
          srcSet={fallbackSrcset()}
          src={getSrc()}
          alt={alt}
          onError={onError}
          onLoad={onLoad}
        />
        {showSkeleton && isLoading && (
          <ImageSkeleton
          //@ts-ignore
            className={styles.fyImg}
          //@ts-ignore

            aspectRatio={aspectRatio}
          //@ts-ignore

            mobileAspectRatio={mobileAspectRatio}
          />
        )}
      </picture>
    </div>
  );
};

FyImage.propTypes = {
  // Define your prop types here
};

export default FyImage;
