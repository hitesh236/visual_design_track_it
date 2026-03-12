
import { generatePageContent } from '@/ai/flows/generate-page-content';
import { RefreshContent } from '@/components/refresh-content';
import { Card, CardContent } from '@/components/ui/card';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'SimpleView | Focus & Clarity',
  description: 'A minimalist space for quiet reflection and fresh inspiration.',
};

export default async function Home() {
  const { content } = await generatePageContent();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-background selection:bg-accent/30">
      <main className="w-full max-w-2xl text-center space-y-12 animate-fade-in">
        <header className="space-y-4">
          <h1 className="text-4xl font-headline font-semibold tracking-tight text-primary">
            SimpleView
          </h1>
          <p className="text-muted-foreground font-body text-lg max-w-md mx-auto">
            Minimalist clarity for your digital workspace.
          </p>
        </header>

        <Card className="border-none bg-white shadow-xl shadow-primary/5 rounded-2xl overflow-hidden">
          <CardContent className="p-12 md:p-16">
            <div className="relative">
              <span className="absolute -top-4 -left-4 text-accent text-6xl opacity-20 font-serif">“</span>
              <p className="text-2xl md:text-3xl font-body leading-relaxed text-foreground font-light">
                {content}
              </p>
              <span className="absolute -bottom-10 -right-4 text-accent text-6xl opacity-20 font-serif">”</span>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col items-center gap-6">
          <RefreshContent />
          <footer className="text-xs text-muted-foreground/60 font-body uppercase tracking-widest pt-8">
            Established for clarity • 2024
          </footer>
        </div>
      </main>
    </div>
  );
}
