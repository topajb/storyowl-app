export interface MythologyStoryParams {
  childName: string;
  age: number;
  language: string;
  theme: string;
  avatarTraits: string;
  geminiApiKey: string;
}

export interface StoryPage {
  pageNumber: number;
  text: string;
  imagePrompt: string;
  imageUrl?: string;
}

export interface GeneratedMythologyStory {
  id: string;
  title: string;
  childName: string;
  theme: string;
  language: string;
  pages: StoryPage[];
  coverImageUrl?: string;
  heroAvatarUrl?: string;
  createdAt: Date;
  totalPages: number;
}

export class MythologyStoryService {
  async generateStoryWithGemini(params: MythologyStoryParams): Promise<GeneratedMythologyStory> {
    const prompt = this.buildMythologyPrompt(params);
    
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${params.geminiApiKey}`, {
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
          temperature: 0.9,
          topK: 1,
          topP: 1,
          maxOutputTokens: 2048,
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          }
        ]
      })
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.statusText}`);
    }

    const data = await response.json();
    const generatedText = data.candidates[0].content.parts[0].text;
    
    return this.parseStoryResponse(generatedText, params);
  }

  private buildMythologyPrompt(params: MythologyStoryParams): string {
    const themePrompts = {
      'krishna': this.buildKrishnaPrompt(params),
      'ganesha': this.buildGaneshaPrompt(params),
      'hanuman': this.buildHanumanPrompt(params),
      'forest-sages': this.buildForestSagesPrompt(params),
      'talking-animals': this.buildTalkingAnimalsPrompt(params)
    };

    const basePrompt = themePrompts[params.theme as keyof typeof themePrompts] || themePrompts['krishna'];
    
    return `${basePrompt}

IMPORTANT INSTRUCTIONS:
- Create a choose-your-own-adventure style story with 2-3 decision points
- Make the story exactly 8-10 pages long
- Each page should have 2-3 sentences maximum for age ${params.age}
- Include vivid descriptions for Pixar-style illustrations
- Language: ${params.language === 'hindi' ? 'Hindi with English translation in brackets' : 'English'}
- Child avatar: ${params.avatarTraits}
- Make it whimsical, magical, and educational about values like kindness, courage, and wisdom

FORMAT YOUR RESPONSE EXACTLY LIKE THIS:
TITLE: [Story Title]

PAGE 1:
TEXT: [Story text]
IMAGE: [Detailed image prompt for Pixar-style illustration]

PAGE 2:
TEXT: [Story text]
IMAGE: [Detailed image prompt]

[Continue for all pages...]

DECISION 1: [After page 3, offer 2 choices]
CHOICE A: [Brief description]
CHOICE B: [Brief description]

[Continue story based on popular choice...]

DECISION 2: [After page 6, offer 2 choices]
CHOICE A: [Brief description] 
CHOICE B: [Brief description]

[Continue to conclusion...]`;
  }

  private buildKrishnaPrompt(params: MythologyStoryParams): string {
    return `Create a magical story about Lord Krishna for ${params.childName} (age ${params.age}). 
    
The story should feature:
- Young Krishna playing his magical flute in Vrindavan
- Talking peacocks, cows, and forest animals
- The child ${params.childName} discovering Krishna's divine powers
- Lessons about friendship, music, and protecting nature
- Beautiful descriptions of Vrindavan's forests and rivers
- Krishna's playful and wise nature`;
  }

  private buildGaneshaPrompt(params: MythologyStoryParams): string {
    return `Create a wisdom-filled adventure with Lord Ganesha for ${params.childName} (age ${params.age}).
    
The story should feature:
- Ganesha as the remover of obstacles helping a village
- ${params.childName} learning about problem-solving and wisdom
- Colorful festivals, sweets (modaks), and celebrations
- Ganesha's mouse companion Mushak
- Lessons about patience, intelligence, and helping others
- Beautiful temple settings and Indian landscapes`;
  }

  private buildHanumanPrompt(params: MythologyStoryParams): string {
    return `Create an inspiring adventure with Lord Hanuman for ${params.childName} (age ${params.age}).
    
The story should feature:
- Hanuman's incredible strength and devotion
- ${params.childName} learning about courage and service
- Flying through clouds and mountains
- Helping those in need with superhuman abilities
- Lessons about bravery, loyalty, and selflessness
- Epic landscapes of ancient India with mountains and forests`;
  }

  private buildForestSagesPrompt(params: MythologyStoryParams): string {
    return `Create a mystical forest adventure with ancient sages for ${params.childName} (age ${params.age}).
    
The story should feature:
- Wise forest rishis (sages) with magical powers
- ${params.childName} learning ancient wisdom in an ashram
- Talking trees, magical herbs, and forest spirits
- Lessons about meditation, respect for nature, and inner peace
- Beautiful depictions of sacred groves and hermitages
- Ancient Indian forest settings with rivers and wildlife`;
  }

  private buildTalkingAnimalsPrompt(params: MythologyStoryParams): string {
    return `Create a delightful story with talking animals from Indian mythology for ${params.childName} (age ${params.age}).
    
The story should feature:
- Wise elephants, clever monkeys, and noble tigers
- ${params.childName} understanding animal language
- Stories from Panchatantra with moral lessons
- Animal friends working together to solve problems
- Lessons about kindness to all creatures and wisdom
- Vibrant Indian jungle and village settings`;
  }

  private parseStoryResponse(responseText: string, params: MythologyStoryParams): GeneratedMythologyStory {
    const lines = responseText.split('\n').filter(line => line.trim());
    const pages: StoryPage[] = [];
    let title = '';
    let currentPage: Partial<StoryPage> = {};
    let pageNumber = 1;

    for (const line of lines) {
      if (line.startsWith('TITLE:')) {
        title = line.replace('TITLE:', '').trim();
      } else if (line.startsWith('PAGE')) {
        if (currentPage.text && currentPage.imagePrompt) {
          pages.push({
            pageNumber: pageNumber - 1,
            text: currentPage.text,
            imagePrompt: currentPage.imagePrompt
          });
        }
        currentPage = { pageNumber };
        pageNumber++;
      } else if (line.startsWith('TEXT:')) {
        currentPage.text = line.replace('TEXT:', '').trim();
      } else if (line.startsWith('IMAGE:')) {
        currentPage.imagePrompt = line.replace('IMAGE:', '').trim();
      }
    }

    // Add the last page
    if (currentPage.text && currentPage.imagePrompt) {
      pages.push({
        pageNumber: pageNumber - 1,
        text: currentPage.text,
        imagePrompt: currentPage.imagePrompt
      });
    }

    return {
      id: this.generateUUID(),
      title: title || `${params.childName}'s Mythology Adventure`,
      childName: params.childName,
      theme: params.theme,
      language: params.language,
      pages,
      createdAt: new Date(),
      totalPages: pages.length
    };
  }

  async generateImagesWithGemini(story: GeneratedMythologyStory, geminiApiKey: string): Promise<GeneratedMythologyStory> {
    // For now, we'll use placeholder images since Gemini doesn't generate images directly
    // In a real implementation, you'd integrate with image generation APIs
    const updatedPages = story.pages.map(page => ({
      ...page,
      imageUrl: `https://via.placeholder.com/512x512/FFE5B4/8B4513?text=Page+${page.pageNumber + 1}`
    }));

    return {
      ...story,
      pages: updatedPages,
      coverImageUrl: `https://via.placeholder.com/512x512/FFE5B4/8B4513?text=${encodeURIComponent(story.title)}`
    };
  }

  async generateCompleteStory(
    params: MythologyStoryParams,
    onProgress: (progress: number, step: string) => void
  ): Promise<GeneratedMythologyStory> {
    try {
      onProgress(10, 'Creating your magical mythology story...');
      
      const story = await this.generateStoryWithGemini(params);
      
      onProgress(50, 'Adding beautiful illustrations...');
      
      const storyWithImages = await this.generateImagesWithGemini(story, params.geminiApiKey);
      
      onProgress(90, 'Preparing your magical book...');
      
      // Save to localStorage
      this.saveStoryToStorage(storyWithImages);
      
      onProgress(100, 'Your mythology adventure is ready!');
      
      return storyWithImages;
    } catch (error) {
      console.error('Error generating story:', error);
      throw error;
    }
  }

  private saveStoryToStorage(story: GeneratedMythologyStory): void {
    try {
      const existingStories = this.getStoriesFromStorage();
      existingStories.push(story);
      localStorage.setItem('mythologyStories', JSON.stringify(existingStories));
    } catch (error) {
      console.error('Error saving story to storage:', error);
    }
  }

  getStoriesFromStorage(): GeneratedMythologyStory[] {
    try {
      const stored = localStorage.getItem('mythologyStories');
      if (stored) {
        return JSON.parse(stored).map((story: any) => ({
          ...story,
          createdAt: new Date(story.createdAt)
        }));
      }
    } catch (error) {
      console.error('Error loading stories from storage:', error);
    }
    return [];
  }

  private generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
}

export const mythologyStoryService = new MythologyStoryService();