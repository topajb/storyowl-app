import React, { useState } from 'react';
import WelcomeScreen from '@/components/WelcomeScreen';
import StoryForm from '@/components/StoryForm';
import LoadingScreen from '@/components/LoadingScreen';
import StoryBook from '@/components/StoryBook';
import { storyService, type StoryGenerationParams, type GeneratedStory } from '@/services/storyService';

type AppState = 'welcome' | 'form' | 'loading' | 'reading';

const Index = () => {
  const [currentState, setCurrentState] = useState<AppState>('welcome');
  const [generatedStory, setGeneratedStory] = useState<GeneratedStory | null>(null);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingStep, setLoadingStep] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleStartCreating = () => {
    setCurrentState('form');
  };

  const handleFormSubmit = async (formData: StoryGenerationParams) => {
    setIsGenerating(true);
    setCurrentState('loading');
    setLoadingProgress(0);
    setLoadingStep('Initializing story creation...');

    try {
      const story = await storyService.generateCompleteStory(
        formData,
        (progress, step) => {
          setLoadingProgress(progress);
          setLoadingStep(step);
        }
      );

      setGeneratedStory(story);
      setCurrentState('reading');
    } catch (error) {
      console.error('Failed to generate story:', error);
      setCurrentState('form');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleBackHome = () => {
    setCurrentState('welcome');
    setGeneratedStory(null);
    setLoadingProgress(0);
    setLoadingStep('');
  };

  switch (currentState) {
    case 'welcome':
      return <WelcomeScreen onStartCreating={handleStartCreating} />;
    
    case 'form':
      return <StoryForm onSubmit={handleFormSubmit} isLoading={isGenerating} />;
    
    case 'loading':
      return <LoadingScreen progress={loadingProgress} currentStep={loadingStep} />;
    
    case 'reading':
      return generatedStory ? (
        <StoryBook story={generatedStory} onBackHome={handleBackHome} />
      ) : (
        <WelcomeScreen onStartCreating={handleStartCreating} />
      );
    
    default:
      return <WelcomeScreen onStartCreating={handleStartCreating} />;
  }
};

export default Index;
