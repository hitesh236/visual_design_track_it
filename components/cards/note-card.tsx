'use client';

import { useTheme } from '@/context/theme-context';

type NoteCardProps = {
  name?: string;
  description: string;
  showDescriptions?: boolean;
  hideTime?: boolean;
};

// ... existing icon code if any (InfoIcon is currently unused in this file but defined)

// ─── Box variant (stacked + split layouts) ────────────────────────

function NoteBox({
  name,
  description,
  showDescriptions,
}: NoteCardProps) {
  if (!showDescriptions) return null;

  return (
    <div className="day-note-box">
      {name && name.toLowerCase() !== 'note' && (
        <h4>{name}</h4>
      )}
      <div dangerouslySetInnerHTML={{ __html: description }} />
    </div>
  );
}

// ─── Inline variant (split layout left column preview) ────────────

function NoteInline({
  description,
  showDescriptions,
}: NoteCardProps) {
  if (!showDescriptions) return null;

  return (
    <p className="day-note-content">
      {description}
    </p>
  );
}

// ─── Main export ──────────────────────────────────────────────────

export function NoteCard({
  name,
  description,
  displayMode,
  showDescriptions = true,
  hideTime,
}: {
  name?: string;
  description: string;
  displayMode: 'box' | 'inline';
  showDescriptions?: boolean;
  hideTime?: boolean;
}) {
  if (!description?.trim()) return null;

  if (displayMode === 'inline') {
    const plainText = description.replace(/<[^>]+>/g, '') ?? '';
    if (!plainText.trim()) return null;
    return (
      <NoteInline
        description={plainText}
        showDescriptions={showDescriptions}
      />
    );
  }

  return (
    <NoteBox
      name={name}
      description={description}
      showDescriptions={showDescriptions}
    />
  );
}
