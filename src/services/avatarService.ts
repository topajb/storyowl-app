import { HfInference } from '@huggingface/inference';
import { toast } from '@/hooks/use-toast';

interface AvatarData {
  avatarUrl: string;
  description: string;
  originalPhoto: string;
}

class AvatarService {
  private hf: HfInference | null = null;

  initializeHuggingFace(apiKey: string) {
    this.hf = new HfInference(apiKey);
  }

  async generateCartoonAvatar(imageData: string, childName: string): Promise<AvatarData> {
    if (!this.hf) {
      throw new Error('Hugging Face API not initialized');
    }

    try {
      // Generate cartoon avatar using FLUX model
      const result = await this.hf.textToImage({
        inputs: `cartoon avatar of a child, colorful, friendly, animated style, suitable for children's book illustration`,
        model: 'black-forest-labs/FLUX.1-schnell',
      });

      // Handle the result properly - it could be Blob or string
      let avatarUrl: string;
      if (result && typeof result === 'object' && 'arrayBuffer' in (result as any)) {
        // It's a Blob-like object
        const blob = result as Blob;
        const arrayBuffer = await blob.arrayBuffer();
        const base64Avatar = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
        avatarUrl = `data:image/png;base64,${base64Avatar}`;
      } else if (result && typeof result === 'string') {
        // If it's a string URL, use it
        avatarUrl = result;
      } else {
        // Fallback to original photo
        avatarUrl = imageData;
      }

      // Generate description for story prompts
      const description = `a cheerful cartoon character representing ${childName}, with bright colors and friendly appearance`;

      const avatarData: AvatarData = {
        avatarUrl,
        description,
        originalPhoto: imageData,
      };

      // Save to localStorage
      localStorage.setItem('heroAvatar', JSON.stringify(avatarData));

      toast({
        title: "Hero Avatar Created! ✨",
        description: `${childName}'s cartoon avatar is ready for the story!`,
        variant: "default",
      });

      return avatarData;
    } catch (error) {
      console.error('Error generating avatar:', error);
      toast({
        title: "Avatar Generation Failed",
        description: "Using photo directly for now. Your story will still be amazing!",
        variant: "destructive",
      });
      
      // Fallback: use original photo
      const fallbackData: AvatarData = {
        avatarUrl: imageData,
        description: `${childName}, a brave and curious child`,
        originalPhoto: imageData,
      };
      
      localStorage.setItem('heroAvatar', JSON.stringify(fallbackData));
      return fallbackData;
    }
  }

  getStoredAvatar(): AvatarData | null {
    try {
      const stored = localStorage.getItem('heroAvatar');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  }

  clearAvatar() {
    localStorage.removeItem('heroAvatar');
  }
}

export const avatarService = new AvatarService();
export type { AvatarData };