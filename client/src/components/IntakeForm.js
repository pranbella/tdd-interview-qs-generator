import React, { useState, useEffect } from 'react';
import './IntakeForm.css';
import InterviewQuestions from './InterviewQuestions';

const IntakeForm = ({ onSubmit, onViewQuestions, hasGeneratedQuestions, initialFormData }) => {
  const [formData, setFormData] = useState({
    jobTitle: '',
    department: '',
    responsibilities: '',
    requiredSkills: '',
    yearsOfExperience: '',
    softSkills: '',
    interviewFocus: '',
    additionalNotes: ''
  });

  const [showQuestions, setShowQuestions] = useState(false);

  useEffect(() => {
    if (initialFormData) {
      setFormData(initialFormData);
    }
  }, [initialFormData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleBackToForm = () => {
    setShowQuestions(false);
  };

  if (showQuestions) {
    return <InterviewQuestions formData={formData} onEdit={handleBackToForm} />;
  }

  return (
    <div className="intake-form-container">
      <h2>The Dev Difference - Job Interview Questions Generator</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="jobTitle">Job Title</label>
          <input
            type="text"
            id="jobTitle"
            name="jobTitle"
            value={formData.jobTitle}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="department">Department</label>
          <input
            type="text"
            id="department"
            name="department"
            value={formData.department}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="responsibilities">Key Responsibilities</label>
          <textarea
            id="responsibilities"
            name="responsibilities"
            value={formData.responsibilities}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="requiredSkills">Required Skills</label>
          <textarea
            id="requiredSkills"
            name="requiredSkills"
            value={formData.requiredSkills}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="yearsOfExperience">Years of Experience</label>
          <input
            type="text"
            id="yearsOfExperience"
            name="yearsOfExperience"
            value={formData.yearsOfExperience}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="softSkills">Soft Skills</label>
          <textarea
            id="softSkills"
            name="softSkills"
            value={formData.softSkills}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="interviewFocus">Interview Focus Areas (Optional)</label>
          <textarea
            id="interviewFocus"
            name="interviewFocus"
            value={formData.interviewFocus}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="additionalNotes">Additional Notes (Optional)</label>
          <textarea
            id="additionalNotes"
            name="additionalNotes"
            value={formData.additionalNotes}
            onChange={handleChange}
          />
        </div>

        <div className="button-group">
          {hasGeneratedQuestions ? (
            <>
              <button type="button" onClick={onViewQuestions} className="view-questions-button">
                View Questions
              </button>
              <button type="submit" className="submit-button">
                Generate New Questions
              </button>
            </>
          ) : (
            <button type="submit" className="submit-button">
              Generate Interview Questions
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default IntakeForm; 