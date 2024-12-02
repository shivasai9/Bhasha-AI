# BhashaAI - AI-Powered Language Learning Platform
BhashaAI is a platform designed to make language learning accessible, engaging, and personalized for everyone. Leveraging AI and cutting-edge web technologies, it offers a unique and interactive way to learn English, Spanish, and French.

## API Setup
Before using the platform, please visit [API Status Page](https://www.bhashaai.com/api-status) to enable the required APIs and check their current status. Follow the instructions provided on the status page to ensure all necessary APIs are properly configured for the website to function correctly.

## What it does
- **Personalized Learning:** Users can learn English, Spanish, and French through AI-generated articles personalized based on their selected topics and interests. Articles are available in three difficulty levels—easy, medium, and hard. The Custom Levels feature lets users fine-tune the difficulty further.
- **Real-Time Conversations:** Users can interact with AI for grammar lessons, personal discussions, or scenario-based sessions, tailored to their interests.
- **Vocabulary Building:** Users can click on any word in an article to get definitions, synonyms, antonyms, translations, example sentences, and listen to the word for correct pronunciation. Users can save these words using the Saved Words feature.
- **Offline Support:** Learn anytime, anywhere, even without internet, leveraging Chrome's built-in AI capabilities.
- **Language Accessibility:** The platform supports three interface languages—English, Spanish, and French.
- **Interactive Features:** Includes tools like Article Buddy Chatbot, Audio Playback, Article Summary, and Quizzes and Summary Challenges.

## How we built it
- **Tech Stack:**
  - Built using **React.js** and **Chrome's built-in AI** APIs.
  - Used **IndexedDB** to persist user-generated data.
  - Used **Local Storage** to save user preferences.
- **Prompts for AI Integration:** Custom prompts were crafted for features like Article Generation, Real-Time Conversations, Article Buddy Chatbot, and Quiz and Summarization Challenges.
- **Wikimedia Integration:** Used Wikimedia APIs to display relevant images in articles.
- **Multilingual Support:** Articles are first generated in English and then translated into Spanish and French using Translation APIs.
- **APIs Used:**
  - **Prompts API:** For generating articles, retrieving vocabulary, building the chatbot, handling conversations, and creating quizzes and challenges.
  - **Translation API:** For translating articles and localizing the website interface.
  - **Summarize API:** For generating article summaries.
  - **Wikimedia API:** For fetching relevant images.

## What's next for BhashaAI
- **Better Error Handling:** Improve error handling across the website.
- **Prompt Fine-Tuning:** Further fine-tune prompts for better results.
- **User Feedback and Feature Enhancements:** Gather feedback and integrate new features based on user suggestions.
- **Support for More Languages:** Expand support to include more languages.
- **Responsive Design:** Create a responsive design to support multiple devices.
- **Enhanced Offline Functionality:** Implement service workers to cache the website's pages for offline access.
- **Improved Summarization Feedback:** Refine prompts and test different techniques to improve summarization feedback accuracy.

## Contact
For any questions or feedback about this project, feel free to reach out to me on [LinkedIn](https://www.linkedin.com/in/shiva-sai-telukuntla/).

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
