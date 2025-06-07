import React, { useEffect, useState } from 'react';
import './App.css';
import Header from './components/Header/Header';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Main from './components/Main';
import Question from './components/AddQuestion/Question';
import ViewQuestion from './components/ViewQuestion';
import Auth from './components/Auth';
import { login, logout, selectUser } from './features/userSlice';
import { useSelector, useDispatch } from 'react-redux';
import { auth } from './firebase';
import Calendar from './components/Calendar';
import Profile from './components/Profile/Profile';
import CodeEditor from './components/CodeEditor/CodeEditor';
import ChatRoom from './components/ChatRoom/ChatRoom';
import UserQuestions from './components/Profile/UserQuestions';

function PrivateRoute({ children, authLoading }) {
  const user = useSelector(selectUser);

  if (authLoading) return null; // Or return <LoadingSpinner />
  return user ? children : <Navigate to="/auth" replace />;
}

function App() {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const [authLoading, setAuthLoading] = useState(true); // <-- track auth load state

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        dispatch(
          login({
            uid: authUser.uid,
            photo: authUser.photoURL,
            displayName: authUser.displayName,
            email: authUser.email,
          })
        );
      } else {
        dispatch(logout());
      }
      setAuthLoading(false); // <-- auth check done
    });

    return () => unsubscribe();
  }, [dispatch]);

  return (
    <div className="App w-screen h-screen overflow-x-hidden">
      <Router>
        <Header />
        <Routes>
          <Route path="/auth" element={<Auth />} />
          <Route path="/" element={<PrivateRoute authLoading={authLoading}><Main currentUserId={user?.uid} /></PrivateRoute>} />
          <Route path="/add-question" element={<PrivateRoute authLoading={authLoading}><Question /></PrivateRoute>} />
          <Route path="/question" element={<PrivateRoute authLoading={authLoading}><ViewQuestion /></PrivateRoute>} />
          <Route path="/calendar" element={<PrivateRoute authLoading={authLoading}><Calendar /></PrivateRoute>} />
          <Route path="/profile" element={<PrivateRoute authLoading={authLoading}><Profile /></PrivateRoute>} />
          <Route path="/zcoderIDE" element={<PrivateRoute authLoading={authLoading}><CodeEditor /></PrivateRoute>} />
          <Route path="/chatRoom" element={<PrivateRoute authLoading={authLoading}><ChatRoom /></PrivateRoute>} />
          <Route path="/queries/user" element={<PrivateRoute authLoading={authLoading}><UserQuestions userId={user?.uid} /></PrivateRoute>} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
