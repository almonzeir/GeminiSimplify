
"use client";

import type { HistoryItem } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Trash2, Eye, FileText, History, AlertCircle } from "lucide-react"; // Changed AlertTriangle to AlertCircle
import { formatDistanceToNow } from 'date-fns';
import {
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"


type HistoryPanelProps = {
  historyItems: HistoryItem[];
  onSelectHistoryItem: (item: HistoryItem) => void;
  onDeleteHistoryItem: (id: string) => void;
  onClearHistory: () => void;
};

export function HistoryPanel({
  historyItems,
  onSelectHistoryItem,
  onDeleteHistoryItem,
  onClearHistory,
}: HistoryPanelProps) {
  return (
    <div className="flex flex-col h-full bg-card text-card-foreground"> {/* Ensure panel background matches theme */}
      <SheetHeader className="p-5 border-b border-border/40 backdrop-blur-sm bg-card/80 sticky top-0 z-10">
        <SheetTitle className="text-2xl font-semibold text-glow-primary flex items-center">
          <History className="mr-3 h-7 w-7 text-primary" />
          Simplification History
        </SheetTitle>
        <SheetDescription className="text-muted-foreground/90 text-sm pt-1">
          Review and reuse your past simplifications.
        </SheetDescription>
      </SheetHeader>

      {historyItems.length > 0 && (
        <div className="px-5 py-4 border-b border-border/30">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm" className="w-full futuristic-glow hover:futuristic-glow-primary hover:bg-destructive/85">
                <Trash2 className="mr-2 h-4 w-4" /> Clear All History
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-card border-destructive/60 futuristic-glow-primary shadow-xl">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-glow-primary text-xl flex items-center">
                   <AlertCircle className="mr-2 h-6 w-6 text-destructive"/> Are you absolutely sure?
                </AlertDialogTitle>
                <AlertDialogDescription className="text-muted-foreground pt-1">
                  This action cannot be undone. This will permanently delete all
                  your simplification history.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter className="pt-2">
                <AlertDialogCancel className="futuristic-glow hover:bg-muted/20">Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={onClearHistory} className="bg-destructive text-destructive-foreground hover:bg-destructive/85 futuristic-glow-primary">
                  Yes, delete all
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      )}

      <ScrollArea className="flex-1 p-2 md:p-3">
        <div className="p-3 space-y-4">
          {historyItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-12 opacity-70">
              <FileText className="h-20 w-20 text-muted-foreground/40 mb-5" />
              <p className="text-xl font-medium text-muted-foreground">No History Yet</p>
              <p className="text-sm text-muted-foreground/80 mt-1">
                Your simplified and translated texts will appear here.
              </p>
            </div>
          ) : (
            historyItems.map((item) => (
              <Card
                key={item.id}
                className="bg-card/80 backdrop-blur-sm border-border/50 shadow-lg hover:shadow-xl transition-all duration-200 futuristic-glow-accent hover:border-accent/60 transform hover:scale-[1.025]"
              >
                <CardHeader className="pb-3 pt-4 px-4 md:px-5">
                  <div className="flex justify-between items-start gap-2">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-md font-semibold text-accent text-glow-accent leading-tight truncate group-hover:text-accent-foreground transition-colors">
                        {item.originalText.substring(0, 60)}{item.originalText.length > 60 && "..."}
                      </CardTitle>
                      <CardDescription className="text-xs text-muted-foreground/80 pt-1.5">
                        {formatDistanceToNow(new Date(item.timestamp), { addSuffix: true })} &bull; To: {item.targetLanguage}
                      </CardDescription>
                    </div>
                     <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive h-9 w-9 p-1.5 futuristic-glow hover:futuristic-glow-primary active:scale-90 shrink-0">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="bg-card border-destructive/60 futuristic-glow-primary shadow-xl">
                        <AlertDialogHeader>
                          <AlertDialogTitle className="text-glow-primary text-xl flex items-center">
                            <AlertCircle className="mr-2 h-6 w-6 text-destructive"/> Delete this history item?
                          </AlertDialogTitle>
                          <AlertDialogDescription className="text-muted-foreground pt-1">
                            This action cannot be undone. Are you sure you want to delete this entry?
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter className="pt-2">
                          <AlertDialogCancel className="futuristic-glow hover:bg-muted/20">Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => onDeleteHistoryItem(item.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/85 futuristic-glow-primary">
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </CardHeader>
                <CardContent className="px-4 md:px-5 pb-4 pt-2">
                  <p className="text-sm text-foreground/90 mb-3.5 truncate">
                    <strong>Simplified:</strong> {item.simplifiedText.substring(0, 80)}{item.simplifiedText.length > 80 && "..."}
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onSelectHistoryItem(item)}
                    className="w-full border-primary/70 text-primary hover:bg-primary/15 hover:text-primary-foreground futuristic-glow-primary transform hover:scale-105 py-2.5"
                  >
                    <Eye className="mr-2 h-4 w-4" /> View & Use
                  </Button>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
