
"use client";

import { useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Loader2, Sparkles, Languages, MessageSquareQuote, Repeat } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { translateArabicDialect, TranslateArabicDialectOutput } from "@/ai/flows/translate-arabic-dialect";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

const arabicDialects = [
  { value: "Modern Standard Arabic", label: "Arabic (Modern Standard)" },
  { value: "Egyptian Arabic", label: "Arabic (Egyptian)" },
  { value: "Levantine Arabic", label: "Arabic (Levantine - Syrian, Lebanese, Palestinian, Jordanian)" },
  { value: "Gulf Arabic", label: "Arabic (Gulf - Khaliji)" },
  { value: "Iraqi Arabic", label: "Arabic (Iraqi)" },
  { value: "Maghrebi Arabic", label: "Arabic (Maghrebi - Moroccan, Algerian, Tunisian, Libyan)" },
  { value: "Sudanese Arabic", label: "Arabic (Sudanese)" },
  { value: "Yemeni Arabic", label: "Arabic (Yemeni)" },
  { value: "Najdi Arabic", label: "Arabic (Najdi)" },
  { value: "Hejazi Arabic", label: "Arabic (Hejazi)" },
  // Add more dialects as needed
];

const formSchema = z.object({
  inputText: z.string().min(5, {
    message: "Please enter at least 5 characters.",
  }).max(2000, { message: "Text cannot exceed 2000 characters."}),
  sourceDialect: z.string({
    required_error: "Please select the source dialect.",
  }),
  targetDialect: z.string({
    required_error: "Please select the target dialect.",
  }),
}).refine(data => data.sourceDialect !== data.targetDialect, {
  message: "Source and target dialects cannot be the same.",
  path: ["targetDialect"], // Point error to targetDialect field
});

export function ArabicDialectTranslator() {
  const [isPending, startTransition] = useTransition();
  const [translationResult, setTranslationResult] = useState<TranslateArabicDialectOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      inputText: "",
      sourceDialect: "Egyptian Arabic", // Default source
      targetDialect: "Levantine Arabic", // Default target
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    startTransition(async () => {
      setTranslationResult(null); // Clear previous results while loading
      try {
        const result = await translateArabicDialect({
          inputText: values.inputText,
          sourceDialect: values.sourceDialect,
          targetDialect: values.targetDialect,
        });
        setTranslationResult(result);
        toast({
          title: "Translation Complete",
          description: `Text translated from ${values.sourceDialect} to ${values.targetDialect}.`,
          className: "bg-background border-accent text-foreground futuristic-glow-accent",
        });
      } catch (error) {
        console.error("Arabic dialect translation failed:", error);
        toast({
          variant: "destructive",
          title: "Translation Error",
          description: "Failed to translate between Arabic dialects. Please try again.",
          className: "bg-destructive border-destructive/50 text-destructive-foreground"
        });
        setTranslationResult(null); 
      }
    });
  }
  
  const swapDialects = () => {
    const currentSource = form.getValues("sourceDialect");
    const currentTarget = form.getValues("targetDialect");
    form.setValue("sourceDialect", currentTarget);
    form.setValue("targetDialect", currentSource);
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center space-y-10">
      <Card className="w-full bg-card/70 backdrop-blur-sm border-border/50 shadow-xl futuristic-glow-accent transition-all duration-300 hover:shadow-2xl hover:border-accent/70 transform hover:scale-[1.01]">
        <CardHeader className="text-center pb-4 pt-6">
          <div className="flex justify-center items-center mb-2">
              <MessageSquareQuote className="h-12 w-12 text-accent text-glow-accent" /> {/* Increased icon size */}
          </div>
          <CardTitle className="text-3xl font-bold text-glow-accent tracking-tight">
            Arabic Dialect Bridge
          </CardTitle>
          <CardDescription className="text-muted-foreground pt-1 text-sm">
            Translate text between various Arabic dialects with ease.
          </CardDescription>
        </CardHeader>
        <CardContent className="px-6 pb-8 pt-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="inputText"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-foreground/80">Text to Translate (in source dialect)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="اكتب النص باللهجة المصدر هنا..."
                        className="min-h-[140px] resize-y bg-input border-border/70 focus:border-accent focus:ring-2 focus:ring-accent/50 transition-all duration-200 ease-in-out shadow-inner placeholder:text-muted-foreground/60 futuristic-glow-accent focus:shadow-md"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-destructive/80" />
                  </FormItem>
                )}
              />

              <div className="flex flex-col sm:flex-row items-center gap-4">
                <FormField
                  control={form.control}
                  name="sourceDialect"
                  render={({ field }) => (
                    <FormItem className="flex-1 w-full sm:w-auto">
                      <FormLabel className="text-sm font-medium text-foreground/80">From (Source Dialect)</FormLabel>
                       <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-input border-border/70 focus:border-accent focus:ring-2 focus:ring-accent/50 transition-all duration-200 ease-in-out shadow-sm text-foreground futuristic-glow-accent focus:shadow-md">
                             <Languages className="mr-2 h-4 w-4 text-accent/70"/>
                            <SelectValue placeholder="Select source dialect" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-popover border-border/70 text-foreground max-h-60">
                          {arabicDialects.map((lang) => (
                            <SelectItem key={`source-${lang.value}`} value={lang.value} className="hover:bg-accent/20 focus:bg-accent/30">
                              {lang.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-destructive/80" />
                    </FormItem>
                  )}
                />

                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={swapDialects}
                  className="mt-0 sm:mt-6 text-accent hover:bg-accent/10 futuristic-glow-accent transform hover:scale-110 active:scale-100 transition-transform duration-200"
                  aria-label="Swap dialects"
                >
                  <Repeat className="h-5 w-5" />
                </Button>

                <FormField
                  control={form.control}
                  name="targetDialect"
                  render={({ field }) => (
                    <FormItem className="flex-1 w-full sm:w-auto">
                      <FormLabel className="text-sm font-medium text-foreground/80">To (Target Dialect)</FormLabel>
                       <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-input border-border/70 focus:border-accent focus:ring-2 focus:ring-accent/50 transition-all duration-200 ease-in-out shadow-sm text-foreground futuristic-glow-accent focus:shadow-md">
                            <Languages className="mr-2 h-4 w-4 text-accent/70"/>
                            <SelectValue placeholder="Select target dialect" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-popover border-border/70 text-foreground max-h-60">
                          {arabicDialects.map((lang) => (
                            <SelectItem key={`target-${lang.value}`} value={lang.value} className="hover:bg-accent/20 focus:bg-accent/30">
                              {lang.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-destructive/80" />
                    </FormItem>
                  )}
                />
              </div>
              

              <Button
                type="submit"
                disabled={isPending}
                className="w-full text-lg py-3 bg-accent text-accent-foreground hover:bg-accent/90 transition-all duration-300 ease-in-out transform hover:scale-[1.02] focus:ring-4 focus:ring-accent/40 shadow-lg futuristic-glow-accent active:shadow-sm active:scale-[1.00]"
              >
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Translating Dialect...
                  </>
                ) : (
                  "Translate Dialect"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {(isPending || translationResult) && (
        <Card className="w-full bg-card/60 backdrop-blur-sm border-border/40 shadow-lg min-h-[150px] futuristic-glow-primary transform hover:scale-[1.01] transition-transform duration-300">
          <CardHeader className="pb-2 pt-4 px-4">
            <CardTitle className="text-xl font-semibold text-glow-primary">Translated Text (in {form.getValues("targetDialect")})</CardTitle>
          </CardHeader>
          <CardContent className="pt-2 px-4 pb-4">
            {isPending ? (
              <div className="space-y-3 pt-2">
                <Skeleton className="h-5 w-full animate-pulse-bg rounded bg-muted/20" />
                <Skeleton className="h-5 w-5/6 animate-pulse-bg rounded bg-muted/20" />
                <Skeleton className="h-5 w-3/4 animate-pulse-bg rounded bg-muted/20" />
              </div>
            ) : translationResult?.translatedText ? (
              <p className="text-base text-foreground/90 whitespace-pre-wrap leading-relaxed">{translationResult.translatedText}</p>
            ) : (
              <p className="text-sm text-muted-foreground/70 italic">Translation will appear here.</p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
