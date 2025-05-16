
"use client";
import React, { useState, useEffect, useRef } from "react"; // Ensured React is imported
import { SimplificationForm } from "@/components/SimplificationForm";
import { OutputDisplay } from "@/components/OutputDisplay";
import { HistoryPanel } from "@/components/HistoryPanel";
import { ArabicDialectTranslator } from "@/components/ArabicDialectTranslator";
import { LogoIcon } from "@/components/icons/LogoIcon";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Link from "next/link";
import { Menu, Sparkles, BrainCircuit, ChevronDown, Facebook, Twitter, Linkedin, Github, ArrowRight, Languages, Wand2, MessageSquareQuote, History as HistoryLucideIcon } from "lucide-react"; // Added MessageSquareQuote, HistoryLucideIcon
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
      const xRotation = (clientY / innerHeight - 0.5) * 6; // Reduced rotation intensity
      const yRotation = (clientX / innerWidth - 0.5) * -6; // Reduced rotation intensity
      elementRef.current.style.transform = `translate(-50%, -50%) perspective(1200px) rotateX(${xRotation}deg) rotateY(${yRotation}deg)`;
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div ref={elementRef} className="hero-3d-element pointer-events-none opacity-60 group-hover:opacity-80 transition-opacity duration-500">
      <div className="hero-3d-plane">
        <div className="hero-3d-line line-1"></div>
        <div className="hero-3d-line line-2"></div>
        <div className="hero-3d-line line-3"></div>
        <div className="hero-3d-line line-4"></div>
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
      { threshold: 0.1 } // Trigger a bit earlier
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
    const updatedHistory = [item, ...historyItems].slice(0, 50); // Keep up to 50 items
    setHistoryItems(updatedHistory);
    localStorage.setItem(LOCAL_STORAGE_HISTORY_KEY, JSON.stringify(updatedHistory));
  };

  const handleResult = (newResult: SimplificationResult | null, text?: string, lang?: string) => {
    setIsLoading(newResult === null && !!text); // Set loading only if actively processing
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
      section.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    setIsMenuOpen(false); // Close mobile menu after navigation
  };

  const handleSelectHistoryItem = (item: HistoryItem) => {
    setInputTextForOutput(item.originalText);
    setTargetLanguageForOutput(item.targetLanguage);
    setResult({
      simplifiedText: item.simplifiedText,
      translatedText: item.translatedText,
    });
    setIsLoading(false);
    setIsHistoryPanelOpen(false); // Close history panel
    // Optionally scroll to the form
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


  const navItems = [
    { id: 'hero', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'services', label: 'Features' },
    { id: 'simplify', label: 'Simplify & Translate' },
    { id: 'arabic-dialect-translator', label: 'Arabic Dialects' },
    { id: 'contact', label: 'Contact' }
  ];

  const services = [
    { title: "AI Text Simplification", description: "Converts complex jargon and lengthy sentences into clear, concise text.", icon: <Wand2 className="h-8 w-8 text-primary"/>, targetSection: "simplify", dataAiHint:"brain lightbulb", glowClass: "futuristic-glow-primary" },
    { title: "Arabic Dialect Translation", description: "Translate text between various Arabic dialects with precision.", icon: <MessageSquareQuote className="h-8 w-8 text-accent"/>, targetSection: "arabic-dialect-translator", dataAiHint:"arabic dialects map", glowClass: "futuristic-glow-accent" },
    { title: "Universal Language Translation", description: "Accurately translates text into numerous global languages.", icon: <Languages className="h-8 w-8 text-secondary"/>, targetSection: "simplify", dataAiHint:"globe languages", glowClass: "futuristic-glow-secondary" },
    { title: "Contextual Understanding", description: "AI considers context for natural simplifications and offers situational advice.", icon: <BrainCircuit className="h-8 w-8 text-primary"/>, targetSection: "simplify", dataAiHint:"connected nodes", glowClass: "futuristic-glow-primary" }
  ];


  return (
    <div className="flex flex-col min-h-screen items-center relative overflow-x-hidden bg-background text-foreground">

      <header className="w-full py-3 px-4 md:px-8 fixed top-0 z-50 bg-background/85 backdrop-blur-lg shadow-2xl border-b border-border/30">
        <div className="container mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <LogoIcon className="h-11 w-11 text-primary group-hover:text-accent transition-colors duration-300 futuristic-glow-primary" />
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-glow-primary group-hover:text-glow-accent transition-all duration-300">
              SaySimple
            </h1>
          </Link>
          <nav className="hidden md:flex gap-1 items-center">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors duration-200 capitalize px-4 py-2 rounded-md hover:bg-primary/10 futuristic-glow"
              >
                {item.label}
              </button>
            ))}
            <Sheet open={isHistoryPanelOpen} onOpenChange={setIsHistoryPanelOpen}>
              <SheetTrigger asChild>
                 <Button variant="outline" className="text-primary hover:text-primary-foreground hover:bg-primary futuristic-glow-primary ml-2">
                   <HistoryLucideIcon className="mr-2 h-4 w-4" /> History
                 </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full sm:max-w-md md:max-w-lg bg-card/95 backdrop-blur-xl border-border/50 text-card-foreground p-0">
                <HistoryPanel
                  historyItems={historyItems}
                  onSelectHistoryItem={handleSelectHistoryItem}
                  onDeleteHistoryItem={handleDeleteHistoryItem}
                  onClearHistory={handleClearHistory}
                />
              </SheetContent>
            </Sheet>
            <Button variant="default" onClick={() => scrollToSection('simplify')} className="futuristic-glow-accent ml-2 px-5 py-2">Get Started</Button>
          </nav>
          <div className="md:hidden flex items-center gap-2">
            <Sheet open={isHistoryPanelOpen} onOpenChange={setIsHistoryPanelOpen}>
              <SheetTrigger asChild>
                 <Button variant="ghost" size="icon" aria-label="View History" className="text-foreground hover:text-primary futuristic-glow-primary">
                   <HistoryLucideIcon className="h-5 w-5" />
                 </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full sm:max-w-xs bg-card/95 backdrop-blur-lg border-border/50 text-card-foreground p-0">
                 <HistoryPanel
                  historyItems={historyItems}
                  onSelectHistoryItem={handleSelectHistoryItem}
                  onDeleteHistoryItem={handleDeleteHistoryItem}
                  onClearHistory={handleClearHistory}
                />
              </SheetContent>
            </Sheet>
            <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Open Menu" className="text-foreground hover:text-primary futuristic-glow-primary">
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </div>
        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-background/95 backdrop-blur-lg shadow-lg py-4 border-t border-border/30">
            <nav className="container mx-auto flex flex-col gap-3 px-6">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="text-base font-medium text-foreground hover:text-primary transition-colors capitalize py-2.5 text-left rounded-md hover:bg-primary/5 px-3"
                >
                  {item.label}
                </button>
              ))}
              <Button variant="default" onClick={() => scrollToSection('simplify')} className="w-full mt-3 py-3 text-md futuristic-glow-accent">Get Started</Button>
            </nav>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section id="hero" className="w-full h-screen flex flex-col items-center justify-center relative text-center px-4 md:px-6 pt-20 overflow-hidden group">
        <Hero3DElement />
        <Image
            src="https://png.pngtree.com/background/20230416/original/pngtree-website-technology-line-dark-background-picture-image_2443641.jpg"
            alt="Abstract futuristic background with interconnected lines on a dark canvas, evoking a sense of global technology and communication networks."
            layout="fill"
            objectFit="cover"
            className="absolute inset-0 z-0 opacity-25" // Slightly increased opacity
            data-ai-hint="technology lines dark"
            priority
        />
        <div className="z-10 relative scroll-animate" style={{ animationDelay: '0.2s' }}>
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold tracking-tight text-glow-primary leading-tight drop-shadow-2xl">
            Simplify. Translate. Understand.
          </h1>
          <p className="mt-6 md:mt-8 text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto scroll-animate" style={{ animationDelay: '0.4s' }}>
            SaySimple uses advanced AI to make complex text easy to grasp and bridges language barriers effortlessly. Your gateway to clear communication.
          </p>
          <div className="mt-10 md:mt-12 flex flex-col sm:flex-row gap-4 justify-center scroll-animate" style={{ animationDelay: '0.6s' }}>
            <Button size="lg" onClick={() => scrollToSection('simplify')} className="futuristic-glow-primary text-lg px-10 py-7 group/maincta bg-primary text-primary-foreground hover:bg-primary/90 transform hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-primary/40">
              Translate and simplify any complex text <ArrowRight className="ml-2.5 h-5 w-5 group-hover/maincta:translate-x-2 transition-transform duration-300"/>
            </Button>
            <Button size="lg" variant="outline" onClick={() => scrollToSection('about')} className="text-lg px-10 py-7 border-accent text-accent hover:bg-accent/15 hover:text-accent-foreground futuristic-glow-accent transform hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-accent/40">
              Learn More <ChevronDown className="ml-2.5 h-5 w-5 group-hover:rotate-[-10deg] group-hover:scale-110 transition-transform duration-300"/>
            </Button>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="w-full py-20 md:py-28 bg-background/60 backdrop-blur-sm">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-14 md:mb-20 scroll-animate">
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-glow-primary tracking-tight">About SaySimple</h2>
            <p className="mt-5 text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
              We believe in clarity and accessibility. SaySimple empowers everyone to understand and communicate effectively, regardless of language or complexity.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center">
            <div className="scroll-animate group" style={{ animationDelay: '0.2s' }}>
              <Image
                src="https://thumbs.dreamstime.com/b/simplify-businessman-drawing-landing-page-blackground-71784449.jpg"
                alt="Businessman drawing a simplified flowchart on a dark background, representing clarity and problem-solving."
                width={800}
                height={534}
                className="rounded-xl shadow-2xl object-cover w-full transform group-hover:scale-105 transition-transform duration-500 ease-out futuristic-glow-primary"
                data-ai-hint="businessman simplify"
              />
            </div>
            <div className="space-y-8 scroll-animate" style={{ animationDelay: '0.4s' }}>
              <div>
                <h3 className="text-2xl md:text-3xl font-semibold text-primary text-glow-primary mb-3">Our Mission</h3>
                <p className="text-muted-foreground leading-relaxed text-md md:text-lg">
                  To break down barriers in communication by providing intuitive AI-powered tools for text simplification and translation. We strive to make information accessible to a global audience.
                </p>
              </div>
              <div>
                <h3 className="text-2xl md:text-3xl font-semibold text-primary text-glow-primary mb-4">Core Values</h3>
                <ul className="space-y-3 text-md md:text-lg">
                  <li className="flex items-start"><Sparkles className="h-5 w-5 text-accent mr-3 mt-1 shrink-0"/> <span className="font-medium text-foreground">Clarity:</span><span className="text-muted-foreground ml-1.5">Simplifying complex ideas into understandable language.</span></li>
                  <li className="flex items-start"><Sparkles className="h-5 w-5 text-accent mr-3 mt-1 shrink-0"/> <span className="font-medium text-foreground">Accessibility:</span><span className="text-muted-foreground ml-1.5">Ensuring everyone can access and understand information.</span></li>
                  <li className="flex items-start"><Sparkles className="h-5 w-5 text-accent mr-3 mt-1 shrink-0"/> <span className="font-medium text-foreground">Innovation:</span><span className="text-muted-foreground ml-1.5">Leveraging cutting-edge AI for powerful results.</span></li>
                  <li className="flex items-start"><Sparkles className="h-5 w-5 text-accent mr-3 mt-1 shrink-0"/> <span className="font-medium text-foreground">Global Reach:</span><span className="text-muted-foreground ml-1.5">Connecting people across different languages and cultures.</span></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="services" className="w-full py-20 md:py-28">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-14 md:mb-20 scroll-animate">
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-glow-accent tracking-tight">Key Features</h2>
            <p className="mt-5 text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
              SaySimple provides powerful tools to enhance your communication and understanding.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 gap-8 md:gap-10">
            {services.map((service, index) => {
              const IconComponent = service.icon.type;
              const originalProps = service.icon.props;
              const newClassName = `${originalProps.className || ''} transform group-hover/servicecard:scale-110 transition-transform`.trim();
              return (
                <button
                  key={index}
                  onClick={() => scrollToSection(service.targetSection)}
                  className="text-left w-full h-full block focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background rounded-xl group/servicecard scroll-animate"
                  style={{ animationDelay: `${index * 0.15}s` }}
                  aria-label={`Learn more about ${service.title}`}
                >
                  <Card className={`bg-card/60 backdrop-blur-md shadow-xl group-hover/servicecard:shadow-2xl transition-all duration-300 transform group-hover/servicecard:scale-[1.05] h-full flex flex-col ${service.glowClass} futuristic-glow border-border/30 group-hover/servicecard:border-current`}>
                    <CardHeader className="items-center text-center pt-8 pb-5">
                      <div className={`p-5 rounded-full bg-current/10 mb-5 transition-transform duration-300 group-hover/servicecard:scale-110 group-hover/servicecard:rotate-[-5deg] ${service.glowClass}`}>
                        {React.isValidElement(service.icon) ? <IconComponent {...originalProps} className={newClassName} /> : service.icon}
                      </div>
                      <CardTitle className={`text-2xl font-semibold ${service.title.includes("Arabic") ? 'text-glow-accent' : (service.title.includes("Universal") ? 'text-glow-secondary' : 'text-glow-primary')}`}>{service.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="text-center flex-grow pb-8 px-5">
                      <p className="text-muted-foreground text-base">{service.description}</p>
                    </CardContent>
                  </Card>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Simplification Tool Section */}
      <section id="simplify" className="w-full py-20 md:py-28 bg-background/60 backdrop-blur-sm">
        <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-14 md:mb-20 scroll-animate">
                <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-glow-primary tracking-tight">
                    Simplify & Translate Universally
                </h2>
                <p className="mt-5 text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
                    Experience the power of AI-driven text simplification and translation into various global languages.
                </p>
            </div>
            <div className="w-full max-w-5xl mx-auto flex flex-col items-center space-y-12 scroll-animate" style={{ animationDelay: '0.2s' }}>
                <SimplificationForm
                  onResult={handleResult}
                  initialText={inputTextForOutput}
                  initialLanguage={targetLanguageForOutput}
                  key={`simplification-${inputTextForOutput}-${targetLanguageForOutput}`}
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

      {/* Arabic Dialect Translator Section */}
      <section id="arabic-dialect-translator" className="w-full py-20 md:py-28">
        <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-14 md:mb-20 scroll-animate">
                <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-glow-accent tracking-tight">
                    Arabic Dialect Translator
                </h2>
                <p className="mt-5 text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
                    Bridge communication gaps between different Arabic dialects seamlessly.
                </p>
            </div>
            <div className="w-full max-w-5xl mx-auto flex flex-col items-center space-y-12 scroll-animate" style={{ animationDelay: '0.2s' }}>
                <ArabicDialectTranslator />
            </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="w-full py-20 md:py-28 bg-background/60 backdrop-blur-sm">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-14 md:mb-20 scroll-animate">
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-glow-primary tracking-tight">Get In Touch</h2>
            <p className="mt-5 text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
              Have questions or want to learn more? We'd love to hear from you.
            </p>
          </div>
          <Card className="max-w-2xl mx-auto bg-card/70 backdrop-blur-md border-border/50 shadow-xl p-6 md:p-10 scroll-animate futuristic-glow-primary transform hover:scale-[1.02] transition-transform duration-300" style={{ animationDelay: '0.2s' }}>
            <form className="space-y-8">
              <div className="grid sm:grid-cols-2 gap-x-6 gap-y-8">
                <div className="scroll-animate" style={{ animationDelay: '0.3s' }}>
                  <label htmlFor="name" className="block text-sm font-medium text-foreground/80 mb-2">Full Name</label>
                  <input type="text" id="name" name="name" className="w-full bg-input border-border/70 focus:border-primary focus:ring-2 focus:ring-primary/50 transition-all duration-200 ease-in-out shadow-inner rounded-md p-3.5 placeholder:text-muted-foreground/60 futuristic-glow-primary focus:shadow-lg" placeholder="Your Name" />
                </div>
                <div className="scroll-animate" style={{ animationDelay: '0.4s' }}>
                  <label htmlFor="email" className="block text-sm font-medium text-foreground/80 mb-2">Email Address</label>
                  <input type="email" id="email" name="email" className="w-full bg-input border-border/70 focus:border-primary focus:ring-2 focus:ring-primary/50 transition-all duration-200 ease-in-out shadow-inner rounded-md p-3.5 placeholder:text-muted-foreground/60 futuristic-glow-primary focus:shadow-lg" placeholder="you@example.com" />
                </div>
              </div>
              <div className="scroll-animate" style={{ animationDelay: '0.5s' }}>
                <label htmlFor="message" className="block text-sm font-medium text-foreground/80 mb-2">Message</label>
                <textarea id="message" name="message" rows={5} className="w-full bg-input border-border/70 focus:border-primary focus:ring-2 focus:ring-primary/50 transition-all duration-200 ease-in-out shadow-inner rounded-md p-3.5 placeholder:text-muted-foreground/60 min-h-[140px] futuristic-glow-primary focus:shadow-lg" placeholder="Your message..."></textarea>
              </div>
              <div className="scroll-animate pt-2" style={{ animationDelay: '0.6s' }}>
                <Button type="submit" className="w-full text-lg py-3.5 bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300 ease-in-out transform hover:scale-[1.03] focus:ring-4 focus:ring-primary/40 shadow-xl futuristic-glow-primary active:shadow-md active:scale-[1.01]">
                  Send Message
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full py-14 px-6 md:px-10 text-center z-10 border-t border-border/30 bg-background/85 backdrop-blur-lg">
        <div className="container mx-auto">
            <div className="flex justify-center gap-8 mb-8">
                <Link href="#" aria-label="Facebook" className="text-muted-foreground hover:text-primary transition-all duration-300 transform hover:scale-125 hover:text-glow-primary p-2 rounded-full hover:bg-primary/10 futuristic-glow"><Facebook className="h-6 w-6"/></Link>
                <Link href="#" aria-label="Twitter" className="text-muted-foreground hover:text-primary transition-all duration-300 transform hover:scale-125 hover:text-glow-primary p-2 rounded-full hover:bg-primary/10 futuristic-glow"><Twitter className="h-6 w-6"/></Link>
                <Link href="#" aria-label="LinkedIn" className="text-muted-foreground hover:text-primary transition-all duration-300 transform hover:scale-125 hover:text-glow-primary p-2 rounded-full hover:bg-primary/10 futuristic-glow"><Linkedin className="h-6 w-6"/></Link>
                <Link href="#" aria-label="GitHub" className="text-muted-foreground hover:text-primary transition-all duration-300 transform hover:scale-125 hover:text-glow-primary p-2 rounded-full hover:bg-primary/10 futuristic-glow"><Github className="h-6 w-6"/></Link>
            </div>
            <p className="text-base text-muted-foreground scroll-animate">
              Powered by Genkit &amp; Gemini AI &bull; Crafted with Next.js &amp; ShadCN UI &bull; Design for Clarity
            </p>
            <p className="text-sm text-muted-foreground/70 mt-4 scroll-animate" style={{ animationDelay: '0.2s' }}>
              © {new Date().getFullYear()} SaySimple. All rights reserved.
            </p>
        </div>
      </footer>
    </div>
  );
}
