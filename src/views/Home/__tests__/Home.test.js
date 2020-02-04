import { render } from '@testing-library/react';
import React from 'react';
import {MemoryRouter} from 'react-router';

import Home from '../Home';
import { useStateValue } from "../../../store/store.js";
jest.mock("../../../store/store.js");

test.only('Match dictionary name for Home', () => {
  const dictionaryName = 'NCI Dictionary of Cancer Terms';

  useStateValue.mockReturnValue([
    {
      appId: "mockAppId",
      basePath: '/testbase',
      dictionaryName
    }
  ]);
  
  const { getByText } = render(    
    <MemoryRouter initialEntries={["/testbase"]}>
      <Home />
    </MemoryRouter>
  );
  
  expect(getByText(dictionaryName)).toBeTruthy();
  
  // Test link is correct
  expect(document.querySelector("a").getAttribute("href")).toBe(
    "/testbase/def/12345"
  );
});