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
  const [inputText, setInputText] = useState(""); // Store input text for explanation
  const [targetLanguage, setTargetLanguage] = useState("English"); // Store target language

   const handleResult = (newResult: SimplificationResult | null) => {
    // Update isLoading based on whether newResult is null (started loading) or not (finished loading)
    setIsLoading(newResult === null);
    setResult(newResult);

    // If we are starting a new request, capture the input text and language
    if (newResult === null) {
        // Access form values directly (or pass them up from SimplificationForm)
        // This requires lifting state up or using a different approach like context or Zustand
        // For simplicity, let's assume SimplificationForm passes these up via onResult or another callback
        // Modify SimplificationForm to pass these values when onSubmit starts
        // For now, we'll simulate this by just setting loading state
    }
  };

   // Modify SimplificationForm to pass input text and language on submit initiation
   // This is a conceptual change, actual implementation needs form access or callback
   const handleFormSubmitStart = (text: string, lang: string) => {
      setInputText(text);
      setTargetLanguage(lang);
      setIsLoading(true);
      setResult(null); // Clear previous results visually
   };


  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-background to-secondary/30">
      <header className="sticky top-0 z-10 w-full bg-card/80 backdrop-blur-md border-b border-border/50 shadow-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-2">
            <LogoIcon className="h-7 w-7 text-primary" />
            <h1 className="text-xl font-bold text-foreground tracking-tight">
              GeminiSimplify
            </h1>
          </div>
          {/* Future placeholder for nav/actions */}
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 md:px-6 py-8 md:py-12">
        <div className="max-w-3xl mx-auto flex flex-col items-center space-y-8">
           {/* Conceptual: Pass handleFormSubmitStart to SimplificationForm */}
           {/* <SimplificationForm onResult={handleResult} onProcessStart={handleFormSubmitStart} /> */}
           {/* For now, keep original onResult and manage inputText/targetLanguage within OutputDisplay if needed */}
           <SimplificationForm onResult={handleResult} />

          {(isLoading || result) && (
            <OutputDisplay
                result={result}
                isLoading={isLoading}
                // Pass inputText and targetLanguage for the explanation feature
                // These need to be correctly sourced when the simplification process starts
                inputText={inputText} // This state needs to be updated correctly
                targetLanguage={targetLanguage} // This state needs to be updated correctly
            />
          )}
        </div>
      </main>

      <footer className="py-6 border-t border-border/50 bg-card/50">
        <div className="container mx-auto px-4 md:px-6 text-center text-sm text-muted-foreground">
          Powered by Gemini AI &bull; Built with Next.js & ShadCN UI
        </div>
      </footer>
    </div>
  );
}
