import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Sparkles, Heart, Star, Rocket, Users, Clock, Palette, Wand2 } from 'lucide-react';
import heroImage from '@/assets/storybook-hero.jpg';

interface WelcomeScreenProps {
  onStartCreating: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStartCreating }) => {
  const features = [
    {
      icon: Sparkles,
      title: 'Divine AI Stories',
      description: 'Personalized mythology tales with Krishna, Ganesha, and Hanuman',
      color: 'text-primary'
    },
    {
      icon: Palette,
      title: 'Cultural Illustrations',
      description: 'Beautiful Indian artwork and divine characters',
      color: 'text-accent'
    },
    {
      icon: Heart,
      title: 'Age-Appropriate',
      description: 'Sacred stories adapted for your child\'s understanding',
      color: 'text-destructive'
    },
    {
      icon: Users,
      title: 'Your Child as Hero',
      description: 'Your little one meets gods and learns ancient wisdom',
      color: 'text-secondary'
    },
    {
      icon: Clock,
      title: 'Instant Magic',
      description: 'Divine stories generated in minutes with AI',
      color: 'text-warning'
    },
    {
      icon: BookOpen,
      title: 'Interactive Adventures',
      description: 'Choose-your-own-adventure with moral lessons',
      color: 'text-success'
    }
  ];

  const sampleStories = [
    {
      title: "Krishna's Divine Flute",
      theme: "Krishna",
      age: "Ages 5-8",
      description: "Journey to Vrindavan where your child learns music from Lord Krishna and dances with peacocks!"
    },
    {
      title: "Ganesha's Wisdom Quest",
      theme: "Ganesha",
      age: "Ages 4-7",
      description: "Your little one seeks Lord Ganesha's blessings to solve puzzles and remove obstacles."
    },
    {
      title: "Hanuman's Forest Adventure",
      theme: "Hanuman",
      age: "Ages 6-10",
      description: "Meet the mighty Hanuman in sacred mountains and learn about courage and devotion."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-sky">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="container mx-auto px-4 py-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge variant="secondary" className="inline-flex items-center gap-2">
                  <Star className="w-4 h-4" />
                  AI-Powered Story Creation
                </Badge>
                <h1 className="story-title text-5xl lg:text-6xl font-bold text-foreground leading-tight">
                  Create Magical
                  <span className="bg-gradient-magical bg-clip-text text-transparent"> Mythology Stories </span>
                  for Your Child
                </h1>
                <p className="text-xl text-muted-foreground leading-relaxed max-w-lg">
                  Generate personalized Indian mythology tales with AI. 
                  Watch your child meet Krishna, Ganesha, Hanuman and become the hero of their own divine adventure!
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  variant="magical"
                  size="xl"
                  onClick={onStartCreating}
                  className="group"
                >
                  <Sparkles className="mr-2 group-hover:animate-spin" />
                  Start Creating Now
                  <Rocket className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button variant="whimsical" size="xl">
                  <BookOpen className="mr-2" />
                  View Sample Stories
                </Button>
              </div>

              <div className="flex items-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-warning" />
                  <span>1000+ Stories Created</span>
                </div>
                <div className="flex items-center gap-2">
                  <Heart className="w-4 h-4 text-destructive" />
                  <span>Loved by Parents</span>
                </div>
              </div>
            </div>

            {/* Right Hero Image */}
            <div className="relative">
              <div className="relative overflow-hidden rounded-3xl shadow-magical">
                <img
                  src={heroImage}
                  alt="Magical Storybook Hero"
                  className="w-full h-auto object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent"></div>
              </div>
              
              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-magical rounded-full flex items-center justify-center shadow-magical float">
                <Sparkles className="text-white w-8 h-8" />
              </div>
              <div className="absolute bottom-8 -left-4 w-12 h-12 bg-gradient-sunset rounded-full flex items-center justify-center shadow-soft float" style={{ animationDelay: '1s' }}>
                <Heart className="text-warning-foreground w-6 h-6" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="story-title text-3xl font-bold text-foreground mb-4">
            Why Choose Mythology StoryBook?
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Connect your child with ancient Indian wisdom through personalized divine adventures.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <Card key={index} className="storybook-card border-2 border-accent/20 hover:border-primary/30 transition-all duration-300">
                <CardHeader className="text-center">
                  <div className={`w-12 h-12 mx-auto rounded-full bg-gradient-magical flex items-center justify-center mb-4 shadow-soft`}>
                    <IconComponent className={`w-6 h-6 text-white`} />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Sample Stories Section */}
      <div className="container mx-auto px-4 py-16 bg-card/50 rounded-3xl mx-4 shadow-soft">
        <div className="text-center mb-12">
          <h2 className="story-title text-3xl font-bold text-foreground mb-4">
            Sample Divine Adventures
          </h2>
          <p className="text-muted-foreground text-lg">
            Discover these enchanting mythology tales created for children like yours
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {sampleStories.map((story, index) => (
            <Card key={index} className="storybook-card border-2 border-secondary/30 hover:shadow-magical transition-all duration-300">
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <CardTitle className="text-lg">{story.title}</CardTitle>
                  <Badge variant="outline">{story.age}</Badge>
                </div>
                <Badge variant="secondary" className="w-fit">
                  {story.theme}
                </Badge>
              </CardHeader>
              <CardContent>
                <CardDescription>{story.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-8">
          <Button variant="story" size="lg" onClick={onStartCreating}>
            <Wand2 className="mr-2" />
            Create Your Own Story
          </Button>
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-3xl mx-auto space-y-6">
          <h2 className="story-title text-4xl font-bold text-foreground">
            Ready to Create Magic?
          </h2>
          <p className="text-xl text-muted-foreground">
            Join thousands of parents who are creating unforgettable stories for their children. 
            Start your magical journey today!
          </p>
          <Button variant="magical" size="xl" onClick={onStartCreating} className="shadow-magical">
            <Sparkles className="mr-2" />
            Begin Your Story Adventure
            <Rocket className="ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;