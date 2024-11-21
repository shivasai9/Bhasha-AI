import { USABLE_LICENCES } from "./licences";

export const isUsableLicense = (license) => {
  if (!license) return false;
  const normalizedLicense = license.toLowerCase().split(" ").join("-");
  return USABLE_LICENCES.includes(normalizedLicense);
};

export const sanitizeText = (text) => {
  return text
    .replace(/\s+/g, ' ')        
    .replace(/<!--.*?-->/g, '')     
    .replace(/&nbsp;/g, ' ')     
    .replace(/[\n\r]/g, ' ') 
    .trim();
};

export const parseArtistLink = (artistHtml) => {
  if (!artistHtml || typeof artistHtml !== 'string') {
    return { name: 'Unknown', url: null };
  }

  const cleanText = sanitizeText(artistHtml);
  if (!cleanText || cleanText === 'null') {
    return { name: 'Unknown', url: null };
  }

  if (!cleanText.includes('<')) {
    if (cleanText.includes('[[') && cleanText.includes(']]')) {
      const wikiMatch = cleanText.match(/\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/);
      return {
        name: (wikiMatch?.[2] || wikiMatch?.[1] || cleanText).trim(),
        url: null
      };
    }
    return { name: cleanText, url: null };
  }

  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(cleanText, 'text/html');

    doc.querySelectorAll('script').forEach(script => script.remove());

    const link = doc.querySelector('a');
    if (!link) {
      return { name: doc.body.textContent.trim() || 'Unknown', url: null };
    }

    let url = link.getAttribute('href');
    if (url) {
      if (url.startsWith('javascript:')) url = null;
      else if (url.startsWith('//')) url = 'https:' + url;
      else if (url.startsWith('/')) url = `https://commons.wikimedia.org${url}`;
    }

    let name = link.textContent.trim();
    if (!name) {
      name = doc.body.textContent.trim() || 'Unknown';
    }

    const fullText = doc.body.textContent.trim();
    if (fullText.length > name.length) {
      name = fullText;
    }

    return { name, url };
  } catch (error) {
    console.warn('Error parsing artist HTML:', error);
    return { name: cleanText.replace(/<[^>]*>/g, '').trim() || 'Unknown', url: null };
  }
};

export const truncateArtistName = (artistHtml, maxLength = 15) => {
  const { name, url } = parseArtistLink(artistHtml);
  
  const separators = [' and ', ' & ', ' / ', '; ', '，', '、'];
  const separator = separators.find(sep => name.includes(sep));
  
  let truncatedName = name;
  if (separator) {
    const artists = name.split(separator);
    truncatedName = artists[0].trim() + '...';
  } else if (name.length > maxLength) {
    truncatedName = name.slice(0, maxLength) + '...';
  }

  return {
    name: truncatedName,
    originalName: name,
    url
  };
};
