/* eslint-disable testing-library/no-node-access */
/* eslint-disable testing-library/no-container */
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { FigureCgovImage } from '..';

describe('<FigureCgovImage /> component', () => {
	const mockFig = {
		altText: 'mock alt text',
		thumb_uri: 'http://mock.png',
	};

	it('creates a cgdp-image figure containing the image and no figcaption when both credit and caption are absent', () => {
		const { container } = render(<FigureCgovImage {...mockFig} />);
		const figure = screen.getByRole('figure');
		expect(figure).toHaveClass('cgdp-image');
		expect(screen.getByRole('img', { name: 'mock alt text' })).toHaveAttribute('src', 'http://mock.png');
		expect(container.querySelector('figcaption')).not.toBeInTheDocument();
	});

	it('adds classes when supplied with classes list', () => {
		render(<FigureCgovImage classes="mockstyle" {...mockFig} />);
		expect(screen.getByRole('figure')).toHaveClass('cgdp-image', 'mockstyle');
	});

	it('creates a cgdp-image caption containing caption text when caption is supplied', () => {
		render(<FigureCgovImage caption="mock caption describing chickens" {...mockFig} />);
		const caption = screen.getByText(/chickens/i);
		expect(caption).toHaveClass('cgdp-image__caption-text');
		expect(caption.closest('figcaption')).toHaveClass('cgdp-image__caption');
	});

	it('creates a figcaption containing a credit when a credit is supplied', () => {
		render(<FigureCgovImage credit="mock credit" {...mockFig} />);
		expect(screen.getByText('Credit: mock credit')).toHaveClass('cgdp-image__credit');
	});

	it('includes an "Enlarge image" link opening the enlarge_uri in a new tab when an enlarge_uri is supplied', () => {
		render(<FigureCgovImage enlarge_uri="http://mock.jpg" {...mockFig} />);
		const link = screen.getByRole('link', { name: /enlarge image/i });
		expect(link).toHaveAttribute('href', 'http://mock.jpg');
		expect(link).toHaveAttribute('target', '_blank');
		expect(link).toHaveAttribute('rel', 'noopener noreferrer');
		expect(link).toHaveClass('usa-link');
		expect(link).toHaveTextContent('Enlarge image in new window');
	});

	it('renders the enlarge icon and link in a row below the caption', () => {
		const { container } = render(<FigureCgovImage caption="mock caption" enlarge_uri="http://mock.jpg" {...mockFig} />);
		const enlarge = container.querySelector('.cgdp-image__enlarge');
		expect(enlarge).toBeInTheDocument();
		// order inside the figure: image, caption, then the enlarge row
		expect([...screen.getByRole('figure').children].map((el) => el.tagName.toLowerCase())).toEqual(['img', 'figcaption', 'div']);
		const icon = enlarge.querySelector('svg.usa-icon');
		expect(icon).toHaveAttribute('aria-hidden', 'true');
		expect(icon).toHaveAttribute('focusable', 'false');
		expect(enlarge).toContainElement(screen.getByRole('link', { name: /enlarge image/i }));
	});

	it('does not render the enlarge row when there is no enlarge_uri', () => {
		const { container } = render(<FigureCgovImage caption="mock caption" {...mockFig} />);
		expect(container.querySelector('.cgdp-image__enlarge')).not.toBeInTheDocument();
		expect(screen.queryByRole('link')).not.toBeInTheDocument();
	});

	it("displays spanish text when lang='es' is supplied", () => {
		render(<FigureCgovImage lang="es" enlarge_uri="http://mock.jpg" credit="mock credit" {...mockFig} />);
		expect(screen.getByRole('link', { name: /ampliar/i })).toHaveTextContent('Ampliar - abre en nueva ventana');
		expect(screen.getByText('Crédito: mock credit')).toBeInTheDocument();
	});
});
