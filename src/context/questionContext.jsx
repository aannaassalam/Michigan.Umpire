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

  const fetchQuestions = async (category, subcategory) => {
    setLoading(true);
    const settings = await firestore()
      .collection('settings')
      .doc('Hwwlfpcsree5njE77Wfz')
      .get();
    firestore()
      .collection('questions')
      .get()
      .then(snap => {
        // Mandatory Questions

        let randomQues = snap.docs
          .filter(
            _doc =>
              _doc.data().activityStatus === 1 &&
              _doc.data().status === 1 &&
              _doc.data().category.toLowerCase() === 'mandatory',
          )
          .sort(() => Math.random() - 0.5)
          .map(doc => ({...doc.data(), id: doc.id}));

        // Team Questions

        const subcategoryQuestions = {};
        snap.docs
          .filter(
            _doc =>
              _doc.data().activityStatus === 1 && _doc.data().status === 1,
          )
          .sort(() => Math.random() - 0.5)
          .forEach(doc => {
            if (doc.data().subCategory)
              subcategoryQuestions[doc.data().subCategory] = [
                ...(subcategoryQuestions[doc.data().subCategory] || []),
                {...doc.data(), id: doc.id},
              ];
          });

        // General Questions

        const generalQues = snap.docs
          .filter(
            _doc =>
              _doc.data().activityStatus === 1 &&
              _doc.data().status === 1 &&
              _doc.data().category === 'General',
          )
          .sort(() => Math.random() - 0.5)
          .slice(0, 5)
          .map(_doc => ({..._doc.data(), id: _doc.id}));

        // Conditional Segregation

        if (category === 'General') {
          randomQues = [...randomQues.slice(0, 10), ...generalQues];
        } else if (category === 'FCC Umpiring Certification') {
          const categoryQues = Object.values(subcategoryQuestions).flatMap(
            _subcat => _subcat.slice(0, 3),
          );
          console.log(categoryQues.length, generalQues.length);
          randomQues = [
            ...randomQues.slice(0, 10),
            ...generalQues,
            ...categoryQues,
          ];
        } else if (category === 'Team Member Umpiring Certification') {
          const categoryQues = subcategoryQuestions[subcategory].slice(0, 3);
          randomQues = [
            ...randomQues.slice(0, 10),
            ...generalQues,
            ...categoryQues,
          ];
        } else if (category === 'Box Cricket Umpiring Certification') {
          randomQues = snap.docs
            .filter(
              _doc =>
                _doc.data().activityStatus === 1 &&
                _doc.data().status === 1 &&
                _doc.data().category === category,
            )
            .sort(() => Math.random() - 0.5)
            .map(doc => ({...doc.data(), id: doc.id}))
            .slice(0, 15);
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
