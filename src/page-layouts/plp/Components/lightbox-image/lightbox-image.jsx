import React, { useState, useEffect, useRef } from "react";
import FyImage from "../../../../components/core/fy-image/fy-image";
import SvgWrapper from "../../../../components/core/svgWrapper/SvgWrapper";
import * as styles from "./lightbox-image.less";
import {
  getProductImgAspectRatio,
  isRunningOnClient,
} from "../../../../helper/utils";
import Viewer3D from "../viewer-3d/viewer-3d";
import { useGlobalTranslation } from "fdk-core/utils";

function LightboxImage({
  images,
  showLightBox = false,
  startAt = 0,
  nThumbs = 5,
  showThumbs = true,
  closeText,
  nextText,
  globalConfig = {},
  toggleResumeVideo,
  currentIndex,
  closeGallery,
}) {
  const { t } = useGlobalTranslation("translation");
  const [select, setSelect] = useState(startAt);
  const [lightBoxOn, setLightBoxOn] = useState(showLightBox);
  const [selectLoading, setSelectLoading] = useState(false);
  const [isMute, setIsMute] = useState(true);
  const [showReplayButton, setShowReplayButton] = useState(false);
  const videoRef = useRef(null);

  let thumbIndex;

  function play() {
    videoRef?.current?.play();
  }

  function pause() {
    videoRef?.current?.pause();
  }
  if (
    select >= Math.floor(nThumbs / 2) &&
    select < images.length - Math.floor(nThumbs / 2)
  ) {
    thumbIndex = {
      begin: select - Math.floor(nThumbs / 2) + (1 - (nThumbs % 2)),
      end: select + Math.floor(nThumbs / 2),
    };
  } else if (select < Math.floor(nThumbs / 2)) {
    thumbIndex = {
      begin: 0,
      end: nThumbs - 1,
    };
  } else {
    thumbIndex = {
      begin: images.length - nThumbs,
      end: images.length - 1,
    };
  }

  const toggleMute = () => {
    setIsMute(!isMute);
  };

  const restartVideo = () => {
    setShowReplayButton(false);

    if (!showReplayButton && videoRef !== null && videoRef.current) {
      videoRef.current.currentTime = 0;
      play();
    }
  };

  const onVideoEnd = () => {
    setShowReplayButton(true);
  };

  const pauseVideo = () => {
    if (!showReplayButton && videoRef !== null && videoRef.current) {
      if (videoRef.current.paused) {
        play();
      } else {
        pause();
      }
    }
  };

  const nextImage = () => {
    setShowReplayButton(false);
    setSelectLoading(true);
    setTimeout(() => {
      setSelect((select + 1) % images.length);
      setSelectLoading(false);
    }, 1);
  };

  const previousImage = () => {
    setShowReplayButton(false);
    setSelectLoading(true);
    setTimeout(() => {
      setSelect((select + images.length - 1) % images.length);
      setSelectLoading(false);
    }, 1);
  };

  const handleVideoPlayback = () => {
    const videoPlayer = document.getElementById("videoPlayer");
    videoPlayer.pause();
    videoPlayer.currentTime = 0;
  };

  const closeLightBox = () => {
    setShowReplayButton(false);
    toggleResumeVideo();
    if (isRunningOnClient()) {
      const iframe = document.querySelector("iframe");
      if (iframe) {
        const iframeSrc = iframe.src;
        iframe.src = iframeSrc;
      }
      setLightBoxOn(false);
      if (document.getElementById("videoPlayer")) handleVideoPlayback();
    }
    closeGallery();
  };

  const getImageURL = (src) =>
    `http://img.youtube.com/vi/${src?.substr((src?.lastIndexOf("/") ?? "") + 1)}/0.jpg`;

  const showImage = (index) => {
    setLightBoxOn(true);
    setSelectLoading(true);
    setTimeout(() => {
      setSelect(index);
      setSelectLoading(false);
    }, 1);
  };

  useEffect(() => {
    if (showLightBox) showImage(currentIndex);
  }, [showLightBox, currentIndex]);

  return (
    <div>
      <div
        className={styles.lbContainer}
        style={{ display: lightBoxOn ? "block" : "none" }}
      >
        <div className={styles.lbContent}>
          <div className={styles.lbHeader}>
            <h4>
              {t("resource.product.image")} ({select + 1}/{images.length})
            </h4>
            <button
              type="button"
              title={closeText || t("resource.facets.close_esc")}
              className={styles.lbButtonClose}
              aria-label={t("resource.facets.close_alt")}
              onClick={closeGallery}
            >
              <span>
                <SvgWrapper svgSrc="close" />
              </span>
            </button>
          </div>
          <div className={styles.lbFigure} onClick={(e) => e.stopPropagation()}>
            <div className={styles.mediaWrapper}>
              {images[select]?.type === "image" && (
                <FyImage
                  src={images[select]?.url}
                  alt={images[select]?.alt}
                  customClass={`${styles.lbModalMedia} ${styles.lbModalImage}`}
                  sources={[
                    { breakpoint: { min: 481 }, width: 1100 },
                    { breakpoint: { max: 480 }, width: 1000 },
                  ]}
                  mobileAspectRatio={getProductImgAspectRatio(globalConfig)}
                  aspectRatio={getProductImgAspectRatio(globalConfig)}
                  globalConfig={globalConfig}
                  showSkeleton={false}
                  isImageFill={globalConfig?.img_fill}
                  isFixedAspectRatio={true}
                  backgroundColor={globalConfig?.img_container_bg}
                />
              )}
              {images[select]?.type === "video" && (
                <div className={styles.videoContainer}>
                  {images[select].url.includes("youtube") ? (
                    <iframe
                      title={t("resource.common.social_accounts.youtube")}
                      key={images[select]?.url}
                      src={`${images[select]?.url}?enablejsapi=1&html5=1`}
                      srcSet={images[select]?.srcset || ""}
                      className={`${styles.lbModalMedia} ${styles.youtubePlayer}`}
                      allowfullscreen
                    />
                  ) : (
                    <div className={styles.videoPlayerContainer}>
                      <div className={styles.playerWrapper}>
                        <video
                          ref={videoRef}
                          key={images[select]?.url}
                          src={images[select]?.url}
                          srcSet={images[select].srcset || ""}
                          className={styles.lbModalMedia}
                          controls={false}
                          autoPlay
                          muted={isMute}
                          onClick={pauseVideo}
                          onEnded={onVideoEnd}
                        />

                        {showReplayButton && (
                          <SvgWrapper
                            className={`${styles.playerIcon} ${styles.playerReplay}`}
                            svgSrc="replay"
                            onClick={restartVideo}
                          />
                        )}

                        <SvgWrapper
                          className={`${styles.playerIcon} ${styles.playerMute}`}
                          svgSrc={isMute ? "mute" : "unmute"}
                          onClick={toggleMute}
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {images[select]?.type === "3d_model" && (
                <div className={`${styles.lbModalMedia} ${styles.type3dModel}`}>
                  <Viewer3D src={images[select]?.url} />
                </div>
              )}
              <SvgWrapper
                svgSrc="close-white"
                className={styles.closeIcon}
                onClick={closeLightBox}
              />
              {images.length > 1 && (
                <button
                  type="button"
                  className={`${styles.lbArrow} ${styles.lbLeft} ${select === 0 ? styles.disableArrow : ""
                    }`}
                  title={t("resource.product.previous_text")}
                  onClick={previousImage}
                  disabled={select === 0}
                  aria-label={t("resource.facets.prev")}
                >
                  <div name="previous">
                    <SvgWrapper svgSrc="arrow-left-white" />
                  </div>
                </button>
              )}

              {images.length > 1 && (
                <button
                  type="button"
                  className={`${styles.lbArrow} ${styles.lbRight} ${select === images.length - 1 ? styles.disableArrow : ""
                    }`}
                  title={nextText || t("resource.facets.next")}
                  onClick={nextImage}
                  disabled={select === images.length - 1}
                  aria-label={t("resource.facets.next")}
                >
                  <div name={t("resource.facets.next")}>
                    <SvgWrapper svgSrc="arrow-right-white" />
                  </div>
                </button>
              )}

              <div className={styles.lbThumbnailWrapper}>
                {showThumbs && (
                  <div className={styles.lbThumbnail}>
                    {images?.map((image, index) => (
                      <div
                        key={index}
                        style={{
                          display:
                            index >= thumbIndex.begin && index <= thumbIndex.end
                              ? "block"
                              : "none",
                        }}
                        onClick={() => showImage(index)}
                        className={styles.thumbnailItem}
                      >
                        {image?.type === "image" && (
                          <FyImage
                            src={image?.url}
                            alt={image?.alt}
                            customClass={`${styles.lbModalThumbnail} ${select === index
                              ? `${styles["lbModalThumbnail-active"]}`
                              : ""
                              }`}
                            mobileAspectRatio={getProductImgAspectRatio(
                              globalConfig
                            )}
                            aspectRatio={getProductImgAspectRatio(globalConfig)}
                            globalConfig={globalConfig}
                            isImageFill={globalConfig?.img_fill}
                            isFixedAspectRatio={true}
                            backgroundColor={globalConfig?.img_container_bg}
                          />
                        )}
                        {image?.type === "video" && (
                          <div className={styles.videoThumbnailContainer}>
                            {image?.url?.includes("youtube") ? (
                              <img
                                alt={image?.alt}
                                src={getImageURL(image?.url)}
                                className={`${styles.lbModalVideoThumbnail}
                          ${select === index
                                    ? `${styles["lbModalVideoThumbnail-active"]}`
                                    : ""
                                  }`}
                              />
                            ) : (
                              <video
                                src={image?.url}
                                className={`${styles.lbModalVideoThumbnail}
                          ${select === index
                                    ? `${styles["lbModalVideoThumbnail-active"]}`
                                    : ""
                                  }`}
                              />
                            )}
                            <SvgWrapper
                              svgSrc="'video-play'"
                              className={styles.videoPlayIcon}
                            />
                          </div>
                        )}
                        {image?.type === "3d_model" && (
                          <div
                            className={`${styles.modelThumbnail} ${select === index
                              ? styles["lbModalThumbnail-active"]
                              : ""
                              }`}
                          >
                            <SvgWrapper
                              svgSrc="3D"
                              className={styles.modelIcon}
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LightboxImage;
