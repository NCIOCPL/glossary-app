import React from 'react';
import { useParams } from 'react-router';

const Definition = () => {
  const { idOrName } = useParams()

  return (
    <div>
      <h1>You Name Here</h1>
      <div>
        Definition for { idOrName }
      </div>
    </div>
  );
}

export default Definition;