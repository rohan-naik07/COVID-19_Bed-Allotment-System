import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { NavigationActions } from 'react-navigation';

import AppNavigator from './AppNavigator';

const NavigationContainer = props => {
  const navRef = useRef();
  const isAuth = false;

  useEffect(() => {
    if (!isAuth) {
      navRef.current.dispatch(
        NavigationActions.navigate({ routeName: 'Auth' })
      );
    }
  }, [isAuth]);

  return <AppNavigator ref={navRef} />;
};

export default NavigationContainer;
