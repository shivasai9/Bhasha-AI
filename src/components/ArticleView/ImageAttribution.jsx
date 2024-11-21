import { ExternalLink } from "lucide-react";

export default function ImageAttribution({ attribution }) {
  if (!attribution) return null;
  
  const processedArtist = attribution.artist.replace(
    /<a(\s+[^>]*)?>/g,
    '<a$1 target="_blank" rel="noopener noreferrer">'
  );
  
  return (
    <div className="text-[11px] leading-normal text-gray-500 bg-gray-50 px-2 py-1.5 rounded">
      <div className="flex items-center justify-center gap-x-1.5">
        by
        <span 
          dangerouslySetInnerHTML={{ __html: processedArtist }}
          className="font-medium text-gray-600"
        />
        {attribution.license && (
          <>
            <span>·</span>
            <a
              href={attribution.license.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-gray-900"
            >
              {attribution.license.name}
            </a>
          </>
        )}
        {attribution.source && (
          <>
            <span>·</span>
            <a
              href={attribution.source}
              target="_blank"
              rel="noopener noreferrer" 
              className="inline-flex items-center text-gray-600 hover:text-gray-900"
            >
              <ExternalLink className="w-2.5 h-2.5 mr-0.5" />
              <span>Source</span>
            </a>
          </>
        )}
      </div>
    </div>
  );
}