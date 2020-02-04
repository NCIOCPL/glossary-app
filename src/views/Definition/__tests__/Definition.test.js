import React from 'react';
import { render } from '@testing-library/react';

import Definition from '../Definition';

import { useParams } from 'react-router';
jest.mock('react-router');

test.only('Match Term Name for Definition', () => { 

  const id = "12345";

  useParams.mockReturnValue({      
      idOrName: id
  });

  const { getByText } = render(<Definition />);
  expect(getByText(/12345/)).toBeTruthy();
});