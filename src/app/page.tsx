"use client";

import { useState } from "react";
import { SimplificationForm } from "@/components/SimplificationForm";
import { OutputDisplay } from "@/components/OutputDisplay";
import { LogoIcon } from "@/components/icons/LogoIcon"; // Re-using existing logo
import { Button } from "@/components/ui/button";
import Link from "next/link"; // For potential future navigation

type SimplificationResult = {
  simplifiedText: string;
  translatedText: string;
};

// Placeholder for 3D-like geometric SVG
const GeometricBackground = () => (
  <div className="hero-geometric-element" aria-hidden="true">
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      {/* Example lines - can be made much more complex */}
      <line className="geo-line" x1="10" y1="10" x2="190" y2="190" style={{ animationDelay: '0s' }} />
      <line className="geo-line" x1="190" y1="10" x2="10" y2="190" style={{ animationDelay: '0.5s' }} />
      <line className="geo-line" x1="100" y1="10" x2="100" y2="190" style={{ animationDelay: '1s' }} />
      <line className="geo-line" x1="10" y1="100" x2="190" y2="100" style={{ animationDelay: '1.5s' }} />
      <line className="geo-line" x1="50" y1="10" x2="150" y2="190" style={{ animationDelay: '2s' }} />
      <line className="geo-line" x1="10" y1="50" x2="190" y2="150" style={{ animationDelay: '2.5s' }} />
      <line className="geo-line" x1="150" y1="10" x2="50" y2="190" style={{ animationDelay: '3s' }} />
      <line className="geo-line" x1="190" y1="50" x2="10" y2="150" style={{ animationDelay: '3.5s' }} />

      {/* Example points */}
      <circle className="geo-point" cx="10" cy="10" r="2" style={{ animationDelay: '0.2s' }}/>
      <circle className="geo-point" cx="190" cy="190" r="2" style={{ animationDelay: '0.7s' }}/>
      <circle className="geo-point" cx="100" cy="100" r="3" style={{ animationDelay: '1.2s' }}/>
      <circle className="geo-point" cx="50" cy="150" r="1.5" style={{ animationDelay: '1.8s' }}/>
      <circle className="geo-point" cx="150" cy="50" r="1.5" style={{ animationDelay: '2.2s' }}/>
    </svg>
  </div>
);


export default function Home() {
  const [result, setResult] = useState<SimplificationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [inputText, setInputText] = useState("");
  const [targetLanguage, setTargetLanguage] = useState("English");

   const handleResult = (newResult: SimplificationResult | null, text?: string, lang?: string) => {
    setIsLoading(newResult === null);
    setResult(newResult);
    if (newResult === null && text !== undefined && lang !== undefined) {
        setInputText(text);
        setTargetLanguage(lang);
    }
  };

  return (
    <div className="flex flex-col min-h-screen items-center relative overflow-hidden">
      <GeometricBackground />

      {/* Header */}
      <header className="w-full py-4 px-6 md:px-10 fixed top-0 z-50 bg-background/80 backdrop-blur-md">
        <div className="container mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <LogoIcon className="h-10 w-10 text-primary group-hover:text-accent transition-colors duration-300 futuristic-glow-cyan" />
            <h1 className="text-3xl font-bold tracking-tighter text-glow-primary group-hover:text-glow-accent transition-all duration-300">
              GeminiSimplify
            </h1>
          </Link>
          {/* Future navigation can go here */}
          {/* <nav className="hidden md:flex gap-6">
            <Link href="#" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Features</Link>
            <Link href="#" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Pricing</Link>
            <Button variant="outline" className="border-primary text-primary hover:bg-primary/10 futuristic-glow-cyan">Get Started</Button>
          </nav> */}
        </div>
      </header>

      {/* Main Content / Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center w-full px-4 md:px-6 pt-24 pb-12 z-10"> {/* Added pt-24 for header offset */}
        <div className="text-center mb-12 md:mb-16 max-w-3xl">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-glow-primary">
            Powerful Web Simplification
          </h2>
          <p className="mt-4 md:mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Enter your text and let our AI simplify and translate it into the language of your choice with futuristic precision.
          </p>
        </div>

        <div className="w-full max-w-4xl flex flex-col items-center space-y-10">
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

      {/* Footer */}
      <footer className="w-full py-8 px-6 md:px-10 text-center z-10 border-t border-border/20 bg-background/70 backdrop-blur-sm">
        <p className="text-sm text-muted-foreground">
          Powered by Gemini AI &bull; Crafted with Next.js & ShadCN UI &bull; Design Inspired by the Future
        </p>
         <p className="text-xs text-muted-foreground/70 mt-2">
          © {new Date().getFullYear()} GeminiSimplify. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
