import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronLeft, ChevronRight, Home, Download, Share2, Volume2, VolumeX } from 'lucide-react';
import { cn } from '@/lib/utils';

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
    setIsAudioPlaying(!isAudioPlaying);
  };

  const downloadStory = () => {
    // Implement PDF download functionality
    console.log('Downloading story...');
  };

  const shareStory = () => {
    // Implement sharing functionality
    console.log('Sharing story...');
  };

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
            <Button variant="outline" size="sm" onClick={downloadStory}>
              <Download />
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