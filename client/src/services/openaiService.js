const OPENAI_API_KEY = process.env.REACT_APP_OPENAI_API_KEY;

export const generateInterviewQuestions = async (formData) => {
  try {
    console.log('API Key:', OPENAI_API_KEY ? 'Present' : 'Missing');
    
    const prompt = `Generate a set of interview questions for a ${formData.jobTitle} position in the ${formData.department} department. 
    Key responsibilities: ${formData.responsibilities}
    Required skills: ${formData.requiredSkills}
    Years of experience: ${formData.yearsOfExperience}
    Soft skills: ${formData.softSkills}
    Interview focus areas: ${formData.interviewFocus || 'Not specified'}
    Additional context: ${formData.additionalNotes || 'Not specified'}

    Please generate a comprehensive set of interview questions organized by category. Include technical questions, behavioral questions, and role-specific questions.`;

    console.log('Sending request to OpenAI API...');
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are an expert HR professional and technical interviewer. Generate relevant interview questions based on the job description and requirements."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1000
      })
    });

    console.log('Response status:', response.status);
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenAI API Error:', errorData);
      throw new Error(`OpenAI API Error: ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    console.log('Successfully received response from OpenAI');
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Error in generateInterviewQuestions:', error);
    throw error;
  }
}; 