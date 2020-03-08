import React from 'react';
import { Link } from 'react-router-dom';
import { useStateValue } from "../../store/store.js";
import { useAppPaths } from "../../hooks/routing";

const Home = () => {
  const [{ dictionaryTitle }] = useStateValue();
  const { DefinitionPath } = useAppPaths();

  return (
    <div>
      <h1>{dictionaryTitle}</h1>
      <div>
        Hello World
      </div>
      <div>
        <Link to={DefinitionPath({ idOrName: '44058' })}>Test Definition Link (metastatic)</Link>
      </div>
    </div>
  );
}

export default Home;