import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const animalFacts = [
  "A group of flamingos is called a 'flamboyance' - perfect for their fabulous pink personalities!",
  "Cats have over 30 muscles controlling their ears, allowing them to rotate 180 degrees.",
  "Dogs can learn over 150 words and can count up to four or five - they're smarter than we think!",
  "Horses can sleep both lying down and standing up thanks to a special locking mechanism in their legs.",
  "A cow has four stomachs and can produce up to 40 glasses of milk per day.",
  "Rabbits can jump nearly 3 feet high and see almost 360 degrees around them.",
  "Goldfish have a memory span of at least 3 months, not 3 seconds as commonly believed!",
  "Pigs are extremely clean animals and are smarter than dogs and even some primates.",
  "A cat's purr vibrates at a frequency that promotes bone healing in humans.",
  "Dogs have a sense of time and can predict future events like walk time or dinner time."
];

const AnimalFactCard = () => {
  const [currentFactIndex, setCurrentFactIndex] = useState(0);
  
  const getNewFact = () => {
    const newIndex = Math.floor(Math.random() * animalFacts.length);
    setCurrentFactIndex(newIndex);
  };

  return (
    <Card className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-health-primary/5 border-primary/20">
      <div className="absolute inset-0 bg-gradient-subtle opacity-50" />
      
      <CardHeader className="relative">
        <CardTitle className="flex items-center gap-2 text-xl">
          <div className="p-2 rounded-full bg-gradient-primary">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          Animal Fact of the Day
        </CardTitle>
      </CardHeader>
      
      <CardContent className="relative space-y-4">
        <p className="text-muted-foreground leading-relaxed text-sm">
          {animalFacts[currentFactIndex]}
        </p>
        
        <Button 
          variant="outline" 
          size="sm" 
          onClick={getNewFact}
          className="w-full border-primary/20 hover:bg-primary/5"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Get Another Fact
        </Button>
      </CardContent>
    </Card>
  );
};

export default AnimalFactCard;