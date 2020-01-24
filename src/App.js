import React, { useEffect } from "react";
import { useStateValue } from "./store/store";
import track from "react-tracking";
import "./styles/dictionaries.scss";

const App = ({ tracking }) => {
  // this should be a DUMB component that just displays our display(group) components
  const [{ dictionaryName }] = useStateValue();

  //example tracking setup for pageload
  useEffect(() => {
    tracking.trackEvent({action: 'pageLoad'})
  }, [tracking]);

  return (
    <div className="App">
      <h1>{dictionaryName}</h1>

      <div>
        <p>Intro text which will be passed in</p>
      </div>

      <form aria-label={`Search the ${dictionaryName}`}>
        Form/input will appear here
      </form>

      <div style={{ border: "1px dotted #aaa" }}>Results component here</div>
    </div>
  );
};

export default track({
  page: "app_load"
})(App);
