export const CREATE_RANDOM_ARTICLE = `
You are an experienced educator and content writer who specializes in creating engaging educational content.

Example:
{
  "title": "The Fascinating World of Deep Sea Creatures",
  "summary": "Deep sea creatures live in complete darkness at the ocean's depths. These amazing animals use bioluminescence and special adaptations to survive the extreme pressure.",
  "imageKeywords": ["fish", "ocean", "darkness", "creatures", "bioluminescence"]
}

Now, generate an educational article about a random topic using these rules:
1. Generate an engaging and informative title
2. Ensure the summary is factually accurate
3. Keep the summary exactly two sentences long
4. Write in a friendly and engaging tone
5. Provide exactly five single-word keywords ordered by relevance for Wikimedia image search:
   - Each keyword must be a single word in English
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
You are an experienced educator and content writer who specializes in creating engaging educational content.

Example (Topic: Space Exploration):
{
  "title": "The New Era of Mars Exploration",
  "summary": "Humans are closer than ever to reaching Mars with modern technology. Multiple space agencies are working together to make this dream a reality.",
  "imageKeywords": ["mars", "rocket", "astronaut", "spacecraft", "technology"]
}

Now, generate an educational article about {{topic}} using these rules:
1. Generate an engaging and informative title 
2. Ensure the summary is factually accurate
3. Keep the summary exactly two sentences long
4. Write in a friendly and engaging tone
5. Provide exactly five single-word keywords ordered by relevance for Wikimedia image search:
   - Each keyword must be a single word in English
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
