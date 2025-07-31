import { useState, useEffect } from 'react';
import { Story } from '@/types/story';
import { v4 as uuidv4 } from 'uuid';

const STORAGE_KEY = 'storyowl_stories';

export const useStoryGallery = () => {
  const [stories, setStories] = useState<Story[]>([]);

  useEffect(() => {
    const loadStories = () => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsedStories = JSON.parse(stored).map((story: any) => ({
            ...story,
            createdAt: new Date(story.createdAt)
          }));
          setStories(parsedStories);
        }
      } catch (error) {
        console.error('Failed to load stories:', error);
      }
    };

    loadStories();
  }, []);

  const saveStory = (storyData: Omit<Story, 'id' | 'createdAt'>) => {
    const newStory: Story = {
      ...storyData,
      id: uuidv4(),
      createdAt: new Date(),
    };

    const updatedStories = [newStory, ...stories];
    setStories(updatedStories);
    
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedStories));
    } catch (error) {
      console.error('Failed to save story:', error);
    }

    return newStory.id;
  };

  const getStory = (id: string): Story | undefined => {
    return stories.find(story => story.id === id);
  };

  const deleteStory = (id: string) => {
    const updatedStories = stories.filter(story => story.id !== id);
    setStories(updatedStories);
    
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedStories));
    } catch (error) {
      console.error('Failed to delete story:', error);
    }
  };

  const updateStoryProgress = (id: string, progress: number) => {
    const updatedStories = stories.map(story => 
      story.id === id ? { ...story, readingProgress: progress } : story
    );
    setStories(updatedStories);
    
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedStories));
    } catch (error) {
      console.error('Failed to update story progress:', error);
    }
  };

  return {
    stories,
    saveStory,
    getStory,
    deleteStory,
    updateStoryProgress,
  };
};