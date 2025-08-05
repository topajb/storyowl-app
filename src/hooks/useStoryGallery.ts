import { useState, useEffect } from 'react';
import { Story } from '@/types/story';
import { v4 as uuidv4 } from 'uuid';
import { useAuth } from './useAuth';
import { useSupabaseStories } from './useSupabaseStories';

const STORAGE_KEY = 'storyowl_stories';

export const useStoryGallery = () => {
  const [localStories, setLocalStories] = useState<Story[]>([]);
  const { user } = useAuth();
  const supabaseStories = useSupabaseStories();

  // Use Supabase stories if authenticated, otherwise use local stories
  const stories = user ? supabaseStories.stories : localStories;

  useEffect(() => {
    // Only load local stories if user is not authenticated
    if (!user) {
      const loadLocalStories = () => {
        try {
          const stored = localStorage.getItem(STORAGE_KEY);
          if (stored) {
            const parsedStories = JSON.parse(stored).map((story: any) => ({
              ...story,
              createdAt: new Date(story.createdAt)
            }));
            setLocalStories(parsedStories);
          }
        } catch (error) {
          console.error('Failed to load stories:', error);
        }
      };

      loadLocalStories();
    }
  }, [user]);

  const saveStory = async (storyData: Omit<Story, 'id' | 'createdAt'>) => {
    if (user) {
      // Save to Supabase if authenticated
      return await supabaseStories.saveStory(storyData);
    } else {
      // Save to localStorage if not authenticated
      const newStory: Story = {
        ...storyData,
        id: uuidv4(),
        createdAt: new Date(),
      };

      const updatedStories = [newStory, ...localStories];
      setLocalStories(updatedStories);
      
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedStories));
      } catch (error) {
        console.error('Failed to save story:', error);
      }

      return newStory.id;
    }
  };

  const getStory = (id: string): Story | undefined => {
    if (user) {
      return supabaseStories.getStory(id);
    } else {
      return localStories.find(story => story.id === id);
    }
  };

  const deleteStory = async (id: string) => {
    if (user) {
      await supabaseStories.deleteStory(id);
    } else {
      const updatedStories = localStories.filter(story => story.id !== id);
      setLocalStories(updatedStories);
      
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedStories));
      } catch (error) {
        console.error('Failed to delete story:', error);
      }
    }
  };

  const updateStoryProgress = async (id: string, progress: number) => {
    if (user) {
      await supabaseStories.updateStoryProgress(id, progress);
    } else {
      const updatedStories = localStories.map(story => 
        story.id === id ? { ...story, readingProgress: progress } : story
      );
      setLocalStories(updatedStories);
      
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedStories));
      } catch (error) {
        console.error('Failed to update story progress:', error);
      }
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