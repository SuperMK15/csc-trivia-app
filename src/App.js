// App.js
import React, { useState, useEffect } from 'react';
import './App.css';

const App = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [answeredQuestions, setAnsweredQuestions] = useState([]);
  const [gameState, setGameState] = useState("welcome");
  const [displayQuestion, setDisplayQuestion] = useState(false);
  const [displayAnswer, setDisplayAnswer] = useState(false);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const questionData = require('./questions.json');
        const localStoragePlayedQuestions = localStorage.getItem('playedQuestions');
        const playedQuestions = localStoragePlayedQuestions ? JSON.parse(localStoragePlayedQuestions) : [];
        let filteredQuestionData = questionData;
        if (playedQuestions) {
          filteredQuestionData = questionData.filter(
            (question) => !playedQuestions.includes(question.id)
          );
        }
        setQuestions(filteredQuestionData);
        console.log(filteredQuestionData);
        console.log(playedQuestions);
      } catch (error) {
        console.error('Error fetching questions:', error);
      }
    };

    if (questions.length === 0) fetchQuestions();
  }, []);

  const getRandomQuestion = () => {
    setGameState("playing");
    setDisplayQuestion(false);
    setDisplayAnswer(false);
    const remainingQuestions = questions.filter(
      (question) => !answeredQuestions.includes(question.id)
    );

    if (remainingQuestions.length === 0) {
      setCurrentQuestion(null);
      setQuestions([]);
      setGameState("gameOver");
    } else {
      const randomIndex = Math.floor(Math.random() * remainingQuestions.length);
      const randomQuestion = remainingQuestions[randomIndex];
      setCurrentQuestion(randomQuestion);
    }
  };

  const removeQuestion = () => {
    setDisplayQuestion(true);
    setAnsweredQuestions([...answeredQuestions, currentQuestion.id]);
    const localStoragePlayedQuestions = localStorage.getItem('playedQuestions');
    const playedQuestions = localStoragePlayedQuestions ? JSON.parse(localStoragePlayedQuestions) : [];
    localStorage.setItem(
      'playedQuestions',
      JSON.stringify(playedQuestions ? [...playedQuestions, currentQuestion.id] : [currentQuestion.id])
    );
  };

  const resetGame = () => {
    setCurrentQuestion(null);
    setAnsweredQuestions([]);
    localStorage.setItem('playedQuestions', '');
    setGameState("welcome");
    setDisplayQuestion(false);
    setDisplayAnswer(false);
    window.location.reload();
  };

  let content;
  switch (gameState) {
    case "welcome":
      content = (
        <>
          <h1 className="app-title">CSC Trivia Night</h1>
          <div className="welcome">
            <h2 className="question-number">Welcome!</h2>
            <br />
            <button className="start-button" onClick={getRandomQuestion}>
              Start Game
            </button>
            <br />
            <br />
            <button className="play-again-button" onClick={resetGame}>
              Reset
            </button>
          </div>
        </>);
      break;

    case "playing":
      content = (<div className="question-container">
        <h1 className="app-title">Trivia Game</h1>
        <p className="question-number">Category: {currentQuestion.category}</p>
        {(displayQuestion ? 
          (<>
            <p className="question-text">{currentQuestion.question}</p>
            {(currentQuestion.img !== "N/A") ? <img className="question-image" src={"./images/"+currentQuestion.img} alt="Question Image" /> : null}
          </>)
          : null)}
        {(displayAnswer ? <p className="answer-text">{currentQuestion.answer}</p> : null)}
        <br />
        {(displayAnswer ? <button className="next-button" onClick={getRandomQuestion}>Next Question</button> :
          (displayQuestion ? <button className="next-button" onClick={() => setDisplayAnswer(true)}>Show Answer</button> :
            <button className="next-button" onClick={() => removeQuestion()}>Show Question</button>))}

      </div>);
      break;

    case "gameOver":
      content = (<div className="welcome">
        <h2 className="question-number">Out of Questions!</h2>
        <button className="play-again-button" onClick={resetGame}>
          Reset Pool?
        </button>
      </div>);
      break;
  }

  return (
    <div className={`app 'dark-mode' : ''}`}>
      {content}
    </div>
  );
};

export default App;
