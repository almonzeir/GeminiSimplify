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

// Shared languages list - also used in OutputDisplay.tsx, consider moving to a shared constants file if app grows
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
  { value: "Turkish", label: "Turkish" },
  { value: "Polish", label: "Polish" },
  { value: "Swedish", label: "Swedish" },
  { value: "Vietnamese", label: "Vietnamese" },
  { value: "Thai", label: "Thai" },
  { value: "Indonesian", label: "Indonesian" },
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
        onResult(result, values.text, values.targetLanguage); // Pass text and lang along with result
        toast({
          title: "Process Complete",
          description: "Text successfully simplified and translated.",
          className: "bg-background border-primary futuristic-glow-primary text-foreground",
        });
      } catch (error) {
        console.error("Simplification failed:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to simplify and translate text. Please try again.",
          className: "bg-destructive border-destructive/50 text-destructive-foreground"
        });
        onResult(null, values.text, values.targetLanguage); // Clear result on error but keep text and lang
      }
    });
  }

  async function handleSuggestText() {
    startSuggestTransition(async () => {
      try {
        const { suggestedText } = await suggestInputText();
        form.setValue("text", suggestedText);
        form.trigger("text"); // Manually trigger validation for the field
        toast({
          title: "Suggestion Loaded",
          description: "Example text populated.",
           className: "bg-background border-accent futuristic-glow-accent text-foreground", // Use accent color
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
    <Card className="w-full bg-card/70 backdrop-blur-sm border-border/50 shadow-xl futuristic-glow-primary transition-all duration-300 hover:shadow-2xl hover:border-primary/70">
      <CardHeader className="text-center pb-4 pt-6">
        <div className="flex justify-center items-center mb-2">
            <Wand2 className="h-8 w-8 text-primary text-glow-primary" />
        </div>
        <CardTitle className="text-3xl font-bold text-glow-primary tracking-tight">
          Simplify & Translate
        </CardTitle>
        <CardDescription className="text-muted-foreground pt-1 text-sm">
            Input your text, choose a language, and witness the AI transformation.
        </CardDescription>
      </CardHeader>
      <CardContent className="px-6 pb-8 pt-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="text"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-foreground/80">Your Text</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Paste or type complex text here..."
                      className="min-h-[160px] resize-y bg-input border-border/70 focus:border-primary focus:ring-2 focus:ring-primary/50 transition-all duration-200 ease-in-out shadow-inner placeholder:text-muted-foreground/60 futuristic-glow-primary focus:shadow-md"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-destructive/80" />
                </FormItem>
              )}
            />

            <div className="flex flex-col sm:flex-row sm:items-end gap-4">
              <FormField
                control={form.control}
                name="targetLanguage"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel className="text-sm font-medium text-foreground/80">Target Language</FormLabel>
                     <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-input border-border/70 focus:border-primary focus:ring-2 focus:ring-primary/50 transition-all duration-200 ease-in-out shadow-sm text-foreground futuristic-glow-primary focus:shadow-md">
                           <Languages className="mr-2 h-4 w-4 text-primary/70"/>
                          <SelectValue placeholder="Select language" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-popover border-border/70 text-foreground">
                        {languages.map((lang) => (
                          <SelectItem key={lang.value} value={lang.value} className="hover:bg-primary/20 focus:bg-primary/30">
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
                variant="outline"
                onClick={handleSuggestText}
                disabled={isSuggesting}
                className="w-full sm:w-auto transition-all duration-200 ease-in-out border-accent text-accent hover:bg-accent/10 hover:text-accent-foreground hover:border-accent futuristic-glow-accent shadow-md"
              >
                {isSuggesting ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Sparkles className="h-4 w-4 mr-2" />
                )}
                Suggest Text
              </Button>
            </div>

            <Button
              type="submit"
              disabled={isPending}
              className="w-full text-lg py-3 bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200 ease-in-out transform hover:scale-[1.01] focus:ring-4 focus:ring-primary/40 shadow-lg futuristic-glow-primary active:shadow-sm"
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
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
