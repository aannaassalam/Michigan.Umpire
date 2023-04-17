import 'react-native-gesture-handler';
import React, {useContext, useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import StackNavigations from './src/navigators/StackNavigations';
import {MMKV} from 'react-native-mmkv';
import {SplashScreen} from './src/screens/splash';
import QuestionContext from './src/context/questionContext';

function App() {
  const [isAppReady, setIsAppReady] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setIsAppReady(true);
    }, 1300);
  }, []);

  return (
    <QuestionContext>
      <SplashScreen isAppReady={isAppReady}>
        <NavigationContainer>
          <StackNavigations />
        </NavigationContainer>
      </SplashScreen>
    </QuestionContext>
  );
}

export default App;
