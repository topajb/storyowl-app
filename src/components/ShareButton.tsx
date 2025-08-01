import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Share2, Copy, MessageCircle, Mail, Facebook, Twitter, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ShareButtonProps {
  storyId: string;
  storyTitle: string;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg';
  className?: string;
}

export default function ShareButton({ 
  storyId, 
  storyTitle, 
  variant = 'outline', 
  size = 'default',
  className = ''
}: ShareButtonProps) {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  
  const shareUrl = `${window.location.origin}/story/${storyId}`;
  const shareText = `Check out this magical story "${storyTitle}" created just for kids! 📚✨`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast({
        title: "Link copied!",
        description: "Share link has been copied to clipboard.",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Please copy the link manually.",
        variant: "destructive",
      });
    }
  };

  const shareViaWhatsApp = () => {
    const url = `https://wa.me/?text=${encodeURIComponent(`${shareText}\n${shareUrl}`)}`;
    window.open(url, '_blank');
  };

  const shareViaEmail = () => {
    const subject = encodeURIComponent(`Amazing Story: ${storyTitle}`);
    const body = encodeURIComponent(`${shareText}\n\n${shareUrl}`);
    window.open(`mailto:?subject=${subject}&body=${body}`);
  };

  const shareViaFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
    window.open(url, '_blank', 'width=600,height=400');
  };

  const shareViaTwitter = () => {
    const text = encodeURIComponent(shareText);
    const url = `https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(shareUrl)}`;
    window.open(url, '_blank', 'width=600,height=400');
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: storyTitle,
          text: shareText,
          url: shareUrl,
        });
      } catch (err) {
        // User cancelled sharing or error occurred
      }
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={variant} size={size} className={className}>
          <Share2 className="h-4 w-4 mr-2" />
          Share
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5 text-primary" />
            Share Your Story
          </DialogTitle>
          <DialogDescription>
            Share this magical story with family and friends!
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Story URL */}
          <div className="space-y-2">
            <Label htmlFor="share-url">Story Link</Label>
            <div className="flex space-x-2">
              <Input
                id="share-url"
                value={shareUrl}
                readOnly
                className="flex-1"
              />
              <Button
                size="sm"
                onClick={copyToClipboard}
                className="px-3"
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          {/* Native Share (if supported) */}
          {navigator.share && (
            <Button onClick={handleNativeShare} className="w-full" variant="default">
              <Share2 className="h-4 w-4 mr-2" />
              Share via Device
            </Button>
          )}

          {/* Social Media Sharing */}
          <div className="space-y-2">
            <Label>Share on Social Media</Label>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" onClick={shareViaWhatsApp} className="w-full">
                <MessageCircle className="h-4 w-4 mr-2 text-green-600" />
                WhatsApp
              </Button>
              <Button variant="outline" onClick={shareViaEmail} className="w-full">
                <Mail className="h-4 w-4 mr-2 text-blue-600" />
                Email
              </Button>
              <Button variant="outline" onClick={shareViaFacebook} className="w-full">
                <Facebook className="h-4 w-4 mr-2 text-blue-700" />
                Facebook
              </Button>
              <Button variant="outline" onClick={shareViaTwitter} className="w-full">
                <Twitter className="h-4 w-4 mr-2 text-blue-500" />
                Twitter
              </Button>
            </div>
          </div>

          <div className="text-center">
            <Badge variant="secondary" className="text-xs">
              Story ID: {storyId}
            </Badge>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}