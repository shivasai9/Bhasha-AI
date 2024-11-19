import { aiWrapper } from "./ai";
import { upsertRecord, getArticleContent, getArticleById } from "./dbUtils";
import { STORES } from "./constants";
import { getLanguage } from "./languageStorage";
import { translateContent } from "./translation.service";

export async function generateAndSaveSummary(articleId, content, level) {
  try {
    const language = getLanguage();
    const existingContent = await getArticleContent(articleId, level, language);
    
    if (!existingContent) {
      console.error('No article content found for:', articleId);
      return null;
    }

    if (existingContent.summary) {
      return existingContent.summary;
    }

    let summary;
    
    if (language.toLowerCase() !== "english") {
      const articleMetadata = await getArticleById(articleId);
      if (!articleMetadata || !articleMetadata.originalArticleId) {
        console.error('Cannot find original English article reference');
        return null;
      }

      const englishContent = await getArticleContent(
        articleMetadata.originalArticleId, 
        level, 
        "english"
      );
      
      if (!englishContent) {
        console.error('No English content found for translation reference');
        return null;
      }

      if (!englishContent.summary) {
        const englishSummary = await aiWrapper.summarizeContent(englishContent.content);
        await upsertRecord(
          STORES.ARTICLES_CONTENT,
          [articleMetadata.originalArticleId, level, "english"],
          {
            ...englishContent,
            summary: englishSummary,
            updatedAt: Date.now()
          }
        );
        summary = await translateContent(englishSummary, "english", language);
      } else {
        summary = await translateContent(englishContent.summary, "english", language);
      }
    } else {
      summary = await aiWrapper.summarizeContent(content);
    }

    if (!summary) {
      throw new Error('Summary generation/translation failed');
    }

    const updatedContent = {
      ...existingContent,
      summary,
      updatedAt: Date.now()
    };
    
    await upsertRecord(
      STORES.ARTICLES_CONTENT, 
      [articleId, level, language], 
      updatedContent
    );

    return summary;

  } catch (error) {
    console.error("Summary generation failed:", error);
    throw error;
  }
}
