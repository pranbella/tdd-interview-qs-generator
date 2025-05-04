import React, { useState, useEffect } from 'react';
import './App.css';
import IntakeForm from './components/IntakeForm';
import InterviewQuestions from './components/InterviewQuestions';

function App() {
  const [showQuestions, setShowQuestions] = useState(false);
  const [formData, setFormData] = useState(null);
  const [generatedQuestions, setGeneratedQuestions] = useState(null);

  // Scroll to top when switching between components
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [showQuestions]);

  const handleFormSubmit = (data) => {
    setFormData(data);
    setGeneratedQuestions(null); // Clear existing questions
    setShowQuestions(true);
  };

  const handleQuestionsGenerated = (questions) => {
    setGeneratedQuestions(questions);
  };

  const handleBackToForm = () => {
    setShowQuestions(false);
  };

  const handleViewQuestions = () => {
    setShowQuestions(true);
  };

  return (
    <div className="App">
      {!showQuestions ? (
        <IntakeForm 
          onSubmit={handleFormSubmit}
          onViewQuestions={handleViewQuestions}
          hasGeneratedQuestions={!!generatedQuestions}
          initialFormData={formData}
        />
      ) : (
        <InterviewQuestions 
          formData={formData} 
          onBack={handleBackToForm}
          onQuestionsGenerated={handleQuestionsGenerated}
          existingQuestions={generatedQuestions}
        />
      )}
    </div>
  );
}

export default App;
