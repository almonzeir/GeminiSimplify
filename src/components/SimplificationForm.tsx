
"use client";

import { useState, useTransition, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Loader2, Sparkles, Languages, Wand2 } from "lucide-react";

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
import { simplifyAndTranslate } from "@/ai/flows/simplify-and-translate";
import { suggestInputText } from "@/ai/flows/suggest-input-text";
import { useToast } from "@/hooks/use-toast";
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

const formSchema = z.object({
  text: z.string().min(10, {
    message: "Please enter at least 10 characters.",
  }).max(5000, { message: "Text cannot exceed 5000 characters."}),
  targetLanguage: z.string({
    required_error: "Please select a language.",
  }),
});

type SimplificationFormProps = {
  onResult: (result: SimplificationResult | null, text?: string, lang?: string) => void;
  initialText?: string;
  initialLanguage?: string;
};

export function SimplificationForm({ onResult, initialText = "", initialLanguage = "English" }: SimplificationFormProps) {
  const [isPending, startTransition] = useTransition();
  const [isSuggesting, startSuggestTransition] = useTransition();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      text: initialText,
      targetLanguage: initialLanguage,
    },
  });

  useEffect(() => {
    form.reset({
      text: initialText,
      targetLanguage: initialLanguage,
    });
  }, [initialText, initialLanguage, form]);


  async function onSubmit(values: z.infer<typeof formSchema>) {
    startTransition(async () => {
      onResult(null, values.text, values.targetLanguage);
      try {
        const result = await simplifyAndTranslate(values);
        onResult(result, values.text, values.targetLanguage);
        toast({
          title: "Process Complete",
          description: "Text successfully simplified and translated.",
          className: "bg-card border-primary text-card-foreground futuristic-glow-primary",
        });
      } catch (error) {
        console.error("Simplification failed:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to simplify and translate text. Please try again.",
          className: "bg-destructive border-destructive/50 text-destructive-foreground"
        });
        onResult(null, values.text, values.targetLanguage);
      }
    });
  }

  async function handleSuggestText() {
    startSuggestTransition(async () => {
      try {
        const { suggestedText } = await suggestInputText();
        form.setValue("text", suggestedText);
        form.trigger("text");
        toast({
          title: "Suggestion Loaded",
          description: "Example text populated.",
           className: "bg-card border-accent text-card-foreground futuristic-glow-accent",
        });
      } catch (error) {
        console.error("Suggestion failed:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load suggested text.",
          className: "bg-destructive border-destructive/50 text-destructive-foreground"
        });
      }
    });
  }

  return (
    <Card className="w-full bg-card/70 backdrop-blur-lg border-border/50 shadow-xl futuristic-glow-primary transition-all duration-300 hover:shadow-2xl hover:border-primary/70 transform hover:scale-[1.015]">
      <CardHeader className="text-center pb-5 pt-8">
        <div className="flex justify-center items-center mb-3">
            <Wand2 className="h-12 w-12 text-primary text-glow-primary" />
        </div>
        <CardTitle className="text-3xl md:text-4xl font-bold text-glow-primary tracking-tight">
          Simplify & Translate
        </CardTitle>
        <CardDescription className="text-muted-foreground pt-2 text-md">
            Input your text, choose a language, and witness the AI transformation.
        </CardDescription>
      </CardHeader>
      <CardContent className="px-6 md:px-8 pb-8 pt-5">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="text"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-medium text-foreground/90">Your Text</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Paste or type complex text here..."
                      className="min-h-[180px] resize-y bg-input border-input-border focus:border-primary focus:ring-2 focus:ring-primary/60 transition-all duration-200 ease-in-out shadow-inner placeholder:text-muted-foreground/60 futuristic-glow-primary focus:shadow-lg p-4 text-base"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-destructive/90 pt-1" />
                </FormItem>
              )}
            />

            <div className="flex flex-col sm:flex-row sm:items-end gap-5">
              <FormField
                control={form.control}
                name="targetLanguage"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel className="text-base font-medium text-foreground/90">Translate Simplified Text To</FormLabel>
                     <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-input border-input-border focus:border-primary focus:ring-2 focus:ring-primary/60 transition-all duration-200 ease-in-out shadow-sm text-foreground futuristic-glow-primary focus:shadow-md h-12 text-base p-3">
                           <Languages className="mr-2.5 h-5 w-5 text-primary/80"/>
                          <SelectValue placeholder="Select language" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-popover border-border/60 text-popover-foreground max-h-80 backdrop-blur-md">
                        {languages.map((lang) => (
                          <SelectItem key={lang.value} value={lang.value} className="hover:bg-primary/20 focus:bg-primary/30 py-2.5 px-3 text-sm">
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
                variant="outline"
                onClick={handleSuggestText}
                disabled={isSuggesting}
                className="w-full sm:w-auto transition-all duration-300 ease-in-out border-accent text-accent hover:bg-accent/15 hover:text-accent-foreground hover:border-accent/80 futuristic-glow-accent shadow-md transform hover:scale-105 h-12 px-6 text-base"
              >
                {isSuggesting ? (
                  <Loader2 className="h-5 w-5 animate-spin mr-2.5" />
                ) : (
                  <Sparkles className="h-5 w-5 mr-2.5" />
                )}
                Suggest Text
              </Button>
            </div>

            <Button
              type="submit"
              disabled={isPending}
              className="w-full text-lg py-3.5 bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300 ease-in-out transform hover:scale-[1.025] focus:ring-4 focus:ring-primary/50 shadow-xl futuristic-glow-primary active:shadow-lg active:scale-[1.01]"
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2.5 h-5 w-5 animate-spin" />
                  Processing...
                </>
              ) : (
                "Simplify & Translate"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
