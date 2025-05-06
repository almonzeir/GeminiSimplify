"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Copy, Check, AlertTriangle, Loader2, BrainCircuit, Eye } from "lucide-react";
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
    // Reset explanation when result or loading state changes
    setExplanation(null);
    setShowExplanation(false);
    setIsExplaining(false);
  }, [result, isLoading]);

  const handleCopy = (text: string, type: 'simplified' | 'translated') => {
    navigator.clipboard.writeText(text).then(() => {
      if (type === 'simplified') setCopiedSimplified(true);
      else setCopiedTranslated(true);
      
      setTimeout(() => {
        if (type === 'simplified') setCopiedSimplified(false);
        else setCopiedTranslated(false);
      }, 2000);

      toast({ 
        title: "Copied to Clipboard", 
        description: `${type === 'simplified' ? 'Simplified' : 'Translated'} text has been copied.`,
        className: "bg-background border-primary futuristic-glow-primary text-foreground" // Use primary glow
      });
    }).catch(err => {
      console.error("Copy failed:", err);
      toast({ 
        variant: "destructive", 
        title: "Copy Error", 
        description: "Failed to copy text to clipboard.",
        className: "bg-destructive border-destructive/50 text-destructive-foreground"
      });
    });
  };

  const handleExplain = async () => {
    if (!inputText || !targetLanguage || isLoading || !result) return; // also check for result
    setIsExplaining(true);
    setExplanation(null);
    setShowExplanation(true);
    try {
      // Use the simplified text from the current result for explanation, or the original input if specified by design
      const textToExplain = result.simplifiedText || inputText; // Prefer explaining the simplification of the already simplified text
      const explanationResult = await explainSimplification({ text: textToExplain, language: targetLanguage });
      setExplanation(explanationResult.explanation);
      toast({
        title: "Explanation Generated",
        description: "AI analysis of the simplification is complete.",
        className: "bg-background border-accent futuristic-glow-accent text-foreground", // Use accent glow
      });
    } catch (error) {
      console.error("Explanation failed:", error);
      setExplanation("Error: Failed to generate explanation. Please try again.");
      toast({ 
        variant: "destructive", 
        title: "Explanation Error", 
        description: "Could not generate the explanation.",
        className: "bg-destructive border-destructive/50 text-destructive-foreground"
      });
    } finally {
      setIsExplaining(false);
    }
  };

  const OutputCard = ({ title, text, copied, onCopy, isLoadingCard, cardGlowType }: { title: string; text: string | undefined; copied: boolean; onCopy: () => void; isLoadingCard: boolean; cardGlowType: 'primary' | 'accent' }) => (
    <Card className={`flex-1 bg-card/60 backdrop-blur-sm border-border/40 shadow-lg transition-all duration-300 ease-in-out min-h-[220px] flex flex-col hover:border-${cardGlowType}/60 ${cardGlowType === 'primary' ? 'futuristic-glow-primary' : 'futuristic-glow-accent'} hover:shadow-xl`}>
      <CardHeader className="flex flex-row items-center justify-between pb-2 pt-4 px-4">
        <CardTitle className={`text-xl font-semibold ${cardGlowType === 'primary' ? 'text-glow-primary' : 'text-glow-accent'}`}>{title}</CardTitle>
        <Button
          variant="ghost"
          size="icon"
          onClick={onCopy}
          disabled={isLoadingCard || !text}
          className={`h-9 w-9 text-muted-foreground hover:text-${cardGlowType} transition-colors duration-200 rounded-full ${cardGlowType === 'primary' ? 'hover:futuristic-glow-primary' : 'hover:futuristic-glow-accent'}`}
          aria-label={`Copy ${title}`}
        >
          {copied ? <Check className={`h-5 w-5 text-green-400`} /> : <Copy className="h-5 w-5" />}
        </Button>
      </CardHeader>
      <CardContent className="pt-2 px-4 pb-4 flex-1">
        {isLoadingCard ? (
          <div className="space-y-3 pt-2">
            <Skeleton className="h-5 w-full animate-pulse-bg rounded bg-muted/20" />
            <Skeleton className="h-5 w-5/6 animate-pulse-bg rounded bg-muted/20" />
            <Skeleton className="h-5 w-3/4 animate-pulse-bg rounded bg-muted/20" />
          </div>
        ) : text ? (
          <p className="text-base text-foreground/90 whitespace-pre-wrap leading-relaxed">{text}</p>
        ) : (
          <div className="flex flex-col items-center justify-center h-full">
            <Eye className="h-12 w-12 text-muted-foreground/30 mb-2" />
            <p className="text-sm text-muted-foreground/50 italic pt-2">Output will appear here...</p>
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-8 mt-10 w-full max-w-5xl">
       <div className="grid md:grid-cols-2 gap-6 md:gap-8">
         <OutputCard
           title="Simplified Text"
           text={result?.simplifiedText}
           copied={copiedSimplified}
           onCopy={() => result?.simplifiedText && handleCopy(result.simplifiedText, 'simplified')}
           isLoadingCard={isLoading && !result}
           cardGlowType="primary" // Primary color for simplified text
         />
         <OutputCard
           title={`Translated (${targetLanguage})`}
           text={result?.translatedText}
           copied={copiedTranslated}
           onCopy={() => result?.translatedText && handleCopy(result.translatedText, 'translated')}
           isLoadingCard={isLoading && !result}
           cardGlowType="accent" // Accent color for translated text
         />
       </div>

      {result && !isLoading && (
         <div className="text-center pt-4">
             <Button 
                onClick={handleExplain} 
                variant="outline" 
                disabled={isExplaining || !inputText || !targetLanguage} 
                className="transition-all duration-300 ease-in-out hover:bg-secondary/20 border-primary/50 text-primary hover:text-primary hover:border-primary futuristic-glow-primary hover:shadow-md group px-6 py-3 text-base"
              >
                 {isExplaining ? (
                    <>
                     <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Analyzing...
                    </>
                 ) : (
                     <>
                     <BrainCircuit className="mr-2 h-5 w-5 text-primary group-hover:text-primary transition-colors"/>
                     Explain Simplification
                    </>
                 )}
             </Button>
         </div>
       )}

        {(showExplanation || isExplaining) && (
         <Card className="bg-card/50 backdrop-blur-sm border-border/40 shadow-xl mt-8 transition-all duration-500 ease-in-out animate-in fade-in slide-in-from-bottom-5 futuristic-glow-primary">
           <CardHeader className="pb-3 pt-5 px-5">
             <CardTitle className="text-xl font-semibold text-glow-primary flex items-center">
                <BrainCircuit className="mr-3 h-6 w-6" />
                AI Explanation
             </CardTitle>
             <CardDescription className="text-muted-foreground/80 pt-1">Analysis of the text transformation.</CardDescription>
           </CardHeader>
           <CardContent className="px-5 pb-5">
             {isExplaining ? (
               <div className="space-y-4 pt-2">
                 <Skeleton className="h-5 w-full animate-pulse-bg rounded bg-muted/20" />
                 <Skeleton className="h-5 w-5/6 animate-pulse-bg rounded bg-muted/20" />
                 <Skeleton className="h-5 w-4/5 animate-pulse-bg rounded bg-muted/20" />
               </div>
             ) : explanation ? (
                explanation.startsWith("Error:") ? (
                    <div className="flex items-center text-destructive py-2">
                        <AlertTriangle className="mr-2 h-5 w-5" />
                        <span className="text-base">{explanation}</span>
                    </div>
                ) : (
                   <p className="text-base text-foreground/90 whitespace-pre-wrap leading-relaxed">{explanation}</p>
                )
             ) : (
                <div className="flex items-center text-muted-foreground/60 py-2">
                    <AlertTriangle className="mr-2 h-5 w-5" />
                    <span className="text-base">Explanation not available or generation failed.</span>
                </div>
             )}
           </CardContent>
         </Card>
       )}
    </div>
  );
}
