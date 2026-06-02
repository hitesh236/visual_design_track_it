'use client';

import React from 'react';

type ActivityCardProps = {
  name: string;
  description?: string;
  images?: string[];
  displayMode: 'card' | 'row' | 'horizontal-card';
  showImages?: boolean;
  showDescriptions?: boolean;
};

export function ActivityCard(props: ActivityCardProps) {
  const { name, description, images, showImages, showDescriptions, displayMode } = props;
  const firstImage = images?.[0];

  if (displayMode === 'horizontal-card') {
    return (
      <div className="itin-card h-card-root">
        {showImages && firstImage && (
          <div className="h-card-img-wrapper">
            <img src={firstImage} alt={name} className="w-full h-full object-cover" />
          </div>
        )}
        <div className="h-card-content">
          <h3 className="font-heading font-bold text-base leading-tight mb-2">{name}</h3>
          {showDescriptions && description && (
            <div className="note-content-container line-clamp-3 text-xs" dangerouslySetInnerHTML={{ __html: description }} />
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="itin-card">
      {showImages && firstImage && <div className="h-[160px] w-full"><img src={firstImage} alt={name} className="w-full h-full object-cover" /></div>}
      <div className="p-4">
        <h3 className="font-heading font-bold text-base mb-2">{name}</h3>
        {showDescriptions && description && (
          <div className="note-content-container" dangerouslySetInnerHTML={{ __html: description }} />
        )}
      </div>
    </div>
  );
}