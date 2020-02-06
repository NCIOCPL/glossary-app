import { cleanup, render } from '@testing-library/react';
import React from 'react';
import { useParams } from 'react-router';

import { testIds } from '../../../constants';
import Definition from '../Definition';

jest.mock('react-router');

let definition;
let wrapper;

function getMockData(term) {
  return term !== 'hpv'
      ? require('../../../services/stubbed/44058__metastatic')
      : require('../../../services/stubbed/44386__hpv');
}

describe('Definition component test', () => {

  beforeEach(() => {
    definition = getMockData();

    useParams.mockReturnValue({
      idOrName: definition.termName
    });

    wrapper = render(<Definition />);
  });

  afterEach(cleanup);

  test('Match Term Name for Definition', () => {
    const { getByText } = wrapper;
    expect(getByText(definition.termName)).toBeTruthy();
  });

  test('Ensure attribute "data-cdr-id" exists with correct value for Definition component', () => {
    const { getByTestId } = wrapper;
    expect(getByTestId(testIds.TERM_DEF_TITLE)).toHaveAttribute('data-cdr-id', `${definition.termId}`);
  });

  describe('', () => {
    beforeEach(cleanup);
    test('Ensure pronunciation is not displayed for a definition without one', () => {
      definition = getMockData('hpv');

      useParams.mockReturnValue({
        idOrName: definition.termName
      });
      wrapper = render(<Definition />);
      const { queryByTestId } = wrapper;
      expect(queryByTestId(testIds.TERM_DEF_PRONUNCIATION)).toBeNull();
    });
  });
});



