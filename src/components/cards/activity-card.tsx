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
      <div className="activity-card-root itin-card">
        <div className="h-card-layout">
          {showImages && firstImage && (
            <div className="h-card-image-container">
              <img src={firstImage} alt={name} />
            </div>
          )}
          <div className="h-card-content-container">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-heading font-bold text-base leading-tight">{name}</h3>
              <span className="badge-pill bg-green-100 text-green-700 ml-2">Activity</span>
            </div>
            {showDescriptions && description && (
              <div className="note-content-container line-clamp-4 text-xs text-gray-600 flex-1" dangerouslySetInnerHTML={{ __html: description }} />
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="activity-card-root itin-card">
      {showImages && firstImage && (
        <div className="h-[160px] w-full overflow-hidden">
          <img src={firstImage} alt={name} className="w-full h-full object-cover" />
        </div>
      )}
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-heading font-bold text-base">{name}</h3>
          <span className="badge-pill bg-green-100 text-green-700">Activity</span>
        </div>
        {showDescriptions && description && (
          <div className="note-content-container text-gray-700" dangerouslySetInnerHTML={{ __html: description }} />
        )}
      </div>
    </div>
  );
}