"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Copy, Check, AlertTriangle, Loader2, BrainCircuit, Eye, HelpCircle, ListChecks, Languages } from "lucide-react"; // Added HelpCircle, ListChecks, Languages
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { explainSimplification, ExplainSimplificationOutput } from "@/ai/flows/explain-simplification";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

type OutputDisplayProps = {
  result: { simplifiedText: string; translatedText: string } | null;
  isLoading: boolean;
  inputText: string;
  targetLanguage: string;
};

// Shared languages list
const languages = [
  { value: "English", label: "English" },
  { value: "Spanish", label: "Spanish" },
  { value: "French", label: "French" },
  { value: "German", label: "German" },
  { value: "Japanese", label: "Japanese" },
  { value: "Mandarin Chinese", label: "Mandarin Chinese" },
  { value: "Hindi", label: "Hindi" },
  { value: "Portuguese", label: "Portuguese" },
  { value: "Russian", label: "Russian" },
  { value: "Arabic", label: "Arabic (Sudanese)" },
  { value: "Korean", label: "Korean" },
  { value: "Italian", label: "Italian" },
  { value: "Dutch", label: "Dutch" },
  // Add more languages as needed
];

export function OutputDisplay({ result, isLoading, inputText, targetLanguage }: OutputDisplayProps) {
  const [copiedSimplified, setCopiedSimplified] = useState(false);
  const [copiedTranslated, setCopiedTranslated] = useState(false);
  const [explanationOutput, setExplanationOutput] = useState<ExplainSimplificationOutput | null>(null);
  const [isExplaining, setIsExplaining] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [selectedGuidanceLanguage, setSelectedGuidanceLanguage] = useState(targetLanguage);
  const { toast } = useToast();

  useEffect(() => {
    // Reset explanation and guidance language when the main result or its target language changes
    setExplanationOutput(null);
    setShowExplanation(false);
    setIsExplaining(false);
    setSelectedGuidanceLanguage(targetLanguage);
  }, [result, targetLanguage]);


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
        className: "bg-background border-primary futuristic-glow-primary text-foreground"
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

  const fetchExplanation = async (languageToUse: string) => {
    if (!result?.simplifiedText || isLoading) return;

    setIsExplaining(true);
    setShowExplanation(true); 
    // Do not setExplanationOutput(null) here if we want to keep old one while loading new
    
    try {
      const explanationResult = await explainSimplification({ 
        simplifiedText: result.simplifiedText, 
        language: languageToUse 
      });
      setExplanationOutput(explanationResult);
      toast({
        title: `Guidance Generated in ${languageToUse}`,
        description: "AI has provided an explanation and next steps.",
        className: "bg-background border-accent futuristic-glow-accent text-foreground",
      });
    } catch (error) {
      console.error("Explanation/Guidance failed:", error);
      const errorMsg = `Error: Failed to generate guidance in ${languageToUse}. Please try again.`;
      setExplanationOutput({ scenarioExplanation: errorMsg, nextSteps: "" });
      toast({ 
        variant: "destructive", 
        title: "Guidance Error", 
        description: `Could not generate explanation in ${languageToUse}.`,
        className: "bg-destructive border-destructive/50 text-destructive-foreground"
      });
    } finally {
      setIsExplaining(false);
    }
  };
  
  const handleExplainButtonClick = () => {
    fetchExplanation(selectedGuidanceLanguage);
  };

  const handleGuidanceLanguageChange = (newLang: string) => {
    setSelectedGuidanceLanguage(newLang);
    // If explanation is already visible and we are not currently explaining, re-fetch in the new language.
    if (showExplanation && result?.simplifiedText && !isExplaining) {
      fetchExplanation(newLang);
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
           cardGlowType="primary"
         />
         <OutputCard
           title={`Translated (${targetLanguage})`}
           text={result?.translatedText}
           copied={copiedTranslated}
           onCopy={() => result?.translatedText && handleCopy(result.translatedText, 'translated')}
           isLoadingCard={isLoading && !result}
           cardGlowType="accent"
         />
       </div>

      {result && !isLoading && (
         <div className="text-center pt-4">
             <Button 
                onClick={handleExplainButtonClick}
                variant="outline" 
                disabled={isExplaining || !result?.simplifiedText} 
                className="transition-all duration-300 ease-in-out hover:bg-secondary/20 border-primary/50 text-primary hover:text-primary hover:border-primary futuristic-glow-primary hover:shadow-md group px-6 py-3 text-base"
              >
                 {isExplaining && explanationOutput === null ? ( // Initial loading state
                    <>
                     <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Analyzing Situation...
                    </>
                 ) : (
                     <>
                     <HelpCircle className="mr-2 h-5 w-5 text-primary group-hover:text-primary transition-colors"/>
                     Explain Situation & Get Advice
                    </>
                 )}
             </Button>
         </div>
       )}

        {(showExplanation || isExplaining) && (
         <Card className="bg-card/50 backdrop-blur-sm border-border/40 shadow-xl mt-8 transition-all duration-500 ease-in-out animate-in fade-in slide-in-from-bottom-5 futuristic-glow-primary">
           <CardHeader className="pb-3 pt-5 px-5">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
              <div className="mb-4 sm:mb-0">
                <CardTitle className="text-xl font-semibold text-glow-primary flex items-center">
                    <BrainCircuit className="mr-3 h-6 w-6" />
                    AI Guidance
                </CardTitle>
                <CardDescription className="text-muted-foreground/80 pt-1">Understanding the situation and suggested next steps.</CardDescription>
              </div>
              <div className="w-full sm:w-auto sm:min-w-[200px]">
                <Label htmlFor="guidance-language" className="text-xs text-muted-foreground mb-1 block">Guidance Language:</Label>
                <Select
                  value={selectedGuidanceLanguage}
                  onValueChange={handleGuidanceLanguageChange}
                  disabled={isExplaining}
                  name="guidance-language"
                >
                  <SelectTrigger className="w-full bg-input border-border/70 focus:border-primary focus:ring-1 focus:ring-primary/30 text-sm">
                    <Languages className="mr-2 h-4 w-4 text-primary/70" />
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border/70 text-foreground">
                    {languages.map((lang) => (
                      <SelectItem key={`guidance-${lang.value}`} value={lang.value} className="hover:bg-primary/20 focus:bg-primary/30 text-sm">
                        {lang.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
           </CardHeader>
           <CardContent className="px-5 pb-5 space-y-4">
             {isExplaining ? (
               <>
                <div>
                  <div className="flex items-center mb-2">
                    <HelpCircle className="mr-2 h-5 w-5 text-primary/80"/>
                    <h4 className="text-lg font-medium text-foreground/90">Scenario Explanation</h4>
                  </div>
                  <Skeleton className="h-5 w-full animate-pulse-bg rounded bg-muted/20 mb-1" />
                  <Skeleton className="h-5 w-5/6 animate-pulse-bg rounded bg-muted/20" />
                </div>
                <div>
                  <div className="flex items-center mb-2">
                    <ListChecks className="mr-2 h-5 w-5 text-accent/80"/>
                    <h4 className="text-lg font-medium text-foreground/90">Suggested Next Steps</h4>
                  </div>
                  <Skeleton className="h-5 w-full animate-pulse-bg rounded bg-muted/20 mb-1" />
                  <Skeleton className="h-5 w-3/4 animate-pulse-bg rounded bg-muted/20" />
                </div>
               </>
             ) : explanationOutput ? (
                <>
                  <div>
                    <div className="flex items-center mb-2">
                      <HelpCircle className="mr-2 h-5 w-5 text-primary/80"/>
                      <h4 className="text-lg font-medium text-foreground/90">Scenario Explanation (in {selectedGuidanceLanguage})</h4>
                    </div>
                    {explanationOutput.scenarioExplanation.startsWith("Error:") ? (
                        <div className="flex items-center text-destructive py-2">
                            <AlertTriangle className="mr-2 h-5 w-5" />
                            <span className="text-base">{explanationOutput.scenarioExplanation}</span>
                        </div>
                    ) : (
                       <p className="text-base text-foreground/90 whitespace-pre-wrap leading-relaxed">{explanationOutput.scenarioExplanation}</p>
                    )}
                  </div>
                  {explanationOutput.nextSteps && (
                    <div>
                      <div className="flex items-center mb-2">
                        <ListChecks className="mr-2 h-5 w-5 text-accent/80"/>
                        <h4 className="text-lg font-medium text-foreground/90">Suggested Next Steps (in {selectedGuidanceLanguage})</h4>
                      </div>
                      <p className="text-base text-foreground/90 whitespace-pre-wrap leading-relaxed">{explanationOutput.nextSteps}</p>
                    </div>
                  )}
                </>
             ) : (
                <div className="flex items-center text-muted-foreground/60 py-2">
                    <AlertTriangle className="mr-2 h-5 w-5" />
                    <span className="text-base">Guidance not available or generation failed. Click button above to try.</span>
                </div>
             )}
           </CardContent>
         </Card>
       )}
    </div>
  );
}
