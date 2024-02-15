import axios from 'axios';
import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Dimensions,
  ImageBackground,
  Keyboard,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
  useWindowDimensions,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import LinearGradient from 'react-native-linear-gradient';
import {MMKV} from 'react-native-mmkv';

export default function OTP({navigation, route}) {
  const {email, last_name, first_name} = route.params;
  const [inputFocus, setInputFocus] = useState();
  const [err, setErr] = useState('');
  const inputRefs = [];
  const [otp_arr, setOtp_arr] = useState([]);
  const [otp, setOtp] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const {fontScale} = useWindowDimensions();

  const styles = makeStyles(fontScale);

  useEffect(() => {
    inputRefs[0].focus();
  }, []);

  const focusPrevious = (key, index) => {
    // console.log('back');
    if (key === 'Backspace' && index !== 0) {
      inputRefs[index - 1].focus();
    }
  };

  const focusNext = (index, value) => {
    // console.log(inputRefs);\
    if (index < inputRefs.length - 1 && value.trim().length > 0) {
      inputRefs[index + 1].focus();
    }
    // console.log(index, inputRefs.length - 1, 'sd');
    if (index === inputRefs.length - 1) {
      // console.log('two');
      // const local_otp = otp;
      // local_otp[index] = value;
      // setOtp(local_otp);
      inputRefs[index].blur();
    }
    const local_otp = otp_arr;
    local_otp[index] = value;
    setOtp_arr(local_otp);
    setOtp(otp_arr.join(''));
    // this.props.getOtp(otp.join(''));
  };

  const storage = new MMKV();

  const submitOTP = () => {
    if (otp.length < 4) {
      setErr('Please enter a valid OTP!');
    } else {
      setAuthLoading(true);
      axios
        .post('https://fccumpire-server.herokuapp.com/check-fccumpire-otp', {
          email: email,
          otp: parseInt(otp),
        })
        .then(() => {
          storage.set('user', JSON.stringify({first_name, last_name, email}));
          navigation.reset({
            index: 0,
            routes: [{name: 'start'}, {name: 'categories'}],
          });
        })
        .catch(() => {
          setErr('Incorrect OTP!');
        })
        .finally(() => setAuthLoading(false));
    }
  };

  const inputs = Array(4).fill(0);

  const renderedInputs = inputs.map((i, j) => (
    <LinearGradient
      colors={
        inputFocus === 1
          ? ['#ff552d', '#f19717']
          : err.input === 'fname'
          ? ['#F47174', '#F47174']
          : ['#999', '#999']
      }
      start={{x: 0, y: 0}}
      end={{x: 1, y: 0}}
      key={j}
      style={{
        elevation: 8,
        marginBottom: 5,
        shadowColor: '#333',
        borderRadius: 20,
        padding: 2,
        overflow: 'hidden',
        flex: 1,
        flexDirection: 'row',
      }}>
      <TextInput
        placeholder="-"
        style={styles.input}
        placeholderTextColor="#999"
        // value={otp1}
        onChangeText={v => focusNext(j, v)}
        onKeyPress={e => focusPrevious(e.nativeEvent.key, j)}
        maxLength={1}
        keyboardType="numeric"
        numberOfLines={1}
        ref={ref => {
          inputRefs[j] = ref;
        }}
      />
    </LinearGradient>
  ));

  return (
    <KeyboardAwareScrollView contentContainerStyle={{flex: 1}}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} style={{flex: 1}}>
        <View style={styles.container}>
          <ImageBackground
            source={require('../../assets/abstract.jpg')}
            resizeMode="cover"
            style={styles.backgroundImage}
          />
          <View
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: Dimensions.get('window').width,
              height: Dimensions.get('window').height,
              backgroundColor: 'rgba(0,0,0,0)',
            }}></View>
          <Text style={styles.headingText}>Enter your</Text>
          <Text style={{...styles.headingText, marginBottom: 40}}>OTP</Text>
          <View style={styles.inputs}>
            {renderedInputs}
            {/* <LinearGradient
              colors={
                inputFocus === 1
                  ? ['#ff552d', '#f19717']
                  : err.input === 'fname'
                  ? ['#F47174', '#F47174']
                  : ['#999', '#999']
              }
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}
              style={{
                elevation: 8,
                marginBottom: 5,
                shadowColor: '#333',
                borderRadius: 20,
                padding: 2,
                overflow: 'hidden',
                flex: 1,
                flexDirection: 'row',
              }}>
              <TextInput
                placeholder="-"
                style={styles.input}
                placeholderTextColor="#999"
                onFocus={() => setInputFocus(1)}
                onBlur={() => setInputFocus()}
                value={otp1}
                onChangeText={text => {
                  setOtp1(text);
                  setErr('Please Enter Valid OTP');
                }}
                numberOfLines={1}
              />
            </LinearGradient>
            <LinearGradient
              colors={
                inputFocus === 2
                  ? ['#ff552d', '#f19717']
                  : err.input === 'lname'
                  ? ['#F47174', '#F47174']
                  : ['#999', '#999']
              }
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}
              style={{
                elevation: 8,
                marginBottom: 5,
                shadowColor: '#333',
                borderRadius: 20,
                padding: 2,
                overflow: 'hidden',
                flex: 1,
                flexDirection: 'row',
              }}>
              <TextInput
                placeholder="-"
                style={styles.input}
                placeholderTextColor="#999"
                onFocus={() => setInputFocus(2)}
                onBlur={() => setInputFocus()}
                value={otp2}
                onChangeText={text => {
                  setOtp2(text);
                  setErr('Please Enter Valid OTP');
                }}
                numberOfLines={1}
              />
            </LinearGradient>
            <LinearGradient
              colors={
                inputFocus === 3
                  ? ['#ff552d', '#f19717']
                  : err.input === 'email'
                  ? ['#F47174', '#F47174']
                  : ['#999', '#999']
              }
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}
              style={{
                elevation: 8,
                marginBottom: 5,
                shadowColor: '#333',
                borderRadius: 20,
                padding: 2,
                overflow: 'hidden',
                flex: 1,
                flexDirection: 'row',
              }}>
              <TextInput
                placeholder="-"
                style={styles.input}
                placeholderTextColor="#999"
                onFocus={() => setInputFocus(3)}
                onBlur={() => setInputFocus()}
                value={otp3}
                onChangeText={text => {
                  setOtp3(text);
                  setErr('Please Enter Valid OTP');
                }}
                numberOfLines={1}
              />
            </LinearGradient>
            <LinearGradient
              colors={
                inputFocus === 4
                  ? ['#ff552d', '#f19717']
                  : err.input === 'email'
                  ? ['#F47174', '#F47174']
                  : ['#999', '#999']
              }
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}
              style={{
                elevation: 8,
                marginBottom: 5,
                shadowColor: '#333',
                borderRadius: 20,
                padding: 2,
                overflow: 'hidden',
                flex: 1,
                flexDirection: 'row',
              }}>
              <TextInput
                placeholder="-"
                style={styles.input}
                placeholderTextColor="#999"
                onFocus={() => setInputFocus(4)}
                onBlur={() => setInputFocus()}
                value={otp4}
                onChangeText={text => {
                  setOtp4(text);
                  setErr('Please Enter Valid OTP');
                }}
                numberOfLines={1}
                // maxLength={1}
              />
            </LinearGradient> */}
          </View>
          <Text
            style={{
              color: '#F47174',
              marginTop: 5,
              fontWeight: '700',
              paddingHorizontal: 50,
            }}>
            {err}
          </Text>
          <Pressable
            style={{
              marginTop: 40,
              elevation: 80,
              shadowColor: '#000',
            }}
            onPress={submitOTP}>
            <LinearGradient
              colors={['#ff552d', '#f19717']}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}
              style={styles.button}>
              {authLoading ? (
                <ActivityIndicator
                  color="#fff"
                  size={'small'}
                  animating={authLoading}
                />
              ) : (
                <Text style={styles.buttonText}>Submit & Continue</Text>
              )}
            </LinearGradient>
          </Pressable>
          {/* </View> */}
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAwareScrollView>
  );
}

const makeStyles = fontScale =>
  StyleSheet.create({
    container: {
      flex: 1,
      height: '100%',
      backgroundColor: '#fcfcfc',
      paddingTop: 140,
      position: 'relative',
    },
    backgroundImage: {
      width: Dimensions.get('window').width,
      height: Dimensions.get('window').height,
      position: 'absolute',
      top: 0,
    },
    headingText: {
      fontSize: 35 / fontScale,
      paddingHorizontal: 50,
      color: '#eee',
      fontWeight: '700',
    },
    inputs: {
      flexDirection: 'row',
      paddingHorizontal: 50,
      gap: 5,
    },
    input: {
      backgroundColor: '#efefef',
      fontWeight: '700',
      paddingHorizontal: 20,
      paddingVertical: Platform.OS === 'android' ? 9 : 20,
      color: '#ff552d',
      //   color: '#333',
      borderRadius: 20,
      flex: 1,
      textAlign: 'center',
      fontSize: 18 / fontScale,
    },
    button: {
      width: 250,
      height: 50,
      alignItems: 'center',
      justifyContent: 'center',
      alignSelf: 'center',
      borderRadius: 10,
    },
    buttonText: {
      color: '#fff',
      fontWeight: '500',
      fontSize: 17 / fontScale,
    },
  });
