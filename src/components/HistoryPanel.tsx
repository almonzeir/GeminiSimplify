
"use client";

import type { HistoryItem } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Trash2, Eye, FileText, AlertTriangle, History } from "lucide-react";
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
    <div className="flex flex-col h-full">
      <SheetHeader className="p-4 border-b border-border/30">
        <SheetTitle className="text-2xl font-semibold text-glow-primary flex items-center">
          <History className="mr-3 h-6 w-6 text-primary" />
          Simplification History
        </SheetTitle>
        <SheetDescription className="text-muted-foreground/80">
          Review and reuse your past simplifications.
        </SheetDescription>
      </SheetHeader>

      {historyItems.length > 0 && (
        <div className="px-4 pt-4">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm" className="w-full futuristic-glow hover:futuristic-glow-primary">
                <Trash2 className="mr-2 h-4 w-4" /> Clear All History
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-card border-destructive/50 futuristic-glow-primary">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-glow-primary">Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription className="text-muted-foreground">
                  This action cannot be undone. This will permanently delete all
                  your simplification history.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="futuristic-glow">Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={onClearHistory} className="bg-destructive text-destructive-foreground hover:bg-destructive/90 futuristic-glow-primary">
                  Yes, delete all
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      )}

      <ScrollArea className="flex-1 p-1 md:p-2">
        <div className="p-3 space-y-3">
          {historyItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-10 opacity-60">
              <FileText className="h-16 w-16 text-muted-foreground/50 mb-4" />
              <p className="text-lg font-medium text-muted-foreground">No History Yet</p>
              <p className="text-sm text-muted-foreground/70">
                Your simplified and translated texts will appear here.
              </p>
            </div>
          ) : (
            historyItems.map((item) => (
              <Card
                key={item.id}
                className="bg-card/70 backdrop-blur-sm border-border/40 shadow-md hover:shadow-lg transition-all duration-200 futuristic-glow-accent hover:border-accent/50 transform hover:scale-[1.02]"
              >
                <CardHeader className="pb-3 pt-4 px-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-base font-semibold text-accent text-glow-accent leading-tight">
                        {item.originalText.substring(0, 50)}...
                      </CardTitle>
                      <CardDescription className="text-xs text-muted-foreground/80 pt-1">
                        {formatDistanceToNow(new Date(item.timestamp), { addSuffix: true })} &bull; To: {item.targetLanguage}
                      </CardDescription>
                    </div>
                     <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive h-8 w-8 futuristic-glow hover:futuristic-glow-primary active:scale-90">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="bg-card border-destructive/50 futuristic-glow-primary">
                        <AlertDialogHeader>
                          <AlertDialogTitle className="text-glow-primary">Delete this history item?</AlertDialogTitle>
                          <AlertDialogDescription className="text-muted-foreground">
                            This action cannot be undone. Are you sure you want to delete this entry?
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel className="futuristic-glow">Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => onDeleteHistoryItem(item.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90 futuristic-glow-primary">
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </CardHeader>
                <CardContent className="px-4 pb-4">
                  <p className="text-sm text-foreground/90 mb-3 truncate">
                    <strong>Simplified:</strong> {item.simplifiedText.substring(0, 70)}...
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onSelectHistoryItem(item)}
                    className="w-full border-primary text-primary hover:bg-primary/10 hover:text-primary-foreground futuristic-glow-primary transform hover:scale-105"
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
