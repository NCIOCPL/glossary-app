import React from "react";
import { render } from "@testing-library/react";

import { useStateValue } from "../store/store.js";
jest.mock("../store/store.js");

import App from "../App";

describe("App component", () => {

  useStateValue.mockReturnValue([
    {
      appId: "mockAppId",
      basePath: "/"
    }
  ]);

  it("loads", () => {
    // TODO: This should actually assert that the routes do
    // exist and have the proper base paths. This should not
    // test rendering.
    const { getByText } = render(<App />);  
    const headingElement = getByText(/Hello World/i);
    expect(headingElement).toBeInTheDocument();
  });

});
