export const CREATE_RANDOM_ARTICLE = `
Generate a random educational article. Return it in the following JSON format:
{
  "title": "The title of the article",
  "summary": "A two-sentence summary of the article",
  "imageKeywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"],
}
Please provide exactly five image keywords. Do not include any markdown or code formatting, only the pure JSON object.
`;

export const CREATE_CUSTOM_ARTICLE = `
Generate an educational article about the following topic: {{topic}}. Return it in the following JSON format:
{
  "title": "The title of the article",
  "summary": "A two-sentence summary of the article",
  "imageKeywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"],
}
Please provide exactly five image keywords. Do not include any markdown or code formatting, only the pure JSON object.
`;


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

