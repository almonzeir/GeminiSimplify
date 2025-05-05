"use client";

import { useState } from "react";
import { SimplificationForm } from "@/components/SimplificationForm";
import { OutputDisplay } from "@/components/OutputDisplay";
import { LogoIcon } from "@/components/icons/LogoIcon";
import { Separator } from "@/components/ui/separator";

type SimplificationResult = {
  simplifiedText: string;
  translatedText: string;
};

export default function Home() {
  const [result, setResult] = useState<SimplificationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [inputText, setInputText] = useState("");
  const [targetLanguage, setTargetLanguage] = useState("English");

   const handleResult = (newResult: SimplificationResult | null, text?: string, lang?: string) => {
    setIsLoading(newResult === null);
    setResult(newResult);

    // Capture input text and language when starting the request
    if (newResult === null && text !== undefined && lang !== undefined) {
        setInputText(text);
        setTargetLanguage(lang);
    }
  };


  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-background via-background to-secondary/20">
      <header className="sticky top-0 z-10 w-full bg-card/90 backdrop-blur-lg border-b border-border/60 shadow-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-3"> {/* Increased gap */}
            <LogoIcon className="h-8 w-8 text-primary" /> {/* Slightly larger logo */}
            <h1 className="text-2xl font-semibold text-foreground tracking-tight"> {/* Bolder title */}
              GeminiSimplify
            </h1>
          </div>
          {/* Future placeholder for nav/actions */}
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 md:px-6 py-10 md:py-16"> {/* Increased padding */}
        <div className="max-w-4xl mx-auto flex flex-col items-center space-y-10"> {/* Increased max-width and spacing */}
           <SimplificationForm onResult={handleResult} />

          {(isLoading || result) && (
            <OutputDisplay
                result={result}
                isLoading={isLoading}
                inputText={inputText}
                targetLanguage={targetLanguage}
            />
          )}
        </div>
      </main>

      <footer className="py-6 border-t border-border/60 bg-card/80 mt-12"> {/* Added top margin */}
        <div className="container mx-auto px-4 md:px-6 text-center text-sm text-muted-foreground">
          Powered by Gemini AI &bull; Built with Next.js & ShadCN UI
        </div>
      </footer>
    </div>
  );
}
