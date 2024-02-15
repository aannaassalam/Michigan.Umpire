import React, {createContext, useContext, useState} from 'react';
import firestore from '@react-native-firebase/firestore';
import {MMKV} from 'react-native-mmkv';

export const QuesContext = createContext();

export default function QuestionContext({children}) {
  const [questions, setQuestions] = useState([]);
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [passingMarks, setPassingMarks] = useState(0);

  const storage = new MMKV();

  const fetchQuestions = async category => {
    setLoading(true);
    const settings = await firestore()
      .collection('settings')
      .doc('Hwwlfpcsree5njE77Wfz')
      .get();
    firestore()
      .collection('questions')
      .get()
      .then(snap => {
        let randomQues = snap.docs
          .filter(
            _doc =>
              _doc.data().activityStatus === 1 &&
              _doc.data().status === 1 &&
              _doc.data().category.toLowerCase() === 'general',
          )
          .map(doc => ({...doc.data(), id: doc.id}));

        if (category.toLowerCase() === 'general') {
          randomQues = randomQues.slice(
            0,
            10 + settings.data().number_of_questions,
          );
        } else {
          const categoryQues = snap.docs
            .filter(
              _doc =>
                _doc.data().activityStatus === 1 &&
                _doc.data().status === 1 &&
                _doc.data().category === category,
            )
            .sort(() => Math.random() - 0.5)
            .slice(0, settings.data().number_of_questions)
            .map(_doc => ({..._doc.data(), id: _doc.id}));

          randomQues = [...randomQues.slice(0, 10), ...categoryQues];
        }
        setPassingMarks(
          Math.round(
            settings.data().number_of_questions *
              (settings.data().passing_marks / 100),
          ),
        );
        setQuestions(randomQues.sort(() => Math.random() - 0.5));
      })
      // .catch(err => console.log(err))
      .finally(() => setLoading(false));
  };

  const checkUser = async (email, results = 'home') => {
    setAuthLoading(true);
    try {
      const doc = await firestore().collection('submissions').doc(email).get();
      console.log(doc.exists);
      if (doc.exists) setUser({...doc.data(), email: doc.id});
      else if (storage.contains('user'))
        setUser(JSON.parse(storage.getString('user')));
    } catch (err) {
      console.log(err);
    } finally {
      setAuthLoading(false);
    }
  };

  return (
    <QuesContext.Provider
      value={{
        questions,
        fetchQuestions,
        loading,
        user,
        setUser,
        checkUser,
        authLoading,
        passingMarks,
      }}>
      {children}
    </QuesContext.Provider>
  );
}
