// App.js
import React, { useState, useEffect } from 'react';
import './App.css';

const App = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [answeredQuestions, setAnsweredQuestions] = useState([]);
  const [donePlaying, setDonePlaying] = useState(false);
  const [selectedFile, setSelectedFile] = useState('');

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const questionsData = require(`./${selectedFile}`);
        setQuestions(questionsData);
        console.log('Questions fetched successfully!');
      } catch (error) {
        console.error('Error fetching questions:', error);
      }
    };

    if (selectedFile) {
      fetchQuestions();
    }
  }, [selectedFile]);

  const getRandomQuestion = () => {
    const remainingQuestions = questions.filter(
      (question) => !answeredQuestions.includes(question.id)
    );

    if (remainingQuestions.length === 0) {
      setDonePlaying(true);
      setCurrentQuestion(null);
      setSelectedFile('');
      setQuestions([]);
    } else {
      const randomIndex = Math.floor(Math.random() * remainingQuestions.length);
      const randomQuestion = remainingQuestions[randomIndex];
      setCurrentQuestion(randomQuestion);
      setAnsweredQuestions([...answeredQuestions, randomQuestion.id]);
    }
  };

  const resetGame = () => {
    setCurrentQuestion(null);
    setAnsweredQuestions([]);
    setDonePlaying(false);
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.value);
  };

  return (
    <div className={`app 'dark-mode' : ''}`}>
      <h1 className="app-title">CSC Trivia Night</h1>
      {currentQuestion ? (
        <div className="question-container">
          <p className="question-text">{currentQuestion.question}</p>
          <button className="next-button" onClick={getRandomQuestion}>
            Next Question
          </button>
        </div>
      ) : (
        donePlaying ? (
          <div className="welcome">
            <h2 className="question-number">Game Over!</h2>
            <button className="play-again-button" onClick={resetGame}>
              Play Again?
            </button>
          </div>
        ) : (
          <div className="welcome">
            <h2 className="question-number">Welcome!</h2>
            <div className="file-dropdown">
              <label htmlFor="fileSelect">Select a Question Set:</label>
              <select id="fileSelect" onChange={handleFileChange} value={selectedFile}>
                <option value="" disabled>Click Me!</option>
                <option value="questions1.json">File 1</option>
                <option value="questions2.json">File 2</option>
                {/* Add more options for different question files */}
              </select>
            </div>
            <br/>
            <button className="start-button" onClick={getRandomQuestion} disabled={selectedFile==''}>
              Start Game
            </button>
          </div>
        )
      )}
    </div>
  );
};

export default App;
