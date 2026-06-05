'use client';

import React from 'react';
import { useTheme } from '@/context/theme-context';

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
  const { activeMoodId } = useTheme();
  const firstImage = images?.[0];

  if (displayMode === 'horizontal-card') {
    return (
      <div className="itin-card">
        <div className="h-card-layout">
          {showImages && firstImage && (
            <div className="h-card-image-container">
              <img src={firstImage} alt={name} className="w-full h-full object-cover" />
            </div>
          )}
          <div className="h-card-content-container">
            <div className="flex justify-between items-start mb-2">
              <div className="min-w-0">
                <h3 className="font-heading font-bold text-base leading-tight truncate">{name}</h3>
                <div className="flex items-center gap-1 mt-1">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-400"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                  <span className="text-[10px] text-gray-500 font-bold uppercase tracking-tight truncate">{location || 'Destination TBD'}</span>
                </div>
              </div>
              <span className="badge-pill bg-blue-100 text-blue-700 ml-2">Hotel</span>
            </div>

            <div className="grid grid-cols-2 gap-4 flex-1">
              <div>
                <div className="text-[9px] text-gray-400 font-bold uppercase mb-1">Stay Details</div>
                <div className="text-xs font-bold text-primary">{mealPlan || 'Meal Plan TBD'}</div>
                <div className="text-[10px] text-gray-600 mt-1">
                  {roomConfigurations && roomConfigurations.length > 0 
                    ? roomConfigurations.map(r => `${r.numberOfRooms}x ${r.roomType}`).join(', ')
                    : 'Rooms TBD'}
                </div>
              </div>
              <div>
                <div className="text-[9px] text-gray-400 font-bold uppercase mb-1">Category</div>
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <svg key={i} width="10" height="10" viewBox="0 0 24 24" fill={i < rating ? "currentColor" : "none"} stroke="currentColor" className={i < rating ? "text-yellow-500" : "text-gray-200"}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                  ))}
                </div>
                <div className="text-[10px] text-gray-600 mt-1 font-bold">{rating} Star Property</div>
              </div>
            </div>
          </div>
        </div>
        {notes && (
          <div className="standard-note-bar">
            <strong>NOTE:</strong>
            <span dangerouslySetInnerHTML={{ __html: notes }} />
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="itin-card">
      {showImages && firstImage && (
        <div className="h-[180px] w-full overflow-hidden">
          <img src={firstImage} alt={name} className="w-full h-full object-cover" />
        </div>
      )}
      <div className="p-4">
        <div className="flex justify-between items-start mb-1">
          <h3 className="font-heading font-bold text-base">{name}</h3>
          <span className="badge-pill bg-blue-100 text-blue-700">Hotel</span>
        </div>
        <div className="text-xs text-gray-500 mb-4">{location}</div>
        <div className="location-box">
          <div className="flex justify-between items-center text-xs font-bold">
            <span className="text-primary">{mealPlan || 'EP'} Plan</span>
            <div className="flex items-center gap-1">
              <span className="text-yellow-600">{rating} Stars</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" className="text-yellow-500"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            </div>
          </div>
        </div>
      </div>
      {notes && (
        <div className="standard-note-bar">
          <strong>NOTE:</strong>
          <span dangerouslySetInnerHTML={{ __html: notes }} />
        </div>
      )}
    </div>
  );
}
