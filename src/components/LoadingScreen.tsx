import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Sparkles, Wand2, BookOpen, Star, Heart } from 'lucide-react';

interface LoadingScreenProps {
  progress: number;
  currentStep: string;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ progress, currentStep }) => {
  const [floatingIcons, setFloatingIcons] = useState<Array<{ id: number; icon: React.ReactNode; delay: number }>>([]);

  useEffect(() => {
    const icons = [
      { id: 1, icon: <Sparkles className="text-primary" />, delay: 0 },
      { id: 2, icon: <Wand2 className="text-accent" />, delay: 0.5 },
      { id: 3, icon: <BookOpen className="text-secondary" />, delay: 1 },
      { id: 4, icon: <Star className="text-warning" />, delay: 1.5 },
      { id: 5, icon: <Heart className="text-destructive" />, delay: 2 },
    ];
    setFloatingIcons(icons);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-sky flex items-center justify-center p-4">
      <Card className="storybook-card border-2 border-primary/30 shadow-magical max-w-md w-full">
        <CardContent className="p-8 text-center space-y-6">
          {/* Animated Storybook */}
          <div className="relative mx-auto w-32 h-32 mb-6">
            <div className="absolute inset-0 bg-gradient-magical rounded-xl transform rotate-3 shadow-magical"></div>
            <div className="absolute inset-0 bg-gradient-sunset rounded-xl transform -rotate-3 shadow-soft"></div>
            <div className="relative bg-card rounded-xl p-4 shadow-book flex items-center justify-center">
              <BookOpen className="w-12 h-12 text-primary twinkle" />
            </div>
            
            {/* Floating Magic Icons */}
            <div className="absolute inset-0">
              {floatingIcons.map((item) => (
                <div
                  key={item.id}
                  className="absolute w-6 h-6 float magic-sparkle"
                  style={{
                    top: `${Math.random() * 80}%`,
                    left: `${Math.random() * 80}%`,
                    animationDelay: `${item.delay}s`,
                  }}
                >
                  {item.icon}
                </div>
              ))}
            </div>
          </div>

          {/* Loading Text */}
          <div className="space-y-3">
            <h2 className="story-title text-2xl font-bold text-foreground">
              Creating Your Magical Story
            </h2>
            <p className="story-text text-muted-foreground">
              {currentStep}
            </p>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <Progress value={progress} className="h-3" />
            <p className="text-sm text-muted-foreground">
              {Math.round(progress)}% complete
            </p>
          </div>

          {/* Fun Loading Messages */}
          <div className="space-y-2">
            <div className="flex justify-center gap-2 text-sm text-muted-foreground">
              <Sparkles className="w-4 h-4 twinkle" />
              <span className="story-text">
                Sprinkling magic dust on your story...
              </span>
              <Sparkles className="w-4 h-4 twinkle" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoadingScreen;