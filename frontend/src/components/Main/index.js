import React, { useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import Main from './Main';
import axios from 'axios';

function Index({currentUserId}) {

  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    async function getQuestion() {
      try {
        const res = await axios.get(process.env.REACT_APP_backendUrl + '/api/question');
        setQuestions(res.data.reverse());
      } catch (err) {
        console.error(err);
      }
    }
    getQuestion();
  }, []);

  return (
    <div className="stack-index flex h-[91vh]">
      {/* Sidebar with variable width */}
      <Sidebar />

      {/* Main takes remaining space */}
      <Main questions={questions} currentUserId={currentUserId}/>
    </div>
  );
}

export default Index;
