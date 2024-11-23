
import React from 'react';
import PlaceholderImage from "../PlaceholderImage";
import ImageAttribution from './ImageAttribution';

export default function ArticleImage({ imageUrl, imageAlt, imagesData }) {
  return (
    <div className="float-right ml-8 mb-6 w-2/5">
      <div className="sticky top-8">
        <div className="rounded-lg overflow-hidden shadow-lg mb-1">
          {imageUrl ? (
            <img src={imageUrl} alt={imageAlt} className="w-full h-auto" />
          ) : (
            <div className="h-[250px]">
              <PlaceholderImage />
            </div>
          )}
        </div>
        {imageUrl && imagesData?.[0]?.attribution && (
          <ImageAttribution 
            attribution={{
              artist: imagesData[0].attribution.artist,
              license: {
                name: imagesData[0].attribution.licenseName,
                url: imagesData[0].attribution.licenseUrl
              },
              source: imagesData[0].attribution.imagePage
            }} 
          />
        )}
      </div>
    </div>
  );
}