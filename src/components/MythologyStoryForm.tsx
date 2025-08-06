import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { 
  Palette, 
  User, 
  Globe, 
  Heart, 
  Sparkles, 
  Crown,
  Mountain,
  TreePine,
  Zap,
  Key
} from 'lucide-react';
import { MythologyStoryParams } from '@/services/mythologyStoryService';

interface MythologyStoryFormProps {
  onSubmit: (params: MythologyStoryParams) => void;
  isLoading: boolean;
}

const themes = [
  {
    id: 'krishna',
    name: 'Krishna Adventures',
    icon: '🐮',
    color: 'hsl(var(--peacock-blue))',
    description: 'Magical flute melodies and playful adventures in Vrindavan'
  },
  {
    id: 'ganesha',
    name: 'Ganesha Wisdom',
    icon: '🐘',
    color: 'hsl(var(--temple-orange))',
    description: 'Problem-solving adventures with the beloved elephant god'
  },
  {
    id: 'hanuman',
    name: 'Hanuman Courage',
    icon: '💪',
    color: 'hsl(var(--saffron))',
    description: 'Epic tales of strength, devotion, and bravery'
  },
  {
    id: 'forest-sages',
    name: 'Forest Sages',
    icon: '🧘',
    color: 'hsl(var(--forest-green))',
    description: 'Mystical wisdom from ancient rishis in sacred groves'
  },
  {
    id: 'talking-animals',
    name: 'Talking Animals',
    icon: '🐅',
    color: 'hsl(var(--lotus-pink))',
    description: 'Panchatantra-inspired tales with wise animal friends'
  }
];

const languages = [
  { id: 'english', name: 'English', nativeName: 'English' },
  { id: 'hindi', name: 'Hindi', nativeName: 'हिंदी' }
];

const MythologyStoryForm: React.FC<MythologyStoryFormProps> = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState<MythologyStoryParams>({
    childName: '',
    age: 6,
    language: 'english',
    theme: '',
    avatarTraits: '',
    geminiApiKey: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.childName.trim()) {
      alert('Please enter your child\'s name');
      return;
    }
    
    if (!formData.theme) {
      alert('Please select a story theme');
      return;
    }
    
    if (!formData.avatarTraits.trim()) {
      alert('Please describe your child\'s avatar traits');
      return;
    }
    
    if (!formData.geminiApiKey.trim()) {
      alert('Please enter your Gemini API key');
      return;
    }
    
    onSubmit(formData);
  };

  const updateFormData = (field: keyof MythologyStoryParams, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const isFormValid = formData.childName.trim() && 
                     formData.theme && 
                     formData.avatarTraits.trim() && 
                     formData.geminiApiKey.trim();

  return (
    <div className="min-h-screen bg-gradient-sky p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="story-title text-4xl font-bold text-foreground mb-4">
            Create Your Mythology Adventure
          </h1>
          <p className="text-muted-foreground text-lg">
            Let's create a magical Indian mythology story personalized for your child
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* API Key Section */}
          <Card className="story-form shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="w-5 h-5 text-primary" />
                Gemini API Configuration
              </CardTitle>
              <CardDescription>
                Enter your Google Gemini API key to generate stories
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="apiKey">Gemini API Key</Label>
                <Input
                  id="apiKey"
                  type="password"
                  placeholder="Enter your Gemini API key"
                  value={formData.geminiApiKey}
                  onChange={(e) => updateFormData('geminiApiKey', e.target.value)}
                  className="mt-1"
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Get your API key from{' '}
                  <a 
                    href="https://makersuite.google.com/app/apikey" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    Google AI Studio
                  </a>
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Child Information */}
          <Card className="story-form shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5 text-primary" />
                About Your Child
              </CardTitle>
              <CardDescription>
                Tell us about the young hero of this story
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="childName">Child's Name</Label>
                <Input
                  id="childName"
                  placeholder="Enter your child's name"
                  value={formData.childName}
                  onChange={(e) => updateFormData('childName', e.target.value)}
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label>Age: {formData.age} years</Label>
                <Slider
                  value={[formData.age]}
                  onValueChange={(value) => updateFormData('age', value[0])}
                  max={12}
                  min={3}
                  step={1}
                  className="mt-2"
                />
                <div className="flex justify-between text-sm text-muted-foreground mt-1">
                  <span>3 years</span>
                  <span>12 years</span>
                </div>
              </div>

              <div>
                <Label htmlFor="language">Preferred Language</Label>
                <Select value={formData.language} onValueChange={(value) => updateFormData('language', value)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {languages.map((lang) => (
                      <SelectItem key={lang.id} value={lang.id}>
                        <div className="flex items-center gap-2">
                          <Globe className="w-4 h-4" />
                          {lang.name} ({lang.nativeName})
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="avatarTraits">Avatar Description</Label>
                <Textarea
                  id="avatarTraits"
                  placeholder="Describe how your child should appear in the story (e.g., 'A cheerful 6-year-old boy with curly hair wearing a yellow kurta')"
                  value={formData.avatarTraits}
                  onChange={(e) => updateFormData('avatarTraits', e.target.value)}
                  className="mt-1"
                  rows={3}
                />
                <p className="text-sm text-muted-foreground mt-1">
                  This helps create consistent character illustrations throughout the story
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Theme Selection */}
          <Card className="story-form shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="w-5 h-5 text-primary" />
                Choose Your Mythology Theme
              </CardTitle>
              <CardDescription>
                Select which mythological adventure to explore
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {themes.map((theme) => (
                  <div
                    key={theme.id}
                    className={`cursor-pointer rounded-lg border-2 p-4 transition-all duration-300 ${
                      formData.theme === theme.id
                        ? 'border-primary bg-primary/5 shadow-magical'
                        : 'border-accent/20 hover:border-primary/30 hover:shadow-soft'
                    }`}
                    onClick={() => updateFormData('theme', theme.id)}
                  >
                    <div className="text-center space-y-2">
                      <div className="text-3xl mb-2">{theme.icon}</div>
                      <h3 className="font-semibold text-foreground">{theme.name}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {theme.description}
                      </p>
                      {formData.theme === theme.id && (
                        <Badge variant="default" className="mt-2">
                          <Heart className="w-3 h-3 mr-1" />
                          Selected
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="text-center">
            <Button
              type="submit"
              variant="magical"
              size="xl"
              disabled={!isFormValid || isLoading}
              className="shadow-magical"
            >
              {isLoading ? (
                <>
                  <div className="loading-dots w-2 h-2 bg-white rounded-full mr-2"></div>
                  Creating Your Story...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2" />
                  Create Magical Story
                  <Crown className="ml-2" />
                </>
              )}
            </Button>
            
            {!isFormValid && (
              <p className="text-sm text-muted-foreground mt-2">
                Please fill in all required fields to continue
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default MythologyStoryForm;