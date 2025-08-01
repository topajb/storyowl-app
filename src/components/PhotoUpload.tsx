import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, X, Camera, Wand2, Sparkles } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { avatarService, AvatarData } from "@/services/avatarService";

interface PhotoUploadProps {
  onPhotoChange: (photo: string | null) => void;
  onAvatarGenerated: (avatar: AvatarData) => void;
  currentPhoto?: string | null;
  childName: string;
}

export const PhotoUpload = ({ onPhotoChange, onAvatarGenerated, currentPhoto, childName }: PhotoUploadProps) => {
  const [preview, setPreview] = useState<string | null>(currentPhoto || null);
  const [isDragging, setIsDragging] = useState(false);
  const [isGeneratingAvatar, setIsGeneratingAvatar] = useState(false);
  const [huggingFaceKey, setHuggingFaceKey] = useState("");
  const [showKeyInput, setShowKeyInput] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file.",
        variant: "destructive",
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      toast({
        title: "File too large",
        description: "Please upload an image smaller than 5MB.",
        variant: "destructive",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setPreview(result);
      onPhotoChange(result);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileChange(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const generateAvatar = async () => {
    if (!preview || !childName) {
      toast({
        title: "Missing Information",
        description: "Please upload a photo and enter child's name first.",
        variant: "destructive",
      });
      return;
    }

    if (!huggingFaceKey) {
      setShowKeyInput(true);
      return;
    }

    setIsGeneratingAvatar(true);
    try {
      avatarService.initializeHuggingFace(huggingFaceKey);
      const avatarData = await avatarService.generateCartoonAvatar(preview, childName);
      onAvatarGenerated(avatarData);
    } catch (error) {
      console.error('Avatar generation error:', error);
    } finally {
      setIsGeneratingAvatar(false);
    }
  };

  const removePhoto = () => {
    setPreview(null);
    onPhotoChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <Camera className="h-5 w-5 text-primary" />
        <label className="text-sm font-medium">Child's Photo (Optional)</label>
      </div>
      
      {preview ? (
        <Card className="relative p-4">
          <div className="flex items-start gap-4">
            <div className="relative">
              <img
                src={preview}
                alt="Child's photo"
                className="w-24 h-24 object-cover rounded-lg border-2 border-primary/20"
              />
              <Button
                size="sm"
                variant="destructive"
                className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                onClick={removePhoto}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-green-700 mb-1">Photo uploaded! ✨</p>
              <p className="text-xs text-muted-foreground mb-3">
                This photo will be used to create a personalized avatar that appears throughout your child's story.
              </p>
              
              {showKeyInput ? (
                <div className="space-y-2">
                  <Label htmlFor="hfKey" className="text-xs">Hugging Face API Key (optional)</Label>
                  <div className="flex gap-2">
                    <Input
                      id="hfKey"
                      type="password"
                      placeholder="hf_..."
                      value={huggingFaceKey}
                      onChange={(e) => setHuggingFaceKey(e.target.value)}
                      className="text-xs h-8"
                    />
                    <Button
                      size="sm"
                      onClick={generateAvatar}
                      disabled={isGeneratingAvatar || !huggingFaceKey}
                      className="h-8 px-3 text-xs"
                    >
                      {isGeneratingAvatar ? (
                        <Sparkles className="h-3 w-3 animate-spin" />
                      ) : (
                        "Generate"
                      )}
                    </Button>
                  </div>
                </div>
              ) : (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={generateAvatar}
                  disabled={isGeneratingAvatar}
                  className="w-full text-xs"
                >
                  {isGeneratingAvatar ? (
                    <>
                      <Sparkles className="h-3 w-3 mr-1 animate-spin" />
                      Creating Avatar...
                    </>
                  ) : (
                    <>
                      <Wand2 className="h-3 w-3 mr-1" />
                      Create Cartoon Avatar
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </Card>
      ) : (
        <Card 
          className={`border-2 border-dashed transition-all duration-200 ${
            isDragging 
              ? 'border-primary bg-primary/5' 
              : 'border-muted-foreground/25 hover:border-primary/50'
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <div className="p-8 text-center">
            <Upload className={`mx-auto h-12 w-12 mb-4 ${isDragging ? 'text-primary' : 'text-muted-foreground'}`} />
            <h3 className="text-sm font-medium mb-2">Upload your child's photo</h3>
            <p className="text-xs text-muted-foreground mb-4">
              We'll create a magical avatar that becomes the hero of the story!
            </p>
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
            >
              Choose Photo
            </Button>
            <p className="text-xs text-muted-foreground mt-2">
              Or drag and drop an image here
            </p>
          </div>
        </Card>
      )}
      
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFileChange(file);
        }}
      />
    </div>
  );
};