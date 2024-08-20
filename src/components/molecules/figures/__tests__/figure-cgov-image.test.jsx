import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { FigureCgovImage } from '..';

describe('<FigureCgovImage /> component', () => {
	const mockFig = {
		altText: 'mock alt text',
		thumb_uri: 'http://mock.png',
	};

	it('creates a figure containing an image and does not create a figcaption when both credit and caption are absent', async () => {
		render(<FigureCgovImage {...mockFig} />);
		await waitFor(() => {
			expect(screen.getByRole('figure')).toBeInTheDocument();
		});
		expect(screen.queryByRole('figure')).not.toHaveTextContent('figcaption');
	});

	it('creates a figure with classes when supplied with classes list', async () => {
		render(<FigureCgovImage classes="mockstyle" {...mockFig} />);
		await waitFor(() => {
			expect(screen.getByRole('figure')).toHaveClass('mockstyle');
		});
		expect(screen.queryByRole('figure')).not.toHaveTextContent('figcaption');
	});

	it('creates a figcaption containing caption text when caption is supplied', async () => {
		render(<FigureCgovImage caption="mock caption describing chickens" {...mockFig} />);
		await waitFor(() => {
			expect(screen.getByText(/chickens/i)).toBeInTheDocument();
		});
	});

	it('creates a figcaption containing a credit when a credit is supplied', async () => {
		render(<FigureCgovImage credit="mock credit" {...mockFig} />);
		await waitFor(() => {
			expect(screen.getByText(/mock credit/i)).toHaveClass('image-photo-credit');
		});
	});

	it('includes an enlarge button when an enlarge_uri is supplied', async () => {
		render(<FigureCgovImage enlarge_uri="http://mock.jpg" {...mockFig} />);
		await waitFor(() => {
			expect(screen.getByRole('link', { name: /enlarge/i })).toHaveClass('article-image-enlarge');
		});
	});

	it("displays spanish text when language='es' is supplied", async () => {
		render(<FigureCgovImage lang="es" enlarge_uri="http://mock.jpg" credit="mock credit" {...mockFig} />);
		await waitFor(() => {
			expect(screen.getByRole('link', { name: /ampliar/i })).toHaveTextContent('Ampliar - abre en nueva ventana');
		});
		expect(screen.getByText(/Crédito/i)).toBeInTheDocument();
	});
});
