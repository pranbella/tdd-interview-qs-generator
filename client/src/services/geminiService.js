const GEMINI_API_KEY = process.env.REACT_APP_GEMINI_API_KEY;

export const generateInterviewQuestions = async (formData) => {
  try {
    const prompt = `Generate a set of interview questions for a ${formData.jobTitle} position in the ${formData.department} department. 
    Key responsibilities: ${formData.responsibilities}
    Required skills: ${formData.requiredSkills}
    Years of experience: ${formData.yearsOfExperience}
    Soft skills: ${formData.softSkills}
    Interview focus areas: ${formData.interviewFocus || 'Not specified'}
    Additional context: ${formData.additionalNotes || 'Not specified'}

    Please generate a maximum of 15 key interview questions organized by category. For each question, also provide evaluation points that indicate what a good answer should include.
    
    Format the response EXACTLY as follows:
    
    Category: [Category Name]
    Question: [Question text]
    Evaluation Points:
    - Point 1
    - Point 2
    - Point 3
    
    [Next Category]
    Question: [Question text]
    Evaluation Points:
    - Point 1
    - Point 2
    - Point 3
    
    Please ensure:
    1. Each question has exactly 3 evaluation points
    2. The format is consistent throughout
    3. The evaluation points are specific and measurable
    4. Use the exact headers "Category:", "Question:", and "Evaluation Points:"
    5. Do not include any additional text or explanations`;

    console.log('Sending prompt to Gemini:', prompt);

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: prompt }]
        }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1000,
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Gemini API Error:', errorData);
      throw new Error(
        `Gemini API Error: ${errorData.error?.message || 'Unknown error'}`
      );
    }

    const data = await response.json();
    console.log('Raw Gemini API Response:', data);
    
    const generatedText = data?.candidates?.[0]?.content?.parts?.[0]?.text || 'No response';
    console.log('Generated text:', generatedText);
    
    // Check if the response contains evaluation points
    const hasEvaluationPoints = generatedText.includes('Evaluation Points:');
    console.log('Response contains evaluation points:', hasEvaluationPoints);
    
    return generatedText;

  } catch (error) {
    console.error('Error generating questions:', error);
    throw error;
  }
};
