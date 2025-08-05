import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Story } from '@/types/story';
import { useToast } from '@/hooks/use-toast';

export function useSupabaseStories() {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      loadStories();
    } else {
      setStories([]);
    }
  }, [user]);

  const loadStories = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('stories')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedStories: Story[] = (data || []).map(story => {
        const storyData = story.story_data as any; // Type assertion for JSON data
        return {
          id: story.story_uuid || story.id,
          title: story.title,
          childName: story.child_name,
          age: storyData?.age || 0,
          theme: storyData?.theme || '',
          pages: storyData?.pages || [],
          coverImage: storyData?.coverImage,
          coverImageUrl: storyData?.coverImageUrl,
          heroAvatarUrl: storyData?.heroAvatarUrl,
          createdAt: new Date(story.created_at),
          readingProgress: storyData?.readingProgress || 0
        };
      });

      setStories(formattedStories);
    } catch (error: any) {
      console.error('Error loading stories:', error);
      toast({
        title: "Failed to load stories",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const saveStory = async (storyData: Omit<Story, 'id' | 'createdAt'>): Promise<string | null> => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to save your story",
        variant: "destructive"
      });
      return null;
    }

    try {
      setLoading(true);
      const storyId = `${storyData.theme.toLowerCase()}-${Date.now()}`;
      
      const { data, error } = await supabase
        .from('stories')
        .insert({
          user_id: user.id,
          story_uuid: storyId,
          title: storyData.title,
          child_name: storyData.childName,
          language: 'English', // Default for now
          story_data: storyData as any // Type assertion for JSON storage
        })
        .select()
        .single();

      if (error) throw error;

      // Refresh stories list
      await loadStories();
      
      toast({
        title: "Story saved!",
        description: "Your story has been saved to your account",
        variant: "default"
      });

      return storyId;
    } catch (error: any) {
      console.error('Error saving story:', error);
      toast({
        title: "Failed to save story",
        description: error.message,
        variant: "destructive"
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const getStory = (id: string): Story | undefined => {
    return stories.find(story => story.id === id);
  };

  const deleteStory = async (id: string): Promise<void> => {
    if (!user) return;

    try {
      setLoading(true);
      const { error } = await supabase
        .from('stories')
        .delete()
        .eq('user_id', user.id)
        .eq('story_uuid', id);

      if (error) throw error;

      setStories(prev => prev.filter(story => story.id !== id));
      
      toast({
        title: "Story deleted",
        description: "The story has been removed from your collection",
        variant: "default"
      });
    } catch (error: any) {
      console.error('Error deleting story:', error);
      toast({
        title: "Failed to delete story",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updateStoryProgress = async (id: string, progress: number): Promise<void> => {
    if (!user) return;

    try {
      const story = stories.find(s => s.id === id);
      if (!story) return;

      const { error } = await supabase
        .from('stories')
        .update({
          story_data: {
            ...story,
            readingProgress: progress
          } as any // Type assertion for JSON storage
        })
        .eq('user_id', user.id)
        .eq('story_uuid', id);

      if (error) throw error;

      setStories(prev => prev.map(story => 
        story.id === id 
          ? { ...story, readingProgress: progress }
          : story
      ));
    } catch (error: any) {
      console.error('Error updating story progress:', error);
    }
  };

  return {
    stories,
    loading,
    saveStory,
    getStory,
    deleteStory,
    updateStoryProgress,
    loadStories
  };
}