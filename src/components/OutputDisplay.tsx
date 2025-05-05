"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Copy, Check, AlertCircle } from "lucide-react";
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
    // Reset explanation when result changes
    setExplanation(null);
    setShowExplanation(false);
    setIsExplaining(false);
  }, [result]);

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
    if (!inputText || !targetLanguage) return;
    setIsExplaining(true);
    setShowExplanation(true); // Show the explanation section immediately
    try {
      const explanationResult = await explainSimplification({ text: inputText, language: targetLanguage });
      // Use the simplified text from the explanation result if available, otherwise keep the original result's text
      // This ensures consistency if the explanation flow provides a slightly different simplification
      if (explanationResult.simplifiedText !== result?.simplifiedText) {
         // Optionally update the displayed simplified text here if desired
         // For now, we just use the explanation part
      }
      setExplanation(explanationResult.explanation);
    } catch (error) {
      console.error("Explanation failed:", error);
      setExplanation("Failed to generate explanation.");
      toast({ variant: "destructive", title: "Error", description: "Failed to get explanation." });
    } finally {
      setIsExplaining(false);
    }
  };


  const OutputCard = ({ title, text, copied, onCopy, isLoading }: { title: string; text: string | undefined; copied: boolean; onCopy: () => void; isLoading: boolean }) => (
    <Card className="flex-1 bg-card border border-border/30 shadow-sm transition-all duration-300 ease-in-out min-h-[200px]">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-medium text-foreground">{title}</CardTitle>
        <Button
          variant="ghost"
          size="icon"
          onClick={onCopy}
          disabled={isLoading || !text}
          className="h-7 w-7 text-muted-foreground hover:text-primary transition-colors duration-200"
        >
          {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
          <span className="sr-only">Copy {title}</span>
        </Button>
      </CardHeader>
      <CardContent className="pt-0">
        {isLoading ? (
          <div className="space-y-2 pt-2">
            <Skeleton className="h-4 w-full animate-pulse-bg" />
            <Skeleton className="h-4 w-full animate-pulse-bg" />
            <Skeleton className="h-4 w-3/4 animate-pulse-bg" />
          </div>
        ) : text ? (
          <p className="text-sm text-foreground whitespace-pre-wrap">{text}</p>
        ) : (
          <p className="text-sm text-muted-foreground italic">Output will appear here...</p>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6 mt-8 w-full">
       <div className="flex flex-col md:flex-row gap-6">
         <OutputCard
           title="Simplified Text"
           text={result?.simplifiedText}
           copied={copiedSimplified}
           onCopy={() => handleCopy(result?.simplifiedText || '', 'simplified')}
           isLoading={isLoading}
         />
         <OutputCard
           title={`Translated Text (${targetLanguage})`}
           text={result?.translatedText}
           copied={copiedTranslated}
           onCopy={() => handleCopy(result?.translatedText || '', 'translated')}
           isLoading={isLoading}
         />
       </div>

      {result && (
         <div className="text-center mt-4">
             <Button onClick={handleExplain} variant="outline" disabled={isExplaining || !inputText || !targetLanguage} className="transition-all duration-200 ease-in-out hover:bg-secondary/80">
                 {isExplaining ? (
                    <>
                     <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating Explanation...
                    </>
                 ) : (
                    "Explain Simplification"
                 )}
             </Button>
         </div>
       )}

        {showExplanation && (
         <Card className="bg-card border border-border/30 shadow-sm mt-6 transition-all duration-500 ease-in-out animate-in fade-in slide-in-from-top-5">
           <CardHeader>
             <CardTitle className="text-lg font-medium text-foreground">Explanation</CardTitle>
             <CardDescription>How the AI simplified the text.</CardDescription>
           </CardHeader>
           <CardContent>
             {isExplaining ? (
               <div className="space-y-2">
                 <Skeleton className="h-4 w-full animate-pulse-bg" />
                 <Skeleton className="h-4 w-5/6 animate-pulse-bg" />
                 <Skeleton className="h-4 w-3/4 animate-pulse-bg" />
               </div>
             ) : explanation ? (
               <p className="text-sm text-foreground whitespace-pre-wrap">{explanation}</p>
             ) : (
                <div className="flex items-center text-muted-foreground">
                    <AlertCircle className="mr-2 h-4 w-4" />
                    <span>Explanation could not be generated.</span>
                </div>
             )}
           </CardContent>
         </Card>
       )}
    </div>
  );
}
