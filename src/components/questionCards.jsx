import React, {memo, useEffect, useRef, useState} from 'react';
import {
  Animated,
  View,
  Text,
  Pressable,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  ScrollView,
  useWindowDimensions,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Video from 'react-native-video';
import {Brightness} from 'react-native-color-matrix-image-filters';

function QuestionCards({question}) {
  const [showImage, setShowImage] = useState(false);
  const [startAnim, setStartAnim] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const [pause, setPause] = useState(false);

  const videoRef = useRef();
  const card = useRef(new Animated.Value(0)).current;
  const {fontScale} = useWindowDimensions();

  const styles = makeStyles(fontScale);

  useEffect(() => {
    if (startAnim) {
      const angle = showImage ? 0 : 1;
      Animated.timing(card, {
        toValue: angle,
        // delay: 1,
        duration: 200,
        useNativeDriver: true,
      }).start(() => {
        setStartAnim(false);
      });
      setTimeout(() => {
        setShowImage(!showImage);
      }, 80);
    } else setStartAnim(false);
  }, [startAnim]);

  //   const rotateCard = () => {
  //     const angle = showImage ? 1 : 0;
  //     Animated.timing(card, {
  //       toValue: angle,
  //       delay: 0,
  //       duration: 200,
  //       useNativeDriver: true,
  //     }).start(() => setShowImage(!showImage));
  //   };

  const rotate = card.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  // console.log(question.id);

  return (
    <Animated.View
      style={[styles.question, , {transform: [{rotateY: rotate}]}]}
      key={question.id}>
      {showImage ? (
        <View style={{flex: 1, width: '100%'}}>
          <Pressable
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              transform: [{rotateY: '180deg'}],
              alignSelf: 'flex-end',
              // padding: 5,
            }}
            onPress={() =>
              //   setTimeout(() => {
              //     setShowImage(false);
              //   }, 200)
              {
                setPause(false);
                setStartAnim(true);
                question.mediaType === 'video' ? setImageLoading(true) : null;
              }
            }
            //   onPress={rotateCard}
          >
            <Feather name="chevron-left" size={22} color="#333" />
            <Text
              style={{
                fontSize: 18 / fontScale,
                color: '#333',
                fontWeight: '500',
              }}>
              Back
            </Text>
          </Pressable>

          {question.mediaType === 'image' ? (
            <Image
              source={{uri: question.image}}
              style={{
                width: '100%',
                height: '90%',
                resizeMode: 'contain',
                marginTop: 'auto',
                display: imageLoading ? 'none' : 'flex',
                // backgroundColor: 'red',
              }}
              onLoadStart={() => console.log('loading')}
              onLoadEnd={() => setImageLoading(false)}
            />
          ) : (
            <>
              <Pressable onPress={() => setPause(prev => !prev)}>
                <Video
                  source={{uri: question.image}}
                  style={{
                    width: '100%',
                    height: '93%',
                    marginTop: 'auto',
                    display: imageLoading ? 'none' : 'flex',
                    // backgroundColor: 'red',
                    transform: [{rotateY: '180deg'}],
                  }}
                  resizeMode="contain"
                  onBuffer={e => console.log(e)}
                  onEnd={() => setPause(true)}
                  onLoad={e => setImageLoading(false)}
                  paused={pause}
                  ref={videoRef}
                />
              </Pressable>
              {pause && (
                <TouchableOpacity
                  style={styles.playButton}
                  onPress={() => setPause(prev => !prev)}>
                  <Ionicons
                    name="play-circle-outline"
                    size={80}
                    color="#f7665e"
                  />
                </TouchableOpacity>
              )}
            </>
          )}
          {imageLoading && (
            <ActivityIndicator
              size={'large'}
              style={{flex: 1}}
              color="#ff552d"
              animating={imageLoading}
            />
          )}
        </View>
      ) : (
        <ScrollView contentContainerStyle={{flexGrow: 1}}>
          {question.title && (
            <Text
              style={{
                ...styles.question_text,
                textAlign: 'left',
                marginBottom: 15,
                fontSize: 20 / fontScale,
                color: '#6B728E',
              }}>
              {question.title.slice(0, 1).toUpperCase() +
                question.title.slice(1, question.title.length).toLowerCase()}
            </Text>
          )}
          {question.brief && (
            <Text
              style={{
                ...styles.question_text,
                textAlign: 'left',
                marginBottom: 20,
                color: '#8D8DAA',
              }}>
              {question.brief.slice(0, 1).toUpperCase() +
                question.brief.slice(1, question.brief.length).toLowerCase()}
            </Text>
          )}
          <Text style={styles.question_text}>
            {question.question.slice(0, 1).toUpperCase() +
              question.question
                .slice(1, question.question.length)
                .toLowerCase()}
          </Text>
          {question.image && (
            <TouchableOpacity
              style={{
                backgroundColor: '#f19717',
                paddingVertical: 10,
                paddingHorizontal: 15,
                borderRadius: 5,
                alignSelf: 'stretch',
                marginTop: 'auto',
              }}
              onPress={() =>
                //   setTimeout(() => {
                //     setShowImage(true);
                //   }, 200)
                setStartAnim(true)
              }
              //   onPress={rotateCard}
            >
              <Text
                style={{
                  fontWeight: '500',
                  color: '#fff',
                  textAlign: 'center',
                  width: '100%',
                }}>
                Show Image
              </Text>
            </TouchableOpacity>
          )}
        </ScrollView>
      )}
      {/* <Image
      source={iconName}
      style={{width: 100, height: 100, marginRight: 10}}
    /> */}
    </Animated.View>
  );
}

export default memo(QuestionCards);

const makeStyles = fontScale =>
  StyleSheet.create({
    question: {
      // width: '100%',
      width: Dimensions.get('window').width - 33,
      height: '100%',
      // flex: 1,
      backgroundColor: '#fff',
      padding: 20,
      borderRadius: 15,
      // paddingRight: 0,
      // flexDirection: 'row',
      justifyContent: 'space-evenly',
      // alignItems: 'flex-start',
      marginRight: 15,
    },
    question_text: {
      color: '#333',
      fontSize: 18 / fontScale,
      // padding: 20,
      textAlign: 'left',
      fontWeight: '700',
      lineHeight: 25,
      marginBottom: 20,
      // textTransform: '',
      // backgroundColor: 'blue',
      // flex: 1,
    },
    playButton: {
      color: '#f7665e',
      position: 'absolute',
      top: '44%',
      left: '36%',
      transform: [{rotateY: '180deg'}],
    },
  });
