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
  language: string;
  geminiKey: string;
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
      console.log('Making request to Gemini API with endpoint:', `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${params.geminiKey.substring(0, 10)}...`);
      
      const requestBody = {
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
      };
      
      console.log('Request body structure:', JSON.stringify(requestBody, null, 2));
      
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${params.geminiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Gemini API error response:', errorText);
        throw new Error(`Gemini API error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('Gemini API response:', data);
      
      if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
        console.error('Unexpected response structure:', data);
        throw new Error('Invalid response structure from Gemini API');
      }
      
      const storyText = data.candidates[0].content.parts[0].text;
      
      return this.parseStoryResponse(storyText);
    } catch (error) {
      console.error('Error generating story with Gemini:', error);
      if (error instanceof Error) {
        throw new Error(`Failed to generate story: ${error.message}`);
      }
      throw new Error('Failed to generate story. Please check your Gemini API key.');
    }
  }

  private buildStoryPrompt(params: StoryGenerationParams): string {
    const ageGuidance = this.getAgeAppropriateGuidance(params.age);
    const readingLevelGuidance = this.getReadingLevelGuidance(params.readingLevel);
    const languageInstruction = params.language !== 'english' 
      ? `\n\nIMPORTANT: Write the entire story in ${this.getLanguageName(params.language)} language. Use proper ${this.getLanguageName(params.language)} grammar, vocabulary, and cultural context appropriate for children. The JSON structure should remain in English, but all story content (title, text) should be in ${this.getLanguageName(params.language)}.`
      : '';
    
    return `Create a personalized children's story with the following specifications:${languageInstruction}

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

  private getLanguageName(languageId: string): string {
    const languages: Record<string, string> = {
      english: 'English',
      hindi: 'Hindi',
      bengali: 'Bengali',
      telugu: 'Telugu',
      marathi: 'Marathi',
      tamil: 'Tamil',
      gujarati: 'Gujarati',
      urdu: 'Urdu',
      kannada: 'Kannada',
      odia: 'Odia',
      punjabi: 'Punjabi',
      malayalam: 'Malayalam',
      assamese: 'Assamese',
      maithili: 'Maithili',
      sanskrit: 'Sanskrit',
      nepali: 'Nepali',
      konkani: 'Konkani',
      manipuri: 'Manipuri',
      bodo: 'Bodo',
      dogri: 'Dogri',
      kashmiri: 'Kashmiri',
      santali: 'Santali',
    };
    return languages[languageId] || 'English';
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

  private async generateImageWithPollinations(prompt: string): Promise<string> {
    try {
      // Clean and enhance the prompt for better image quality
      const enhancedPrompt = `${prompt}, high quality, detailed, beautiful, children's book illustration style, vibrant colors, whimsical, magical`
        .replace(/[^a-zA-Z0-9\s,.-]/g, '') // Remove special characters
        .replace(/\s+/g, ' ') // Replace multiple spaces with single space
        .trim();
      
      // Use the new Pollinations API endpoint with POST method
      const response = await fetch('https://pollinations.ai/api/prompt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: enhancedPrompt,
          model: 'flux',
          width: 1024,
          height: 1024,
          seed: Math.floor(Math.random() * 1000000),
          nologo: true
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const imageUrl = data.url || data.image_url || `https://image.pollinations.ai/prompt/${encodeURIComponent(enhancedPrompt)}?width=1024&height=1024&nologo=true&model=flux`;
      
      console.log('Generated image URL:', imageUrl);
      
      return imageUrl;
    } catch (error) {
      console.error('Error generating image with Pollinations:', error);
      // Fallback to GET method if POST fails
      const enhancedPrompt = `${prompt}, high quality, detailed, beautiful, children's book illustration style, vibrant colors, whimsical, magical`
        .replace(/[^a-zA-Z0-9\s,.-]/g, '')
        .replace(/\s+/g, ' ')
        .trim();
      const encodedPrompt = encodeURIComponent(enhancedPrompt);
      return `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1024&height=1024&seed=${Math.floor(Math.random() * 1000000)}&model=flux&nologo=true`;
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
      story.coverImage = await this.generateImageWithPollinations(story.coverImagePrompt);
      onProgress(60, 'Illustrating story pages...');

      // Generate images for each page
      const totalPages = story.pages.length;
      for (let i = 0; i < story.pages.length; i++) {
        const page = story.pages[i];
        try {
          page.imageUrl = await this.generateImageWithPollinations(page.imagePrompt);
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