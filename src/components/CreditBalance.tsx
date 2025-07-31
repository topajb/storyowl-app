import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Coins, RefreshCw } from "lucide-react";
import { useCredits } from "@/hooks/useCredits";

export const CreditBalance = () => {
  const { credits, getDaysUntilReset } = useCredits();
  const daysUntilReset = getDaysUntilReset();
  const usagePercent = (credits.used / credits.limit) * 100;

  return (
    <Card className="p-4 bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Coins className="h-5 w-5 text-primary" />
          <span className="font-semibold text-sm">Story Credits</span>
        </div>
        <Badge variant={credits.balance > 0 ? "default" : "destructive"}>
          {credits.balance} left
        </Badge>
      </div>
      
      <div className="space-y-2">
        <Progress value={100 - usagePercent} className="h-2" />
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{credits.balance} of {credits.limit} credits</span>
          <div className="flex items-center gap-1">
            <RefreshCw className="h-3 w-3" />
            <span>Resets in {daysUntilReset} days</span>
          </div>
        </div>
      </div>
      
      {credits.balance === 0 && (
        <div className="mt-3 p-2 bg-amber-50 border border-amber-200 rounded-lg">
          <p className="text-xs text-amber-800">
            You've used all your free credits this month. Upgrade for unlimited stories!
          </p>
        </div>
      )}
    </Card>
  );
};