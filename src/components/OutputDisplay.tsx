
"use client";

import React, { useState, useEffect } from "react"; // Added React to the import
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Copy, Check, AlertTriangle, Loader2, BrainCircuit, Eye, HelpCircle, ListChecks, Languages, Wand2 } from "lucide-react";
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
import type { SimplificationResult } from "@/lib/types";


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
  { value: "Korean", label: "Korean" },
  { value: "Italian", label: "Italian" },
  { value: "Dutch", label: "Dutch" },
  { value: "Turkish", label: "Turkish" },
  { value: "Polish", label: "Polish" },
  { value: "Swedish", label: "Swedish" },
  { value: "Arabic (Modern Standard)", label: "Arabic (Modern Standard)" },
  { value: "Arabic (Egyptian)", label: "Arabic (Egyptian)" },
  { value: "Arabic (Levantine)", label: "Arabic (Levantine)" },
  { value: "Arabic (Gulf)", label: "Arabic (Gulf)" },
  { value: "Arabic (Iraqi)", label: "Arabic (Iraqi)" },
  { value: "Arabic (Maghrebi)", label: "Arabic (Maghrebi - Darija)" },
  { value: "Arabic (Sudanese)", label: "Arabic (Sudanese)" },
  { value: "Arabic (Yemeni)", label: "Arabic (Yemeni)" },
  { value: "Arabic (Najdi)", label: "Arabic (Najdi)" },
  { value: "Arabic (Hejazi)", label: "Arabic (Hejazi)" },
  { value: "Arabic (Libyan)", label: "Arabic (Libyan)" },
  { value: "Arabic (Hassaniya)", label: "Arabic (Hassaniya)" },
  { value: "Urdu", label: "Urdu" },
  { value: "Bengali", label: "Bengali" },
  { value: "Farsi (Persian)", label: "Farsi (Persian)" },
  { value: "Hebrew", label: "Hebrew" },
  { value: "Greek", label: "Greek" },
  { value: "Czech", label: "Czech" },
  { value: "Hungarian", label: "Hungarian" },
  { value: "Finnish", label: "Finnish" },
  { value: "Danish", label: "Danish" },
  { value: "Norwegian", label: "Norwegian" },
  { value: "Indonesian", label: "Indonesian" },
  { value: "Malay", label: "Malay" },
  { value: "Filipino (Tagalog)", label: "Filipino (Tagalog)" },
  { value: "Vietnamese", label: "Vietnamese" },
  { value: "Thai", label: "Thai" },
  { value: "Swahili", label: "Swahili" },
];

type OutputDisplayProps = {
  result: SimplificationResult | null;
  isLoading: boolean;
  inputText: string;
  targetLanguage: string;
};

export function OutputDisplay({ result, isLoading, inputText, targetLanguage }: OutputDisplayProps) {
  const [copiedSimplified, setCopiedSimplified] = useState(false);
  const [copiedTranslated, setCopiedTranslated] = useState(false);
  const [explanationOutput, setExplanationOutput] = useState<ExplainSimplificationOutput | null>(null);
  const [isExplaining, setIsExplaining] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [selectedGuidanceLanguage, setSelectedGuidanceLanguage] = useState(targetLanguage);
  const { toast } = useToast();

  useEffect(() => {
    setExplanationOutput(null);
    setShowExplanation(false);
    setIsExplaining(false);

    const targetLanguageOption = languages.find(l => l.value === targetLanguage);
    if (targetLanguageOption) {
      setSelectedGuidanceLanguage(targetLanguageOption.value);
    } else if (targetLanguage.toLowerCase().includes("arabic")) {
       const specificArabicMatch = languages.find(l => l.value.toLowerCase() === targetLanguage.toLowerCase() && l.value.startsWith("Arabic ("));
       if (specificArabicMatch) {
         setSelectedGuidanceLanguage(specificArabicMatch.value);
       } else {
         setSelectedGuidanceLanguage("Arabic (Modern Standard)");
       }
    } else {
      setSelectedGuidanceLanguage("English");
    }
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
        className: "bg-card border-primary text-card-foreground futuristic-glow-primary",
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
    setExplanationOutput(null);

    try {
      const explanationResult = await explainSimplification({
        simplifiedText: result.simplifiedText,
        language: languageToUse
      });
      setExplanationOutput(explanationResult);
      toast({
        title: `Guidance Generated in ${languageToUse}`,
        description: "AI has provided an explanation and next steps.",
        className: "bg-card border-accent text-card-foreground futuristic-glow-accent",
      });
    } catch (error) {
      console.error("Explanation/Guidance failed:", error);
      const errorMsg = `Error: Failed to generate guidance in ${languageToUse}. The AI may not support this language for explanations, or there was a temporary issue. Please try English or another major language.`;
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
    if (showExplanation && result?.simplifiedText && !isExplaining) {
      fetchExplanation(newLang);
    }
  };


  const OutputCard = ({ title, text, copied, onCopy, isLoadingCard, cardGlowType, cardIcon }: { title: string; text: string | undefined; copied: boolean; onCopy: () => void; isLoadingCard: boolean; cardGlowType: 'primary' | 'accent'; cardIcon: React.ReactNode }) => (
    <Card className={`flex-1 bg-card/60 backdrop-blur-lg border-border/50 shadow-xl transition-all duration-300 ease-in-out min-h-[240px] flex flex-col hover:border-${cardGlowType}/70 ${cardGlowType === 'primary' ? 'futuristic-glow-primary' : 'futuristic-glow-accent'} hover:shadow-2xl transform hover:scale-[1.025]`}>
      <CardHeader className="flex flex-row items-center justify-between pb-3 pt-5 px-5">
        <div className="flex items-center">
          {React.cloneElement(cardIcon as React.ReactElement, { className: `h-7 w-7 ${cardGlowType === 'primary' ? 'text-primary' : 'text-accent'}` })}
          <CardTitle className={`text-xl md:text-2xl font-semibold ml-2.5 ${cardGlowType === 'primary' ? 'text-glow-primary' : 'text-glow-accent'}`}>{title}</CardTitle>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onCopy}
          disabled={isLoadingCard || !text}
          className={`h-10 w-10 text-muted-foreground hover:text-${cardGlowType} transition-colors duration-200 rounded-full ${cardGlowType === 'primary' ? 'hover:futuristic-glow-primary' : 'hover:futuristic-glow-accent'} active:scale-90`}
          aria-label={`Copy ${title}`}
        >
          {copied ? <Check className={`h-5 w-5 text-green-400`} /> : <Copy className="h-5 w-5" />}
        </Button>
      </CardHeader>
      <CardContent className="pt-2 px-5 pb-5 flex-1">
        {isLoadingCard ? (
          <div className="space-y-3 pt-2">
            <Skeleton className="h-6 w-full animate-pulse-bg rounded bg-muted/25" />
            <Skeleton className="h-6 w-5/6 animate-pulse-bg rounded bg-muted/25" />
            <Skeleton className="h-6 w-4/5 animate-pulse-bg rounded bg-muted/25" />
          </div>
        ) : text ? (
          <p className="text-base md:text-lg text-foreground/95 whitespace-pre-wrap leading-relaxed" dir="auto">{text}</p>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center opacity-60">
            <Eye className="h-14 w-14 text-muted-foreground/40 mb-3" />
            <p className="text-md text-muted-foreground/60 italic">Output will appear here...</p>
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-10 mt-12 w-full max-w-6xl"> {/* Increased max-width */}
       <div className="grid md:grid-cols-2 gap-8 md:gap-10">
         <OutputCard
           title="Simplified Text"
           text={result?.simplifiedText}
           copied={copiedSimplified}
           onCopy={() => result?.simplifiedText && handleCopy(result.simplifiedText, 'simplified')}
           isLoadingCard={isLoading && !result}
           cardGlowType="primary"
           cardIcon={<Wand2 />}
         />
         <OutputCard
           title={`Translated (${targetLanguage})`}
           text={result?.translatedText}
           copied={copiedTranslated}
           onCopy={() => result?.translatedText && handleCopy(result.translatedText, 'translated')}
           isLoadingCard={isLoading && !result}
           cardGlowType="accent"
           cardIcon={<Languages />}
         />
       </div>

      {result && !isLoading && (
         <div className="text-center pt-6 scroll-animate" style={{ animationDelay: '0.2s' }}>
             <Button
                onClick={handleExplainButtonClick}
                variant="outline"
                disabled={isExplaining || !result?.simplifiedText}
                className="transition-all duration-300 ease-in-out hover:bg-secondary/20 border-secondary text-secondary hover:text-secondary-foreground hover:border-secondary/80 futuristic-glow-secondary hover:shadow-lg group px-8 py-3.5 text-base md:text-lg transform hover:scale-105"
              >
                 {isExplaining && explanationOutput === null ? (
                    <>
                     <Loader2 className="mr-2.5 h-5 w-5 animate-spin" /> Analyzing Situation...
                    </>
                 ) : (
                     <>
                     <BrainCircuit className="mr-2.5 h-5 w-5 text-secondary group-hover:text-secondary-foreground transition-colors"/>
                     Explain Situation & Get Advice
                    </>
                 )}
             </Button>
         </div>
       )}

        {(showExplanation || isExplaining) && (
         <Card className="bg-card/50 backdrop-blur-lg border-border/50 shadow-xl mt-10 transition-all duration-500 ease-in-out animate-in fade-in slide-in-from-bottom-8 futuristic-glow-secondary transform hover:scale-[1.015]">
           <CardHeader className="pb-4 pt-6 px-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex-grow">
                <CardTitle className="text-xl md:text-2xl font-semibold text-glow-secondary flex items-center">
                    <BrainCircuit className="mr-3 h-7 w-7 text-secondary" />
                    AI Guidance
                </CardTitle>
                <CardDescription className="text-muted-foreground/80 pt-1.5 text-sm md:text-base">Understanding the situation and suggested next steps.</CardDescription>
              </div>
              <div className="w-full sm:w-auto sm:min-w-[240px] pt-2 sm:pt-0">
                <Label htmlFor="guidance-language" className="text-sm font-medium text-muted-foreground mb-1.5 block">Guidance Language:</Label>
                <Select
                  value={selectedGuidanceLanguage}
                  onValueChange={handleGuidanceLanguageChange}
                  disabled={isExplaining}
                  name="guidance-language"
                >
                  <SelectTrigger className="w-full bg-input border-input-border focus:border-secondary focus:ring-1 focus:ring-secondary/40 text-sm futuristic-glow-secondary h-11 p-3">
                    <Languages className="mr-2 h-4 w-4 text-secondary/80" />
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border/60 text-popover-foreground max-h-72 backdrop-blur-md">
                    {languages.map((lang) => (
                      <SelectItem key={`guidance-${lang.value}`} value={lang.value} className="hover:bg-secondary/20 focus:bg-secondary/30 text-sm py-2 px-3">
                        {lang.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
           </CardHeader>
           <CardContent className="px-6 pb-6 space-y-6 pt-4">
             {isExplaining && explanationOutput === null ? (
               <>
                <div>
                  <div className="flex items-center mb-2.5">
                    <HelpCircle className="mr-2.5 h-5 w-5 text-secondary/80"/>
                    <h4 className="text-lg font-medium text-foreground/95">Scenario Explanation (in {selectedGuidanceLanguage})</h4>
                  </div>
                  <div className="space-y-2.5">
                    <Skeleton className="h-5 w-full animate-pulse-bg rounded bg-muted/25" />
                    <Skeleton className="h-5 w-11/12 animate-pulse-bg rounded bg-muted/25" />
                    <Skeleton className="h-5 w-5/6 animate-pulse-bg rounded bg-muted/25" />
                  </div>
                </div>
                <div>
                  <div className="flex items-center mb-2.5">
                    <ListChecks className="mr-2.5 h-5 w-5 text-secondary/80"/>
                    <h4 className="text-lg font-medium text-foreground/95">Suggested Next Steps (in {selectedGuidanceLanguage})</h4>
                  </div>
                   <div className="space-y-2.5">
                    <Skeleton className="h-5 w-full animate-pulse-bg rounded bg-muted/25" />
                    <Skeleton className="h-5 w-5/6 animate-pulse-bg rounded bg-muted/25" />
                  </div>
                </div>
               </>
             ) : explanationOutput ? (
                <>
                  <div>
                    <div className="flex items-center mb-2.5">
                      <HelpCircle className="mr-2.5 h-5 w-5 text-secondary/80"/>
                      <h4 className="text-lg font-medium text-foreground/95">Scenario Explanation (in {selectedGuidanceLanguage})</h4>
                    </div>
                    {explanationOutput.scenarioExplanation.startsWith("Error:") ? (
                        <div className="flex items-start text-destructive py-2.5 px-3 bg-destructive/10 rounded-md border border-destructive/30">
                            <AlertTriangle className="mr-2.5 h-5 w-5 flex-shrink-0 mt-0.5" />
                            <span className="text-base">{explanationOutput.scenarioExplanation}</span>
                        </div>
                    ) : (
                       <p className="text-base md:text-lg text-foreground/90 whitespace-pre-wrap leading-relaxed p-3 bg-muted/10 rounded-md border border-border/30" dir="auto">{explanationOutput.scenarioExplanation}</p>
                    )}
                  </div>
                  {explanationOutput.nextSteps && !explanationOutput.scenarioExplanation.startsWith("Error:") && (
                    <div>
                      <div className="flex items-center mb-2.5">
                        <ListChecks className="mr-2.5 h-5 w-5 text-secondary/80"/>
                        <h4 className="text-lg font-medium text-foreground/95">Suggested Next Steps (in {selectedGuidanceLanguage})</h4>
                      </div>
                      <p className="text-base md:text-lg text-foreground/90 whitespace-pre-wrap leading-relaxed p-3 bg-muted/10 rounded-md border border-border/30" dir="auto">{explanationOutput.nextSteps}</p>
                    </div>
                  )}
                </>
             ) : (
                <div className="flex items-center text-muted-foreground/70 py-3 px-3 bg-muted/10 rounded-md border border-border/30">
                    <AlertTriangle className="mr-2.5 h-5 w-5" />
                    <span className="text-base">Click "Explain Situation & Get Advice" to generate guidance.</span>
                </div>
             )}
           </CardContent>
         </Card>
       )}
    </div>
  );
}
