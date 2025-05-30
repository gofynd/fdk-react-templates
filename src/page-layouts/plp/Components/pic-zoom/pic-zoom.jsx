import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Viewer3D from "../viewer-3d/viewer-3d";
import FyImage from "../../../../components/core/fy-image/fy-image";
import SvgWrapper from "../../../../components/core/svgWrapper/SvgWrapper";
import * as styles from "./pic-zoom.less";
import { getProductImgAspectRatio } from "../../../../helper/utils";
import { useGlobalTranslation } from "fdk-core/utils";

function PicZoom({
  source,
  type,
  alt,
  currentIndex,
  resumeVideo,
  globalConfig,
  customClass,
  onClickImage,
  isLoading,
  hideImagePreview = false,
}) {
  const { t } = useGlobalTranslation("translation");
  const [imageFullyLoaded, setImageFullyLoaded] = useState(true);
  const [imageLoading, setImageLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isFrameLoading, setIsFrameLoading] = useState(true);
  const [isMute, setIsMute] = useState(true);
  const [showReplayButton, setShowReplayButton] = useState(false);

  useEffect(() => {
    setImageFullyLoaded(true);
    setImageLoading(false);
  }, [source]);

  useEffect(() => {
    if (resumeVideo && !showReplayButton) {
      const videoPlayer = document.getElementById("html-video-player");
      if (videoPlayer) {
        videoPlayer.play();
      }
    }
  }, [resumeVideo, showReplayButton]);

  const onPlayerExpand = () => {
    if (!showReplayButton) {
      const videoPlayer = document.getElementById("html-video-player");
      if (videoPlayer) videoPlayer.pause();
    }
    onClickImage(currentIndex);
  };

  const toggleMute = () => {
    setIsMute(!isMute);
  };

  const restartVideo = () => {
    setShowReplayButton(false);
    const videoPlayer = document.getElementById("html-video-player");
    if (videoPlayer) {
      videoPlayer.currentTime = 0;
      videoPlayer.play();
    }
  };

  const pauseVideo = () => {
    if (!showReplayButton) {
      const videoPlayer = document.getElementById("html-video-player");
      if (videoPlayer) {
        if (videoPlayer.paused) {
          videoPlayer.play();
        } else {
          videoPlayer.pause();
        }
      }
    }
  };

  const onVideoEnd = () => {
    setShowReplayButton(true);
  };

  const iframeload = () => {
    setIsFrameLoading(false);
  };

  const imageLoaded = () => {
    setImageFullyLoaded(true);
  };

  const getOriginalImage = () => source || "";

  useEffect(() => {
    setIsMounted(true);
    setIsFrameLoading(true);
  }, []);

  return (
    <div className={customClass}>
      {type === "image" && (
        <div
          className={!hideImagePreview ? styles.loadImage : ""}
          onClick={() => {
            if (!hideImagePreview) {
              onClickImage(currentIndex);
            }
          }}
        >
          {!isLoading && (
            <FyImage
              customClass={styles.pdpImage}
              src={source}
              alt={alt}
              aspectRatio={getProductImgAspectRatio(globalConfig)}
              globalConfig={globalConfig}
              onLoad={imageLoaded}
              sources={[
                { breakpoint: { min: 780 }, width: 600 },
                { breakpoint: { min: 480 }, width: 400 },
              ]}
              defer={currentIndex > 0}
              isImageFill={globalConfig?.img_fill}
              isFixedAspectRatio={true}
              backgroundColor={globalConfig?.img_container_bg}
            />
          )}
        </div>
      )}
      {type === "video" && (
        <div className={styles.videoContainer}>
          {!getOriginalImage().includes("youtube") ? (
            <div className={styles.videoPlayerWrapper}>
              <video
                id="html-video-player"
                className={`${styles.originalVideo} ${styles.videoPlayer}`}
                src={getOriginalImage()}
                data-loaded="false"
                controls={false}
                autoPlay
                muted={isMute}
                onLoadedData={iframeload}
                onClick={pauseVideo}
                onEnded={onVideoEnd}
              />

              <SvgWrapper
                svgSrc="replay"
                className={`${styles.playerIcon} ${styles.playerReplay}`}
                style={{ display: showReplayButton ? "block" : "none" }}
                onClick={restartVideo}
              />

              <SvgWrapper
                svgSrc={isMute ? "mute" : "unmute"}
                className={`${styles.playerIcon} ${styles.playerMute}`}
                onClick={toggleMute}
              />

              <SvgWrapper
                svgSrc="expand-media"
                className={`${styles.playerIcon} ${styles.playerExpand}`}
                onClick={onPlayerExpand}
              />
            </div>
          ) : (
            <iframe
              className={styles.originalVideo}
              src={getOriginalImage()}
              allowFullScreen
              onLoad={iframeload}
              title={t("resource.common.social_accounts.youtube")}
            />
          )}
          {isFrameLoading && <div id="loader" />}
        </div>
      )}
      {type === "3d_model" && isMounted && (
        <div className={styles.type3dModel}>
          <Viewer3D src={getOriginalImage()} />
        </div>
      )}
    </div>
  );
}

PicZoom.propTypes = {
  source: PropTypes.string.isRequired,
  type: PropTypes.string,
  alt: PropTypes.string,
  currentIndex: PropTypes.number.isRequired,
  resumeVideo: PropTypes.bool,
  onClickImage: PropTypes.func.isRequired,
};

export default PicZoom;
