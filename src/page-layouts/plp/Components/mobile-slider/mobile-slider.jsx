import React, { useState, createRef } from "react";
import Slider from "react-slick";
import FyImage from "../../../../components/core/fy-image/fy-image";
import SvgWrapper from "../../../../components/core/svgWrapper/SvgWrapper";
import { getProductImgAspectRatio } from "../../../../helper/utils";
import Viewer3D from "../viewer-3d/viewer-3d";
import * as styles from "./mobile-slider.less";
import { useGlobalTranslation } from "fdk-core/utils";
import useLocaleDirection from "../../../../helper/hooks/useLocaleDirection";

function MobileSlider({
  images,
  globalConfig,
  onImageClick,
  product,
  setCurrentImageIndex,
  slideTabCentreNone = false,
}) {
  const { t } = useGlobalTranslation("translation");
  const { isRTL } = useLocaleDirection();
  const settings = {
    dots: true,
    infinite: !images?.length === 1,
    slidesToShow: 1,
    slidesToScroll: 1,
    lazyLoad: "ondemand",
    arrows: false,
    swipe: true,
    swipeToSlide: false,
    touchThreshold: 90,
    draggable: false,
    touchMove: true,
    speed: 400,
    fade: true,
    responsive: [
      {
        breakpoint: 780,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          centerPadding: !slideTabCentreNone && "90px",
          centerMode: images.length > 1 && !slideTabCentreNone,
          fade: false,
          infinite: images.length > 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          centerMode: false,
        },
      },
    ],
    rtl: isRTL,
  };

  const [showReplayButton, setShowReplayButton] = useState(false);
  const [isMute, setIsMute] = useState(true);
  const videoRef = createRef();

  function play() {
    videoRef?.current?.play();
  }

  function pause() {
    videoRef?.current?.pause();
  }

  function pauseVideo() {
    if (!showReplayButton) {
      if (videoRef.current?.paused) {
        play();
      } else {
        pause();
      }
    }
  }

  function onVideoEnd() {
    setShowReplayButton(true);
  }

  function toggleMute() {
    setIsMute(!isMute);
  }

  function restartVideo(i) {
    setShowReplayButton(false);
    videoRef.current.currentTime = 0;
    videoRef.current.play();
  }

  function getImageURL(src) {
    return `http://img.youtube.com/vi/${src?.substr(
      (src?.lastIndexOf("/") ?? "") + 1
    )}/0.jpg`;
  }

  return (
    <div className={styles.mobilePdpCarouselBox} style={{ maxWidth: "100vw" }}>
      <Slider
        {...settings}
        beforeChange={(cur, next) => {
          setCurrentImageIndex(next);
        }}
      >
        {images?.map((media, i) => (
          <div className={styles.mediaWrapper} key={i}>
            {media.type === "image" && (
              <div onClick={() => onImageClick()}>
                <FyImage
                  src={media?.url}
                  alt={media?.alt}
                  mobileAspectRatio={getProductImgAspectRatio(globalConfig)}
                  sources={[
                    { breakpoint: { min: 780 }, width: 600 },
                    { breakpoint: { min: 480 }, width: 400 },
                  ]}
                  defer={i > 0}
                  globalConfig={globalConfig}
                  isImageFill={globalConfig?.img_fill}
                  isFixedAspectRatio={true}
                  backgroundColor={globalConfig?.img_container_bg}
                />
              </div>
            )}
            {media.type === "video" && (
              <div className={styles.videoContainer}>
                {media?.url.includes("youtube") && (
                  <img
                    src={getImageURL(media.url)}
                    alt={media.alt}
                    onClick={() => onImageClick()}
                  />
                )}
                <div className={styles.videoPlayerWrapper}>
                  {!media?.url.includes("youtube") && (
                    <div>
                      <video
                        ref={videoRef}
                        id={`mobile-video-player-${i}`}
                        className={styles.originalVideo}
                        controls={false}
                        autoPlay
                        muted={isMute}
                        onClick={pauseVideo}
                        onEnded={onVideoEnd}
                      >
                        <source src={media?.url} type="video/mp4" />
                      </video>
                      <div>
                        {showReplayButton && (
                          <SvgWrapper
                            svgSrc="replay"
                            className={`${styles.playerIcon} ${styles.playerReplay}`}
                            onClick={() => restartVideo(i)}
                          />
                        )}

                        <SvgWrapper
                          svgSrc={isMute ? "mute" : "unmute"}
                          className={`${styles.playerIcon} ${styles.playerMute}`}
                          onClick={() => {
                            toggleMute();
                          }}
                        />

                        <SvgWrapper
                          svgSrc="expand-media"
                          className={`${styles.playerIcon} ${styles.playerExpand}`}
                          onClick={() => onImageClick()}
                        ></SvgWrapper>
                      </div>
                    </div>
                  )}

                  {media.url.includes("youtube") && (
                    <SvgWrapper
                      svgSrc="play-button"
                      className={styles.thumbnail}
                    />
                  )}
                </div>
              </div>
            )}
            {media.type === "3d_model" && (
              <div className={styles.type3dModel}>
                <div className={styles.modelWrapper}>
                  <Viewer3D src={media.url} />

                  <SvgWrapper
                    svgSrc="auto-rotate"
                    className={styles.autoRotateIcon}
                    onClick={() => onImageClick()}
                  />
                </div>
              </div>
            )}
            {product?.custom_order?.is_custom_order && (
              <div className={`${styles.badge} ${styles.b4}`}>
                {t("resource.product.made_to_order")}
              </div>
            )}
          </div>
        ))}
      </Slider>
    </div>
  );
}

export default MobileSlider;
