import React from 'react';

/**
 * Silly helper component that just holds children. Used by tracking
 * components since we have to use the weird track() wrapping.
 * @param {object} props
 * @param {object} props.children - the child elements.
 */
const WrapperComponent = ({children}) => {
  return (
    <>{children}</>
  )
}

export default WrapperComponent;