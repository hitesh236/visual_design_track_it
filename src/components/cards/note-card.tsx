'use client';

type NoteCardProps = {
  name?: string;
  description: string;
  showDescriptions?: boolean;
};

// ─── Box variant ──────────────────────────────────────────────────

function NoteBox({
  name,
  description,
  showDescriptions,
}: NoteCardProps) {
  if (!showDescriptions) return null;

  const hasTitle = name && name.toLowerCase() !== 'note';

  return (
    <div className="note-content-container day-note-box">
      {hasTitle && (
        <h4>{name}</h4>
      )}
      <div 
        className="note-body" 
        style={{ display: 'contents' }} 
        dangerouslySetInnerHTML={{ __html: description }} 
      />
    </div>
  );
}

// ─── Inline variant ───────────────────────────────────────────────

function NoteInline({
  description,
  showDescriptions,
}: NoteCardProps) {
  if (!showDescriptions) return null;

  return (
    <p className="note-content-container">
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
}: {
  name?: string;
  description: string;
  displayMode: 'box' | 'inline';
  showDescriptions?: boolean;
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