"use client";

import { useState, useEffect, useRef } from "react";
import { SimplificationForm } from "@/components/SimplificationForm";
import { OutputDisplay } from "@/components/OutputDisplay";
import { HistoryPanel } from "@/components/HistoryPanel"; 
import { LogoIcon } from "@/components/icons/LogoIcon";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Menu, Sparkles, BrainCircuit, ChevronDown, Facebook, Twitter, Linkedin, Github, ArrowRight, Languages, Wand2, History as HistoryIcon } from "lucide-react"; 
import Image from "next/image";
import type { SimplificationResult, HistoryItem } from "@/lib/types"; 
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet"; 

const LOCAL_STORAGE_HISTORY_KEY = "saySimpleHistory";

const Hero3DElement = () => {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (!elementRef.current) return;
      const { clientX, clientY } = event;
      const { innerWidth, innerHeight } = window;
      const xRotation = (clientY / innerHeight - 0.5) * 5; // Reduced sensitivity
      const yRotation = (clientX / innerWidth - 0.5) * -5; // Reduced sensitivity
      elementRef.current.style.transform = `translate(-50%, -50%) perspective(1000px) rotateX(${xRotation}deg) rotateY(${yRotation}deg)`;
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div ref={elementRef} className="hero-3d-element pointer-events-none">
      <div className="hero-3d-plane">
        <div className="hero-3d-line line-1" style={{ top: '20%', opacity: 0.3 }}></div>
        <div className="hero-3d-line line-2" style={{ top: '80%', opacity: 0.3 }}></div>
        <div className="hero-3d-line line-3" style={{ left: '20%', opacity: 0.3, animationDelay: '0.5s' }}></div>
        <div className="hero-3d-line line-4" style={{ left: '80%', opacity: 0.3, animationDelay: '0.5s' }}></div>
      </div>
    </div>
  );
};

const useScrollAnimation = () => {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
          }
        });
      },
      { threshold: 0.1 } 
    );

    const elements = document.querySelectorAll(".scroll-animate");
    elements.forEach((el) => observer.observe(el));

    return () => elements.forEach((el) => observer.unobserve(el));
  }, []);
};


export default function Home() {
  const [result, setResult] = useState<SimplificationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [inputTextForOutput, setInputTextForOutput] = useState("");
  const [targetLanguageForOutput, setTargetLanguageForOutput] = useState("English");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);
  const [isHistoryPanelOpen, setIsHistoryPanelOpen] = useState(false);


  useScrollAnimation(); 

  useEffect(() => {
    const storedHistory = localStorage.getItem(LOCAL_STORAGE_HISTORY_KEY);
    if (storedHistory) {
      try {
        const parsedHistory = JSON.parse(storedHistory);
        if (Array.isArray(parsedHistory)) {
            setHistoryItems(parsedHistory);
        } else {
            setHistoryItems([]);
        }
      } catch (error) {
        console.error("Failed to parse history from localStorage:", error);
        setHistoryItems([]);
      }
    }
  }, []);

  const saveHistoryItem = (item: HistoryItem) => {
    const updatedHistory = [item, ...historyItems].slice(0, 50); 
    setHistoryItems(updatedHistory);
    localStorage.setItem(LOCAL_STORAGE_HISTORY_KEY, JSON.stringify(updatedHistory));
  };

  const handleResult = (newResult: SimplificationResult | null, text?: string, lang?: string) => {
    setIsLoading(newResult === null && !!text); 
    setResult(newResult);
    if (text !== undefined) setInputTextForOutput(text);
    if (lang !== undefined) setTargetLanguageForOutput(lang);

    if (newResult && text && lang) {
      const historyEntry: HistoryItem = {
        id: Date.now().toString() + Math.random().toString(36).substring(2, 15),
        timestamp: Date.now(),
        originalText: text,
        targetLanguage: lang,
        simplifiedText: newResult.simplifiedText,
        translatedText: newResult.translatedText,
      };
      saveHistoryItem(historyEntry);
    }
  };
  
  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
    setIsMenuOpen(false);
  };

  const handleSelectHistoryItem = (item: HistoryItem) => {
    setInputTextForOutput(item.originalText);
    setTargetLanguageForOutput(item.targetLanguage);
    setResult({
      simplifiedText: item.simplifiedText,
      translatedText: item.translatedText,
    });
    setIsLoading(false);
    setIsHistoryPanelOpen(false); 
    scrollToSection('simplify');
  };

  const handleDeleteHistoryItem = (id: string) => {
    const updatedHistory = historyItems.filter(item => item.id !== id);
    setHistoryItems(updatedHistory);
    localStorage.setItem(LOCAL_STORAGE_HISTORY_KEY, JSON.stringify(updatedHistory));
  };

  const handleClearHistory = () => {
    setHistoryItems([]);
    localStorage.removeItem(LOCAL_STORAGE_HISTORY_KEY);
  };


  return (
    <div className="flex flex-col min-h-screen items-center relative overflow-x-hidden bg-background text-foreground">
      
      <header className="w-full py-4 px-6 md:px-10 fixed top-0 z-50 bg-background/80 backdrop-blur-md shadow-sm">
        <div className="container mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <LogoIcon className="h-10 w-10 text-primary group-hover:text-accent transition-colors duration-300 futuristic-glow-primary" />
            <h1 className="text-3xl font-bold tracking-tighter text-glow-primary group-hover:text-glow-accent transition-all duration-300">
              SaySimple
            </h1>
          </Link>
          <nav className="hidden md:flex gap-4 items-center"> 
            {['hero', 'about', 'services', 'simplify', 'contact'].map((item) => (
              <button
                key={item}
                onClick={() => scrollToSection(item)}
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors capitalize"
              >
                {item === 'hero' ? 'Home' : item}
              </button>
            ))}
            <Sheet open={isHistoryPanelOpen} onOpenChange={setIsHistoryPanelOpen}>
              <SheetTrigger asChild>
                 <Button variant="outline" className="border-primary/70 text-primary/90 hover:bg-primary/10 futuristic-glow-primary">
                   <HistoryIcon className="mr-2 h-4 w-4" /> History
                 </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full sm:max-w-md md:max-w-lg bg-card/95 backdrop-blur-lg border-border/50 text-card-foreground">
                <HistoryPanel
                  historyItems={historyItems}
                  onSelectHistoryItem={handleSelectHistoryItem}
                  onDeleteHistoryItem={handleDeleteHistoryItem}
                  onClearHistory={handleClearHistory}
                />
              </SheetContent>
            </Sheet>
            <Button variant="default" onClick={() => scrollToSection('simplify')} className="futuristic-glow-accent">Simplify & Translate</Button>
          </nav>
          <div className="md:hidden flex items-center gap-2">
            <Sheet open={isHistoryPanelOpen} onOpenChange={setIsHistoryPanelOpen}>
              <SheetTrigger asChild>
                 <Button variant="ghost" size="icon" aria-label="View History">
                   <HistoryIcon className="h-5 w-5" />
                 </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full sm:max-w-xs bg-card/95 backdrop-blur-lg border-border/50 text-card-foreground">
                 <HistoryPanel
                  historyItems={historyItems}
                  onSelectHistoryItem={handleSelectHistoryItem}
                  onDeleteHistoryItem={handleDeleteHistoryItem}
                  onClearHistory={handleClearHistory}
                />
              </SheetContent>
            </Sheet>
            <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Open Menu">
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </div>
        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-background/95 backdrop-blur-md shadow-lg py-4">
            <nav className="container mx-auto flex flex-col gap-4 px-6">
              {['hero', 'about', 'services', 'simplify', 'contact'].map((item) => (
                <button
                  key={item}
                  onClick={() => scrollToSection(item)}
                  className="text-base font-medium text-foreground hover:text-primary transition-colors capitalize py-2 text-left"
                >
                  {item === 'hero' ? 'Home' : item}
                </button>
              ))}
              <Button variant="default" onClick={() => scrollToSection('simplify')} className="w-full mt-2 futuristic-glow-accent">Simplify & Translate</Button>
            </nav>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section id="hero" className="w-full h-screen flex flex-col items-center justify-center relative text-center px-4 md:px-6 pt-20 overflow-hidden">
        <Hero3DElement />
        <div className="z-10 relative scroll-animate">
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-glow-primary leading-tight">
            Simplify. Translate. Understand.
          </h1>
          <p className="mt-6 md:mt-8 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            SaySimple uses advanced AI to make complex text easy to grasp and bridges language barriers effortlessly.
          </p>
          <div className="mt-10 md:mt-12 flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={() => scrollToSection('simplify')} className="futuristic-glow-primary text-lg px-8 py-6 group bg-primary text-primary-foreground hover:bg-primary/90">
              Translate and simplify any complex text <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform"/>
            </Button>
            <Button size="lg" variant="outline" onClick={() => scrollToSection('about')} className="text-lg px-8 py-6 border-accent text-accent hover:bg-accent/10 hover:text-accent-foreground futuristic-glow-accent">
              Learn More <ChevronDown className="ml-2 h-5 w-5"/>
            </Button>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="w-full py-16 md:py-24 bg-background/50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12 md:mb-16 scroll-animate">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-glow-primary tracking-tight">About SaySimple</h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
              We believe in clarity and accessibility. SaySimple empowers everyone to understand and communicate effectively, regardless of language or complexity.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
            <div className="scroll-animate">
              <Image 
                src="https://picsum.photos/600/400?random=1" 
                alt="Abstract representation of understanding" 
                width={600} 
                height={400} 
                className="rounded-lg shadow-xl object-cover aspect-[3/2]"
                data-ai-hint="abstract network"
              />
            </div>
            <div className="space-y-6 scroll-animate">
              <h3 className="text-2xl font-semibold text-primary">Our Mission</h3>
              <p className="text-muted-foreground leading-relaxed">
                To break down barriers in communication by providing intuitive AI-powered tools for text simplification and translation. We strive to make information accessible to a global audience.
              </p>
              <h3 className="text-2xl font-semibold text-primary">Core Values</h3>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li><span className="font-medium text-foreground">Clarity:</span> Simplifying complex ideas into understandable language.</li>
                <li><span className="font-medium text-foreground">Accessibility:</span> Ensuring everyone can access and understand information.</li>
                <li><span className="font-medium text-foreground">Innovation:</span> Leveraging cutting-edge AI for powerful results.</li>
                <li><span className="font-medium text-foreground">Global Reach:</span> Connecting people across different languages and cultures.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="w-full py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12 md:mb-16 scroll-animate">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-glow-accent tracking-tight">What We Offer</h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
              SaySimple provides powerful tools to enhance your communication and understanding.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {[
              { title: "AI Text Simplification", description: "Converts complex jargon and lengthy sentences into clear, concise text.", icon: <Sparkles className="h-8 w-8 text-accent"/>, dataAiHint:"brain lightbulb" },
              { title: "Multi-Language Translation", description: "Accurately translates text into numerous languages, including specialized dialects.", icon: <Languages className="h-8 w-8 text-accent"/>, dataAiHint:"globe languages" },
              { title: "Contextual Understanding", description: "Our AI considers context to provide more natural and accurate simplifications and translations.", icon: <BrainCircuit className="h-8 w-8 text-accent"/>, dataAiHint:"connected nodes" }
            ].map((service, index) => (
              <Card key={index} className="bg-card/60 backdrop-blur-sm border-border/40 shadow-lg hover:shadow-xl hover:border-accent/70 transition-all duration-300 scroll-animate transform hover:scale-[1.03]">
                <CardHeader className="items-center text-center">
                  <div className="p-3 rounded-full bg-accent/10 mb-3 futuristic-glow-accent">{service.icon}</div>
                  <CardTitle className="text-xl text-glow-accent">{service.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-muted-foreground text-sm">{service.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      
      {/* Simplification Tool Section */}
      <section id="simplify" className="w-full py-16 md:py-24 bg-background/50">
        <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-12 md:mb-16 scroll-animate">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-glow-primary tracking-tight">
                    Try SaySimple Now
                </h2>
                <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
                    Experience the power of AI-driven text simplification and translation.
                </p>
            </div>
            <div className="w-full max-w-4xl mx-auto flex flex-col items-center space-y-10 scroll-animate">
                <SimplificationForm 
                  onResult={handleResult} 
                  initialText={inputTextForOutput} 
                  initialLanguage={targetLanguageForOutput} 
                  key={`${inputTextForOutput}-${targetLanguageForOutput}`} 
                />
                {(isLoading || result) && (
                    <OutputDisplay
                        result={result}
                        isLoading={isLoading}
                        inputText={inputTextForOutput}
                        targetLanguage={targetLanguageForOutput}
                    />
                )}
            </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="w-full py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12 md:mb-16 scroll-animate">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-glow-accent tracking-tight">Get In Touch</h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
              Have questions or want to learn more? We'd love to hear from you.
            </p>
          </div>
          <Card className="max-w-2xl mx-auto bg-card/60 backdrop-blur-sm border-border/40 shadow-xl p-6 md:p-8 scroll-animate futuristic-glow-accent">
            <form className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-foreground/80 mb-1">Full Name</label>
                  <input type="text" id="name" name="name" className="w-full bg-input border-border/70 focus:border-accent focus:ring-2 focus:ring-accent/50 transition-all duration-200 ease-in-out shadow-inner rounded-md p-3 placeholder:text-muted-foreground/60" placeholder="Your Name" />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-foreground/80 mb-1">Email Address</label>
                  <input type="email" id="email" name="email" className="w-full bg-input border-border/70 focus:border-accent focus:ring-2 focus:ring-accent/50 transition-all duration-200 ease-in-out shadow-inner rounded-md p-3 placeholder:text-muted-foreground/60" placeholder="you@example.com" />
                </div>
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-foreground/80 mb-1">Message</label>
                <textarea id="message" name="message" rows={4} className="w-full bg-input border-border/70 focus:border-accent focus:ring-2 focus:ring-accent/50 transition-all duration-200 ease-in-out shadow-inner rounded-md p-3 placeholder:text-muted-foreground/60 min-h-[120px]" placeholder="Your message..."></textarea>
              </div>
              <div>
                <Button type="submit" className="w-full text-lg py-3 bg-accent text-accent-foreground hover:bg-accent/90 transition-all duration-200 ease-in-out transform hover:scale-[1.01] focus:ring-4 focus:ring-accent/40 shadow-lg futuristic-glow-accent active:futuristic-glow-accent">
                  Send Message
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full py-12 px-6 md:px-10 text-center z-10 border-t border-border/20 bg-background/70 backdrop-blur-sm">
        <div className="container mx-auto">
            <div className="flex justify-center gap-6 mb-6">
                <Link href="#" aria-label="Facebook" className="text-muted-foreground hover:text-primary transition-colors"><Facebook className="h-6 w-6"/></Link>
                <Link href="#" aria-label="Twitter" className="text-muted-foreground hover:text-primary transition-colors"><Twitter className="h-6 w-6"/></Link>
                <Link href="#" aria-label="LinkedIn" className="text-muted-foreground hover:text-primary transition-colors"><Linkedin className="h-6 w-6"/></Link>
                <Link href="#" aria-label="GitHub" className="text-muted-foreground hover:text-primary transition-colors"><Github className="h-6 w-6"/></Link>
            </div>
            <p className="text-sm text-muted-foreground">
              Powered by Genkit & Gemini AI &bull; Crafted with Next.js & ShadCN UI &bull; Design for Clarity
            </p>
            <p className="text-xs text-muted-foreground/70 mt-3">
              © {new Date().getFullYear()} SaySimple. All rights reserved.
            </p>
        </div>
      </footer>
    </div>
  );
