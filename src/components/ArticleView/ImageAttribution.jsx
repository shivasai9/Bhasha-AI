import { ExternalLink } from "lucide-react";
import { truncateArtistName } from "../../lib/licencing/licenceUtils";
import { useRef, useState } from "react";
import CustomTooltip from "./CustomTooltip";

export default function ImageAttribution({ attribution }) {
  if (!attribution) return null;
  
  const { name, originalName, url } = truncateArtistName(attribution.artist);
  const [showTooltip, setShowTooltip] = useState(false);
  const artistRef = useRef(null);
  
  return (
    <div className="text-[11px] leading-normal text-gray-100 bg-gradient-to-t from-black/60 to-black/20 backdrop-blur-sm px-2 py-1.5">
      <div className="flex items-center justify-center gap-x-1.5">
        {url ? (
          <a 
            ref={artistRef}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-white/90 hover:text-white"
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
          >
            {name}
          </a>
        ) : (
          <span 
            ref={artistRef}
            className="font-medium text-white/90"
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
          >
            {name}
          </span>
        )}
        <CustomTooltip 
          text={originalName}
          visible={showTooltip && originalName !== name}
          containerRef={artistRef}
        />
        {attribution.license && (
          <>
            <span className="text-white/70">·</span>
            <a
              href={attribution.license.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/80 hover:text-white"
            >
              {attribution.license.name}
            </a>
          </>
        )}
        {attribution.source && (
          <>
            <span className="text-white/70">·</span>
            <a
              href={attribution.source}
              target="_blank"
              rel="noopener noreferrer" 
              className="inline-flex items-center text-white/80 hover:text-white"
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