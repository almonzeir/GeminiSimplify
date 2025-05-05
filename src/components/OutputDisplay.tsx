"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Copy, Check, AlertCircle, Loader2, BrainCircuit } from "lucide-react"; // Added Loader2, BrainCircuit
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { explainSimplification } from "@/ai/flows/explain-simplification";

type OutputDisplayProps = {
  result: { simplifiedText: string; translatedText: string } | null;
  isLoading: boolean;
  inputText: string;
  targetLanguage: string;
};

export function OutputDisplay({ result, isLoading, inputText, targetLanguage }: OutputDisplayProps) {
  const [copiedSimplified, setCopiedSimplified] = useState(false);
  const [copiedTranslated, setCopiedTranslated] = useState(false);
  const [explanation, setExplanation] = useState<string | null>(null);
  const [isExplaining, setIsExplaining] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Reset explanation when result changes or loading starts
    setExplanation(null);
    setShowExplanation(false);
    setIsExplaining(false);
  }, [result, isLoading]);

  const handleCopy = (text: string, type: 'simplified' | 'translated') => {
    navigator.clipboard.writeText(text).then(() => {
      if (type === 'simplified') {
        setCopiedSimplified(true);
        setTimeout(() => setCopiedSimplified(false), 2000);
      } else {
        setCopiedTranslated(true);
        setTimeout(() => setCopiedTranslated(false), 2000);
      }
      toast({ title: "Copied!", description: `${type === 'simplified' ? 'Simplified' : 'Translated'} text copied to clipboard.` });
    }).catch(err => {
      console.error("Copy failed:", err);
      toast({ variant: "destructive", title: "Error", description: "Failed to copy text." });
    });
  };

  const handleExplain = async () => {
    if (!inputText || !targetLanguage || isLoading) return; // Also disable if main process is loading
    setIsExplaining(true);
    setExplanation(null); // Clear previous explanation
    setShowExplanation(true); // Show the explanation section immediately with loading state
    try {
      const explanationResult = await explainSimplification({ text: inputText, language: targetLanguage });
      setExplanation(explanationResult.explanation);
    } catch (error) {
      console.error("Explanation failed:", error);
      setExplanation("Failed to generate explanation. Please try again."); // More informative error
      toast({ variant: "destructive", title: "Explanation Error", description: "Could not generate the explanation." });
    } finally {
      setIsExplaining(false);
    }
  };


  const OutputCard = ({ title, text, copied, onCopy, isLoading }: { title: string; text: string | undefined; copied: boolean; onCopy: () => void; isLoading: boolean }) => (
    <Card className="flex-1 bg-card/80 border border-border/50 shadow-md transition-all duration-300 ease-in-out min-h-[200px] flex flex-col"> {/* Added flex flex-col */}
      <CardHeader className="flex flex-row items-center justify-between pb-2 pt-4 px-4"> {/* Adjusted padding */}
        <CardTitle className="text-lg font-semibold text-foreground">{title}</CardTitle> {/* Increased font weight */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onCopy}
          disabled={isLoading || !text}
          className="h-8 w-8 text-muted-foreground hover:text-primary transition-colors duration-200 rounded-full" /* Rounded button */
          aria-label={`Copy ${title}`}
        >
          {copied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
        </Button>
      </CardHeader>
      <CardContent className="pt-2 px-4 pb-4 flex-1"> {/* Added flex-1 to fill space */}
        {isLoading ? (
          <div className="space-y-3 pt-2"> {/* Increased spacing */}
            <Skeleton className="h-4 w-full animate-pulse-bg rounded" /> {/* Rounded skeleton */}
            <Skeleton className="h-4 w-5/6 animate-pulse-bg rounded" />
            <Skeleton className="h-4 w-3/4 animate-pulse-bg rounded" />
          </div>
        ) : text ? (
          <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">{text}</p> /* Increased line height */
        ) : (
          <p className="text-sm text-muted-foreground italic pt-2">Output will appear here...</p>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-8 mt-10 w-full"> {/* Increased spacing and margin-top */}
       <div className="flex flex-col md:flex-row gap-6">
         <OutputCard
           title="Simplified Text"
           text={result?.simplifiedText}
           copied={copiedSimplified}
           onCopy={() => handleCopy(result?.simplifiedText || '', 'simplified')}
           isLoading={isLoading && !result} // Only show loading skeleton if no result yet
         />
         <OutputCard
           title={`Translated Text (${targetLanguage})`}
           text={result?.translatedText}
           copied={copiedTranslated}
           onCopy={() => handleCopy(result?.translatedText || '', 'translated')}
           isLoading={isLoading && !result}
         />
       </div>

      {result && !isLoading && ( // Only show Explain button if result is loaded and not currently loading
         <div className="text-center pt-2"> {/* Added padding-top */}
             <Button onClick={handleExplain} variant="outline" disabled={isExplaining || !inputText || !targetLanguage} className="transition-all duration-200 ease-in-out hover:bg-secondary hover:border-primary/30 shadow-sm border-input group"> {/* Added group class */}
                 {isExplaining ? (
                    <>
                     <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating Explanation...
                    </>
                 ) : (
                     <>
                     <BrainCircuit className="mr-2 h-4 w-4 text-accent group-hover:text-accent-foreground transition-colors"/> {/* Accent icon */}
                     Explain Simplification
                    </>
                 )}
             </Button>
         </div>
       )}

        {/* Explanation Section */}
        {(showExplanation || isExplaining) && ( // Show card container if explaining or explanation is ready
         <Card className="bg-secondary/30 border border-border/50 shadow-md mt-6 transition-all duration-500 ease-in-out animate-in fade-in slide-in-from-bottom-5"> {/* Softer background */}
           <CardHeader className="pb-3 pt-4 px-4">
             <CardTitle className="text-lg font-semibold text-foreground flex items-center">
                <BrainCircuit className="mr-2 h-5 w-5 text-primary" /> {/* Icon in title */}
                Explanation
             </CardTitle>
             <CardDescription className="text-muted-foreground pt-1">How the AI simplified the original text.</CardDescription>
           </CardHeader>
           <CardContent className="px-4 pb-4">
             {isExplaining ? (
               <div className="space-y-3 pt-2"> {/* Increased spacing */}
                 <Skeleton className="h-4 w-full animate-pulse-bg rounded" />
                 <Skeleton className="h-4 w-5/6 animate-pulse-bg rounded" />
                 <Skeleton className="h-4 w-4/5 animate-pulse-bg rounded" />
               </div>
             ) : explanation ? (
               <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">{explanation}</p> /* Increased line height */
             ) : (
                <div className="flex items-center text-destructive py-2"> {/* Destructive color for error */}
                    <AlertCircle className="mr-2 h-4 w-4" />
                    <span>Explanation could not be generated or is not available.</span>
                </div>
             )}
           </CardContent>
         </Card>
       )}
    </div>
  );
}
