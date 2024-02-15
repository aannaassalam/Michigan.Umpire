import React, {useContext, useEffect, useRef, useState} from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  Image,
  View,
  Animated,
  useWindowDimensions,
} from 'react-native';
import {MMKV} from 'react-native-mmkv';
import {QuesContext} from '../context/questionContext';

export const SplashScreen = ({isAppReady, children}) => {
  const {questions} = useContext(QuesContext);
  const loadingState = isAppReady;

  return (
    <>
      {loadingState && children}

      <Splash isAppReady={isAppReady} />
    </>
  );
};

const LOADING_IMAGE = 'Loading image';
const FADE_IN_IMAGE = 'Fade in image';
const WAIT_FOR_APP_TO_BE_READY = 'Wait for app to be ready';
const FADE_OUT = 'Fade out';
const HIDDEN = 'Hidden';

export default function Splash({isAppReady}) {
  const [state, setState] = useState(LOADING_IMAGE);

  const storage = new MMKV();
  const {fontScale} = useWindowDimensions();

  const styles = makeStyles(fontScale);

  // const {fetchQuestions, loading, checkUser} = useContext(QuesContext);
  const containerOpacity = useRef(new Animated.Value(1)).current;
  const imageOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // fetchQuestions();
    // if (storage.contains('user')) {
    //   checkUser(JSON.parse(storage.getString('user')).email);
    // }
    if (state === FADE_IN_IMAGE) {
      Animated.timing(imageOpacity, {
        toValue: 1,
        duration: 1000, // Fade in duration
        useNativeDriver: true,
      }).start(() => {
        setState(WAIT_FOR_APP_TO_BE_READY);
      });
    }
  }, [imageOpacity, state]);

  useEffect(() => {
    if (state === WAIT_FOR_APP_TO_BE_READY) {
      if (isAppReady) {
        setState(FADE_OUT);
      }
    }
  }, [isAppReady, state]);

  useEffect(() => {
    if (state === FADE_OUT) {
      Animated.timing(containerOpacity, {
        toValue: 0,
        duration: 1000, // Fade out duration
        delay: 1000, // Minimum time the logo will stay visible
        useNativeDriver: true,
      }).start(() => {
        setState(HIDDEN);
      });
    }
  }, [containerOpacity, state]);

  if (state === HIDDEN) return null;

  if (isAppReady) return null;

  return (
    <Animated.View
      collapsable={false}
      style={[styles.container, {opacity: containerOpacity}]}>
      <Image
        source={require('../../assets/abstract.jpg')}
        resizeMode="cover"
        fadeDuration={0}
        onLoad={() => {
          setState(FADE_IN_IMAGE);
        }}
        style={styles.backgroundImage}
      />
      <View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0,0,0,0.0)',
        }}></View>
      <Animated.Text style={[styles.name, {opacity: imageOpacity}]}>
        FCCUmpire
      </Animated.Text>
      {/* <Pressable
          style={{
            flex: 0.15,
          }}
          onPress={() =>
            navigation.navigate(storage.contains('user') ? 'questions' : 'login')
          }>
          <LinearGradient
            colors={['#ff552d', '#f19717']}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 0}}
            style={styles.button}>
            <Text style={styles.buttonText}>
              {storage.contains('user') ? 'Continue Quiz' : 'Start Quiz'}
            </Text>
          </LinearGradient>
        </Pressable> */}
    </Animated.View>
  );
}

const makeStyles = fontScale =>
  StyleSheet.create({
    container: {
      flex: 1,
      // backgroundColor: '#fafafa',
      position: 'relative',
      justifyContent: 'flex-end',
    },
    backgroundImage: {
      height: Dimensions.get('window').height,
      width: Dimensions.get('window').width,
      // width: '100%',
      // height: '100%',
      position: 'absolute',
      top: 0,
      left: 0,
    },
    name: {
      fontSize: 48 / fontScale,
      fontFamily: 'Redressed-Regular',
      marginBottom: 'auto',
      marginTop: 'auto',
      color: '#fafafa',
      textAlign: 'center',
      // color: '#333',
      width: '100%',
    },
  });
