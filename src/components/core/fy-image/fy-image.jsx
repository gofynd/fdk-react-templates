/**
 * FyImage is a React component that renders an image with various configurations.
 * It supports lazy loading, aspect ratio adjustments, and responsive image sources.
 *
 * @param {Object} props - The properties object.
 * @param {string} props.backgroundColor - The background color of the image container.
 * @param {string} props.src - The source URL of the image.
 * @param {string} props.placeholder - The placeholder image URL to display in case of an error.
 * @param {string} props.alt - The alt text for the image.
 * @param {boolean} props.isImageFill - Determines if the image should fill its container.
 * @param {boolean} props.isFixedAspectRatio - Determines if the image should maintain a fixed aspect ratio.
 * @param {number} props.aspectRatio - The aspect ratio for desktop view.
 * @param {number} [props.mobileAspectRatio] - The aspect ratio for mobile view.
 * @param {boolean} props.showSkeleton - Determines if a skeleton loader should be shown while loading.
 * @param {boolean} props.showOverlay - Determines if an overlay should be shown over the image.
 * @param {string} props.overlayColor - The color of the overlay.
 * @param {Array} props.sources - An array of objects defining responsive image sources with breakpoints and widths.
 * @param {boolean} props.isLazyLoaded - Determines if the image should be lazy-loaded.
 * @param {number} props.blurWidth - The width for the blurred version of the image.
 * @param {string} [props.customClass] - Custom CSS class for additional styling.
 * @param {Object} [props.globalConfig] - Global configuration object for additional settings.
 * @param {boolean} props.defer - Determines if the image loading should be deferred.
 * @param {Object} ref - A React ref object for accessing the DOM element.
 *
 * @returns {JSX.Element} A JSX element representing the image container with the configured properties and behaviors.
 */

import React, { useState, useEffect, useRef, useMemo, forwardRef } from "react";
import * as styles from "./fy-image.less";
import ImageSkeleton from "../skeletons/image-skeleton";
import { transformImage } from "../../../helper/utils";

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

const FyImage = forwardRef(
  (
    {
      backgroundColor = "#ffffff",
      src = "",
      placeholder = "",
      alt = "",
      isImageFill = false,
      isFixedAspectRatio = true,
      aspectRatio = 1,
      mobileAspectRatio,
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
      defer = true,
      overlayCustomClass,
    },
    ref
  ) => {
    const [isError, setIsError] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isIntersecting, setIsIntersecting] = useState(false);
    const imgWrapperRef = useRef(null);

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
      "--aspect-ratio-mobile": `${mobileAspectRatio || aspectRatio}`,
      "--bg-color": `${globalConfig?.img_container_bg || backgroundColor}`,
    };

    const overlayStyles = {
      "--overlay-bgcolor": overlayColor,
    };

    const isImageResizable = useMemo(() => {
      const imagePattern = /\.(svg|gif)$/i;

      return !src.match(imagePattern);
    }, [src]);

    const getSrc = () => {
      if (!isImageResizable) {
        return src;
      }

      const key = searchStringInArray(src, IMAGE_SIZES);

      if (isLazyLoaded && !isIntersecting) {
        return transformImage(src, key, blurWidth);
      }

      if (isError) {
        return placeholder;
      } else {
        return transformImage(src, undefined, undefined);
      }
    };

    const fallbackSrcset = () => {
      let url = src;

      if ((isLazyLoaded && !isIntersecting) || !isImageResizable) {
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
      if (!isImageResizable) {
        return [];
      }
      return getLazyLoadSources().map((source) => {
        source.srcset = getUrl(source.width, source.url);
        return source;
      });
    };

    const getMedia = (source) => {
      if (source.breakpoint) {
        const min =
          (source.breakpoint.min &&
            `(min-width: ${source.breakpoint.min}px)`) ||
          "";
        const max =
          (source.breakpoint.max &&
            `(max-width: ${source.breakpoint.max}px)`) ||
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
      if (isError) {
        url = placeholder;
      }

      const key = searchStringInArray(url, IMAGE_SIZES);

      if (key) {
        return transformImage(url, key, width);
      } else {
        return transformImage(url, undefined, undefined);
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
    };

    return (
      <div
        className={`${styles.imageWrapper} ${isImageFill ? styles.fill : ""}
      ${isFixedAspectRatio ? styles.fixedAspRatio : ""} ${customClass}`}
        style={dynamicStyles}
        ref={imgWrapperRef}
      >
        {showOverlay && (
          <div
            className={`${styles.overlay} ${overlayCustomClass}`}
            style={overlayStyles}
          ></div>
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
            loading={defer ? "lazy" : "eager"}
            fetchPriority={defer ? "low" : "high"}
            ref={ref}
          />
          {showSkeleton && isLoading && (
            <ImageSkeleton
              className={styles.fyImg}
              aspectRatio={aspectRatio}
              mobileAspectRatio={mobileAspectRatio || aspectRatio}
            />
          )}
        </picture>
      </div>
    );
  }
);

FyImage.propTypes = {
  // Define your prop types here
};

export default FyImage;
