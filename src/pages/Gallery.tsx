import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  ArrowLeft, 
  BookOpen, 
  Calendar, 
  Search, 
  Star,
  Trash2,
  Eye,
  Share2
} from "lucide-react";
import { useStoryGallery } from "@/hooks/useStoryGallery";
import { format } from "date-fns";

export default function Gallery() {
  const { stories, deleteStory } = useStoryGallery();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredStories = stories.filter(story =>
    story.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    story.childName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    story.theme.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleShare = async (storyId: string) => {
    const shareUrl = `${window.location.origin}/story/${storyId}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Check out this magical story!',
          url: shareUrl,
        });
      } catch (error) {
        // User cancelled sharing
      }
    } else {
      await navigator.clipboard.writeText(shareUrl);
      // You might want to show a toast here
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back Home
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Story Gallery</h1>
              <p className="text-muted-foreground">
                Your collection of magical adventures
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search stories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-64"
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <BookOpen className="h-8 w-8 text-primary" />
              <div>
                <div className="text-2xl font-bold">{stories.length}</div>
                <div className="text-sm text-muted-foreground">Total Stories</div>
              </div>
            </div>
          </Card>
          
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <Star className="h-8 w-8 text-amber-500" />
              <div>
                <div className="text-2xl font-bold">
                  {stories.filter(s => s.readingProgress && s.readingProgress > 0).length}
                </div>
                <div className="text-sm text-muted-foreground">Stories Started</div>
              </div>
            </div>
          </Card>
          
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <Calendar className="h-8 w-8 text-green-500" />
              <div>
                <div className="text-2xl font-bold">
                  {stories.filter(s => {
                    const weekAgo = new Date();
                    weekAgo.setDate(weekAgo.getDate() - 7);
                    return s.createdAt > weekAgo;
                  }).length}
                </div>
                <div className="text-sm text-muted-foreground">This Week</div>
              </div>
            </div>
          </Card>
        </div>

        {/* Stories Grid */}
        {filteredStories.length === 0 ? (
          <Card className="p-12 text-center">
            <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">
              {searchTerm ? 'No stories found' : 'No stories yet'}
            </h3>
            <p className="text-muted-foreground mb-6">
              {searchTerm 
                ? 'Try adjusting your search terms'
                : 'Create your first magical story to get started!'
              }
            </p>
            {!searchTerm && (
              <Link to="/">
                <Button>Create Your First Story</Button>
              </Link>
            )}
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStories.map((story) => (
              <Card key={story.id} className="overflow-hidden hover:shadow-lg transition-all duration-300 group">
                {/* Cover Image */}
                <div className="aspect-[4/3] bg-gradient-to-br from-purple-100 to-pink-100 relative overflow-hidden">
                  {story.coverImageUrl ? (
                    <img
                      src={story.coverImageUrl}
                      alt={story.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <BookOpen className="h-12 w-12 text-muted-foreground" />
                    </div>
                  )}
                  
                  {/* Reading Progress */}
                  {story.readingProgress && story.readingProgress > 0 && (
                    <div className="absolute top-2 right-2">
                      <Badge variant="secondary" className="bg-white/90 text-xs">
                        {Math.round(story.readingProgress)}% read
                      </Badge>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-lg line-clamp-1">{story.title}</h3>
                    {story.heroAvatarUrl && (
                      <img
                        src={story.heroAvatarUrl}
                        alt={story.childName}
                        className="w-8 h-8 rounded-full border-2 border-primary/20"
                      />
                    )}
                  </div>
                  
                  <div className="space-y-1 text-sm text-muted-foreground mb-3">
                    <div>Hero: {story.childName}, age {story.age}</div>
                    <div>Theme: {story.theme}</div>
                    <div>{format(story.createdAt, 'MMM d, yyyy')}</div>
                  </div>

                  <div className="flex gap-2">
                    <Link to={`/story/${story.id}`} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full">
                        <Eye className="h-4 w-4 mr-2" />
                        Read
                      </Button>
                    </Link>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleShare(story.id)}
                    >
                      <Share2 className="h-4 w-4" />
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteStory(story.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}