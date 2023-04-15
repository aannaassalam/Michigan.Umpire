import React, {useCallback, useContext, useEffect, useState} from 'react';
import {
  Dimensions,
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  ActivityIndicator,
  useWindowDimensions,
} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import {MMKV} from 'react-native-mmkv';
import {QuesContext} from '../context/questionContext';

export default function Start({navigation}) {
  const {user, fetchQuestions, checkUser, authLoading} =
    useContext(QuesContext);

  const storage = new MMKV();
  const {fontScale} = useWindowDimensions();
  const styles = makeStyles(fontScale);

  useFocusEffect(
    useCallback(() => {
      // setState({
      //   submitted: storage.contains('submitted'),
      //   user: storage.contains('user'),
      // });
      if (storage.contains('user')) {
        checkUser(JSON.parse(storage.getString('user')).email);
      }
    }, []),
  );

  return (
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
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0,0,0,0.0)',
        }}></View>
      <View
        style={{
          marginBottom: 'auto',
          marginTop: 'auto',
          width: '100%',
          alignItems: 'center',
        }}>
        <Image
          source={require('../../assets/FCCUmpire-logo.jpeg')}
          style={styles.logo}
        />
        <Text style={styles.name}>FCCUmpire</Text>
      </View>
      <Pressable
        onPress={() => {
          if (storage.contains('user')) {
            fetchQuestions();
            authLoading ? null : navigation.navigate('questions');
          } else {
            navigation.navigate('login');
          }
        }}>
        <LinearGradient
          colors={['#ff552d', '#f19717']}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 0}}
          style={{...styles.button, marginBottom: 20}}>
          <Text style={styles.buttonText}>
            {storage.contains('user') ? 'Attempt Quiz' : 'Start Quiz'}
          </Text>
        </LinearGradient>
      </Pressable>

      {user.attempts !== undefined && (
        <Pressable
          style={{
            flex: 0.15,
          }}
          onPress={() =>
            navigation.navigate(
              user.attempts !== undefined ? 'results' : 'login',
            )
          }>
          <LinearGradient
            colors={['#ff552d', '#f19717']}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 0}}
            style={styles.button}>
            <Text style={styles.buttonText}>Results</Text>
          </LinearGradient>
        </Pressable>
      )}
    </View>
  );
}

const makeStyles = fontScale =>
  StyleSheet.create({
    container: {
      flex: 1,
      // backgroundColor: '#fafafa',
      position: 'relative',
      justifyContent: 'flex-end',
      alignItems: 'center',
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
    logo: {
      width: 80,
      height: 80,
      resizeMode: 'cover',
      borderWidth: 5,
      borderColor: '#eee',
      borderRadius: 15,
      marginBottom: 25,
    },
    name: {
      fontSize: 40 / fontScale,
      fontFamily: 'NatureBeauty',
      color: '#fafafa',
      textAlign: 'center',
      // color: '#333',
      width: '100%',
    },
    button: {
      width: 230,
      height: 50,
      alignItems: 'center',
      justifyContent: 'center',
      alignSelf: 'center',
      borderRadius: 10,
      // justifySelf: 'flex-end',
      // marginTop: 'auto',
    },
    buttonText: {
      color: '#fff',
      fontWeight: '500',
      fontSize: 17 / fontScale,
    },
  });
