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
  StatusBar,
  Platform,
  TouchableOpacity,
} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import {MMKV} from 'react-native-mmkv';
import {QuesContext} from '../context/questionContext';
import Modal from 'react-native-modal';
import firestore, {firebase} from '@react-native-firebase/firestore';

export default function Start({navigation}) {
  const {user, fetchQuestions, checkUser, authLoading, setUser} =
    useContext(QuesContext);

  const storage = new MMKV();
  const {fontScale} = useWindowDimensions();
  const styles = makeStyles(fontScale);

  const [deleteModal, setDeleteModal] = useState(false);
  const [recheck, setRecheck] = useState(false);

  useFocusEffect(
    useCallback(() => {
      // setState({
      //   submitted: storage.contains('submitted'),
      //   user: storage.contains('user'),
      // });
      if (storage.contains('user')) {
        checkUser(JSON.parse(storage.getString('user')).email);
        setRecheck(false);
      }
    }, [recheck]),
  );

  const deleteAccount = () => {
    firestore()
      .collection('submissions')
      .doc(JSON.parse(storage.getString('user')).email)
      .delete()
      .then(() => {
        storage.clearAll();
        setRecheck(true);
        setDeleteModal(false);
        setUser({});
      })
      .catch(err => console.log(err));
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
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
        <Text style={styles.name}>Michigan Umpire</Text>
      </View>
      <Pressable
        onPress={() => {
          if (storage.contains('user')) {
            // fetchQuestions();
            authLoading ? null : navigation.navigate('categories');
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
            // flex: 0.15,
            marginBottom: 20,
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

      {Boolean(storage.contains('user')) && (
        <Pressable
          onPress={() => {
            setDeleteModal(true);
          }}>
          <LinearGradient
            colors={['#ff552d', '#f19717']}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 0}}
            style={{...styles.button, marginBottom: 20}}>
            <Text style={styles.buttonText}>Delete Account</Text>
          </LinearGradient>
        </Pressable>
      )}
      <Modal
        isVisible={deleteModal}
        backdropColor="#000000"
        onBackdropPress={() => setDeleteModal(false)}
        coverScreen={false}
        deviceWidth={Dimensions.get('window').width}
        style={styles.modal}>
        {/* <View style={styles.modal}> */}
        <Text style={styles.modalHeading}>Delete Account?</Text>
        <Text style={styles.modalSubtitle}>
          Are you sure? This action will result in permanent deletion of you
          account.
        </Text>
        <View style={styles.stack}>
          <TouchableOpacity
            style={[styles.modal_button, styles.outlined]}
            onPress={() => setDeleteModal(false)}>
            <Text style={[styles.modal_buttonText, styles.outlined_text]}>
              No
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.modal_button, styles.contained]}
            onPress={deleteAccount}>
            <Text style={[styles.modal_buttonText, styles.contained_text]}>
              Yes, sure
            </Text>
          </TouchableOpacity>
        </View>
        {/* </View> */}
      </Modal>
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
      paddingBottom: Platform.OS === 'ios' ? 10 : 0,
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
      fontSize: 48 / fontScale,
      fontFamily: 'Redressed-Regular',
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
    modal: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      height: 230,
      width: Dimensions.get('screen').width,
      margin: 0,
      borderTopRightRadius: 20,
      borderTopLeftRadius: 20,
      backgroundColor: '#f0f0f0',
      padding: 30,
      justifyContent: 'flex-start',
      // paddingVertical: 20,
    },
    modalHeading: {
      fontSize: 25 / fontScale,
      color: '#333',
      fontWeight: '700',
      marginTop: 0,
      marginBottom: 10,
    },
    modalSubtitle: {
      fontSize: 16,
      fontWeight: '500',
      color: '#888',
    },
    stack: {
      flexDirection: 'row',
      gap: 10,
      marginTop: 30,
    },
    modal_button: {
      padding: 10,
      paddingVertical: 13,
      borderRadius: 10,
      // backgroundColor: 'red',
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    modal_buttonText: {
      color: '#fff',
      fontWeight: '500',
      fontSize: 16,
    },
    outlined: {
      borderWidth: 2,
      borderColor: '#ff6961',
      backgroundColor: '#f0f0f0',
    },
    outlined_text: {
      color: '#ff6961',
    },
    contained: {
      backgroundColor: '#ff6961',
    },
    contained_text: {
      color: '#fff',
    },
  });
