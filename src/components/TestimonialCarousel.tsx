import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Testimonial } from "@/types/story";

const testimonials: Testimonial[] = [
  {
    text: "My daughter couldn't stop smiling when she saw herself as a superhero! Thank you for this amazing gift!",
    author: "Sarah M.",
    role: "Parent of Emma, age 6",
    avatarUrl: "/api/placeholder/40/40",
  },
  {
    text: "Finally, a way to get my son excited about reading! He asks for his story every night now.",
    author: "Mike Johnson",
    role: "Parent of Alex, age 8",
    avatarUrl: "/api/placeholder/40/40",
  },
  {
    text: "The personalized stories helped my daughter build confidence. She truly believes she can be anything!",
    author: "Lisa Chen",
    role: "Parent of Maya, age 5",
    avatarUrl: "/api/placeholder/40/40",
  },
  {
    text: "As a teacher, I love how these stories engage children in a way traditional books sometimes can't.",
    author: "Jennifer Williams",
    role: "Elementary Teacher",
    avatarUrl: "/api/placeholder/40/40",
  },
  {
    text: "The quality is incredible! My twins each have their own adventure and they love comparing stories.",
    author: "David Rodriguez",
    role: "Parent of twins, age 7",
    avatarUrl: "/api/placeholder/40/40",
  },
];

export const TestimonialCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const currentTestimonial = testimonials[currentIndex];

  return (
    <section className="py-16 bg-gradient-to-b from-primary/5 to-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">What Parents Say</h2>
          <p className="text-muted-foreground">
            Join thousands of families creating magical memories together
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Card className="p-8 relative overflow-hidden">
            <div className="absolute top-4 left-4 text-primary/20">
              <Quote className="h-8 w-8" />
            </div>
            
            <div className="text-center mb-6">
              <blockquote className="text-lg md:text-xl leading-relaxed mb-6 px-8">
                "{currentTestimonial.text}"
              </blockquote>
              
              <div className="flex items-center justify-center gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={currentTestimonial.avatarUrl} alt={currentTestimonial.author} />
                  <AvatarFallback>
                    {currentTestimonial.author.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="text-left">
                  <div className="font-semibold">{currentTestimonial.author}</div>
                  {currentTestimonial.role && (
                    <div className="text-sm text-muted-foreground">{currentTestimonial.role}</div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center gap-4">
              <Button
                variant="outline"
                size="sm"
                className="h-10 w-10 rounded-full p-0"
                onClick={prevTestimonial}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              <div className="flex gap-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    className={`h-2 w-2 rounded-full transition-all duration-300 ${
                      index === currentIndex ? 'bg-primary w-6' : 'bg-muted-foreground/30'
                    }`}
                    onClick={() => setCurrentIndex(index)}
                  />
                ))}
              </div>

              <Button
                variant="outline"
                size="sm"
                className="h-10 w-10 rounded-full p-0"
                onClick={nextTestimonial}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        </div>

        <div className="text-center mt-8">
          <div className="flex items-center justify-center gap-2 text-lg font-semibold">
            <span>Trusted by</span>
            <span className="text-2xl font-bold text-primary">5,400+</span>
            <span>happy families</span>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Join our community of parents making learning magical together
          </p>
        </div>
      </div>
    </section>
  );
};