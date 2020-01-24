import React from 'react';
import track from 'react-tracking';

const WrapperComponent = ({children}) => {
  return (
    <>{children}</>
  )
}

/**
 * A HoC to handle deficiencies in the react-tracking module when using stateless
 * function. This is used to wrap the app so that we can bind the analyticsHandler
 * to the dispatch function for the tracking.
 *
 * @param {Object} props - The props
 * @param {array} props.children - the child objects
 * @param {function} props.analyticsHandler - The function for handling tracking dispatches
 */
const AnalyticsProvider = ({ children, analyticsHandler }) => {
  
  const TrackingWrapper = track(
    {},
    { 
      dispatch: analyticsHandler 
    }
  )(WrapperComponent);

  return (
    <TrackingWrapper>
      {children}
    </TrackingWrapper>
  );

};

export default AnalyticsProvider;