import firestore from '@react-native-firebase/firestore';
import axios from 'axios';
import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Dimensions,
  ImageBackground,
  Keyboard,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  useWindowDimensions,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import LinearGradient from 'react-native-linear-gradient';
import {MMKV} from 'react-native-mmkv';
import {SafeAreaView} from 'react-native-safe-area-context';

export default function SubCategories({navigation, route}) {
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTournament, setSelectedTournament] = useState('');
  const {fontScale} = useWindowDimensions();

  const {category} = route.params;

  const styles = makeStyles(fontScale);

  useEffect(() => {
    firestore()
      .collection('settings')
      .doc('Hwwlfpcsree5njE77Wfz')
      .get()
      .then(doc => {
        setTournaments(doc.data().tournaments.filter(_cat => _cat.active));
        setLoading(false);
      });
  }, []);

  // const addCategories = _category => {
  //   setSelectedCategories(prev =>
  //     prev.includes(_category)
  //       ? prev.filter(_prev => _prev !== _category)
  //       : [...prev, _category],
  //   );
  // };

  if (loading) {
    return (
      <SafeAreaView
        style={[
          styles.container,
          {alignItems: 'center', justifyContent: 'center'},
        ]}
        edges={['top']}>
        <ImageBackground
          source={require('../../assets/abstract.jpg')}
          resizeMode="cover"
          style={styles.backgroundImage}
        />
        <ActivityIndicator size={'large'} color={'#fff'} />
      </SafeAreaView>
    );
  }

  return (
    <View style={{flex: 1}}>
      {/* <TouchableWithoutFeedback onPress={Keyboard.dismiss} style={{flex: 1}}> */}
      <ImageBackground
        source={require('../../assets/abstract.jpg')}
        resizeMode="cover"
        style={styles.backgroundImage}
      />
      <ScrollView
        style={styles.container}
        contentContainerStyle={{paddingTop: 140, paddingBottom: 50}}
        showsVerticalScrollIndicator={false}>
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: Dimensions.get('window').width,
            height: Dimensions.get('window').height,
            backgroundColor: 'rgba(0,0,0,0)',
          }}></View>
        <Text style={styles.headingText}>Choose Your</Text>
        <Text style={{...styles.headingText, marginBottom: 40}}>
          Tournament
        </Text>
        <View style={styles.categories}>
          {tournaments.map((_cat, index) => {
            return (
              <TouchableOpacity
                onPress={() => setSelectedTournament(_cat.title)}
                key={index}>
                <LinearGradient
                  colors={
                    selectedTournament === _cat.title
                      ? ['#ff552d', '#f19717']
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
                    // flex: 1,
                    flexDirection: 'row',
                  }}>
                  <View style={styles.category}>
                    <Text style={styles.category_text}>{_cat.title}</Text>
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            );
          })}
        </View>
        <Pressable
          style={{
            marginTop: 40,
            elevation: 80,
            shadowColor: '#000',
          }}
          onPress={() =>
            navigation.navigate('questions', {
              category,
              subcategory: selectedTournament,
            })
          }>
          <LinearGradient
            colors={['#ff552d', '#f19717']}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 0}}
            style={styles.button}>
            <Text style={styles.buttonText}>Submit & Continue</Text>
          </LinearGradient>
        </Pressable>
        {/* </View> */}
      </ScrollView>
      {/* </TouchableWithoutFeedback> */}
    </View>
  );
}

const makeStyles = fontScale =>
  StyleSheet.create({
    container: {
      flex: 1,
      // height: '100%',
      // backgroundColor: '#fcfcfc',
      position: 'relative',
      // marginTop: 140,
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
    categories: {
      //   flex: 1,
      //   flexDirection: 'row',
      paddingHorizontal: 50,
      gap: 5,
      //   width: '100%',
    },
    category: {
      //   width: '50%',
      backgroundColor: '#efefef',
      paddingHorizontal: 20,
      paddingVertical: Platform.OS === 'android' ? 9 : 20,
      color: '#ff552d',
      //   color: '#333',
      borderRadius: 20,
      flex: 1,
    },
    category_text: {
      fontSize: 16 / fontScale,
      fontWeight: '500',
      color: '#333',
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
