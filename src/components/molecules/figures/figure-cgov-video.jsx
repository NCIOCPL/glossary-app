import React from "react";
import { YoutubeVideoPlayer } from "../..";

const FigureCgovVideo = ({
  videoId,
  videoTitle,
  children,
  classes,
  template
}) => {
  return (
    <figure className={classes}>
      <YoutubeVideoPlayer youtubeId={videoId} videoTitle={videoTitle} />
      {children && (
        <figcaption className="caption-container no-resize">
          {children}
        </figcaption>
      )}
    </figure>
  ); 
};

export default FigureCgovVideo;
