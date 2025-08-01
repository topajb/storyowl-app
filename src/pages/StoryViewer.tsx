import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, AlertCircle } from "lucide-react";
import { useStoryGallery } from "@/hooks/useStoryGallery";
import StoryBook from "@/components/StoryBook";

export default function StoryViewer() {
  const { id } = useParams<{ id: string }>();
  const { getStory, updateStoryProgress } = useStoryGallery();
  
  if (!id) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-destructive mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-4">Story Not Found</h1>
          <p className="text-muted-foreground mb-6">
            The story you're looking for doesn't exist or has been removed.
          </p>
          <Link to="/gallery">
            <Button>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Gallery
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const story = getStory(id);
  
  if (!story) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-destructive mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-4">Story Not Found</h1>
          <p className="text-muted-foreground mb-6">
            This story might have been moved or deleted.
          </p>
          <Link to="/gallery">
            <Button>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Gallery
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleBackHome = () => {
    // This will be handled by navigation
  };

  return (
    <StoryBook 
      story={story} 
      onBackHome={handleBackHome}
    />
  );
}