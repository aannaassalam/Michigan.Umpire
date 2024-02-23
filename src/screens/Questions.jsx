import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  ImageBackground,
  View,
  Text,
  StyleSheet,
  Dimensions,
  Pressable,
  Image,
  Animated,
  TouchableOpacity,
  FlatList,
  ScrollView,
  useWindowDimensions,
  ActivityIndicator,
} from 'react-native';
// import {questions} from './data.json';
import LinearGradient from 'react-native-linear-gradient';
import {MMKV} from 'react-native-mmkv';
// import {GetIcons} from '../hooks/getIcons';
import {QuesContext} from '../context/questionContext';
import firestore, {firebase} from '@react-native-firebase/firestore';
import QuestionCards from '../components/questionCards';
import axios from 'axios';
import {SafeAreaView} from 'react-native-safe-area-context';

export default function Questions({navigation, route}) {
  const {category, subcategory} = route.params;
  const [answer, setAnswer] = useState();
  const [questionIndex, setQuestionIndex] = useState(0);
  const {questions, passingMarks, fetchQuestions, loading, setUser} =
    useContext(QuesContext);
  const [local_questions_copy, setLocal_questions_copy] = useState(questions);
  const [score, setScore] = useState(0);
  const [saving, setSaving] = useState(false);

  const {fontScale} = useWindowDimensions();

  const question = useRef(new Animated.Value(0)).current;
  const options = useRef(new Animated.Value(0)).current;
  const flatlist = useRef();

  const storage = new MMKV();
  const styles = makeStyles(fontScale);
  const Dimen = Dimensions.get('window').width - 12.3;

  useEffect(() => {
    fetchQuestions(category, subcategory);
  }, []);

  useEffect(() => {
    setLocal_questions_copy(questions);
  }, [questions]);

  useEffect(() => {
    if (questionIndex < local_questions_copy.length) {
      flatlist.current.scrollToIndex({index: questionIndex, animated: true});
    }
  }, [questionIndex]);

  const animateOptions = useCallback(() => {
    Animated.timing(options, {
      toValue: Dimensions.get('window').width * 0.61,
      duration: 450,
      useNativeDriver: true,
    }).start(() => {
      Animated.timing(options, {
        toValue: 0,
        duration: 300,
        delay: 500,
        useNativeDriver: true,
      }).start();
    });
  }, []);

  // const optionsIntepolate = options.interpolate({
  //   inputRange: [-1, 0, 1],
  //   outputRange: ['0%', '100%', '0%'],
  // });

  const saveAnswer = useCallback(() => {
    if (questionIndex === local_questions_copy.length - 1) {
      setSaving(true);
      const user = JSON.parse(storage.getString('user'));
      firestore()
        .collection('submissions')
        .doc(user.email)
        .get()
        .then(async doc => {
          if (doc.exists) {
            const attempts = [
              ...doc.data().attempts,
              {
                question_set: local_questions_copy,
                certificate_issued: score >= passingMarks,
                result_state: score >= passingMarks ? 1 : 0,
                date: new Date(),
                score,
                id: doc.data().attempts[doc.data().attempts.length - 1].id + 1,
              },
            ];
            firestore()
              .collection('submissions')
              .doc(doc.id)
              .set({
                name: doc.data().name,
                attempts,
              })
              .then(() => {
                setUser({
                  name: doc.data().name,
                  email: user.email,
                  attempts,
                });
                storage.set('submitted', true);
                navigation.replace('results', {
                  fromQuestions: true,
                });
              })
              .catch(err => console.log(err));
          } else {
            firestore()
              .collection('submissions')
              .doc(user.email)
              .set({
                name: `${user.first_name} ${user.last_name}`,
                attempts: [
                  {
                    question_set: local_questions_copy,
                    certificate_issued: score >= passingMarks,
                    result_state: score >= passingMarks ? 1 : 0,
                    date: new Date(),
                    score,
                    id: 1,
                  },
                ],
              })
              .then(() => {
                setUser({
                  name: `${user.first_name} ${user.last_name}`,
                  email: user.email,
                  attempts: [
                    {
                      question_set: local_questions_copy,
                      certificate_issued: score >= passingMarks,
                      result_state: score >= passingMarks ? 1 : 0,
                      date: new Date(),
                      score,
                      id: 1,
                    },
                  ],
                });
                navigation.replace('results', {
                  fromQuestions: true,
                });
              })
              .catch(err => console.log(err));
          }
          if (score >= passingMarks) {
            try {
              const res = await axios.post(
                'https://fccumpire-server.herokuapp.com/certificate',
                {
                  name: `${user.first_name} ${user.last_name}`,
                  email: user.email,
                },
              );
              // console.log(res);
              if (res.status === 200) {
                setSaving(false);
              }
            } catch (err) {
              console.log(err);
            }
          }
        })
        .catch(err => console.log(err));
    } else if (answer > -1) {
      const local_array = local_questions_copy;
      local_array[questionIndex].answer = answer;
      // local_array[questionIndex].answer =
      //   local_array[questionIndex]['options'][answer];
      if (answer === local_array[questionIndex].correctOption)
        setScore(prev => prev + 1);
      setLocal_questions_copy(local_array);
      setTimeout(() => {
        setQuestionIndex(questionIndex + 1);
        setAnswer();
      }, 320);
      animateOptions();
    } else {
      null;
    }
  }, [questionIndex, answer]);

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
    <SafeAreaView style={styles.container} edges={['top']}>
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
          backgroundColor: 'rgba(0,0,0,0.1)',
        }}
      />
      <View style={styles.question_counter}>
        <Text style={styles.counter}>
          Question {questionIndex + 1}/{local_questions_copy.length}
        </Text>
      </View>
      <View style={styles.question_container}>
        <FlatList
          ref={flatlist}
          data={local_questions_copy}
          renderItem={({item}) => <QuestionCards question={item} />}
          keyExtractor={question => question.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          scrollEnabled={false}
        />
      </View>
      <Animated.ScrollView
        style={[
          {
            ...styles.options_container,
            flex: 0.38,
          },
          {transform: [{translateY: options}]},
        ]}
        contentContainerStyle={{
          flexGrow: 1,
          alignItems: 'center',
          justifyContent: 'center',
          paddingTop: 10,
          paddingBottom: 30,
          marginBottom: 15,
        }}>
        <Text style={styles.helperText}>Select the correct answer</Text>
        <View
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            flexWrap: 'wrap',
            width: '100%',
            // backgroundColor: 'red',
            gap: 4,
          }}>
          {local_questions_copy[questionIndex]?.options.map((option, index) => {
            return (
              <View style={{width: '100%'}} key={index}>
                <Pressable
                  style={{
                    ...styles.option,
                    backgroundColor: answer === index ? '#3ad655' : '#fff',
                    borderColor: answer === index ? '#ffffff99' : 'transparent',
                  }}
                  onPress={() => setAnswer(index)}
                  key={index}>
                  <Text
                    style={{
                      color: answer === index ? '#fff' : '#333',
                      fontWeight: answer === index ? '900' : '500',
                      fontSize: 16 / fontScale,
                    }}>
                    {option}
                  </Text>
                </Pressable>
              </View>
            );
          })}
        </View>
        <Pressable
          style={{
            marginTop: 20,
            elevation: 80,
            shadowColor: '#000',
          }}
          onPress={saveAnswer}>
          <LinearGradient
            colors={['#ff552d', '#f19717']}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 0}}
            style={styles.button}>
            {saving ? (
              <ActivityIndicator animating={true} color="#fff" />
            ) : (
              <>
                <Text style={styles.buttonText}>
                  {questionIndex === questions.length - 1 ? 'Submit' : 'Next'}
                </Text>
                <Image
                  source={require('../../assets/right-arrow.png')}
                  style={styles.icon}
                />
              </>
            )}
          </LinearGradient>
        </Pressable>
      </Animated.ScrollView>
    </SafeAreaView>
  );
}

const makeStyles = fontScale =>
  StyleSheet.create({
    container: {
      flex: 1,
      position: 'relative',
    },
    backgroundImage: {
      width: Dimensions.get('window').width,
      height: Dimensions.get('window').height,
      position: 'absolute',
      top: 0,
    },
    question_counter: {
      height: 50,
      width: '100%',
      justifyContent: 'center',
      alignItems: 'center',
    },
    counter: {
      color: '#eee',
      fontSize: 18 / fontScale,
      marginTop: 15,
      fontWeight: '500',
    },
    question_container: {
      flex: 1.3,
      padding: 15,
      flexDirection: 'row',
      // justifyContent: 'center',
      alignItems: 'center',
    },
    options_container: {
      // position: 'relative',
      borderTopLeftRadius: 50,
      borderTopRightRadius: 50,
      paddingHorizontal: 50,
      paddingVertical: 30,
      paddingTop: 10,
      backgroundColor: 'rgba(255,255,255,.3)',
    },
    blur: {
      width: '100%',
      height: '100%',
      position: 'absolute',
      top: 0,
      left: 0,
      // backgroundColor: 'rgba(255,255,255,0.1)',
    },
    helperText: {
      fontSize: 14 / fontScale,
      textAlign: 'center',
      marginBottom: 40,
      color: '#fff',
      fontWeight: '500',
    },
    option: {
      width: '100%',
      // minHeight: 50,
      padding: 12,
      paddingVertical: 15,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 20,
      borderRadius: 10,
      borderWidth: 1,
    },
    button: {
      width: 200,
      height: 50,
      flexDirection: 'row',
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
    icon: {
      width: 20,
      height: 20,
      marginTop: 2,
      marginLeft: 10,
    },
  });
