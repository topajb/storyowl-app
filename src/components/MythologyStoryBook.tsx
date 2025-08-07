import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  BookOpen, 
  ChevronLeft, 
  ChevronRight, 
  Download, 
  Home, 
  Share,
  Heart,
  Star,
  Volume2
} from 'lucide-react';
import { type GeneratedMythologyStory, type StoryDecision } from '@/services/mythologyStoryService';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface MythologyStoryBookProps {
  story: GeneratedMythologyStory;
  onBackHome: () => void;
}

const MythologyStoryBook: React.FC<MythologyStoryBookProps> = ({ story, onBackHome }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedDecisions, setSelectedDecisions] = useState<{ [key: number]: string }>({});
  const [isReading, setIsReading] = useState(false);

  // Split story text into pages for better reading experience
  const storyPages = React.useMemo(() => {
    const paragraphs = story.story_text.split('\n\n').filter(p => p.trim());
    const pages = [];
    let currentPageText = '';
    
    for (const paragraph of paragraphs) {
      if (currentPageText.length + paragraph.length > 800) {
        if (currentPageText) {
          pages.push(currentPageText.trim());
          currentPageText = paragraph;
        } else {
          pages.push(paragraph);
        }
      } else {
        currentPageText += (currentPageText ? '\n\n' : '') + paragraph;
      }
    }
    
    if (currentPageText) {
      pages.push(currentPageText.trim());
    }
    
    return pages;
  }, [story.story_text]);

  const totalPages = storyPages.length;
  const progress = ((currentPage + 1) / totalPages) * 100;

  const handleDecisionSelect = (decisionIndex: number, option: string) => {
    setSelectedDecisions(prev => ({
      ...prev,
      [decisionIndex]: option
    }));
  };

  const handleTextToSpeech = () => {
    if (isReading) {
      speechSynthesis.cancel();
      setIsReading(false);
      return;
    }

    const currentText = storyPages[currentPage];
    if (currentText && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(currentText);
      utterance.rate = 0.8;
      utterance.pitch = 1.1;
      utterance.volume = 0.9;
      
      utterance.onstart = () => setIsReading(true);
      utterance.onend = () => setIsReading(false);
      utterance.onerror = () => setIsReading(false);
      
      speechSynthesis.speak(utterance);
    }
  };

  const downloadAsPDF = async () => {
    const pdf = new jsPDF();
    
    // Title page
    pdf.setFontSize(20);
    pdf.text(story.story_title, 20, 30);
    
    pdf.setFontSize(12);
    pdf.text(`A story for ${story.child_name}`, 20, 50);
    pdf.text(`Theme: ${story.theme}`, 20, 65);
    pdf.text(`Language: ${story.language}`, 20, 80);
    pdf.text(`Created: ${story.creation_date}`, 20, 95);
    
    // Story content
    pdf.addPage();
    pdf.setFontSize(14);
    
    const pageHeight = pdf.internal.pageSize.height;
    const lineHeight = 7;
    let yPosition = 30;
    
    const lines = pdf.splitTextToSize(story.story_text, 170);
    
    for (const line of lines) {
      if (yPosition > pageHeight - 30) {
        pdf.addPage();
        yPosition = 30;
      }
      
      pdf.text(line, 20, yPosition);
      yPosition += lineHeight;
    }
    
    // Download
    pdf.save(`${story.child_name}-${story.theme}-Story.pdf`);
  };

  const shareStory = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: story.story_title,
          text: `Check out this magical mythology story created for ${story.child_name}!`,
          url: window.location.href
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback to copying URL
      navigator.clipboard.writeText(window.location.href);
      alert('Story link copied to clipboard!');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-sky">
      {/* Header */}
      <div className="border-b border-accent/20 bg-card/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={onBackHome}>
                <Home className="w-4 h-4 mr-2" />
                Home
              </Button>
              <div>
                <h1 className="font-semibold text-lg">{story.story_title}</h1>
                <p className="text-sm text-muted-foreground">
                  A story for {story.child_name} • {story.theme}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={handleTextToSpeech}>
                <Volume2 className={`w-4 h-4 ${isReading ? 'text-primary' : ''}`} />
              </Button>
              <Button variant="ghost" size="sm" onClick={shareStory}>
                <Share className="w-4 h-4" />
              </Button>
              <Button variant="divine" size="sm" onClick={downloadAsPDF}>
                <Download className="w-4 h-4 mr-2" />
                PDF
              </Button>
            </div>
          </div>
          
          {/* Progress */}
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">
                Page {currentPage + 1} of {totalPages}
              </span>
              <span className="text-sm text-muted-foreground">
                {Math.round(progress)}% complete
              </span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </div>
      </div>

      {/* Story Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Card className="storybook-card shadow-book border-2 border-accent/20">
            <CardContent className="p-8">
              {/* Story Metadata */}
              <div className="flex flex-wrap gap-2 mb-6">
                <Badge variant="secondary">
                  <BookOpen className="w-3 h-3 mr-1" />
                  {story.theme}
                </Badge>
                <Badge variant="outline">
                  {story.language}
                </Badge>
                <Badge variant="outline">
                  <Heart className="w-3 h-3 mr-1 text-destructive" />
                  For {story.child_name}
                </Badge>
                <Badge variant="outline">
                  <Star className="w-3 h-3 mr-1 text-warning" />
                  {story.credits_used} credit used
                </Badge>
              </div>

              {/* Story Text */}
              <div className="story-text text-lg leading-relaxed mb-8">
                <div className="prose prose-lg max-w-none">
                  {storyPages[currentPage]?.split('\n').map((paragraph, index) => (
                    <p key={index} className="mb-4">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>

              {/* Interactive Decisions */}
              {story.decisions && story.decisions.length > 0 && (
                <div className="space-y-4 mb-8">
                  <h3 className="text-xl font-semibold text-center mb-4">
                    🌟 Choose Your Adventure 🌟
                  </h3>
                  
                  {story.decisions.map((decision, decisionIndex) => (
                    <Card key={decisionIndex} className="border-primary/20 bg-primary/5">
                      <CardContent className="p-6">
                        <h4 className="font-medium text-lg mb-4 text-center">
                          {decision.question}
                        </h4>
                        <div className="grid md:grid-cols-2 gap-3">
                          {decision.options.map((option, optionIndex) => (
                            <Button
                              key={optionIndex}
                              variant={selectedDecisions[decisionIndex] === option ? "divine" : "whimsical"}
                              className="h-auto p-4 text-left whitespace-normal"
                              onClick={() => handleDecisionSelect(decisionIndex, option)}
                            >
                              <div className="text-sm">
                                <span className="font-medium block mb-1">
                                  Option {optionIndex + 1}:
                                </span>
                                {option}
                              </div>
                            </Button>
                          ))}
                        </div>
                        {selectedDecisions[decisionIndex] && (
                          <div className="mt-4 p-3 bg-success/10 rounded-lg border border-success/20">
                            <p className="text-sm text-success-foreground">
                              ✨ {story.child_name} chose: "{selectedDecisions[decisionIndex]}"
                            </p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {/* Navigation */}
              <div className="flex items-center justify-between pt-6 border-t border-accent/20">
                <Button
                  variant="forest"
                  onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                  disabled={currentPage === 0}
                >
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Previous Page
                </Button>

                <div className="text-center">
                  <p className="text-sm text-muted-foreground">
                    Swipe or use buttons to turn pages
                  </p>
                </div>

                <Button
                  variant="forest"
                  onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
                  disabled={currentPage === totalPages - 1}
                >
                  Next Page
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Story Complete Message */}
          {currentPage === totalPages - 1 && (
            <Card className="mt-6 border-success/30 bg-success/5">
              <CardContent className="p-6 text-center">
                <h3 className="text-xl font-semibold mb-2 text-success">
                  🎉 Story Complete! 🎉
                </h3>
                <p className="text-muted-foreground mb-4">
                  {story.child_name} has finished their magical mythology adventure!
                </p>
                <div className="flex flex-wrap gap-3 justify-center">
                  <Button variant="divine" onClick={downloadAsPDF}>
                    <Download className="w-4 h-4 mr-2" />
                    Download PDF
                  </Button>
                  <Button variant="magical" onClick={onBackHome}>
                    <BookOpen className="w-4 h-4 mr-2" />
                    Create Another Story
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default MythologyStoryBook;