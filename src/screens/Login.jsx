import React, {useContext, useState} from 'react';
import {
  Button,
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  Dimensions,
  View,
  Keyboard,
  ScrollView,
  ActivityIndicator,
  useWindowDimensions,
  TouchableWithoutFeedback,
  Platform,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {MMKV} from 'react-native-mmkv';
import {QuesContext} from '../context/questionContext';
import firestore from '@react-native-firebase/firestore';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import axios from 'axios';

export default function Login({navigation}) {
  const [inputFocus, setInputFocus] = useState();
  const [first_name, setFirst_name] = useState('');
  const [last_name, setLast_name] = useState('');
  const [email, setEmail] = useState('');
  const [err, setErr] = useState({input: '', msg: ''});
  const [authLoading, setAuthLoading] = useState(false);

  const {checkUser} = useContext(QuesContext);

  const {fontScale} = useWindowDimensions();

  const styles = makeStyles(fontScale);

  const storage = new MMKV();

  const submitLogin = async () => {
    if (first_name.trim() === '') {
      setErr({
        input: 'fname',
        msg: 'Please fill First name!',
      });
      return;
    }
    if (last_name.trim() === '') {
      setErr({
        input: 'lname',
        msg: 'Please fill Last name!',
      });
      return;
    }
    if (email.trim() === '') {
      setErr({
        input: 'email',
        msg: 'Please provide your email!',
      });
      return;
    }
    if (!email.includes('@')) {
      setErr({
        input: 'email',
        msg: 'Please enter valid email address!',
      });
      return;
    }
    setAuthLoading(true);
    axios
      .post('https://fccumpire-server.herokuapp.com/send-fccumpire-otp', {
        email,
      })
      .then(() => {
        navigation.navigate('otp', {first_name, last_name, email});
      })
      .catch(() => {})
      .finally(() => setAuthLoading(false));
    // firestore()
    //   .collection('submissions')
    //   .doc(email)
    //   .get()
    //   .then(doc => {
    //     if (!doc.exists) {
    //       navigation.replace('questions');
    //     } else {
    //       navigation.replace('results');
    //     }
    //   })
    //   .catch(err => console.log(err));
    // .finally(() => setAuthLoading(false));
  };

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
          <Text style={{...styles.headingText, marginBottom: 40}}>Details</Text>
          <View style={styles.inputs}>
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
              style={{
                elevation: 8,
                marginBottom: 5,
                shadowColor: '#333',
                borderRadius: 20,
                padding: 2,
                overflow: 'hidden',
              }}>
              <TextInput
                placeholder="Enter First Name"
                style={styles.input}
                placeholderTextColor="#999"
                onFocus={() => setInputFocus(1)}
                onBlur={() => setInputFocus()}
                value={first_name}
                onChangeText={text => {
                  setFirst_name(text);
                  setErr({input: '', msg: ''});
                }}
              />
            </LinearGradient>
            <Text
              style={{
                color: '#F47174',
                marginBottom: 5,
                fontWeight: '500',
                paddingHorizontal: 20,
              }}>
              {err.input === 'fname' && err.msg}
            </Text>
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
              }}>
              <TextInput
                placeholder="Enter Last Name"
                style={styles.input}
                placeholderTextColor="#999"
                onFocus={() => setInputFocus(2)}
                onBlur={() => setInputFocus()}
                value={last_name}
                onChangeText={text => {
                  setLast_name(text);
                  setErr({input: '', msg: ''});
                }}
              />
            </LinearGradient>
            <Text
              style={{
                color: '#F47174',
                marginBottom: 5,
                fontWeight: '500',
                paddingHorizontal: 20,
              }}>
              {err.input === 'lname' && err.msg}
            </Text>
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
              }}>
              <TextInput
                placeholder="Enter Email"
                style={styles.input}
                placeholderTextColor="#999"
                onFocus={() => setInputFocus(3)}
                onBlur={() => setInputFocus()}
                value={email}
                onChangeText={text => {
                  setEmail(text.toLowerCase());
                  setErr({input: '', msg: ''});
                }}
              />
            </LinearGradient>
            <Text
              style={{
                color: '#F47174',
                marginBottom: 5,
                fontWeight: '500',
                paddingHorizontal: 20,
              }}>
              {err.input === 'email' && err.msg}
            </Text>
          </View>
          <Pressable
            style={{
              marginTop: 40,
              elevation: 80,
              shadowColor: '#000',
            }}
            onPress={submitLogin}>
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
      paddingHorizontal: 50,
    },
    input: {
      backgroundColor: '#efefef',
      fontWeight: '500',
      paddingHorizontal: 20,
      paddingVertical: Platform.OS === 'ios' ? 15 : 9,
      color: '#333',
      borderRadius: 20,
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
