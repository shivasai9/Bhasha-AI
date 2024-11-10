export const CREATE_RANDOM_ARTICLE = `
Generate a random educational article. Return it in the following JSON format:
{
  "title": "The title of the article",
  "summary": "A two-sentence summary of the article",
  "imageKeywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"],
}
Please provide exactly five image keywords. Do not include any markdown or code formatting, only the pure JSON object.
`;
