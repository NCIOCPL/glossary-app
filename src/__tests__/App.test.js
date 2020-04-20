import { act, cleanup, render } from "@testing-library/react";
import axios from 'axios';
import nock from 'nock';
import React from "react";
import { ClientContextProvider } from "react-fetching-library";
import { MemoryRouter, useLocation } from "react-router";

import { queryType } from "../constants";
import { useAppPaths } from "../hooks";
import { getAxiosClient } from "../services/api/axios-client";
import { useStateValue } from "../store/store.js";
import Definition from "../views/Definition";
import Home from "../views/Home";

jest.mock("../store/store.js");

let wrapper;
axios.defaults.adapter = require('axios/lib/adapters/http');

const { EXPAND_SPANISH } = queryType;

describe("App component", () => {
  let location;

  function ComponentWithLocation({ RenderComponent }) {
    location = useLocation();
    return <RenderComponent />;
  }
  const audience = "Patient";
  const dictionaryEndpoint = "http://localhost:3000/api";
  const dictionaryName = "Cancer.gov";
  const dictionaryTitle = "NCI Dictionary of Cancer Terms";
  const language = "en";
  const searchBoxTitle = "Search NCI's Dictionary of Cancer Terms";

  useStateValue.mockReturnValue([
    {
      appId: "mockAppId",
      audience,
      basePath: "/",
      dictionaryEndpoint,
      dictionaryName,
      dictionaryTitle,
      language,
      searchBoxTitle
    }
  ]);

  beforeAll( () => {
    nock.disableNetConnect();
  });

  afterAll( () => {
    nock.cleanAll();
    nock.enableNetConnect();
  });

  afterEach(cleanup);

  test("DefinitionPath route exists and matches expected route", async () => {
    const { DefinitionPath } = useAppPaths();
    const idOrName = 'metastatic';
    const initialState = {
      audience,
      dictionaryEndpoint,
      dictionaryName,
      dictionaryTitle,
      language,
      searchBoxTitle
    };

    await act( async () => {
      wrapper = render(
          <MemoryRouter initialEntries={[DefinitionPath({ idOrName })]}>
            <ClientContextProvider client={getAxiosClient(initialState)}>
              <ComponentWithLocation RenderComponent={ Definition } />
            </ClientContextProvider>
          </MemoryRouter>
      );
    });

    const expectedLocationObject = {
      pathname: `/def/${idOrName}`,
      search: '',
      hash: '',
      state: null,
      key: expect.any(String)
    };

    expect(location).toMatchObject(expectedLocationObject);
  });

  test("ExpandPath route exists and matches expected route", async () => {
    const { ExpandPath } = useAppPaths();
    const expandChar = 'A';
    const initialState = {
      audience,
      dictionaryEndpoint,
      dictionaryName,
      dictionaryTitle,
      language,
      searchBoxTitle
    };

    await act( async () => {
      wrapper = render(
          <MemoryRouter initialEntries={[ExpandPath({ expandChar })]}>
            <ClientContextProvider client={getAxiosClient(initialState)}>
              <ComponentWithLocation RenderComponent={ Home } />
            </ClientContextProvider>
          </MemoryRouter>
      );
    });

    const expectedLocationObject = {
      pathname: `/expand/${expandChar}`,
      search: '',
      hash: '',
      state: null,
      key: expect.any(String)
    };

    expect(location).toMatchObject(expectedLocationObject);
  });

  test("ExpandPathNoParam route exists and matches expected route", async () => {
    const { ExpandPathNoParam } = useAppPaths();
    const initialState = {
      audience,
      dictionaryEndpoint,
      dictionaryName,
      dictionaryTitle,
      language,
      searchBoxTitle
    };

    await act( async () => {
      wrapper = render(
          <MemoryRouter initialEntries={[ExpandPathNoParam()]}>
            <ClientContextProvider client={getAxiosClient(initialState)}>
              <ComponentWithLocation RenderComponent={ Home } />
            </ClientContextProvider>
          </MemoryRouter>
      );
    });

    const expectedLocationObject = {
      pathname: '/expand',
      search: '',
      hash: '',
      state: null,
      key: expect.any(String)
    };

    expect(location).toMatchObject(expectedLocationObject);
  });

  test("ExpandPathSpanish route exists and matches expected route", async () => {
    const { ExpandPathSpanish } = useAppPaths();
    const expandChar = 'A';
    const initialState = {
      audience,
      dictionaryEndpoint,
      dictionaryName,
      dictionaryTitle,
      language,
      searchBoxTitle
    };

    await act( async () => {
      wrapper = render(
          <MemoryRouter initialEntries={[ExpandPathSpanish({ expandChar })]}>
            <ClientContextProvider client={getAxiosClient(initialState)}>
              <ComponentWithLocation RenderComponent={ Home } />
            </ClientContextProvider>
          </MemoryRouter>
      );
    });

    const expectedLocationObject = {
      pathname: `/${EXPAND_SPANISH}/${expandChar}`,
      search: '',
      hash: '',
      state: null,
      key: expect.any(String)
    };

    expect(location).toMatchObject(expectedLocationObject);
  });

  test("ExpandPathNoParamSpanish route exists and matches expected route", async () => {
    const { ExpandPathNoParamSpanish } = useAppPaths();
    const initialState = {
      audience,
      dictionaryEndpoint,
      dictionaryName,
      dictionaryTitle,
      language,
      searchBoxTitle
    };

    await act( async () => {
      wrapper = render(
          <MemoryRouter initialEntries={[ExpandPathNoParamSpanish()]}>
            <ClientContextProvider client={getAxiosClient(initialState)}>
              <ComponentWithLocation RenderComponent={ Home } />
            </ClientContextProvider>
          </MemoryRouter>
      );
    });

    const expectedLocationObject = {
      pathname: `/${EXPAND_SPANISH}`,
      search: '',
      hash: '',
      state: null,
      key: expect.any(String)
    };

    expect(location).toMatchObject(expectedLocationObject);
  });

  test("HomePath route exists and matches expected route", async () => {
    const { HomePath } = useAppPaths();
    const initialState = {
      audience,
      dictionaryEndpoint,
      dictionaryName,
      dictionaryTitle,
      language,
      searchBoxTitle
    };

    await act( async () => {
      wrapper = render(
          <MemoryRouter initialEntries={[HomePath()]}>
            <ClientContextProvider client={getAxiosClient(initialState)}>
              <ComponentWithLocation RenderComponent={ Home } />
            </ClientContextProvider>
          </MemoryRouter>
      );
    });

    const expectedLocationObject = {
      pathname: '/',
      search: '',
      hash: '',
      state: null,
      key: expect.any(String)
    };

    expect(location).toMatchObject(expectedLocationObject);
  });
});
