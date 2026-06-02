'use client';

import React from 'react';

type HotelCardProps = {
  name: string;
  rating: number;
  location?: string;
  mealPlan?: string;
  roomConfigurations?: Array<{ roomType: string; numberOfRooms: number | string }>;
  images?: string[];
  displayMode: 'card' | 'row' | 'horizontal-card';
  notes?: string;
  checkIn?: string | null;
  checkOut?: string | null;
  showImages?: boolean;
};

export function HotelCard(props: HotelCardProps) {
  const { name, rating, location, mealPlan, images, showImages, roomConfigurations, notes, displayMode } = props;
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
          <div className="mb-2">
            <h3 className="font-heading font-bold text-base leading-tight">{name}</h3>
            <div className="text-[10px] text-gray-500 uppercase font-bold mt-1">{location || 'TBD'}</div>
          </div>
          <div className="grid grid-cols-2 gap-4 flex-1">
             <div className="text-[10px]">
               <div className="text-gray-400 font-bold uppercase mb-1">Stay</div>
               <div className="font-bold text-primary">{mealPlan || 'EP'}</div>
               <div className="mt-1">{roomConfigurations?.[0]?.numberOfRooms}x {roomConfigurations?.[0]?.roomType}</div>
             </div>
             <div className="text-[10px]">
               <div className="text-gray-400 font-bold uppercase mb-1">Rating</div>
               <div className="font-bold">{rating} Stars</div>
             </div>
          </div>
          {notes && <div className="text-[10px] italic text-gray-500 mt-2 truncate">{notes.replace(/<[^>]+>/g, '')}</div>}
        </div>
      </div>
    );
  }

  return (
    <div className="itin-card">
      {showImages && firstImage && <div className="h-[180px] w-full"><img src={firstImage} alt={name} className="w-full h-full object-cover" /></div>}
      <div className="p-4">
        <h3 className="font-heading font-bold text-base mb-1">{name}</h3>
        <div className="text-xs text-gray-500 mb-3">{location}</div>
        <div className="location-box mb-0">
          <div className="flex justify-between text-xs font-bold">
            <span>{mealPlan || 'EP'} Plan</span>
            <span>{rating} Stars</span>
          </div>
        </div>
      </div>
      {notes && (
        <div className="standard-note-bar">
          <strong>NOTE:</strong>
          <span className="note-content-container" dangerouslySetInnerHTML={{ __html: notes }} />
        </div>
      )}
    </div>
  );
}