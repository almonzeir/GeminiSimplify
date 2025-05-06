
export type SimplificationResult = {
  simplifiedText: string;
  translatedText: string;
};

export type HistoryItem = {
  id: string;
  timestamp: number;
  originalText: string;
  targetLanguage: string;
  simplifiedText: string;
  translatedText: string;
};
