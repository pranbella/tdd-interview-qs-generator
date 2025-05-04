import React, { useState, useEffect } from 'react';
import './InterviewQuestions.css';
import { generateInterviewQuestions } from '../services/geminiService';

const InterviewQuestions = ({ formData, onBack, onQuestionsGenerated, existingQuestions }) => {
  const [questions, setQuestions] = useState(existingQuestions || []);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(!existingQuestions);
  const [error, setError] = useState(null);
  const [expandedQuestions, setExpandedQuestions] = useState({});

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const fetchQuestions = async () => {
      if (existingQuestions) {
        setQuestions(existingQuestions);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        const generatedQuestions = await generateInterviewQuestions(formData);
        console.log('Raw generated questions:', generatedQuestions);
        const parsedQuestions = parseQuestions(generatedQuestions);
        console.log('Parsed questions:', parsedQuestions);
        setQuestions(parsedQuestions);
        onQuestionsGenerated(parsedQuestions);
      } catch (err) {
        console.error('Error in fetchQuestions:', err);
        setError(`Error: ${err.message}. Please check your API key and try again.`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuestions();
  }, [formData, existingQuestions, onQuestionsGenerated]);

  const toggleEvaluation = (index) => {
    setExpandedQuestions(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const handleQuestionEdit = (index, newQuestion) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index] = {
      ...updatedQuestions[index],
      question: newQuestion
    };
    setQuestions(updatedQuestions);
    onQuestionsGenerated(updatedQuestions);
  };

  const parseQuestions = (text) => {
    console.log('Starting to parse text:', text);
    const sections = text.split('\n\n').filter(section => section.trim());
    const parsedQuestions = [];
    let currentCategory = '';
    let currentQuestion = '';
    let currentEvaluationPoints = [];
    let isInEvaluationPoints = false;

    sections.forEach(section => {
      console.log('Processing section:', section);
      const lines = section.split('\n');
      lines.forEach(line => {
        if (line.startsWith('Category:')) {
          currentCategory = line.replace('Category:', '').trim();
          console.log('Found category:', currentCategory);
        } else if (line.startsWith('Question:')) {
          if (currentQuestion) {
            console.log('Saving previous question with points:', currentEvaluationPoints);
            parsedQuestions.push({
              category: currentCategory,
              question: currentQuestion,
              evaluationPoints: [...currentEvaluationPoints]
            });
          }
          currentQuestion = line.replace('Question:', '').trim();
          currentEvaluationPoints = [];
          isInEvaluationPoints = false;
          console.log('Found question:', currentQuestion);
        } else if (line.toLowerCase().includes('evaluation points:')) {
          isInEvaluationPoints = true;
          console.log('Found evaluation points section');
        } else if (isInEvaluationPoints && line.trim().startsWith('-')) {
          const point = line.replace('-', '').trim();
          currentEvaluationPoints.push(point);
          console.log('Added evaluation point:', point);
        }
      });
    });

    // Add the last question
    if (currentQuestion) {
      console.log('Adding final question with points:', currentEvaluationPoints);
      parsedQuestions.push({
        category: currentCategory,
        question: currentQuestion,
        evaluationPoints: currentEvaluationPoints
      });
    }

    return parsedQuestions;
  };

  if (isLoading) {
    return (
      <div className="questions-container">
        <div className="loading-spinner">Generating questions...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="questions-container">
        <div className="error-message">{error}</div>
        <div className="error-help">
          <p>If you're seeing this error, please check:</p>
          <ul>
            <li>Your Gemini API key is correctly set in the .env file</li>
            <li>The API key has sufficient credits</li>
            <li>Your internet connection is working</li>
          </ul>
        </div>
        <button onClick={onBack} className="back-button">Back to Form</button>
      </div>
    );
  }

  return (
    <div className="questions-container">
      <h2>Generated Interview Questions</h2>

      <div className="questions-list">
        {questions.map((item, index) => (
          <div key={index} className="question-category">
            <h3>{item.category}</h3>
            <div className="question-item">
              {isEditing ? (
                <input
                  type="text"
                  value={item.question}
                  onChange={(e) => handleQuestionEdit(index, e.target.value)}
                  className="question-edit-input"
                />
              ) : (
                <p className="question-text">{item.question}</p>
              )}
              <button 
                className="evaluation-toggle"
                onClick={() => toggleEvaluation(index)}
              >
                {expandedQuestions[index] ? 'Hide Evaluation Points' : 'Show Evaluation Points'}
              </button>
              {expandedQuestions[index] && (
                <div className="evaluation-points">
                  <h4>Evaluation Points:</h4>
                  <ul>
                    {item.evaluationPoints && item.evaluationPoints.length > 0 ? (
                      item.evaluationPoints.map((point, pointIndex) => (
                        <li key={pointIndex}>{point}</li>
                      ))
                    ) : (
                      <li>No evaluation points available for this question.</li>
                    )}
                  </ul>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="questions-actions">
        <button 
          onClick={() => setIsEditing(!isEditing)} 
          className="edit-button"
        >
          {isEditing ? 'Save Changes' : 'Edit Questions'}
        </button>
        <button onClick={onBack} className="back-button">Back to Form</button>
      </div>
    </div>
  );
};

export default InterviewQuestions;
