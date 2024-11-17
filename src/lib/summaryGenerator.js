import { aiWrapper } from "./ai";
import { upsertRecord, getArticleContent } from "./dbUtils";
import { STORES } from "./constants";
import { getLanguage } from "./languageStorage";

export async function generateAndSaveSummary(articleId, content, level) {
  try {
    console.log("Generating summary for:", { articleId, level });
    const language = getLanguage();
    const existingContent = await getArticleContent(articleId, level, language);
    
    if (!existingContent) {
      console.error('No article content found for:', articleId);
      return null;
    }

    if (existingContent.summary) {
      console.log("Returning existing summary");
      return existingContent.summary;
    }

    console.log("Generating new AI summary");
    const aiSummary = await aiWrapper.summarizeContent(content);
    
    if (!aiSummary) {
      throw new Error('AI summary generation failed');
    }

    const updatedContent = {
      ...existingContent,
      summary: aiSummary,
      updatedAt: Date.now()
    };
    
    await upsertRecord(STORES.ARTICLES_CONTENT, [articleId, level, language], updatedContent);
    return aiSummary;

  } catch (error) {
    console.error("Summary generation failed:", error);
    throw error;
  }
}
