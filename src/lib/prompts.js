import { getArticlesByLanguage } from "./dbUtils";
import { getTopics } from "./languageStorage";
import { TOPICS } from "./constants";

const getRandomItem = (array) => {
  return array[Math.floor(Math.random() * array.length)];
};

const getTopicDescriptions = () => {
  const selectedTopicIds = getTopics();
  if (!selectedTopicIds.length) return [];

  return selectedTopicIds.map(id => {
    const standardTopic = TOPICS.find(t => t.id === id);
    if (standardTopic) {
      return {
        name: standardTopic.name,
        description: standardTopic.description
      };
    }
    return {
      name: id.split('-').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' '),
      description: `Content related to ${id.split('-').join(' ')}`
    };
  });
};

export async function generateArticleCreationPrompt(customTopic = null) {
  const existingArticles = await getArticlesByLanguage("english");
  const existingTopics = existingArticles.map((article) => {
    // TODO: update the condition
    const topic = article.title.split(":")[0].trim();
    return topic;
  });
  let prompt = "";

  if (existingTopics.length > 0) {
    prompt = existingTopics.join("\n") + "\n\n";
    prompt +=
      "**IMPORTANT INSTRUCTION**: The topics listed above are already generated by you. Generate a completely new article with a unique topic that is NOT related to the above topics.**\n\n";
    prompt += `
**Examples of related topics to avoid**:
- If the topic is "Space Exploration," avoid related topics like "Mars Missions," "Astronaut Training," or "Space Technology."
- If the topic is "The Amazing World of Jellyfish", avoid topics like "The Enigmatic Beauty of Jellyfish"
- If the topic is "The History of Tea", avoid topics like "The Wonderful World of Tea"
- If the topic is "The Enchanting World of Bees", avoid topics like "The Intricate World of Bees"

**Examples of acceptable new topics**:
- "The Evolution of Classical Music"
- "Innovations in Renewable Energy"
- "The Cultural Impact of Social Media"
`;
  }

  if (customTopic) {
    return prompt + CREATE_CUSTOM_ARTICLE.replace("{{topic}}", customTopic);
  }

  const topicDescriptions = getTopicDescriptions();
  
  if (!topicDescriptions.length) {
    const randomTopic = getRandomItem(TOPICS);
    return prompt + CREATE_RANDOM_ARTICLE
      .replace("{{topicName}}", randomTopic.name)
      .replace("{{topicDescription}}", randomTopic.description);
  }

  const selectedTopic = getRandomItem(topicDescriptions);
  return prompt + CREATE_RANDOM_ARTICLE
    .replace("{{topicName}}", selectedTopic.name)
    .replace("{{topicDescription}}", selectedTopic.description);
}

export const CREATE_RANDOM_ARTICLE = `
Task: Generate an article about "{{topicName}}" considering this context: {{topicDescription}}

Example using:
Topic: "Daily Life & Culture"
Description: "Everyday situations, customs, and cultural practices"

{
  "title": "Morning Rituals Around the World",
  "summary": "From Japanese fish markets to Italian espresso bars, morning routines reveal fascinating cultural traditions worldwide. These daily practices showcase how different societies begin their day, reflecting deep-rooted customs and social values.",
  "imageKeywords": ["breakfast", "ritual", "culture", "tradition", "morning"]
}

Rules for generating the article:
1. Focus specifically on the given topic and its description
2. Generate an engaging and informative title in clear English
3. Ensure the summary is factually accurate and written in proper English
4. Keep the summary exactly two sentences long in standard English
5. Write in a friendly and engaging tone using natural English expressions
6. Provide exactly five single-word keywords ordered by relevance for Wikimedia image search:
   - Each keyword must be a single word in English only
   - Keywords should match the article's main theme and content
   - Order from most relevant to least relevant
   - Use common, searchable terms that would exist in image databases
   - Avoid abstract concepts that wouldn't have direct images
7. Return pure JSON without any markdown or code formatting

Return it in this JSON format:
{
  "title": "The title",
  "summary": "A two-sentence summary",
  "imageKeywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"]
}`;

export const CREATE_CUSTOM_ARTICLE = `
You are an experienced educator and content writer who specializes in creating engaging content in English.

Example (Topic: Space Exploration):
{
  "title": "The New Era of Mars Exploration",
  "summary": "Humans are closer than ever to reaching Mars with modern technology. Multiple space agencies are working together to make this dream a reality.",
  "imageKeywords": ["mars", "rocket", "astronaut", "spacecraft", "technology"]
}

Now, generate an article about {{topic}} using these rules:
1. Generate an engaging and informative title in clear English
2. Ensure the summary is factually accurate and written in proper English
3. Keep the summary exactly two sentences long in standard English
4. Write in a friendly and engaging tone using natural English expressions
5. Provide exactly five single-word keywords ordered by relevance for Wikimedia image search:
   - Each keyword must be a single word in English only
   - Keywords should match the article's main theme and content
   - Order from most relevant to least relevant
   - Use common, searchable terms that would exist in image databases
   - Avoid abstract concepts that wouldn't have direct images
6. Return pure JSON without any markdown or code formatting

Return it in this JSON format:
{
  "title": "The title",
  "summary": "A two-sentence summary",
  "imageKeywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"]
}`;

export const CREATE_ARTICLE_QUESTIONS = `
Generate 5 questions from the below article description with 4 options and answer. 

Article: "{{title}}"
Description: "{{content}}"

Return it in the following Array of JSON Objects format:
[
{"question":"question from the article",
    "options": ["A. Option1", "B. Option2", "C. Option3", "D. Option4"],
    "answer": "Answer for the question",
    "explanation" : "1 line explanation about the answer",
},
{"question":"question from the article",
    "options": ["A. Option1", "B. Option2", "C. Option3", "D. Option4"],
    "answer": "Answer for the question",
    "explanation" : "1 line explanation about the answer",
},
{"question":"question from the article",
    "options": ["A. Option1", "B. Option2", "C. Option3", "D. Option4"],
    "answer": "Answer for the question",
    "explanation" : "1 line explanation about the answer",
},
{"question":"question from the article",
    "options": ["A. Option1", "B. Option2", "C. Option3", "D. Option4"],
    "answer": "Answer for the question",
    "explanation" : "1 line explanation about the answer",
},
{"question":"question from the article",
    "options": ["A. Option1", "B. Option2", "C. Option3", "D. Option4"],
    "answer": "Answer for the question",
    "explanation" : "1 line explanation about the answer",
}
]
Please provide exactly five questions. Do not include any markdown or code formatting, only the pure array of JSON objects.
`;

export const CORRECT_SUMMARY = `
Article: "{{title}}"
Written Summary: "{{summary}}"

Can you refer the Written Summary and give me if any gramatical mistakes are identified, suggestions to correct them and Corrected Summary.

Response format: {
  "Errors": [
    "1. Mistake 1",
    "2. Mistake 2" 
  ],
  "Suggestions": [
    "1. Suggestion 1",
    "2. Suggestion 2"
  ]
  "Corrected Summary": "Corrected Summary."
}

Don't find errors in Article. Find errors only from Written Summary. Do not include any markdown or code formatting, only the pure JSON object.
`

export const GENERATE_ARTICLE_CONTENT = `
Generate an article content based on the following title and summary, adhering to the specified tone and length requirements.

Title: {{title}}
Summary: {{summary}}
Tone: {{level}}

Guidelines:
1. Total length: 120-160 words total, split into 2 paragraphs
2. Output Format: Return two paragraphs separated by "\n"
3. Adapt the writing style based on the tone:
   - easy/beginner: Simple words, short sentences, basic concepts
   - medium/intermediate: Moderate vocabulary, varied sentence structure
   - hard/advanced: Complex vocabulary, sophisticated expressions
   - children: Simple, fun, engaging for kids under 5
   - technical: Industry-specific terms, formal tone
   - creative: Descriptive, vivid, engaging language
   - conversational: Casual, friendly, using everyday language
   - academic: Scholarly, research-focused language
   - journalistic: Clear, concise, news-style writing
   
   If the specified tone is not listed above:
   - Analyze the tone name and context
   - Apply appropriate writing style that best matches the intended audience
   - Maintain clear and coherent structure
   - Focus on readability and engagement
   - Keep factual accuracy and professional quality

4. Keep content factually accurate and engaging
5. Return plain text only, using "\n" for paragraph separation

Example outputs:

For beginner:
The sun is very important for life on Earth. It gives us light and heat every day, helping plants grow and keeping us warm. The bright yellow star in the sky is like a giant lamp that never stops shining.\n Scientists have studied the sun for many years and learned amazing things about it. They found out that it is actually a huge ball of very hot gas, much bigger than our planet Earth. Even though it looks small from here, it's actually enormous!

For custom tone (storytelling):
Deep beneath the ocean's surface lies a world of wonder and mystery, where creatures of all shapes and sizes dance in the eternal darkness. Like tiny stars in a midnight sea, bioluminescent organisms create their own light, turning the deep waters into a natural light show that defies imagination.\n Among these remarkable inhabitants, the anglerfish dangles its glowing lure like a skilled fisherman, while transparent jellies pulse through the water like living glass sculptures. This hidden realm, untouched by sunlight, showcases nature's incredible ability to adapt and thrive in the most challenging environments.

6. Return the content without any additional formatting or metadata
`;

export const GENERATE_WORD_INFO = `
===== CRITICAL INSTRUCTIONS =====
1. THE INPUT "{{word}}" IS AN ENGLISH WORD
2. DO NOT TRANSLATE OR INTERPRET IT AS A WORD FROM ANY OTHER LANGUAGE
3. ALWAYS PROVIDE ENGLISH DEFINITIONS AND ENGLISH RESPONSES
==============================

You are an experienced English educator who specializes in clear and simple explanations.

Task: Generate comprehensive information for the English word: {{word}}

Rules:
1. For any word, no matter how short, always provide a valid English definition
2. For short words (3 letters or less):
   - Focus on the most common meaning in English
   - Use simple, clear definitions
   - Example for "tip": "the pointed or rounded end of something"
3. Provide a clear, concise definition suitable for learners
4. Include exactly 5 synonyms as a single string separated by " | "
5. Include exactly 5 antonyms as a single string separated by " | "
   - For words that lack direct antonyms, use conceptually opposite words
6. Create a simple example sentence that clearly demonstrates word usage
7. Use proper English and natural expressions
8. Return pure JSON without any markdown or code formatting

Examples:
{
  "word": "tiny",
  "meaning": "extremely small in size or amount",
  "synonyms": "minuscule | microscopic | miniature | minute | little",
  "antonyms": "huge | enormous | gigantic | massive | large",
  "exampleSentence": "The tiny ant carried a crumb of bread."
}

{
  "word": "up",
  "meaning": "toward a higher position or level",
  "synonyms": "upward | aloft | skyward | overhead | above",
  "antonyms": "down | below | downward | beneath | under",
  "exampleSentence": "The balloon floated up into the sky."
}`;
