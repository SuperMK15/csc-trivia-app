// App.js
import React, { useState, useEffect } from 'react';
import './App.css';

const App = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [answeredQuestions, setAnsweredQuestions] = useState([]);
  const [donePlaying, setDonePlaying] = useState(false);
  const [gameState, setGameState] = useState("welcome");

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const questionData = require('./questions.json');
        const playedQuestions = localStorage.getItem('playedQuestions');
        let filteredQuestionData = questionData;
        if (playedQuestions) {
          filteredQuestionData = questionData.filter(
            (question) => !playedQuestions.includes(question.id)
          );
        }
        setQuestions(filteredQuestionData);
        console.log(filteredQuestionData);
      } catch (error) {
        console.error('Error fetching questions:', error);
      }
    };

    if (questions.length === 0) fetchQuestions();
  }, []);

  const getRandomQuestion = () => {
    setGameState("playing");
    const remainingQuestions = questions.filter(
      (question) => !answeredQuestions.includes(question.id)
    );

    if (remainingQuestions.length === 0) {
      setDonePlaying(true);
      setCurrentQuestion(null);
      setQuestions([]);
      setGameState("gameOver");
    } else {
      const randomIndex = Math.floor(Math.random() * remainingQuestions.length);
      const randomQuestion = remainingQuestions[randomIndex];
      setCurrentQuestion(randomQuestion);
      setAnsweredQuestions([...answeredQuestions, randomQuestion.id]);

      const playedQuestions = localStorage.getItem('playedQuestions');
      localStorage.setItem(
        'playedQuestions',
        playedQuestions ? [...playedQuestions, randomQuestion.id] : [randomQuestion.id]
      );
    }
  };

  const resetGame = () => {
    setCurrentQuestion(null);
    setAnsweredQuestions([]);
    setDonePlaying(false);
    localStorage.setItem('playedQuestions', []);
    setGameState("welcome");
  };

  let content;
  switch (gameState) {
    case "welcome":
      content = (<div className="welcome">
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
      </div>);
      break;

    case "playing":
      content = (<div className="question-container">
        <p className="question-number">{currentQuestion.category}</p>
        <p className="question-text">{currentQuestion.question}</p>
        <button className="next-button" onClick={getRandomQuestion}>
          Next Question
        </button>
      </div>);
      break;

    case "gameOver":
      content = (<div className="welcome">
        <h2 className="question-number">Game Over!</h2>
        <button className="play-again-button" onClick={resetGame}>
          Play Again?
        </button>
      </div>);
      break;
  }

  return (
    <div className={`app 'dark-mode' : ''}`}>
      <h1 className="app-title">CSC Trivia Night</h1>
      {content}
    </div>
  );
};

export default App;
