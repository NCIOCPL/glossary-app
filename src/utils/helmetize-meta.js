/**
 * Adds data-react-helmet attributes to metatags that a react app will need
 * to manage. If this attribute is not added to pre-existing tags then
 * helmet will create duplicate tags.
 *
 * NOTE: For SEO should NOT use this for:
 * - <meta name="description">
 * - <meta http-equiv="robots"
 * - <title>
 * - <link rel="canonical">
 * - <link rel="alternate">
 *
 * @param {Document} document
 *   The document object
 * @param {Array} selectors
 *   An array of selectors for elements to add the attribute to.
 */
export const helmetizeMeta = (document, selectors) => {
	for (const selector of selectors) {
		const elements = document.querySelectorAll(selector);
		for (const element of elements) {
			if (!element.hasAttribute('data-react-helmet')) {
				element.setAttribute('data-react-helmet', 'true');
			}
		}
	}
};
