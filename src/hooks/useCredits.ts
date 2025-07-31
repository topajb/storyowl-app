import { useState, useEffect } from 'react';
import { CreditSystem } from '@/types/story';

const CREDITS_KEY = 'storyowl_credits';
const INITIAL_CREDITS = 3;
const MONTHLY_LIMIT = 3;

export const useCredits = () => {
  const [credits, setCredits] = useState<CreditSystem>({
    balance: INITIAL_CREDITS,
    used: 0,
    limit: MONTHLY_LIMIT,
  });

  useEffect(() => {
    const loadCredits = () => {
      try {
        const stored = localStorage.getItem(CREDITS_KEY);
        if (stored) {
          const parsedCredits = JSON.parse(stored);
          // Check if it's a new month and reset credits
          const now = new Date();
          const resetDate = parsedCredits.resetDate ? new Date(parsedCredits.resetDate) : null;
          
          if (!resetDate || now.getMonth() !== resetDate.getMonth() || now.getFullYear() !== resetDate.getFullYear()) {
            // New month - reset credits
            const newCredits: CreditSystem = {
              balance: MONTHLY_LIMIT,
              used: 0,
              limit: MONTHLY_LIMIT,
              resetDate: new Date(now.getFullYear(), now.getMonth() + 1, 1), // First day of next month
            };
            setCredits(newCredits);
            localStorage.setItem(CREDITS_KEY, JSON.stringify(newCredits));
          } else {
            setCredits({
              ...parsedCredits,
              resetDate: new Date(parsedCredits.resetDate)
            });
          }
        } else {
          // First time user
          const initialCredits: CreditSystem = {
            balance: INITIAL_CREDITS,
            used: 0,
            limit: MONTHLY_LIMIT,
            resetDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1),
          };
          setCredits(initialCredits);
          localStorage.setItem(CREDITS_KEY, JSON.stringify(initialCredits));
        }
      } catch (error) {
        console.error('Failed to load credits:', error);
      }
    };

    loadCredits();
  }, []);

  const useCredit = (): boolean => {
    if (credits.balance <= 0) {
      return false;
    }

    const updatedCredits: CreditSystem = {
      ...credits,
      balance: credits.balance - 1,
      used: credits.used + 1,
    };

    setCredits(updatedCredits);
    
    try {
      localStorage.setItem(CREDITS_KEY, JSON.stringify(updatedCredits));
    } catch (error) {
      console.error('Failed to update credits:', error);
    }

    return true;
  };

  const getDaysUntilReset = (): number => {
    if (!credits.resetDate) return 0;
    
    const now = new Date();
    const resetDate = new Date(credits.resetDate);
    const diffTime = resetDate.getTime() - now.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  return {
    credits,
    useCredit,
    canUseCredit: credits.balance > 0,
    getDaysUntilReset,
  };
};