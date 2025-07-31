import { Badge } from "@/components/ui/badge";
import { Clock, Sparkles, Video, Volume2 } from "lucide-react";
import { Phase } from "@/types/story";

interface FeatureBannerProps {
  phase: Phase;
  isComingSoon?: boolean;
}

const phaseConfig = {
  storybook: {
    icon: Sparkles,
    title: "Custom Storybooks",
    description: "LIVE for kids! All age groups available!",
    color: "bg-green-500/10 text-green-700 border-green-500/20",
  },
  audiobook: {
    icon: Volume2,
    title: "Custom Audiobooks",
    description: "Professional narration with word highlighting",
    color: "bg-amber-500/10 text-amber-700 border-amber-500/20",
  },
  movie: {
    icon: Video,
    title: "Custom Short Movies",
    description: "Animated stories with your child as the hero",
    color: "bg-purple-500/10 text-purple-700 border-purple-500/20",
  },
};

export const FeatureBanner = ({ phase, isComingSoon = false }: FeatureBannerProps) => {
  const config = phaseConfig[phase];
  const Icon = config.icon;

  return (
    <div className={`rounded-xl border p-4 ${config.color} transition-all duration-300 hover:scale-105`}>
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-lg bg-white/50">
          <Icon className="h-5 w-5" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-sm">{config.title}</h3>
            {isComingSoon && (
              <Badge variant="secondary" className="text-xs">
                <Clock className="h-3 w-3 mr-1" />
                Coming Soon
              </Badge>
            )}
          </div>
          <p className="text-xs opacity-80">{config.description}</p>
        </div>
      </div>
    </div>
  );
};