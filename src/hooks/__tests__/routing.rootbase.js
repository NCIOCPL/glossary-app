import { useAppPaths } from '../routing';

import { useStateValue } from "../../store/store.js";
jest.mock("../../store/store.js");

describe("when base path is slash", ()=> {
  useStateValue.mockReturnValue([{
      basePath: '/'
  }]);

  it("will produce paths without params", () => {
    const {HomePath, DefinitionPath} = useAppPaths();

    expect(HomePath()).toEqual('/');
    expect(DefinitionPath()).toEqual('/def/:idOrName');
  });

  it("will replace paths with params", () => {
    const {HomePath, DefinitionPath} = useAppPaths();

    expect(HomePath({foo: 'bar'})).toEqual('/');
    expect(DefinitionPath({idOrName: '12345'})).toEqual('/def/12345');
  });

});

