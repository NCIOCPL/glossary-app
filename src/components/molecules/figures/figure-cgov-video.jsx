import React from 'react';
import PropTypes from 'prop-types';
import { YoutubeVideoPlayer } from '../..';

// Markup and class names follow the cancer.gov NCIDS video component (cgdp-video):
// a 16:9 media box holding the YouTube player, then the caption.
const FigureCgovVideo = ({ videoId, videoTitle, children, classes = '' }) => {
	return (
		<figure className={`cgdp-video${classes ? ` ${classes}` : ''}`}>
			<div className="cgdp-video__media">
				<YoutubeVideoPlayer youtubeId={videoId} videoTitle={videoTitle} />
			</div>
			{children && <figcaption className="cgdp-video__caption">{children}</figcaption>}
		</figure>
	);
};

FigureCgovVideo.propTypes = {
	videoId: PropTypes.string,
	videoTitle: PropTypes.string,
	children: PropTypes.node,
	classes: PropTypes.string,
};

export default FigureCgovVideo;
