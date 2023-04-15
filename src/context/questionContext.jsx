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

  const fetchQuestions = () => {
    firestore()
      .collection('questions')
      .get()
      .then(snap => {
        const randomQues = [];
        snap.docs.forEach(doc => randomQues.push({...doc.data(), id: doc.id}));
        setPassingMarks(parseInt(14 * (14 / randomQues.length)));
        setQuestions(randomQues.sort(() => Math.random() - 0.5).splice(0, 25));
      })
      .finally(() => setLoading(false));
  };

  const checkUser = async email => {
    setAuthLoading(true);
    try {
      const doc = await firestore().collection('submissions').doc(email).get();

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
        checkUser,
        authLoading,
        passingMarks,
      }}>
      {children}
    </QuesContext.Provider>
  );
}
