import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Crown } from "lucide-react";
import { AvatarData } from "@/services/avatarService";

interface MeetYourHeroProps {
  avatar: AvatarData;
  childName: string;
}

export const MeetYourHero = ({ avatar, childName }: MeetYourHeroProps) => {
  return (
    <Card className="storybook-card border-2 border-primary/30 bg-gradient-to-br from-primary/5 to-accent/10">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2 text-2xl">
          <Crown className="text-warning h-6 w-6" />
          Meet Your Hero!
          <Crown className="text-warning h-6 w-6" />
        </CardTitle>
      </CardHeader>
      <CardContent className="text-center space-y-4">
        <div className="relative mx-auto w-32 h-32 rounded-full overflow-hidden border-4 border-primary/30 shadow-magical">
          <img
            src={avatar.avatarUrl}
            alt={`${childName}'s hero avatar`}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary/10 to-transparent" />
        </div>
        
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-foreground">
            {childName} the Hero! ✨
          </h3>
          <Badge variant="secondary" className="text-xs px-3 py-1">
            <Sparkles className="w-3 h-3 mr-1" />
            Ready for Adventure
          </Badge>
        </div>
        
        <p className="text-sm text-muted-foreground max-w-md mx-auto">
          This magical avatar will appear throughout your personalized story as the brave hero of every adventure!
        </p>
      </CardContent>
    </Card>
  );
};