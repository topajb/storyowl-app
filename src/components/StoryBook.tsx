import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronLeft, ChevronRight, Home, Download, Share2, Volume2, VolumeX } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface StoryPage {
  pageNumber: number;
  text: string;
  imageUrl?: string;
}

interface Story {
  title: string;
  pages: StoryPage[];
  coverImage?: string;
}

interface StoryBookProps {
  story: Story;
  onBackHome: () => void;
}

const StoryBook: React.FC<StoryBookProps> = ({ story, onBackHome }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [isPageTurning, setIsPageTurning] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const speechSynthRef = useRef<SpeechSynthesisUtterance | null>(null);
  const storyBookRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const totalPages = story.pages.length + 1; // +1 for cover

  const handlePageTurn = (direction: 'next' | 'prev') => {
    if (isPageTurning) return;
    
    setIsPageTurning(true);
    
    if (direction === 'next' && currentPage < totalPages - 1) {
      setCurrentPage(prev => prev + 1);
    } else if (direction === 'prev' && currentPage > 0) {
      setCurrentPage(prev => prev - 1);
    }
    
    setTimeout(() => setIsPageTurning(false), 800);
  };

  const toggleAudio = () => {
    if (isAudioPlaying) {
      // Stop speech
      window.speechSynthesis.cancel();
      setIsAudioPlaying(false);
    } else {
      // Start speech
      const currentText = getCurrentPageText();
      if (currentText) {
        const utterance = new SpeechSynthesisUtterance(currentText);
        utterance.rate = 0.8;
        utterance.pitch = 1.1;
        utterance.volume = 0.9;
        
        utterance.onend = () => {
          setIsAudioPlaying(false);
        };
        
        speechSynthRef.current = utterance;
        window.speechSynthesis.speak(utterance);
        setIsAudioPlaying(true);
        
        toast({
          title: "Reading aloud",
          description: "The story is being read to you!",
        });
      }
    }
  };

  const getCurrentPageText = () => {
    if (currentPage === 0) {
      return `${story.title}. A Magical Story Created Just For You.`;
    } else {
      const page = story.pages[currentPage - 1];
      return page ? page.text : '';
    }
  };

  const downloadStory = async () => {
    setIsDownloading(true);
    try {
      const pdf = new jsPDF();
      pdf.setFontSize(16);
      
      // Add title page
      pdf.text(story.title, 20, 30);
      pdf.setFontSize(12);
      pdf.text('A Magical Story Created Just For You', 20, 50);
      
      // Add each page
      for (let i = 0; i < story.pages.length; i++) {
        pdf.addPage();
        const page = story.pages[i];
        const lines = pdf.splitTextToSize(page.text, 170);
        pdf.text(lines, 20, 30);
        pdf.text(`Page ${i + 1}`, 20, pdf.internal.pageSize.height - 20);
      }
      
      pdf.save(`${story.title.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`);
      
      toast({
        title: "Download complete!",
        description: "Your story has been saved as a PDF.",
      });
    } catch (error) {
      toast({
        title: "Download failed",
        description: "There was an error creating the PDF.",
        variant: "destructive",
      });
    } finally {
      setIsDownloading(false);
    }
  };

  const shareStory = async () => {
    const shareData = {
      title: story.title,
      text: `Check out this amazing story: "${story.title}"`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        toast({
          title: "Story shared!",
          description: "Thank you for sharing this magical story.",
        });
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(`${shareData.title}\n\n${shareData.text}\n\n${shareData.url}`);
        toast({
          title: "Link copied!",
          description: "The story link has been copied to your clipboard.",
        });
      }
    } catch (error) {
      toast({
        title: "Sharing failed",
        description: "There was an error sharing the story.",
        variant: "destructive",
      });
    }
  };

  // Cleanup speech synthesis on unmount
  React.useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  const currentContent = currentPage === 0 ? 'cover' : story.pages[currentPage - 1];

  return (
    <div className="min-h-screen bg-gradient-sky flex flex-col items-center justify-center p-4">
      {/* Story Book Container */}
      <div className="max-w-6xl w-full">
        {/* Controls */}
        <div className="flex justify-between items-center mb-6">
          <Button variant="whimsical" onClick={onBackHome}>
            <Home className="mr-2" />
            Back Home
          </Button>
          
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={toggleAudio}>
              {isAudioPlaying ? <VolumeX /> : <Volume2 />}
            </Button>
            <Button variant="outline" size="sm" onClick={downloadStory} disabled={isDownloading}>
              <Download className={isDownloading ? "animate-spin" : ""} />
            </Button>
            <Button variant="outline" size="sm" onClick={shareStory}>
              <Share2 />
            </Button>
          </div>
        </div>

        {/* Book */}
        <div className="relative mx-auto" style={{ perspective: '1500px' }}>
          <Card className={cn(
            "storybook-card border-4 border-accent/30 shadow-book transition-all duration-800",
            isPageTurning && "page-turn"
          )}>
            <CardContent className="p-0">
              <div className="grid md:grid-cols-2 min-h-[600px]">
                {/* Left Page */}
                <div className="p-8 flex flex-col justify-center items-center bg-card border-r border-border">
                  {currentPage === 0 ? (
                    // Cover Page
                    <div className="text-center space-y-6">
                      <div className="space-y-4">
                        <h1 className="story-title text-4xl md:text-5xl font-bold text-foreground">
                          {story.title}
                        </h1>
                        <div className="w-24 h-1 bg-gradient-magical mx-auto rounded-full"></div>
                        <p className="text-muted-foreground text-lg">
                          A Magical Story Created Just For You
                        </p>
                      </div>
                      {story.coverImage && (
                        <div className="w-48 h-48 mx-auto rounded-2xl overflow-hidden shadow-magical">
                          <img
                            src={story.coverImage}
                            alt="Story Cover"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                    </div>
                  ) : currentPage % 2 === 1 ? (
                    // Left page content
                    <div className="space-y-6 text-center">
                      {currentContent && typeof currentContent === 'object' && currentContent.imageUrl && (
                        <div className="w-full max-w-sm mx-auto rounded-xl overflow-hidden shadow-soft">
                          <img
                            src={currentContent.imageUrl}
                            alt={`Page ${currentContent.pageNumber}`}
                            className="w-full h-64 object-cover"
                          />
                        </div>
                      )}
                    </div>
                  ) : (
                    // Left page text
                    <div className="space-y-4">
                      <p className="story-text text-lg leading-relaxed text-foreground">
                        {currentContent && typeof currentContent === 'object' ? currentContent.text : ''}
                      </p>
                    </div>
                  )}
                </div>

                {/* Right Page */}
                <div className="p-8 flex flex-col justify-center items-center bg-card">
                  {currentPage === 0 ? (
                    // Cover page right side
                    <div className="text-center space-y-4">
                      <div className="text-6xl">📚</div>
                      <p className="story-text text-muted-foreground">
                        Turn the page to begin your adventure...
                      </p>
                    </div>
                  ) : currentPage % 2 === 1 ? (
                    // Right page text
                    <div className="space-y-4">
                      <p className="story-text text-lg leading-relaxed text-foreground">
                        {currentContent && typeof currentContent === 'object' ? currentContent.text : ''}
                      </p>
                    </div>
                  ) : (
                    // Right page image
                    <div className="space-y-6 text-center">
                      {currentContent && typeof currentContent === 'object' && currentContent.imageUrl && (
                        <div className="w-full max-w-sm mx-auto rounded-xl overflow-hidden shadow-soft">
                          <img
                            src={currentContent.imageUrl}
                            alt={`Page ${currentContent.pageNumber}`}
                            className="w-full h-64 object-cover"
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Page Number */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                <span className="text-sm text-muted-foreground bg-card px-3 py-1 rounded-full shadow-soft">
                  Page {currentPage + 1} of {totalPages}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Navigation Buttons */}
          <div className="absolute top-1/2 transform -translate-y-1/2 -left-16">
            <Button
              variant="whimsical"
              size="icon"
              onClick={() => handlePageTurn('prev')}
              disabled={currentPage === 0 || isPageTurning}
              className="rounded-full"
            >
              <ChevronLeft />
            </Button>
          </div>
          
          <div className="absolute top-1/2 transform -translate-y-1/2 -right-16">
            <Button
              variant="whimsical"
              size="icon"
              onClick={() => handlePageTurn('next')}
              disabled={currentPage === totalPages - 1 || isPageTurning}
              className="rounded-full"
            >
              <ChevronRight />
            </Button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-6 max-w-md mx-auto">
          <div className="w-full bg-muted rounded-full h-2">
            <div
              className="bg-gradient-magical h-2 rounded-full transition-all duration-500"
              style={{ width: `${((currentPage + 1) / totalPages) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoryBook;