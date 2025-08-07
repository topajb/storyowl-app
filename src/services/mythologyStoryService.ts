export interface MythologyStoryParams {
  childName: string;
  preferredLanguage: string;
  storyTheme: string;
  avatarTraits: string;
  childAge?: number;
}

export interface GeneratedMythologyStory {
  child_name: string;
  story_title: string;
  story_text: string;
  avatar_traits: string;
  language: string;
  story_uuid: string;
  creation_date: string;
  credits_used: number;
  theme: string;
  decisions: StoryDecision[];
}

export interface StoryDecision {
  question: string;
  options: string[];
  selectedOption?: string;
}

class MythologyStoryService {
  private generateStoryUUID(): string {
    return 'story_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
  }

  private buildMythologyPrompt(params: MythologyStoryParams): string {
    const { childName, storyTheme, avatarTraits, preferredLanguage, childAge = 7 } = params;
    
    const themePrompts = {
      'Krishna': `Create a magical story about ${childName} meeting Lord Krishna in the beautiful forests of Vrindavan. Include Krishna's divine flute, peacocks, and gentle cows. The story should feature Krishna's playful nature and his love for butter and music.`,
      
      'Ganesha': `Write an enchanting tale where ${childName} seeks the blessings of Lord Ganesha, the remover of obstacles. Include Ganesha's wisdom, his love for modaks (sweets), his mouse companion Mushak, and how he helps solve problems with intelligence.`,
      
      'Hanuman': `Craft an adventure story where ${childName} meets the mighty Hanuman in a mystical forest. Include Hanuman's incredible strength, his devotion to Rama, his ability to fly, and his protective nature towards children.`,
      
      'Forest Sages': `Create a peaceful story where ${childName} discovers a hidden ashram of wise forest sages. Include their simple life in nature, meditation under banyan trees, friendly forest animals, and ancient wisdom about kindness and courage.`,
      
      'Talking Animals': `Write a delightful tale where ${childName} enters an enchanted forest where all animals can talk. Include wise elephants, clever monkeys, graceful deer, colorful peacocks, and their ancient stories from Indian folklore.`
    };

    const basePrompt = themePrompts[storyTheme as keyof typeof themePrompts] || themePrompts['Krishna'];

    return `
${basePrompt}

IMPORTANT REQUIREMENTS:
- The story must be appropriate for a ${childAge}-year-old child
- Write in ${preferredLanguage} language (if not English, include English translation in parentheses for key terms)
- Include exactly 2-3 decision points where ${childName} must choose between options
- The child avatar should be described as: ${avatarTraits}
- Make the story interactive and engaging with vivid descriptions
- Include moral lessons about kindness, courage, and wisdom
- Keep the tone magical, whimsical, and child-friendly
- Length: approximately 400-600 words
- No scary or frightening elements

FORMAT THE RESPONSE AS A VALID JSON OBJECT:
{
  "story_title": "A creative title in ${preferredLanguage}",
  "story_text": "The complete story with decision points clearly marked as [DECISION 1: question - Option A / Option B]",
  "decisions": [
    {
      "question": "What should ${childName} do?",
      "options": ["Option A description", "Option B description"]
    }
  ],
  "moral_lesson": "Key lesson learned",
  "cultural_elements": ["List of Indian cultural elements included"]
}
`;
  }

  async generateMythologyStory(
    params: MythologyStoryParams,
    onProgress?: (progress: number, step: string) => void
  ): Promise<GeneratedMythologyStory> {
    try {
      onProgress?.(10, 'Connecting to story generation service...');
      
      const prompt = this.buildMythologyPrompt(params);
      
      onProgress?.(30, 'Creating your magical mythology story...');
      
      // Simulate API call - Replace with actual Gemini API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      onProgress?.(70, 'Adding mythological characters and settings...');
      
      // Mock response - Replace with actual API response parsing
      const mockStoryResponse = {
        story_title: `${params.childName} and the Divine Adventure of ${params.storyTheme}`,
        story_text: this.generateMockStory(params),
        decisions: [
          {
            question: `What should ${params.childName} do when meeting ${params.storyTheme}?`,
            options: [
              "Offer a flower and bow respectfully",
              "Ask for a blessing and guidance"
            ]
          },
          {
            question: `How should ${params.childName} help the forest creatures?`,
            options: [
              "Share food and water with them",
              "Listen to their ancient stories"
            ]
          }
        ],
        moral_lesson: "Kindness and respect bring divine blessings",
        cultural_elements: ["Indian mythology", "Forest settings", "Divine beings", "Moral values"]
      };
      
      onProgress?.(90, 'Finalizing your story...');
      
      const story: GeneratedMythologyStory = {
        child_name: params.childName,
        story_title: mockStoryResponse.story_title,
        story_text: mockStoryResponse.story_text,
        avatar_traits: params.avatarTraits,
        language: params.preferredLanguage,
        story_uuid: this.generateStoryUUID(),
        creation_date: new Date().toISOString().split('T')[0],
        credits_used: 1,
        theme: params.storyTheme,
        decisions: mockStoryResponse.decisions
      };
      
      onProgress?.(100, 'Story ready!');
      
      return story;
      
    } catch (error) {
      console.error('Error generating mythology story:', error);
      throw new Error('Failed to generate story. Please try again.');
    }
  }

  private generateMockStory(params: MythologyStoryParams): string {
    const { childName, storyTheme, avatarTraits } = params;
    
    const stories = {
      'Krishna': `Once upon a time, in the mystical land of Vrindavan, ${childName} (${avatarTraits}) was walking through a beautiful forest filled with blooming jasmine flowers and singing birds. The air was sweet with the fragrance of roses and the gentle sound of flowing rivers.

Suddenly, ${childName} heard the most melodious flute music echoing through the trees. Following the enchanting tune, ${childName} discovered Lord Krishna sitting by a crystal-clear pond, playing his divine flute. His peacock feathers glistened in the golden sunlight, and gentle cows gathered around him, listening to the magical music.

Krishna smiled warmly at ${childName} and said, "Welcome, dear child! I have been waiting for you. The forest animals told me you have a kind heart."

[DECISION 1: What should ${childName} do when meeting Krishna? - Offer a flower and bow respectfully / Ask for a blessing and guidance]

Krishna was delighted with ${childName}'s choice and taught ${childName} how to play a simple tune on a wooden flute. Together, they called the forest animals - colorful peacocks danced, butterflies created rainbows in the air, and even the trees seemed to sway with joy.

[DECISION 2: How should ${childName} help the forest creatures? - Share food and water with them / Listen to their ancient stories]

As the day ended, Krishna blessed ${childName} with the gift of bringing joy wherever they go. ${childName} returned home with a heart full of happiness and the magic of Krishna's friendship forever.`,

      'Ganesha': `In a beautiful temple garden filled with lotus flowers and golden marigolds, ${childName} (${avatarTraits}) was searching for someone wise who could help solve a puzzle that had been bothering the village children.

Suddenly, ${childName} saw a gentle elephant-headed figure sitting under a huge banyan tree, with his faithful mouse friend Mushak by his side. It was Lord Ganesha, the remover of obstacles! Sweet modaks were arranged before him, and his eyes twinkled with wisdom and kindness.

"Hello, little one," Ganesha said with a warm smile. "I sense you seek wisdom. Tell me what troubles you."

[DECISION 1: What should ${childName} do when meeting Ganesha? - Offer a flower and bow respectfully / Ask for a blessing and guidance]

Ganesha was pleased and invited ${childName} to sit beside him. He shared his wisdom about how every problem has a solution if we think carefully and act with kindness. He even let ${childName} meet Mushak, who whispered secrets about finding hidden treasures of friendship.

[DECISION 2: How should ${childName} help solve the village puzzle? - Use Ganesha's wisdom to think creatively / Gather all the children to work together]

With Ganesha's blessings and newfound wisdom, ${childName} returned to the village and solved the puzzle, bringing joy to all the children. From that day forward, ${childName} remembered to approach every challenge with patience and kindness.`,

      'Hanuman': `High up in the Himalayan mountains, where the air was fresh and eagles soared, ${childName} (${avatarTraits}) was exploring ancient paths when suddenly the ground began to shake. But it wasn't an earthquake - it was the mighty Hanuman landing gracefully on the mountain peak!

Hanuman's orange-colored body glowed in the sunlight, and his long tail swished playfully. He carried a magnificent mace and wore a gentle smile that made ${childName} feel safe immediately.

"Fear not, brave child," Hanuman said in his deep, kind voice. "I am Hanuman, devotee of Lord Rama. I protect all good children who venture into these sacred mountains."

[DECISION 1: What should ${childName} do when meeting Hanuman? - Ask to hear stories of his adventures / Request to see his incredible strength]

Hanuman was delighted to share his tales of adventure and showed ${childName} how he could leap across mountain tops and how his strength came from his pure devotion and kind heart.

[DECISION 2: How should ${childName} help when they discover lost travelers? - Guide them with Hanuman's wisdom / Use Hanuman's strength to clear the path]

Together, they helped the lost travelers find their way home. Hanuman taught ${childName} that true strength comes from helping others and having courage to do what's right. As a parting gift, he gave ${childName} a small orange flower that would always remind them to be brave and kind.`
    };

    return stories[storyTheme as keyof typeof stories] || stories['Krishna'];
  }
}

export const mythologyStoryService = new MythologyStoryService();