
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

export function RefreshContent() {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const router = useRouter();

  const handleRefresh = async () => {
    setIsRefreshing(true);
    router.refresh();
    // Simulate a brief delay for a smoother visual transition
    setTimeout(() => setIsRefreshing(false), 800);
  };

  return (
    <Button
      variant="outline"
      onClick={handleRefresh}
      disabled={isRefreshing}
      className={cn(
        "group h-12 px-8 rounded-full border-primary/20 hover:border-accent hover:bg-accent/5 transition-all duration-300",
        isRefreshing && "opacity-50"
      )}
    >
      <RefreshCw 
        className={cn(
          "mr-2 h-4 w-4 transition-transform duration-700",
          isRefreshing && "rotate-180"
        )} 
      />
      <span className="font-body font-medium text-primary">New Inspiration</span>
    </Button>
  );
}
