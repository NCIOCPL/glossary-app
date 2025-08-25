import { helmetizeMeta } from '../helmetize-meta';
import { JSDOM } from 'jsdom';

describe('helmetizeMeta', () => {
	it('adds data attribute', () => {
		const dom = new JSDOM(`
				<html>
					<head>
						<meta id="keywords" name="keywords" content="a,b,c" />
						<meta id="creator" name="creator" content="creator" />
						<meta id="creator2" name="dc.creator" content="creator2" data-react-helmet="false" />
						<link id="css1" rel="stylesheet" href="https://example.org/test.css" />
						<link id="css2" rel="stylesheet" href="https://example.org/test2.css" />
					</head>
					<body>
					</body>
				</html>
			`);

		helmetizeMeta(dom.window.document, ['meta[name="keywords"]', 'meta[name="dc.creator"]', 'link[rel="stylesheet"]']);
		// Find single element
		expect(dom.window.document.querySelector('#keywords')).toHaveAttribute('data-react-helmet', 'true');
		// Find multiple elements
		expect(dom.window.document.querySelector('#css1')).toHaveAttribute('data-react-helmet', 'true');
		expect(dom.window.document.querySelector('#css2')).toHaveAttribute('data-react-helmet', 'true');
		// Do not modify elements not in selectors list
		expect(dom.window.document.querySelector('#creator')).not.toHaveAttribute('data-react-helmet');
		// Skip over elements that already have the data attribute
		expect(dom.window.document.querySelector('#creator2')).toHaveAttribute('data-react-helmet', 'false');
	});
});
