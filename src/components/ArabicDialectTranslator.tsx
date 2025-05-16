
"use client";

import { useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Loader2, Languages, MessageSquareQuote, Repeat } from "lucide-react"; // Removed Sparkles

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
  { value: "Modern Standard Arabic", label: "Arabic (Modern Standard - MSA)" },
  { value: "Egyptian Arabic", label: "Arabic (Egyptian - Masri)" },
  { value: "Sudanese Arabic", label: "Arabic (Sudanese)" },
  { value: "Levantine Arabic (North)", label: "Arabic (Levantine - North: Syrian, Lebanese)" },
  { value: "Levantine Arabic (South)", label: "Arabic (Levantine - South: Palestinian, Jordanian)" },
  { value: "Iraqi Arabic", label: "Arabic (Iraqi - Baghdadi)" },
  { value: "Gulf Arabic (General Khaliji)", label: "Arabic (Gulf - General Khaliji)" },
  { value: "Kuwaiti Arabic", label: "Arabic (Gulf - Kuwaiti)" },
  { value: "Bahraini Arabic", label: "Arabic (Gulf - Bahraini)" },
  { value: "Qatari Arabic", label: "Arabic (Gulf - Qatari)" },
  { value: "Emirati Arabic", label: "Arabic (Gulf - Emirati)" },
  { value: "Omani Arabic", label: "Arabic (Gulf - Omani)" },
  { value: "Najdi Arabic", label: "Arabic (Saudi - Najdi)" },
  { value: "Hejazi Arabic", label: "Arabic (Saudi - Hejazi)" },
  { value: "Yemeni Arabic (Sanaani)", label: "Arabic (Yemeni - Sanaani)" },
  { value: "Yemeni Arabic (Adeni)", label: "Arabic (Yemeni - Adeni)" },
  { value: "Maghrebi Arabic (Moroccan Darija)", label: "Arabic (Maghrebi - Moroccan Darija)" },
  { value: "Maghrebi Arabic (Algerian)", label: "Arabic (Maghrebi - Algerian)" },
  { value: "Maghrebi Arabic (Tunisian)", label: "Arabic (Maghrebi - Tunisian)" },
  { value: "Libyan Arabic", label: "Arabic (Libyan)" },
  { value: "Hassaniya Arabic", label: "Arabic (Hassaniya - Mauritania, W. Sahara)" },
  { value: "Chadian Arabic", label: "Arabic (Chadian)" },
];


const formSchema = z.object({
  inputText: z.string().min(3, {
    message: "Please enter at least 3 characters.",
  }).max(2000, { message: "Text cannot exceed 2000 characters."}),
  sourceDialect: z.string({
    required_error: "Please select the source dialect.",
  }),
  targetDialect: z.string({
    required_error: "Please select the target dialect.",
  }),
}).refine(data => data.sourceDialect !== data.targetDialect, {
  message: "Source and target dialects cannot be the same.",
  path: ["targetDialect"],
});

export function ArabicDialectTranslator() {
  const [isPending, startTransition] = useTransition();
  const [translationResult, setTranslationResult] = useState<TranslateArabicDialectOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      inputText: "",
      sourceDialect: "Egyptian Arabic",
      targetDialect: "Levantine Arabic (North)",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    startTransition(async () => {
      setTranslationResult(null);
      try {
        const result = await translateArabicDialect({
          inputText: values.inputText,
          sourceDialect: values.sourceDialect,
          targetDialect: values.targetDialect,
        });
        setTranslationResult(result);
        toast({
          title: "Dialect Translation Complete",
          description: `Text translated from ${values.sourceDialect} to ${values.targetDialect}.`,
          className: "bg-card border-accent text-card-foreground futuristic-glow-accent",
        });
      } catch (error) {
        console.error("Arabic dialect translation failed:", error);
        toast({
          variant: "destructive",
          title: "Dialect Translation Error",
          description: "Failed to translate between Arabic dialects. The AI might have limitations with the selected pair or the input text. Please try again or with different dialects.",
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
    <div className="w-full max-w-5xl mx-auto flex flex-col items-center space-y-12"> {/* Increased max-w and space */}
      <Card className="w-full bg-card/70 backdrop-blur-lg border-border/50 shadow-xl futuristic-glow-accent transition-all duration-300 hover:shadow-2xl hover:border-accent/70 transform hover:scale-[1.015]">
        <CardHeader className="text-center pb-5 pt-8">
          <div className="flex justify-center items-center mb-3">
              <MessageSquareQuote className="h-14 w-14 text-accent text-glow-accent" /> {/* Larger icon */}
          </div>
          <CardTitle className="text-3xl md:text-4xl font-bold text-glow-accent tracking-tight">
            Arabic Dialect Bridge
          </CardTitle>
          <CardDescription className="text-muted-foreground pt-2 text-md">
            Seamlessly translate text between a wide range of Arabic dialects.
          </CardDescription>
        </CardHeader>
        <CardContent className="px-6 md:px-8 pb-8 pt-5">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="inputText"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-medium text-foreground/90">Text to Translate (in source dialect)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="اكتب النص باللهجة المصدر هنا..."
                        className="min-h-[160px] resize-y bg-input border-input-border focus:border-accent focus:ring-2 focus:ring-accent/60 transition-all duration-200 ease-in-out shadow-inner placeholder:text-muted-foreground/60 futuristic-glow-accent focus:shadow-lg p-4 text-base"
                        {...field}
                        dir="auto"
                      />
                    </FormControl>
                    <FormMessage className="text-destructive/90 pt-1" />
                  </FormItem>
                )}
              />

              <div className="flex flex-col sm:flex-row items-center gap-5">
                <FormField
                  control={form.control}
                  name="sourceDialect"
                  render={({ field }) => (
                    <FormItem className="flex-1 w-full sm:w-auto">
                      <FormLabel className="text-base font-medium text-foreground/90">From (Source Dialect)</FormLabel>
                       <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-input border-input-border focus:border-accent focus:ring-2 focus:ring-accent/60 transition-all duration-200 ease-in-out shadow-sm text-foreground futuristic-glow-accent focus:shadow-md h-12 text-base p-3">
                             <Languages className="mr-2.5 h-5 w-5 text-accent/80"/>
                            <SelectValue placeholder="Select source dialect" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-popover border-border/60 text-popover-foreground max-h-80 backdrop-blur-md">
                          {arabicDialects.map((lang) => (
                            <SelectItem key={`source-${lang.value}`} value={lang.value} className="hover:bg-accent/20 focus:bg-accent/30 py-2.5 px-3 text-sm">
                              {lang.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-destructive/90 pt-1" />
                    </FormItem>
                  )}
                />

                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={swapDialects}
                  className="mt-0 sm:mt-7 text-accent hover:bg-accent/15 futuristic-glow-accent transform hover:scale-110 active:scale-100 transition-transform duration-200 p-2.5"
                  aria-label="Swap dialects"
                >
                  <Repeat className="h-6 w-6" /> {/* Slightly larger icon */}
                </Button>

                <FormField
                  control={form.control}
                  name="targetDialect"
                  render={({ field }) => (
                    <FormItem className="flex-1 w-full sm:w-auto">
                      <FormLabel className="text-base font-medium text-foreground/90">To (Target Dialect)</FormLabel>
                       <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-input border-input-border focus:border-accent focus:ring-2 focus:ring-accent/60 transition-all duration-200 ease-in-out shadow-sm text-foreground futuristic-glow-accent focus:shadow-md h-12 text-base p-3">
                            <Languages className="mr-2.5 h-5 w-5 text-accent/80"/>
                            <SelectValue placeholder="Select target dialect" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-popover border-border/60 text-popover-foreground max-h-80 backdrop-blur-md">
                          {arabicDialects.map((lang) => (
                            <SelectItem key={`target-${lang.value}`} value={lang.value} className="hover:bg-accent/20 focus:bg-accent/30 py-2.5 px-3 text-sm">
                              {lang.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-destructive/90 pt-1" />
                    </FormItem>
                  )}
                />
              </div>


              <Button
                type="submit"
                disabled={isPending}
                className="w-full text-lg py-3.5 bg-accent text-accent-foreground hover:bg-accent/90 transition-all duration-300 ease-in-out transform hover:scale-[1.025] focus:ring-4 focus:ring-accent/50 shadow-xl futuristic-glow-accent active:shadow-lg active:scale-[1.01]"
              >
                {isPending ? (
                  <>
                    <Loader2 className="mr-2.5 h-5 w-5 animate-spin" />
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
        <Card className="w-full bg-card/60 backdrop-blur-md border-border/40 shadow-lg min-h-[180px] futuristic-glow-primary transform hover:scale-[1.01] transition-transform duration-300">
          <CardHeader className="pb-3 pt-5 px-5">
            <CardTitle className="text-xl md:text-2xl font-semibold text-glow-primary">Translated Text (in {form.getValues("targetDialect") || "target dialect"})</CardTitle>
          </CardHeader>
          <CardContent className="pt-3 px-5 pb-5">
            {isPending ? (
              <div className="space-y-4 pt-2">
                <Skeleton className="h-6 w-full animate-pulse-bg rounded bg-muted/25" />
                <Skeleton className="h-6 w-5/6 animate-pulse-bg rounded bg-muted/25" />
                <Skeleton className="h-6 w-3/4 animate-pulse-bg rounded bg-muted/25" />
              </div>
            ) : translationResult?.translatedText ? (
              <p className="text-base md:text-lg text-foreground/95 whitespace-pre-wrap leading-relaxed" dir="auto">{translationResult.translatedText}</p>
            ) : (
              <p className="text-md text-muted-foreground/70 italic">Translation will appear here.</p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
