import React from 'react';
import { Link } from 'react-router-dom';
import { useStateValue } from "../../store/store.js";
import { useAppPaths } from "../../hooks/routing";

const Home = () => {
  const [{ dictionaryName }] = useStateValue();
  const { DefinitionPath } = useAppPaths();

  return (
    <div>
      <h1>{dictionaryName}</h1>
      <div>
        Hello World
      </div>
      <div>
        <Link to={DefinitionPath({ idOrName: '12345' })}>Test Definition Link</Link>
      </div>
    </div>
  );
}

export default Home;