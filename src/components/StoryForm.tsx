import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Star, Sparkles, Heart, Rocket, Fish, TreePine, Castle, Wand2 } from 'lucide-react';

interface StoryFormData {
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

interface StoryFormProps {
  onSubmit: (data: StoryFormData) => void;
  isLoading: boolean;
}

const themes = [
  { id: 'space', name: 'Space Adventure', icon: Rocket, color: 'bg-gradient-to-r from-purple-500 to-blue-500' },
  { id: 'underwater', name: 'Underwater World', icon: Fish, color: 'bg-gradient-to-r from-blue-400 to-teal-500' },
  { id: 'forest', name: 'Magical Forest', icon: TreePine, color: 'bg-gradient-to-r from-green-400 to-emerald-500' },
  { id: 'fairy-tale', name: 'Fairy Tale Castle', icon: Castle, color: 'bg-gradient-to-r from-pink-400 to-purple-500' },
  { id: 'magic', name: 'Wizard School', icon: Wand2, color: 'bg-gradient-to-r from-indigo-500 to-purple-600' },
];

const StoryForm: React.FC<StoryFormProps> = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState<StoryFormData>({
    childName: '',
    age: 5,
    theme: '',
    characters: '',
    plot: '',
    pageCount: 8,
    moralLesson: '',
    readingLevel: 'beginner',
    geminiKey: '',
    openaiKey: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const updateFormData = (field: keyof StoryFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="text-center mb-8">
        <h2 className="story-title text-4xl font-bold text-foreground mb-4 flex items-center justify-center gap-3">
          <Sparkles className="text-primary twinkle" />
          Create Your Magical Story
          <Sparkles className="text-primary twinkle" />
        </h2>
        <p className="text-muted-foreground text-lg">
          Let's create a wonderful, personalized story just for you!
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* API Keys Section */}
        <Card className="storybook-card border-2 border-accent/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="text-warning" />
              API Configuration
            </CardTitle>
            <CardDescription>
              Add your API keys to power the story generation magic!
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="geminiKey" className="text-sm font-medium">
                Gemini API Key (for story generation)
              </Label>
              <Input
                id="geminiKey"
                type="password"
                placeholder="Enter your Gemini API key..."
                value={formData.geminiKey}
                onChange={(e) => updateFormData('geminiKey', e.target.value)}
                className="mt-1"
                required
              />
            </div>
            <div>
              <Label htmlFor="openaiKey" className="text-sm font-medium">
                OpenAI API Key (for image generation)
              </Label>
              <Input
                id="openaiKey"
                type="password"
                placeholder="Enter your OpenAI API key..."
                value={formData.openaiKey}
                onChange={(e) => updateFormData('openaiKey', e.target.value)}
                className="mt-1"
                required
              />
            </div>
          </CardContent>
        </Card>

        {/* Child Information */}
        <Card className="storybook-card border-2 border-primary/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="text-destructive" />
              About the Little Reader
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="childName" className="text-sm font-medium">
                Child's Name
              </Label>
              <Input
                id="childName"
                placeholder="What's the hero's name?"
                value={formData.childName}
                onChange={(e) => updateFormData('childName', e.target.value)}
                className="mt-1"
                required
              />
            </div>
            <div>
              <Label className="text-sm font-medium">
                Age: {formData.age} years old
              </Label>
              <Slider
                value={[formData.age]}
                onValueChange={(value) => updateFormData('age', value[0])}
                max={12}
                min={1}
                step={1}
                className="mt-2"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>1 year</span>
                <span>12 years</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Theme Selection */}
        <Card className="storybook-card border-2 border-accent/30">
          <CardHeader>
            <CardTitle>Choose Your Adventure Theme</CardTitle>
            <CardDescription>Pick a magical world to explore!</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {themes.map((theme) => {
                const IconComponent = theme.icon;
                return (
                  <div
                    key={theme.id}
                    className={`p-4 rounded-xl cursor-pointer transition-all duration-300 ${
                      formData.theme === theme.id
                        ? 'ring-4 ring-primary shadow-magical scale-105'
                        : 'hover:scale-105 hover:shadow-soft'
                    } ${theme.color} text-white`}
                    onClick={() => updateFormData('theme', theme.id)}
                  >
                    <IconComponent className="mx-auto mb-2 h-8 w-8" />
                    <p className="text-center font-medium text-sm">{theme.name}</p>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Story Details */}
        <Card className="storybook-card border-2 border-secondary/30">
          <CardHeader>
            <CardTitle>Story Details</CardTitle>
            <CardDescription>Tell us about your amazing story!</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="characters" className="text-sm font-medium">
                Main Characters
              </Label>
              <Input
                id="characters"
                placeholder="A brave little dragon, a wise owl, a friendly bear..."
                value={formData.characters}
                onChange={(e) => updateFormData('characters', e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="plot" className="text-sm font-medium">
                Story Plot (optional)
              </Label>
              <Textarea
                id="plot"
                placeholder="What adventure should happen? Leave blank for AI surprise!"
                value={formData.plot}
                onChange={(e) => updateFormData('plot', e.target.value)}
                className="mt-1 min-h-20"
              />
            </div>
            <div>
              <Label htmlFor="moralLesson" className="text-sm font-medium">
                Moral Lesson (optional)
              </Label>
              <Input
                id="moralLesson"
                placeholder="Friendship, kindness, courage, honesty..."
                value={formData.moralLesson}
                onChange={(e) => updateFormData('moralLesson', e.target.value)}
                className="mt-1"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium">
                  Number of Pages: {formData.pageCount}
                </Label>
                <Slider
                  value={[formData.pageCount]}
                  onValueChange={(value) => updateFormData('pageCount', value[0])}
                  max={15}
                  min={3}
                  step={1}
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="readingLevel" className="text-sm font-medium">
                  Reading Level
                </Label>
                <Select value={formData.readingLevel} onValueChange={(value) => updateFormData('readingLevel', value)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner (Simple words)</SelectItem>
                    <SelectItem value="intermediate">Intermediate (Longer sentences)</SelectItem>
                    <SelectItem value="advanced">Advanced (Complex vocabulary)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Button
          type="submit"
          variant="magical"
          size="xl"
          className="w-full"
          disabled={isLoading || !formData.childName || !formData.theme || !formData.geminiKey || !formData.openaiKey}
        >
          {isLoading ? (
            <>
              <Sparkles className="animate-spin" />
              Creating Your Magical Story...
            </>
          ) : (
            <>
              <Wand2 />
              Create My Story!
            </>
          )}
        </Button>
      </form>
    </div>
  );
};

export default StoryForm;