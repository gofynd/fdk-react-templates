import React, { useState, useEffect, useRef } from "react";
import SvgWrapper from "../../../../components/core/svgWrapper/SvgWrapper";
import PicZoom from "../pic-zoom/pic-zoom";
import FyImage from "../../../../components/core/fy-image/fy-image";
import {
  getProductImgAspectRatio,
  isRunningOnClient,
} from "../../../../helper/utils";
import * as styles from "./image-gallery.less";
import LightboxImage from "../lightbox-image/lightbox-image";
import MobileSlider from "../mobile-slider/mobile-slider";
import { useGlobalTranslation } from "fdk-core/utils";

const QUICK_SHOP_WISHLIST_EMPTY =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAYCAYAAAAPtVbGAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAOdEVYdFNvZnR3YXJlAEZpZ21hnrGWYwAAAOVJREFUeAHtlTEOgzAMAE3VhYkRNkbExAgTKxOfRHwAeAH8AH7AKxhTbClRW1V2qEoXclJEokQ54tiKp3bgRLydG/wBJ7mo5C4tWNcVhmGgfl3XEAQBtG1rxnEcS1vwJ+n7HqqqItGyLNRP09SMi6KAaZpARDHkea66rjPjpmmoacZxpDUc6PC4ivd9H7ZtY39SWiNWfFmWbDjwrrIsAxHuqPM8qyRJ6Htk7j1crETHPQzDl82wH0URzUlYSRC8bC3SgucE+IlEizA82GwFWsJm16eLxmLEhLAFs+uQ5Bvco+Uk5/IA0ejvuYOyhUIAAAAASUVORK5CYII=";
const QUICK_SHOP_WISHLIST_FILLED =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAYCAYAAAAPtVbGAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAOdEVYdFNvZnR3YXJlAEZpZ21hnrGWYwAAAMpJREFUeAHtlbEOgyAQQM+mg06ubo6Ojm7+AT9J+AHCF/AJfAJfwUg9EppIK0fb2EVeconI6Uu4u9D4DTiRZuMGf6BKLiq5UwnWWlBKhWfGGPR9D0KI53ocRyDxGbTWfhgG37ZtiGmaQsQ1BubkICXLsux++C4wh5I0uYnvug5KcM4d7pETv64rUMzzTOZkj8sYs6tJGriHOT/VBMHCHkmklNTnZRKEc/4iwHclFEtSUakgSrLdlYJDicNY0hAR7K6PJN9QL60qOZcHQfXqFwj9LwgAAAAASUVORK5CYII=";

function ImageGallery({
  images,
  displayThumbnail = true,
  product,
  iconColor = "",
  globalConfig = {},
  isLoading,
  hiddenDots = false,
  slideTabCentreNone = false,
  hideImagePreview = false,
  isQuickShopGallery = false,
  isFollowed = false,
  onWishlistClick = () => {},
}) {
  const { t } = useGlobalTranslation("translation");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [enableLightBox, setEnableLightBox] = useState(false);
  const [src, setSrc] = useState(images?.[0]?.url || "");
  const [type, setType] = useState(images[0]?.type || "");
  const [alt, setAlt] = useState(images[0]?.alt || "");
  const [isFrameLoading, setIsFrameLoading] = useState(true);
  const [resumeVideo, setResumeVideo] = useState(false);

  const itemWrapperRef = useRef(null);

  useEffect(() => {
    if (isRunningOnClient() && enableLightBox) {
      document.body.style.position = "fixed";
    } else {
      document.body.style.position = "";
    }
  }, [enableLightBox]);

  useEffect(() => {
    if (images.length) {
      setSrc(images[0]?.url);
      setType(images[0]?.type || "");
      setAlt(images[0]?.alt || "");
    }
  }, [images]);

  const setMainImage = (e, index) => {
    e.preventDefault();
    if (index >= 0) {
      setSrc(images[index]?.url || "");
      setType(images[index]?.type || "");
      setAlt(images?.[index]?.alt || "");
      setCurrentImageIndex(index);
    }
  };

  const getImageURL = (srcUrl) =>
    `http://img.youtube.com/vi/${srcUrl?.substr(srcUrl?.lastIndexOf("/") + 1)}/0.jpg`;

  const prevSlide = () => {
    if (currentImageIndex === 0) {
      return;
    }
    if (!hiddenDots) {
      itemWrapperRef.current.scrollLeft -= 75;
    }
    setCurrentImageIndex((prevIndex) => prevIndex - 1);
    setSrc(images[currentImageIndex - 1]?.url || "");
    setType(images[currentImageIndex - 1]?.type || "");
    setAlt(images?.[currentImageIndex - 1]?.alt || "");
  };

  const nextSlide = () => {
    if (currentImageIndex === images.length - 1) {
      return;
    }
    if (!hiddenDots) {
      itemWrapperRef.current.scrollLeft += 75;
    }
    setCurrentImageIndex((prevIndex) => prevIndex + 1);
    setSrc(images[currentImageIndex + 1]?.url || "");
    setType(images[currentImageIndex + 1]?.type || "");
    setAlt(images?.[currentImageIndex + 1]?.alt || "");
  };

  const openGallery = () => {
    setEnableLightBox(true);
  };

  const getQuickShopBadge = () => {
    if (typeof product?.teaser_tag === "string") {
      return product.teaser_tag;
    }
    return product?.teaser_tag?.name || product?.teaser_tag?.tag || "";
  };

  if (isQuickShopGallery) {
    const quickShopImages = images?.filter(
      (item) => !item?.type || item?.type === "image"
    );
    const visibleImages = quickShopImages?.length ? quickShopImages : images;
    const badgeText = getQuickShopBadge();

    return (
      <div className={styles.quickShopGallery}>
        {!!badgeText && (
          <div className={styles.quickShopBadge}>{badgeText}</div>
        )}
        <button
          type="button"
          className={`${styles.quickShopWishlist} ${isFollowed ? styles.active : ""}`}
          aria-label={isFollowed ? "Remove from wishlist" : "Add to wishlist"}
          onClick={onWishlistClick}
        >
          <img
            className={styles.quickShopWishlistIcon}
            src={
              isFollowed
                ? QUICK_SHOP_WISHLIST_FILLED
                : QUICK_SHOP_WISHLIST_EMPTY
            }
            alt=""
            aria-hidden="true"
          />
        </button>
        {visibleImages?.map((item, index) => (
          <button
            type="button"
            key={`${item?.url}-${index}`}
            className={styles.quickShopImageFrame}
            onClick={() => {
              setCurrentImageIndex(index);
              setEnableLightBox(true);
            }}
            aria-label={item?.alt || "View product image"}
          >
            <FyImage
              customClass={styles.quickShopImage}
              src={item?.url}
              alt={item?.alt || product?.name}
              aspectRatio={2 / 3}
              sources={[{ width: 720 }, { width: 540 }]}
              globalConfig={globalConfig}
              isImageFill={globalConfig?.img_fill}
              backgroundColor={
                globalConfig?.img_container_bg || "oklch(96% 0.006 100)"
              }
              defer={index > 0}
            />
          </button>
        ))}
        {enableLightBox && (
          <LightboxImage
            images={images}
            showCaption={false}
            showLightBox={enableLightBox}
            iconColor={iconColor}
            toggleResumeVideo={() => setResumeVideo((prev) => !prev)}
            globalConfig={globalConfig}
            closeGallery={() => setEnableLightBox(false)}
            currentIndex={currentImageIndex}
          />
        )}
      </div>
    );
  }

  return (
    <div className={styles.galleryBox}>
      <div className={`${styles.imageGallery} ${styles.desktop}`}>
        <div className={styles.flexAlignCenter}>
          <div>
            <SvgWrapper
              svgSrc="carousel-nav-arrow"
              className={`${styles.carouselArrow} ${styles["carouselArrow--left"]
                } ${currentImageIndex <= 0 ? styles.disableArrow : ""}`}
              onClick={prevSlide}
            />
          </div>
          <div className={styles.imageBox}>
            <PicZoom
              customClass={styles.imageItem}
              source={src}
              type={type}
              alt={alt}
              currentIndex={currentImageIndex}
              onClickImage={() => openGallery()}
              isFrameLoading={isFrameLoading}
              resumeVideo={resumeVideo}
              globalConfig={globalConfig}
              isLoading={isLoading}
              hideImagePreview={hideImagePreview}
            />
            {product?.custom_order?.is_custom_order && (
              <div className={`${styles.badge} ${styles.b4}`}>
                {t("resource.product.made_to_order")}
              </div>
            )}
          </div>
          <div>
            <SvgWrapper
              svgSrc="carousel-nav-arrow"
              className={`${styles.carouselArrow} ${currentImageIndex >= images.length - 1
                ? styles.disableArrow
                : ""
                }`}
              onClick={nextSlide}
            />
          </div>
        </div>

        {!hiddenDots && (
          <div
            className={`${styles.thumbSlider} ${displayThumbnail ? "" : styles.hidden
              }}`}
          >
            <div
              className={`${styles.thumbWrapper} ${images && images.length < 5 ? styles.removeWidth : ""
                }`}
            >
              <button
                type="button"
                className={`${styles.prevBtn} ${styles.btnNavGallery}`}
                onClick={prevSlide}
                aria-label={t("resource.facets.prev")}
              >
                <SvgWrapper
                  svgSrc="arrow-left"
                  className={`${currentImageIndex <= 0 ? styles.disableArrow : ""
                    } ${styles.navArrowIcon}`}
                />
              </button>
              <ul
                ref={itemWrapperRef}
                className={`${styles.imageGallery__list} ${styles.scrollbarHidden
                  } ${images && images?.length < 5 ? styles.fitContent : ""}`}
              >
                {images.map((item, index) => (
                  <li
                    key={index}
                    onClick={(e) => setMainImage(e, index)}
                    className={`${styles.gap} ${item.type === "video" ? styles.flexAlign : ""
                      } ${currentImageIndex === index ? styles.active : ""}`}
                    style={{ "--icon-color": iconColor }}
                  >
                    {item.type === "image" && (
                      <FyImage
                        customClass={`${styles["imageGallery__list--item"]}`}
                        src={item?.url}
                        alt={item?.alt}
                        aspectRatio={getProductImgAspectRatio(globalConfig)}
                        sources={[{ width: 100 }]}
                        globalConfig={globalConfig}
                        isImageFill={globalConfig?.img_fill}
                        isFixedAspectRatio={true}
                        backgroundColor={globalConfig?.img_container_bg}
                      />
                    )}
                    {item.type === "video" && (
                      <div className={styles.videoThumbnailContainer}>
                        {item.url.includes("youtube") ? (
                          <img
                            className={`${styles["imageGallery__list--item"]} ${styles.videoThumbnail}`}
                            src={getImageURL(item.url)}
                            alt={item.alt}
                          />
                        ) : (
                          <video
                            className={`${styles["imageGallery__list--item"]} ${styles.videoThumbnail}`}
                            src={item?.url}
                          />
                        )}
                        <SvgWrapper
                          svgSrc="video-play"
                          className={styles.videoPlayIcon}
                        />
                      </div>
                    )}
                    {item.type === "3d_model" && (
                      <div
                        className={`${styles["imageGallery__list--item"]} ${styles.type3dModel}`}
                      >
                        <SvgWrapper svgSrc="3D" className={styles.modelIcon} />
                      </div>
                    )}
                  </li>
                ))}
              </ul>
              <button
                type="button"
                className={`${styles.nextBtn} ${styles.btnNavGallery}`}
                onClick={nextSlide}
                aria-label={t("resource.facets.next")}
              >
                <SvgWrapper
                  svgSrc="arrow-right"
                  className={`${currentImageIndex >= images.length - 1
                    ? styles.disableArrow
                    : ""
                    } ${styles.navArrowIcon}`}
                />
              </button>
            </div>
          </div>
        )}
      </div>
      <div className={styles.mobile}>
        <MobileSlider
          images={images}
          onImageClick={() => openGallery()}
          product={product}
          resumeVideo={resumeVideo}
          globalConfig={globalConfig}
          setCurrentImageIndex={setCurrentImageIndex}
          slideTabCentreNone={slideTabCentreNone}
        />
      </div>
      {enableLightBox && (
        <div>
          <LightboxImage
            images={images}
            showCaption={false}
            showLightBox={enableLightBox}
            iconColor={iconColor}
            toggleResumeVideo={() => setResumeVideo((prev) => !prev)}
            globalConfig={globalConfig}
            closeGallery={() => setEnableLightBox(false)}
            currentIndex={currentImageIndex}
          />
        </div>
      )}
    </div>
  );
}

export default ImageGallery;
