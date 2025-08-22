import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, Activity, MapPin, Calendar } from "lucide-react";

interface Animal {
  id: string;
  name: string;
  species: string;
  breed: string;
  age: number;
  weight: number;
  image: string;
  lastActivity: string;
  location: string;
  heartRate: number;
  caloriesBurned: number;
  status: "active" | "resting" | "alert";
}

interface AnimalCardProps {
  animal: Animal;
  onViewDetails: (id: string) => void;
}

const statusColors = {
  active: "bg-health-success text-white",
  resting: "bg-health-accent text-white",
  alert: "bg-health-warning text-white",
};

const AnimalCard = ({ animal, onViewDetails }: AnimalCardProps) => {
  return (
    <Card className="group hover:shadow-hover transition-all duration-300 border border-white/20 bg-gradient-glass backdrop-blur-sm">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center text-white font-bold text-lg">
              {animal.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <CardTitle className="text-lg font-semibold">
                {animal.name}
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                {animal.breed} • {animal.age}yrs • {animal.weight}kg
              </p>
            </div>
          </div>
          <Badge className={statusColors[animal.status]} variant="secondary">
            {animal.status}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center space-x-2">
            <Heart className="w-4 h-4 text-health-primary" />
            <div>
              <p className="text-sm font-medium">{animal.heartRate} BPM</p>
              <p className="text-xs text-muted-foreground">Heart Rate</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Activity className="w-4 h-4 text-health-secondary" />
            <div>
              <p className="text-sm font-medium">{animal.caloriesBurned} cal</p>
              <p className="text-xs text-muted-foreground">Burned Today</p>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-sm">
            <MapPin className="w-4 h-4 text-health-accent" />
            <span className="text-muted-foreground">Location:</span>
            <span>{animal.location}</span>
          </div>

          <div className="flex items-center space-x-2 text-sm">
            <Calendar className="w-4 h-4 text-health-accent" />
            <span className="text-muted-foreground">Last Active:</span>
            <span>{animal.lastActivity}</span>
          </div>
        </div>

        <Button
          onClick={() => onViewDetails(animal.id)}
          className="w-full bg-gradient-primary hover:bg-gradient-secondary transition-all duration-300"
          size="sm"
        >
          View Details
        </Button>
      </CardContent>
    </Card>
  );
};

export default AnimalCard;
