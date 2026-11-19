import React, { useState, useMemo, createRef } from "react";
import FyImage from "../../../../components/core/fy-image/fy-image";
import SvgWrapper from "../../../../components/core/svgWrapper/SvgWrapper";
import { getProductImgAspectRatio } from "../../../../helper/utils";
import Viewer3D from "../viewer-3d/viewer-3d";
import * as styles from "./mobile-slider.less";
import { useGlobalTranslation } from "fdk-core/utils";
import useLocaleDirection from "../../../../helper/hooks/useLocaleDirection";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "../../../../components/carousel/carousel";

function MobileSlider({
  images,
  globalConfig,
  onImageClick,
  product,
  setCurrentImageIndex,
  slideTabCentreNone = false,
}) {
  const { t } = useGlobalTranslation("translation");
  const { direction } = useLocaleDirection();

  const carouselProps = useMemo(() => {
    const len = images.length;
    const centerModeTablet = len > 1 && !slideTabCentreNone;
    const opts = {
      direction,
      align: "start",
      loop: len > 1,
      draggable: false,
      containScroll: "trimSnaps",
      slidesToScroll: 1,
      duration: 25,
      breakpoints: {
        "(max-width: 779px)": {
          align: centerModeTablet ? "center" : "start",
        },
        "(max-width: 479px)": {
          align: "start",
        },
      },
    };
    return { opts };
  }, [direction, images?.length, slideTabCentreNone]);

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
    return `http://img.youtube.com/vi/${src?.substr((src?.lastIndexOf("/") ?? "") + 1)}/0.jpg`;
  }

  return (
    <div className={styles.mobilePdpCarouselBox} style={{ maxWidth: "100vw" }}>
      <Carousel {...carouselProps}>
        <CarouselContent>
          {images?.map((media, i) => (
            <CarouselItem style={{ flex: "0 0 100%" }} key={i}>
              <div className={styles.mediaWrapper}>
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
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
}

export default MobileSlider;
