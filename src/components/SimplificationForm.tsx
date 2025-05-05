"use client";

import { useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Loader2, Sparkles, Languages } from "lucide-react";

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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { simplifyAndTranslate } from "@/ai/flows/simplify-and-translate";
import { suggestInputText } from "@/ai/flows/suggest-input-text";
import { useToast } from "@/hooks/use-toast";

const languages = [
  { value: "English", label: "English" },
  { value: "Spanish", label: "Spanish" },
  { value: "French", label: "French" },
  { value: "German", label: "German" },
  { value: "Japanese", label: "Japanese" },
  { value: "Mandarin Chinese", label: "Mandarin Chinese" },
  { value: "Hindi", label: "Hindi" },
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
  onResult: (result: { simplifiedText: string; translatedText: string } | null) => void;
};

export function SimplificationForm({ onResult }: SimplificationFormProps) {
  const [isPending, startTransition] = useTransition();
  const [isSuggesting, startSuggestTransition] = useTransition();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      text: "",
      targetLanguage: "English",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    startTransition(async () => {
      onResult(null); // Clear previous results
      try {
        const result = await simplifyAndTranslate(values);
        onResult(result);
        toast({
          title: "Success!",
          description: "Text simplified and translated.",
        });
      } catch (error) {
        console.error("Simplification failed:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to simplify and translate text. Please try again.",
        });
        onResult(null);
      }
    });
  }

  async function handleSuggestText() {
    startSuggestTransition(async () => {
      try {
        const { suggestedText } = await suggestInputText();
        form.setValue("text", suggestedText);
        toast({
          title: "Suggestion Loaded",
          description: "Example text added to the input area.",
        });
      } catch (error) {
        console.error("Suggestion failed:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load suggested text.",
        });
      }
    });
  }

  return (
    <Card className="w-full shadow-lg border border-border/50">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold text-center text-foreground">Enter Text to Simplify & Translate</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="text"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-muted-foreground">Your Text</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Paste or type your text here..."
                      className="min-h-[150px] resize-y bg-card border-input focus:border-primary focus:ring-primary transition-colors duration-200 ease-in-out"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex flex-col sm:flex-row sm:items-end gap-4">
              <FormField
                control={form.control}
                name="targetLanguage"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel className="text-muted-foreground">Target Language</FormLabel>
                     <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-card border-input focus:border-primary focus:ring-primary transition-colors duration-200 ease-in-out">
                           <Languages className="mr-2 h-4 w-4 opacity-50"/>
                          <SelectValue placeholder="Select a language" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {languages.map((lang) => (
                          <SelectItem key={lang.value} value={lang.value}>
                            {lang.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <Button
                type="button"
                variant="outline"
                onClick={handleSuggestText}
                disabled={isSuggesting}
                className="w-full sm:w-auto transition-all duration-200 ease-in-out hover:bg-secondary/80"
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
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200 ease-in-out transform hover:scale-105"
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
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
