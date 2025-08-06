import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Home,
  Download,
  Share,
  Volume2,
  VolumeX,
  RotateCcw
} from 'lucide-react';
import { GeneratedMythologyStory } from '@/services/mythologyStoryService';
import { toast } from 'sonner';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface MythologyStoryBookProps {
  story: GeneratedMythologyStory;
  onBackHome: () => void;
}

const MythologyStoryBook: React.FC<MythologyStoryBookProps> = ({ story, onBackHome }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [isReading, setIsReading] = useState(false);
  const bookRef = useRef<HTMLDivElement>(null);
  const speechSynthesis = window.speechSynthesis;

  const totalPages = story.pages.length;
  const isFirstPage = currentPage === 0;
  const isLastPage = currentPage === totalPages - 1;

  const goToNextPage = () => {
    if (!isLastPage) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const goToPreviousPage = () => {
    if (!isFirstPage) {
      setCurrentPage(prev => prev - 1);
    }
  };

  const goToPage = (pageIndex: number) => {
    if (pageIndex >= 0 && pageIndex < totalPages) {
      setCurrentPage(pageIndex);
    }
  };

  const handleReadAloud = () => {
    if (isReading) {
      speechSynthesis.cancel();
      setIsReading(false);
    } else {
      const text = story.pages[currentPage].text;
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.8;
      utterance.pitch = 1.1;
      utterance.onend = () => setIsReading(false);
      speechSynthesis.speak(utterance);
      setIsReading(true);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: story.title,
          text: `Check out this magical mythology story: ${story.title}`,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  const handleDownloadPDF = async () => {
    if (!bookRef.current) return;

    try {
      toast.loading('Generating PDF...');
      
      const pdf = new jsPDF();
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      // Add title page
      pdf.setFontSize(24);
      pdf.text(story.title, pageWidth / 2, 50, { align: 'center' });
      pdf.setFontSize(16);
      pdf.text(`A story for ${story.childName}`, pageWidth / 2, 80, { align: 'center' });
      pdf.text(`Theme: ${story.theme}`, pageWidth / 2, 100, { align: 'center' });
      
      // Add story pages
      for (let i = 0; i < story.pages.length; i++) {
        pdf.addPage();
        pdf.setFontSize(18);
        pdf.text(`Page ${i + 1}`, pageWidth / 2, 30, { align: 'center' });
        
        pdf.setFontSize(12);
        const lines = pdf.splitTextToSize(story.pages[i].text, pageWidth - 40);
        pdf.text(lines, 20, 60);
      }

      pdf.save(`${story.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf`);
      toast.success('PDF downloaded successfully!');
    } catch (error) {
      toast.error('Failed to generate PDF');
      console.error('PDF generation error:', error);
    }
  };

  const restartStory = () => {
    setCurrentPage(0);
    if (isReading) {
      speechSynthesis.cancel();
      setIsReading(false);
    }
  };

  const currentPageData = story.pages[currentPage];

  return (
    <div className="min-h-screen bg-gradient-sky">
      {/* Header */}
      <div className="bg-card/80 backdrop-blur-sm border-b shadow-soft sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={onBackHome}>
                <Home className="w-4 h-4 mr-2" />
                Home
              </Button>
              <div>
                <h1 className="font-bold text-lg text-foreground">{story.title}</h1>
                <p className="text-sm text-muted-foreground">
                  Page {currentPage + 1} of {totalPages}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={handleReadAloud}>
                {isReading ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </Button>
              <Button variant="ghost" size="sm" onClick={restartStory}>
                <RotateCcw className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={handleShare}>
                <Share className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={handleDownloadPDF}>
                <Download className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Story Content */}
      <div className="container mx-auto px-4 py-8" ref={bookRef}>
        <div className="max-w-4xl mx-auto">
          <Card className="storybook-card shadow-book bg-card/95 backdrop-blur-sm overflow-hidden">
            {/* Page Content */}
            <div className="aspect-[4/3] relative">
              {/* Image Section */}
              <div className="h-1/2 bg-gradient-whimsical flex items-center justify-center relative overflow-hidden">
                {currentPageData.imageUrl ? (
                  <img
                    src={currentPageData.imageUrl}
                    alt={`Page ${currentPage + 1} illustration`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-center text-white">
                    <BookOpen className="w-16 h-16 mx-auto mb-4 opacity-60" />
                    <p className="text-sm opacity-80">Illustration: {currentPageData.imagePrompt}</p>
                  </div>
                )}
                
                {/* Page Number Badge */}
                <Badge 
                  variant="secondary" 
                  className="absolute top-4 right-4 bg-white/90 text-foreground"
                >
                  {currentPage + 1} / {totalPages}
                </Badge>
              </div>

              {/* Text Section */}
              <div className="h-1/2 p-8 flex items-center justify-center">
                <div className="text-center max-w-2xl">
                  <p className="story-text text-lg leading-relaxed text-foreground">
                    {currentPageData.text}
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8">
            <Button
              variant="whimsical"
              onClick={goToPreviousPage}
              disabled={isFirstPage}
              className="flex items-center gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </Button>

            {/* Page Indicators */}
            <div className="flex items-center gap-2">
              {story.pages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToPage(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentPage
                      ? 'bg-primary scale-125'
                      : 'bg-muted hover:bg-primary/50'
                  }`}
                />
              ))}
            </div>

            <Button
              variant="whimsical"
              onClick={goToNextPage}
              disabled={isLastPage}
              className="flex items-center gap-2"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>

          {/* Story Info */}
          <div className="mt-8 text-center">
            <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
              <Badge variant="outline">{story.theme}</Badge>
              <Badge variant="outline">{story.language}</Badge>
              <span>Created for {story.childName}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Keyboard Navigation */}
      <div className="fixed bottom-4 right-4 text-xs text-muted-foreground bg-card/80 px-3 py-2 rounded-lg">
        Use ← → arrow keys to navigate
      </div>
    </div>
  );
};

export default MythologyStoryBook;