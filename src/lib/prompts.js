import { getArticlesByLanguage } from "./dbUtils";

export const CREATE_RANDOM_ARTICLE = `
You are an experienced educator and content writer who specializes in creating engaging content in English.

Example:
{
  "title": "The Fascinating World of Deep Sea Creatures",
  "summary": "Deep sea creatures live in complete darkness at the ocean's depths. These amazing animals use bioluminescence and special adaptations to survive the extreme pressure.",
  "imageKeywords": ["fish", "ocean", "darkness", "creatures", "bioluminescence"]
}

Now, generate an article about a random topic using these rules:
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
Generate 5 questions from the article "{{title}}" with 4 options and answer. Return it in the following JSON format:
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
Please provide exactly five questions. Do not include any markdown or code formatting, only the pure array of JSON object.
`;

export const GENERATE_ARTICLE_CONTENT = `
Generate a detailed article content in 2 paragraphs based on the following title and summary. Keep the language level at {{level}} (beginner/intermediate/advanced).

Title: {{title}}
Summary: {{summary}}

Guidelines:
1. Write 2 well-structured paragraphs
2. Use language appropriate for {{level}} level:
   - Beginner: Simple vocabulary and sentence structure
   - Intermediate: Moderate complexity with some advanced terms
   - Advanced: Complex sentence structures and advanced vocabulary
3. Keep the content informative and engaging
4. Maintain factual accuracy
5. Return the content as plain text without any formatting

Example output:
First paragraph discussing the main topic and its importance...
Second paragraph elaborating on specific details and conclusions...
`;

export async function generateArticleCreationPrompt(customTopic = null) {
  const existingArticles = await getArticlesByLanguage("english");
  const existingTopics = existingArticles.map((article) => {
    const topic = article.title.split(":")[0].trim();
    return topic;
  });
  let prompt = "";

  if (existingTopics.length > 0 && !customTopic) {
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

  prompt += customTopic
    ? CREATE_CUSTOM_ARTICLE.replace("{{topic}}", customTopic)
    : CREATE_RANDOM_ARTICLE;

  return prompt;
}
