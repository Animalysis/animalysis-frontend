import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Bot, Send, MessageCircle, X, Minimize2 } from "lucide-react";

interface Message {
  id: string;
  text: string;
  sender: "user" | "ai";
  timestamp: Date;
}

interface AiChatBubbleProps {
  animalName: string;
  animalSpecies: string;
}

const AiChatBubble = ({ animalName, animalSpecies }: AiChatBubbleProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: `Hello! I'm your AI caretaker assistant for ${animalName}. I can help you with health advice, nutrition recommendations, behavior insights, and answer any questions about your ${animalSpecies}. What would you like to know?`,
      sender: "ai",
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      sender: "user",
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");

    // Simulate AI response (in real app, this would call an AI API)
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: generateAiResponse(inputMessage, animalName, animalSpecies),
        sender: "ai",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  const generateAiResponse = (question: string, name: string, species: string) => {
    const responses = [
      `Based on ${name}'s profile as a ${species}, I'd recommend...`,
      `Great question about ${name}! For ${species}s, it's important to consider...`,
      `Looking at ${name}'s recent activity data, I suggest...`,
      `That's a common concern for ${species} owners. For ${name} specifically...`,
      `Given ${name}'s age and breed, my recommendation would be...`
    ];
    return responses[Math.floor(Math.random() * responses.length)] + " This is a simulated response. Connect to a real AI service for actual veterinary guidance.";
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          className="rounded-full w-14 h-14 bg-gradient-primary hover:bg-gradient-secondary shadow-lg hover:shadow-xl transition-all duration-300"
          size="icon"
        >
          <MessageCircle className="w-6 h-6 text-white" />
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Card className={`w-80 bg-background border border-border shadow-xl transition-all duration-300 ${
        isMinimized ? "h-16" : "h-96"
      }`}>
        <CardHeader className="p-4 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Avatar className="w-8 h-8 bg-gradient-primary">
                <AvatarFallback className="text-white">
                  <Bot className="w-4 h-4" />
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-sm">AI Caretaker</CardTitle>
                <div className="flex items-center space-x-1">
                  <Badge variant="secondary" className="text-xs px-2 py-0">
                    {animalName}
                  </Badge>
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="icon"
                className="w-6 h-6"
                onClick={() => setIsMinimized(!isMinimized)}
              >
                <Minimize2 className="w-3 h-3" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="w-6 h-6"
                onClick={() => setIsOpen(false)}
              >
                <X className="w-3 h-3" />
              </Button>
            </div>
          </div>
        </CardHeader>
        
        {!isMinimized && (
          <CardContent className="p-0 flex flex-col h-80">
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg p-3 text-sm ${
                        message.sender === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      }`}
                    >
                      {message.text}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
            
            <div className="p-4 border-t">
              <div className="flex space-x-2">
                <Input
                  placeholder={`Ask about ${animalName}...`}
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  className="flex-1"
                />
                <Button 
                  onClick={handleSendMessage}
                  size="icon"
                  className="bg-gradient-primary hover:bg-gradient-secondary"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
};

export default AiChatBubble;