import React from 'react';

const FigureCgovImage = ({
	altText,
	caption,
	classes = '',
	credit,
	enlarge_uri,
	lang = 'en',
	thumb_uri,
}) => {
	// set up text for spanish
	const t = {};
	t.linkText =
		lang === 'en' ? (
			<>
				Enlarge <span className="show-for-sr"> this image in new window</span>
			</>
		) : (
			<>
				Ampliar <span className="show-for-sr">- abre en nueva ventana</span>
			</>
		);
	t.creditText = lang === 'en' ? 'Credit' : 'Crédito';

	return (
		<figure className={classes}>
			<div className="centered-element">
				<img src={thumb_uri} alt={altText} />
				{enlarge_uri && (
					<a
						href={enlarge_uri}
						target="_blank"
						rel="noopener noreferrer"
						className="article-image-enlarge no-resize">
						{t.linkText}
					</a>
				)}
				{(caption || credit) && (
					<figcaption>
						<div className="caption-container no-resize">
							{caption && <>{caption}</>}
							{credit && (
								<div className="image-photo-credit">
									{t.creditText}: {credit}
								</div>
							)}
						</div>
					</figcaption>
				)}
			</div>
		</figure>
	);
};

export default FigureCgovImage;
