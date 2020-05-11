import { EDDLAnalyticsHandler } from "../index";

describe("EDDLAnalyticsHandler", () => {

it('pushes a load event on the NCIDataLayer', () => {
    const mockWindow = {
      NCIDataLayer: []
    };
    const spy = jest.spyOn(mockWindow.NCIDataLayer, 'push');
    EDDLAnalyticsHandler(mockWindow)({
      type: 'PageLoad',
      event: 'TestLoad',
      name: 'pageName',
      channel: 'channel',
      audience: 'Patient',
      additional1: '',
      additional2: ''
    });
    expect(spy).toHaveBeenCalledTimes(1);    
  });

it('pushes a other event on the NCIDataLayer', () => {
    const mockWindow = {
      NCIDataLayer: []
    };
    const spy = jest.spyOn(mockWindow.NCIDataLayer, 'push');
    EDDLAnalyticsHandler(mockWindow)({
      type: 'Other',
      event: 'TestOther',
      linkName: 'TestLinkName',
      data1: "",
      data2: ""
    });
    expect(spy).toHaveBeenCalledTimes(1);    
  });
});