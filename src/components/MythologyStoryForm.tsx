import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Heart, 
  User, 
  Globe, 
  Palette, 
  Sparkles, 
  Calendar,
  ArrowLeft
} from 'lucide-react';
import { type MythologyStoryParams } from '@/services/mythologyStoryService';

interface MythologyStoryFormProps {
  onSubmit: (params: MythologyStoryParams) => void;
  onBack: () => void;
  isLoading?: boolean;
}

const MythologyStoryForm: React.FC<MythologyStoryFormProps> = ({
  onSubmit,
  onBack,
  isLoading = false
}) => {
  const [formData, setFormData] = useState<MythologyStoryParams>({
    childName: '',
    preferredLanguage: 'English',
    storyTheme: '',
    avatarTraits: '',
    childAge: 7
  });

  const [errors, setErrors] = useState<Partial<MythologyStoryParams>>({});

  const storyThemes = [
    {
      value: 'Krishna',
      label: 'Lord Krishna',
      description: 'Magical adventures in Vrindavan with divine flute music',
      icon: '🦚'
    },
    {
      value: 'Ganesha',
      label: 'Lord Ganesha',
      description: 'Wisdom and obstacle removal with the elephant god',
      icon: '🐘'
    },
    {
      value: 'Hanuman',
      label: 'Hanuman',
      description: 'Strength and courage with the mighty monkey god',
      icon: '🐒'
    },
    {
      value: 'Forest Sages',
      label: 'Forest Sages',
      description: 'Peaceful wisdom from ancient hermit sages',
      icon: '🌳'
    },
    {
      value: 'Talking Animals',
      label: 'Talking Animals',
      description: 'Enchanted forest with wise animal friends',
      icon: '🦌'
    }
  ];

  const languages = [
    'English',
    'Hindi',
    'Tamil',
    'Bengali',
    'Marathi',
    'Telugu',
    'Gujarati',
    'Kannada',
    'Malayalam',
    'Punjabi'
  ];

  const validateForm = (): boolean => {
    const newErrors: Partial<MythologyStoryParams> = {};

    if (!formData.childName.trim()) {
      newErrors.childName = 'Child name is required';
    }

    if (!formData.storyTheme) {
      newErrors.storyTheme = 'Please select a story theme';
    }

    if (!formData.avatarTraits.trim()) {
      newErrors.avatarTraits = 'Please describe your child\'s appearance';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const updateFormData = (field: keyof MythologyStoryParams, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-sky p-4">
      <div className="container mx-auto max-w-2xl">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={onBack}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </div>

        <Card className="story-form border-2 border-accent/30 shadow-magical">
          <CardHeader className="text-center">
            <CardTitle className="story-title text-3xl mb-2">
              Create Your Mythology Story
            </CardTitle>
            <CardDescription className="text-lg">
              Tell us about your child and choose their mythological adventure
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Child Information */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-3">
                  <User className="w-5 h-5 text-primary" />
                  <h3 className="text-lg font-semibold">Child Information</h3>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="childName" className="flex items-center gap-2">
                      <Heart className="w-4 h-4 text-destructive" />
                      Child's Name *
                    </Label>
                    <Input
                      id="childName"
                      placeholder="Enter your child's name"
                      value={formData.childName}
                      onChange={(e) => updateFormData('childName', e.target.value)}
                      className={errors.childName ? 'border-destructive' : ''}
                    />
                    {errors.childName && (
                      <p className="text-sm text-destructive">{errors.childName}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="childAge" className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-accent" />
                      Age
                    </Label>
                    <Select
                      value={formData.childAge?.toString()}
                      onValueChange={(value) => updateFormData('childAge', parseInt(value))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select age" />
                      </SelectTrigger>
                      <SelectContent>
                        {[3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(age => (
                          <SelectItem key={age} value={age.toString()}>
                            {age} years old
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Story Preferences */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-5 h-5 text-primary" />
                  <h3 className="text-lg font-semibold">Story Preferences</h3>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="preferredLanguage" className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-accent" />
                    Preferred Language
                  </Label>
                  <Select
                    value={formData.preferredLanguage}
                    onValueChange={(value) => updateFormData('preferredLanguage', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {languages.map(lang => (
                        <SelectItem key={lang} value={lang}>
                          {lang}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <Label className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-primary" />
                    Choose Story Theme *
                  </Label>
                  <div className="grid md:grid-cols-2 gap-3">
                    {storyThemes.map((theme) => (
                      <Card
                        key={theme.value}
                        className={`cursor-pointer border-2 transition-all duration-300 hover:shadow-soft ${
                          formData.storyTheme === theme.value
                            ? 'border-primary bg-primary/5'
                            : 'border-accent/30 hover:border-primary/50'
                        }`}
                        onClick={() => updateFormData('storyTheme', theme.value)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="text-2xl">{theme.icon}</span>
                            <h4 className="font-semibold">{theme.label}</h4>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {theme.description}
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  {errors.storyTheme && (
                    <p className="text-sm text-destructive">{errors.storyTheme}</p>
                  )}
                </div>
              </div>

              {/* Avatar Description */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-3">
                  <Palette className="w-5 h-5 text-primary" />
                  <h3 className="text-lg font-semibold">Character Description</h3>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="avatarTraits" className="flex items-center gap-2">
                    <Palette className="w-4 h-4 text-accent" />
                    Describe Your Child's Appearance *
                  </Label>
                  <Textarea
                    id="avatarTraits"
                    placeholder="e.g., A cheerful child with curly hair, wearing a bright yellow kurta, loves to smile..."
                    value={formData.avatarTraits}
                    onChange={(e) => updateFormData('avatarTraits', e.target.value)}
                    className={`min-h-[80px] ${errors.avatarTraits ? 'border-destructive' : ''}`}
                  />
                  {errors.avatarTraits && (
                    <p className="text-sm text-destructive">{errors.avatarTraits}</p>
                  )}
                  <p className="text-sm text-muted-foreground">
                    This helps us create a character that looks like your child in the story illustrations.
                  </p>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <Button
                  type="submit"
                  variant="magical"
                  size="xl"
                  className="w-full"
                  disabled={isLoading}
                >
                  <Sparkles className="mr-2" />
                  {isLoading ? 'Creating Your Story...' : 'Create Magical Story'}
                </Button>
              </div>

              {/* Credits Info */}
              <div className="text-center">
                <Badge variant="secondary" className="text-sm">
                  <Heart className="w-3 h-3 mr-1" />
                  This story will use 1 credit
                </Badge>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MythologyStoryForm;