import MaskedView from '@react-native-community/masked-view';
import React, {useContext, useEffect, useState, useRef} from 'react';
import {
  View,
  Text,
  ImageBackground,
  Pressable,
  StyleSheet,
  Dimensions,
  Animated,
  Image,
  useWindowDimensions,
} from 'react-native';
import {QuesContext} from '../context/questionContext';
import {MMKV} from 'react-native-mmkv';
import Lottie from 'lottie-react-native';

export default function Results({route, navigation}) {
  const [initialLoading, setInitialLoading] = useState(true);

  const {user, checkUser, authLoading, passingMarks} = useContext(QuesContext);
  const storage = new MMKV();
  const {fontScale} = useWindowDimensions();

  const styles = makeStyles(fontScale);

  const wicket = useRef(new Animated.Value(-97)).current;
  const scale = useRef(new Animated.Value(1)).current;
  const top = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    !route.params?.fromQuestion
      ? checkUser(JSON.parse(storage.getString('user')).email)
      : null;
    setTimeout(() => {
      setInitialLoading(false);
    }, 840);
    Animated.timing(wicket, {
      toValue: 0,
      duration: 500,
      delay: 900,
      useNativeDriver: false,
    }).start();
    Animated.timing(top, {
      toValue: 130,
      duration: 500,
      useNativeDriver: false,
    }).start();
    Animated.timing(scale, {
      toValue: 0.5,
      duration: 500,
      delay: 900,
      useNativeDriver: false,
    }).start();
    Animated.timing(opacity, {
      toValue: 1,
      duration: 500,
      delay: 1000,
      useNativeDriver: false,
    }).start();
  }, []);

  const rightInterpolate = wicket.interpolate({
    inputRange: [-97, 0],
    outputRange: ['-25%', '0%'],
  });

  const topInterpolate = top.interpolate({
    inputRange: [0, 130],
    outputRange: ['0%', '16%'],
  });

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../../assets/abstract.jpg')}
        resizeMode="cover"
        style={styles.backgroundImage}
      />
      {initialLoading ? (
        <Lottie
          source={require('../../assets/wicket.json')}
          autoPlay
          resizeMode="cover"
          style={styles.umpire}
        />
      ) : (
        <Animated.Image
          source={require('../../assets/wicket_img2.png')}
          style={[
            {
              width: Dimensions.get('window').width,
              height: Dimensions.get('window').height * 0.395,
              resizeMode: 'contain',
              position: 'absolute',
              zIndex: 99,
            },
            {
              right: rightInterpolate,
              transform: [{scale: scale}],
              top: topInterpolate,
            },
          ]}
        />
      )}
      <Animated.View style={[styles.result_container, {opacity: opacity}]}>
        <View style={{width: '100%', alignItems: 'center', marginTop: 200}}>
          <Text
            style={{
              ...styles.text,
              color: authLoading
                ? '#ccc'
                : user.attempts[user.attempts?.length - 1].result_state === 0
                ? '#F47174'
                : '#50C878',
              fontSize: 24 / fontScale,
              marginBottom: 5,
              fontWeight: '700',
            }}>
            {authLoading
              ? 'Loading Result...'
              : user.attempts[user.attempts?.length - 1].result_state === 0
              ? 'Assignment Failed'
              : 'Assignment Passed'}
          </Text>
          <Text style={{...styles.text}}>
            {authLoading
              ? ''
              : `Test Score: ${
                  user.attempts[user.attempts?.length - 1].score
                }/${
                  user.attempts[user.attempts?.length - 1].question_set.length
                }`}
            {/* user.attempts[user.attempts?.length - 1].result_state === 0
            ? 'Better Luck next time...'
              : 'Boom Boom Boom...' */}
          </Text>
        </View>
        <View
          style={{
            marginTop: 15,
            padding: 5,
            paddingHorizontal: 10,
          }}>
          <Text
            style={{
              fontSize: 18 / fontScale,
              fontWeight: '500',
              color: '#444',
              marginTop: 0,
              marginBottom: 5,
            }}>
            {authLoading
              ? ''
              : user.attempts[user.attempts.length - 1].result_state === 0
              ? "Results are out, as you have not been able to clear the assignment your certificate has been put to hold. Don't forget you can still attempt again and come again stronger"
              : "Congratulations🎉, You have successfully cleared your assignment, and the certificate has been sent to you over mail, don't forget to check. Remember you can come again anytime and take the assignment."}
          </Text>
        </View>
      </Animated.View>
    </View>
  );
}

const makeStyles = fontScale =>
  StyleSheet.create({
    container: {
      flex: 1,
      position: 'relative',
      alignItems: 'center',
      justifyContent: 'center',
    },
    backgroundImage: {
      width: Dimensions.get('window').width,
      height: Dimensions.get('window').height,
      position: 'absolute',
      top: 0,
    },
    result_container: {
      width: 320,
      // height: 4,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#fff',
      position: 'relative',
      padding: 15,
      paddingHorizontal: 17,
      borderRadius: 15,
      // opacity: 0,s
    },
    umpire: {
      height: Dimensions.get('window').height * 0.3,
      width: Dimensions.get('window').width,
      // resizeMode: 'contain',
      position: 'absolute',
      zIndex: 99,
      // backgroundColor: 'red',
    },
    text: {
      fontSize: 15 / fontScale,
      color: '#333',
      fontWeight: '500',
    },
  });
