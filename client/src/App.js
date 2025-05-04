import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import './App.css';
import IntakeForm from './components/IntakeForm';
import InterviewQuestions from './components/InterviewQuestions';

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

function AppContent() {
  const [formData, setFormData] = useState(null);
  const [generatedQuestions, setGeneratedQuestions] = useState(null);
  const navigate = useNavigate();

  // Scroll to top when switching between components
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [window.location.pathname]);

  const handleFormSubmit = (data) => {
    setFormData(data);
    setGeneratedQuestions(null); // Clear existing questions
    navigate('/questions');
  };

  const handleQuestionsGenerated = (questions) => {
    setGeneratedQuestions(questions);
  };

  const handleBackToForm = () => {
    navigate('/');
  };

  const handleViewQuestions = () => {
    navigate('/questions');
  };

  return (
    <div className="App">
      <Routes>
        <Route 
          path="/" 
          element={
            <IntakeForm 
              onSubmit={handleFormSubmit}
              onViewQuestions={handleViewQuestions}
              hasGeneratedQuestions={!!generatedQuestions}
              initialFormData={formData}
            />
          } 
        />
        <Route 
          path="/questions" 
          element={
            <InterviewQuestions 
              formData={formData} 
              onBack={handleBackToForm}
              onQuestionsGenerated={handleQuestionsGenerated}
              existingQuestions={generatedQuestions}
            />
          } 
        />
      </Routes>
    </div>
  );
}

export default App;
