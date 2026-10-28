import React from 'react';
import PropTypes from 'prop-types';

// Markup and class names follow the cancer.gov NCIDS image component (cgdp-image):
// the image, a caption, then an "Enlarge image" link with an enlarge icon below
// the caption. The figure itself carries the cgdp-image class so the whole
// component, including the enlarge link, stays inside one figure.
const FigureCgovImage = ({ altText, caption, classes = '', credit, enlarge_uri, lang = 'en', thumb_uri }) => {
	// set up text for spanish
	const t = {};
	t.linkText =
		lang === 'en' ? (
			<>
				Enlarge image<span className="usa-sr-only"> in new window</span>
			</>
		) : (
			<>
				Ampliar<span className="usa-sr-only"> - abre en nueva ventana</span>
			</>
		);
	t.creditText = lang === 'en' ? 'Credit' : 'Crédito';

	return (
		<figure className={`cgdp-image${classes ? ` ${classes}` : ''}`}>
			<img src={thumb_uri} alt={altText} />
			{(caption || credit) && (
				<figcaption className="cgdp-image__caption">
					{caption && <div className="cgdp-image__caption-text">{caption}</div>}
					{credit && (
						<p className="cgdp-image__credit">
							{t.creditText}: {credit}
						</p>
					)}
				</figcaption>
			)}
			{enlarge_uri && (
				<div className="cgdp-image__enlarge">
					{/* USWDS "zoom_in" icon */}
					<svg className="usa-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
						<path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
						<path d="M12 10h-2v2H9v-2H7V9h2V7h1v2h2v1z" />
					</svg>
					<a href={enlarge_uri} target="_blank" rel="noopener noreferrer" className="usa-link">
						{t.linkText}
					</a>
				</div>
			)}
		</figure>
	);
};

FigureCgovImage.propTypes = {
	altText: PropTypes.string,
	caption: PropTypes.string,
	classes: PropTypes.string,
	credit: PropTypes.string,
	enlarge_uri: PropTypes.string,
	lang: PropTypes.string,
	thumb_uri: PropTypes.string,
};

export default FigureCgovImage;
