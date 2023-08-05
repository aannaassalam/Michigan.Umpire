import React, {createContext, useContext, useState} from 'react';
import firestore from '@react-native-firebase/firestore';
import {MMKV} from 'react-native-mmkv';

export const QuesContext = createContext();

export default function QuestionContext({children}) {
  const [questions, setQuestions] = useState([]);
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(false);
  const [passingMarks, setPassingMarks] = useState(0);

  const storage = new MMKV();

  const fetchQuestions = async () => {
    const settings = await firestore()
      .collection('settings')
      .doc('Hwwlfpcsree5njE77Wfz')
      .get();
    firestore()
      .collection('questions')
      .get()
      .then(snap => {
        const randomQues = [];
        snap.docs.forEach(doc => randomQues.push({...doc.data(), id: doc.id}));
        setPassingMarks(
          Math.round(
            settings.data().number_of_questions *
              (settings.data().passing_marks / 100),
          ),
        );
        setQuestions(
          randomQues
            .sort(() => Math.random() - 0.5)
            .splice(0, settings.data().number_of_questions),
        );
      })
      .finally(() => setLoading(false));
  };

  const checkUser = async email => {
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
