
'use client';

import React from 'react';

export type TransportItem = {
  id?: string;
  name?: string;
  pickupLocation?: string;
  dropLocation?: string;
  routeStops?: string[];
  cabCategoryName?: string;
  cabModelName?: string;
  isAC?: boolean;
  seaterCapacity?: string | number;
  vehicleCount?: number;
  additionalVehicles?: Array<{
    categoryName: string;
    model: string;
    count: number | string;
  }>;
  price?: number | string;
  notes?: string;
};

function TransportCardItem({ item }: { item: TransportItem }) {
  const vehicleCount = item.vehicleCount ?? 1;
  const displayName = item.name ?? item.cabModelName ?? 'Transport';

  return (
    <div className="itin-card">
      <div className="p-4">
        {/* Header */}
        <div className="flex justify-between items-center flex-wrap gap-2 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[var(--color-transport)] flex items-center justify-center flex-shrink-0">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/></svg>
            </div>
            <h3 className="font-heading font-bold text-sm text-[var(--color-text)]">{displayName}</h3>
          </div>
          <div className="flex gap-2">
            {item.isAC !== false && <span className="bg-gray-100 px-2 py-0.5 rounded text-[9px] font-bold uppercase">AC</span>}
            <span className="bg-gray-100 px-2 py-0.5 rounded text-[9px] font-bold uppercase">{vehicleCount} Vehicles</span>
            {item.cabCategoryName && <span className="bg-gray-100 px-2 py-0.5 rounded text-[9px] font-bold uppercase">{item.cabCategoryName}</span>}
          </div>
        </div>

        {/* Integrated Location & Vehicle Box */}
        <div className="location-box">
          <div className="grid grid-cols-[1fr,auto,1fr] items-center gap-4 mb-4">
            <div className="text-left min-w-0">
              <div className="text-[9px] text-gray-500 font-bold uppercase mb-1">Pickup</div>
              <div className="text-xs font-bold truncate">{item.pickupLocation || 'TBD'}</div>
            </div>
            <div className="text-gray-300">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14m-7-7l7 7-7 7"/></svg>
            </div>
            <div className="text-right min-w-0">
              <div className="text-[9px] text-gray-500 font-bold uppercase mb-1">Drop</div>
              <div className="text-xs font-bold truncate">{item.dropLocation || 'TBD'}</div>
            </div>
          </div>

          <div className="vehicle-badge-group">
             <div className="bg-white/60 px-2 py-1 rounded-md text-[10px] flex items-center gap-1.5 border border-black/5 shadow-sm">
               <span className="font-bold text-primary">{vehicleCount}x</span>
               <span className="font-medium text-gray-700">{item.cabModelName || 'Vehicle'}</span>
             </div>
             {item.additionalVehicles?.map((v, idx) => (
               <div key={idx} className="bg-white/60 px-2 py-1 rounded-md text-[10px] flex items-center gap-1.5 border border-black/5 shadow-sm">
                 <span className="font-bold text-primary">{v.count}x</span>
                 <span className="font-medium text-gray-700">{v.model || v.categoryName}</span>
               </div>
             ))}
          </div>
        </div>
      </div>

      {item.notes && (
        <div className="standard-note-bar">
          <strong>NOTE:</strong>
          <span className="note-content-container" dangerouslySetInnerHTML={{ __html: item.notes }} />
        </div>
      )}
    </div>
  );
}

export function TransportCard({ items }: { items: TransportItem[] }) {
  if (!items.length) return null;
  return (
    <div className="flex flex-col gap-4">
      {items.map((item, i) => (
        <TransportCardItem key={item.id ?? i} item={item} />
      ))}
    </div>
  );
}

export { TransportCard as TransportRow };
