import OpenAI from 'openai';

let openaiClient = null;

const getOpenAI = () => {
  if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'your_openai_api_key_here') {
    return null;
  }
  if (!openaiClient) {
    openaiClient = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
  return openaiClient;
};

/**
 * Generate AI response with OpenAI or fallback mock for development.
 */
export const generateAIResponse = async (systemPrompt, userPrompt) => {
  const client = getOpenAI();

  if (!client) {
    return getMockResponse(userPrompt);
  }

  try {
    const completion = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    return completion.choices[0]?.message?.content || 'No response generated.';
  } catch (error) {
    console.error('OpenAI API error:', error.message);
    return getMockResponse(userPrompt);
  }
};

/**
 * Generate structured JSON from AI (quizzes, flashcards, etc.).
 */
export const generateStructuredAI = async (systemPrompt, userPrompt) => {
  const client = getOpenAI();

  if (!client) {
    return null;
  }

  try {
    const completion = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.5,
      max_tokens: 3000,
      response_format: { type: 'json_object' },
    });

    const content = completion.choices[0]?.message?.content;
    return content ? JSON.parse(content) : null;
  } catch (error) {
    console.error('OpenAI structured API error:', error.message);
    return null;
  }
};

const getMockResponse = (prompt) => {
  const lower = prompt.toLowerCase();

  if (lower.includes('quiz') || lower.includes('question')) {
    return 'I can help you create practice quizzes from your study materials. Upload your notes or select a topic, and I will generate multiple-choice questions to test your knowledge.';
  }

  if (lower.includes('summar')) {
    return 'Here is a summary of your document:\n\n• Key concepts identified from your notes\n• Main topics covered in the material\n• Important definitions and terms\n• Suggested areas for further review\n\nUpload a document to get a detailed AI-powered summary.';
  }

  if (lower.includes('flashcard')) {
    return 'Flashcards are a great study tool! I can generate flashcards from your uploaded materials. Each card will have a question on the front and the answer on the back.';
  }

  if (lower.includes('recommend') || lower.includes('study')) {
    return 'Based on your study patterns, I recommend:\n\n1. Review your most recent uploaded materials\n2. Take a quiz to identify knowledge gaps\n3. Use flashcards for key terms\n4. Schedule 25-minute focused study sessions\n5. Revisit topics where quiz scores were below 70%';
  }

  return `Thank you for your question about "${prompt.slice(0, 80)}". As your AI StudyMate, I'm here to help you learn effectively. I can summarize documents, generate quizzes, create flashcards, and provide personalized study recommendations. How would you like to continue studying today?`;
};

export const getMockQuiz = (topic, count = 5) => ({
  title: `Quiz: ${topic || 'General Knowledge'}`,
  questions: Array.from({ length: count }, (_, i) => ({
    question: `Sample question ${i + 1} about ${topic || 'your study topic'}?`,
    options: ['Option A', 'Option B', 'Option C', 'Option D'],
    correctAnswer: i % 4,
    explanation: `This is the explanation for question ${i + 1}.`,
  })),
});

export const getMockFlashcards = (topic, count = 5) =>
  Array.from({ length: count }, (_, i) => ({
    front: `${topic || 'Term'} ${i + 1}`,
    back: `Definition and explanation for ${topic || 'term'} ${i + 1}.`,
  }));

export const getMockSummary = (title) =>
  `Summary of "${title}":\n\nThis document covers fundamental concepts related to the subject matter. Key points include important definitions, core principles, and practical applications. Students should focus on understanding the main themes and reviewing any highlighted terminology. Further study is recommended on areas that connect to upcoming exam topics.`;
