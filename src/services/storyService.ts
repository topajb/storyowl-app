import { toast } from '@/hooks/use-toast';

export interface StoryGenerationParams {
  childName: string;
  age: number;
  theme: string;
  characters: string;
  plot: string;
  pageCount: number;
  moralLesson: string;
  readingLevel: string;
  geminiKey: string;
  openaiKey: string;
}

export interface StoryPage {
  pageNumber: number;
  text: string;
  imagePrompt: string;
  imageUrl?: string;
}

export interface GeneratedStory {
  title: string;
  pages: StoryPage[];
  coverImagePrompt: string;
  coverImage?: string;
}

class StoryService {
  private async generateStoryWithGemini(params: StoryGenerationParams): Promise<GeneratedStory> {
    const prompt = this.buildStoryPrompt(params);
    
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${params.geminiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: 0.8,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 8192,
          }
        }),
      });

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.status}`);
      }

      const data = await response.json();
      const storyText = data.candidates[0].content.parts[0].text;
      
      return this.parseStoryResponse(storyText);
    } catch (error) {
      console.error('Error generating story with Gemini:', error);
      throw new Error('Failed to generate story. Please check your Gemini API key.');
    }
  }

  private buildStoryPrompt(params: StoryGenerationParams): string {
    const ageGuidance = this.getAgeAppropriateGuidance(params.age);
    const readingLevelGuidance = this.getReadingLevelGuidance(params.readingLevel);
    
    return `Create a personalized children's story with the following specifications:

STORY DETAILS:
- Child's name: ${params.childName}
- Age: ${params.age} years old
- Theme: ${params.theme}
- Main characters: ${params.characters || 'Let the AI decide'}
- Plot: ${params.plot || 'Create an original adventure'}
- Moral lesson: ${params.moralLesson || 'Include a positive message'}
- Number of pages: ${params.pageCount}

WRITING GUIDELINES:
${ageGuidance}
${readingLevelGuidance}

RESPONSE FORMAT:
Please return the story in the following JSON format:
{
  "title": "Story Title",
  "coverImagePrompt": "Detailed prompt for cover illustration",
  "pages": [
    {
      "pageNumber": 1,
      "text": "Page text content",
      "imagePrompt": "Detailed prompt for page illustration"
    }
  ]
}

IMPORTANT REQUIREMENTS:
1. Make ${params.childName} the main character or hero of the story
2. Use age-appropriate language and concepts
3. Include vivid descriptions for illustrations
4. Each page should have 1-3 sentences for younger children, 2-4 for older
5. Image prompts should be detailed and child-friendly
6. Ensure the story flows naturally across ${params.pageCount} pages
7. Include a satisfying conclusion with the moral lesson
8. Make the story engaging and interactive

Please create a magical, engaging story that ${params.childName} will love!`;
  }

  private getAgeAppropriateGuidance(age: number): string {
    if (age <= 3) {
      return "- Use very simple words and short sentences\n- Focus on basic concepts like colors, shapes, and emotions\n- Include repetitive phrases\n- Keep the story very simple and comforting";
    } else if (age <= 6) {
      return "- Use simple vocabulary with occasional new words\n- Short, clear sentences\n- Include basic emotions and simple problem-solving\n- Add some rhyming if possible";
    } else if (age <= 9) {
      return "- Use more complex vocabulary\n- Introduce basic adventure and friendship themes\n- Include simple moral lessons\n- Use descriptive language for imagery";
    } else {
      return "- Use rich vocabulary and complex sentence structures\n- Include deeper themes like courage, perseverance, and empathy\n- Add some educational elements\n- Create more sophisticated plot developments";
    }
  }

  private getReadingLevelGuidance(level: string): string {
    switch (level) {
      case 'beginner':
        return "- Use simple, common words\n- Very short sentences (3-8 words)\n- Repeat key phrases\n- Focus on basic actions and emotions";
      case 'intermediate':
        return "- Mix simple and slightly complex words\n- Medium-length sentences (5-12 words)\n- Introduce new vocabulary gradually\n- Include some descriptive language";
      case 'advanced':
        return "- Use rich, varied vocabulary\n- Longer, complex sentences\n- Include challenging but age-appropriate words\n- Use metaphors and detailed descriptions";
      default:
        return "- Use age-appropriate vocabulary\n- Vary sentence length\n- Include engaging descriptions";
    }
  }

  private parseStoryResponse(responseText: string): GeneratedStory {
    try {
      // Try to extract JSON from the response
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in response');
      }

      const storyData = JSON.parse(jsonMatch[0]);
      
      // Validate the structure
      if (!storyData.title || !storyData.pages || !Array.isArray(storyData.pages)) {
        throw new Error('Invalid story structure');
      }

      return {
        title: storyData.title,
        pages: storyData.pages.map((page: any, index: number) => ({
          pageNumber: page.pageNumber || index + 1,
          text: page.text || '',
          imagePrompt: page.imagePrompt || `Illustration for page ${index + 1}`,
        })),
        coverImagePrompt: storyData.coverImagePrompt || `Cover illustration for ${storyData.title}`,
      };
    } catch (error) {
      console.error('Error parsing story response:', error);
      
      // Fallback: create a simple story structure from the text
      const lines = responseText.split('\n').filter(line => line.trim());
      const title = lines[0] || 'A Magical Story';
      
      return {
        title,
        pages: [
          {
            pageNumber: 1,
            text: "Once upon a time, there was a wonderful adventure waiting to begin...",
            imagePrompt: "A magical beginning scene with sparkles and wonder",
          }
        ],
        coverImagePrompt: `Cover illustration for ${title}`,
      };
    }
  }

  private async generateImageWithOpenAI(prompt: string, openaiKey: string): Promise<string> {
    try {
      const enhancedPrompt = `Children's book illustration: ${prompt}. Soft, colorful, child-friendly art style, whimsical and magical, suitable for children, high quality digital art, warm lighting`;

      const response = await fetch('https://api.openai.com/v1/images/generations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${openaiKey}`,
        },
        body: JSON.stringify({
          model: 'dall-e-3',
          prompt: enhancedPrompt,
          size: '1024x1024',
          quality: 'standard',
          n: 1,
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const data = await response.json();
      return data.data[0].url;
    } catch (error) {
      console.error('Error generating image with OpenAI:', error);
      throw new Error('Failed to generate image. Please check your OpenAI API key.');
    }
  }

  async generateCompleteStory(
    params: StoryGenerationParams,
    onProgress: (progress: number, step: string) => void
  ): Promise<GeneratedStory> {
    try {
      onProgress(10, 'Generating your magical story...');
      
      // Generate the story text
      const story = await this.generateStoryWithGemini(params);
      onProgress(40, 'Creating beautiful cover art...');

      // Generate cover image
      story.coverImage = await this.generateImageWithOpenAI(story.coverImagePrompt, params.openaiKey);
      onProgress(60, 'Illustrating story pages...');

      // Generate images for each page
      const totalPages = story.pages.length;
      for (let i = 0; i < story.pages.length; i++) {
        const page = story.pages[i];
        try {
          page.imageUrl = await this.generateImageWithOpenAI(page.imagePrompt, params.openaiKey);
          const progress = 60 + ((i + 1) / totalPages) * 35;
          onProgress(progress, `Illustrating page ${i + 1} of ${totalPages}...`);
        } catch (error) {
          console.error(`Error generating image for page ${i + 1}:`, error);
          // Continue with other pages even if one fails
        }
      }

      onProgress(100, 'Story complete! Preparing your magical book...');
      
      toast({
        title: "Story Created Successfully!",
        description: `"${story.title}" is ready to read!`,
        variant: "default",
      });

      return story;
    } catch (error) {
      console.error('Error in generateCompleteStory:', error);
      toast({
        title: "Story Creation Failed",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      });
      throw error;
    }
  }
}

export const storyService = new StoryService();