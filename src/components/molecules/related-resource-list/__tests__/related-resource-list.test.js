import React from "react";
import { render, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router";
import { useStateValue } from "../../../../store/store";
import RelatedResourceList from "../";

jest.mock("../../../../store/store.js");

useStateValue.mockReturnValue([
  {
    appId: "mockAppId",
    basePath: "/",
    dictionaryName: "Cancer.gov",
    dictionaryTitle: "Mock Dictionary of Cancer Terms",
    language: "en"
  }
]);

describe("<RelatedResourceList /> component", () => {
  afterEach(cleanup);

  test("empty relatedResources array does not output a list", () => {
    const mockEmptyArr = [];
    const { container } = render(
      <MemoryRouter initialEntries={["/"]}>
        <RelatedResourceList linksArr={mockEmptyArr} />
      </MemoryRouter>
    );
    expect(
      container.querySelector("ul.more-information-list")
    ).not.toBeInTheDocument();
    expect(container.querySelectorAll("li").length).toBe(0);
  });

  test("creates a list of links", () => {
    const mockResourcesArr = [
      {
        Url: "https://mock.com",
        Type: "External",
        Text: "Mock External"
      },
      {
        Url: "https://mock.com",
        Type: "Summary",
        Text: "Mock Summary"
      },
      {
        Url: "https://mock.com",
        Type: "DrugSummary",
        Text: "Mock Term"
      }
    ];
    const { container } = render(
      <MemoryRouter initialEntries={["/"]}>
        <RelatedResourceList linksArr={mockResourcesArr} />
      </MemoryRouter>
    );
    expect(
      container.querySelector("ul.more-information-list")
    ).toBeInTheDocument();
    expect(container.querySelectorAll("li").length).toBe(3);
  });

  it("creates GlossaryTerm links, using prettyUrls when provided", () => {
    const mockGlossaryTermResource = [
      {
        Type: "GlossaryTerm",
        Text: "breast density",
        TermId: 335487,
        Audience: "Patient",
        PrettyUrlName: "breast-density"
      }
    ];
    const { container } = render(
      <MemoryRouter initialEntries={["/"]}>
        <RelatedResourceList linksArr={mockGlossaryTermResource} />
      </MemoryRouter>
    );
    expect(container.querySelector("li")).toHaveTextContent(/Definition of/i);
    expect(container.querySelector("a")).toHaveAttribute("href", "/def/335487");
  });

  it("creates a list with spanish text when language is 'es'", () => {
    const mockSpanishGlossaryTerm = [
      {
        Type: "GlossaryTerm",
        Text: "densidad de la mama",
        TermId: 335487,
        Audience: "Patient",
        PrettyUrlName: "densidad-de-la-mama"
      }
    ];
    const { container } = render(
      <MemoryRouter initialEntries={["/"]}>
        <RelatedResourceList linksArr={mockSpanishGlossaryTerm} lang="es" />
      </MemoryRouter>
    );
    expect(container.querySelector("li")).toHaveTextContent(/Definición de/i);
  });
});
