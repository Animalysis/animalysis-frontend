import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Activity, Heart, MapPin, TrendingUp, Users, Zap } from "lucide-react";
import AnimalCard from "@/components/dashboard/AnimalCard";
import StatsCard from "@/components/dashboard/StatsCard";
import AddAnimalDialog from "@/components/dashboard/AddAnimalDialog";
import ActivityChart from "@/components/dashboard/ActivityChart";
import heroImage from "@/assets/hero-pets.jpg";

const initialAnimals = [
  {
    id: "1",
    name: "Buddy",
    species: "dog",
    breed: "Golden Retriever",
    age: 3,
    weight: 30.5,
    image: "",
    lastActivity: "30 minutes ago",
    location: "Backyard",
    heartRate: 85,
    caloriesBurned: 420,
    status: "active" as const,
  },
  {
    id: "2", 
    name: "Whiskers",
    species: "cat",
    breed: "Maine Coon",
    age: 5,
    weight: 6.2,
    image: "",
    lastActivity: "2 hours ago",
    location: "Living Room",
    heartRate: 180,
    caloriesBurned: 150,
    status: "resting" as const,
  },
  {
    id: "3",
    name: "Luna",
    species: "horse",
    breed: "Arabian",
    age: 8,
    weight: 450,
    image: "",
    lastActivity: "1 hour ago", 
    location: "Stable",
    heartRate: 40,
    caloriesBurned: 850,
    status: "active" as const,
  }
];

const Index = () => {
  const [animals, setAnimals] = useState(initialAnimals);

  const handleAddAnimal = (newAnimal: any) => {
    setAnimals([...animals, newAnimal]);
  };

  const handleViewDetails = (id: string) => {
    // TODO: Navigate to animal details page
    console.log("View details for animal:", id);
  };

  const totalAnimals = animals.length;
  const avgHeartRate = Math.round(animals.reduce((sum, animal) => sum + animal.heartRate, 0) / animals.length);
  const totalCalories = animals.reduce((sum, animal) => sum + animal.caloriesBurned, 0);
  const activeAnimals = animals.filter(animal => animal.status === "active").length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-health-primary/5">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero opacity-10"></div>
        <div className="relative container mx-auto px-4 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                Track Your <span className="bg-gradient-primary bg-clip-text text-transparent">Animals'</span> Health
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Monitor vitals, track activities, and keep your beloved animals healthy with our comprehensive fitness tracker.
              </p>
              <div className="flex space-x-4">
                <AddAnimalDialog onAddAnimal={handleAddAnimal} />
                <Button variant="outline" size="lg" className="border-health-primary text-health-primary hover:bg-health-primary hover:text-white">
                  View Demo
                </Button>
              </div>
            </div>
            <div className="relative">
              <img 
                src={heroImage} 
                alt="Happy pets with health tracking"
                className="rounded-2xl shadow-hover animate-float"
              />
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-secondary rounded-full flex items-center justify-center animate-bounce-gentle">
                <Heart className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <StatsCard
            title="Total Animals"
            value={totalAnimals}
            icon={Users}
            gradient="bg-gradient-primary"
            trend={{ value: 12, isPositive: true }}
          />
          <StatsCard
            title="Avg Heart Rate"
            value={`${avgHeartRate} BPM`}
            icon={Heart}
            gradient="bg-gradient-secondary"
            trend={{ value: 5, isPositive: false }}
          />
          <StatsCard
            title="Total Calories"
            value={`${totalCalories.toLocaleString()}`}
            subtitle="burned today"
            icon={Zap}
            gradient="bg-health-accent"
            trend={{ value: 18, isPositive: true }}
          />
          <StatsCard
            title="Active Now"
            value={activeAnimals}
            subtitle={`of ${totalAnimals} animals`}
            icon={Activity}
            gradient="bg-health-success"
            trend={{ value: 8, isPositive: true }}
          />
        </div>

        {/* Charts Section */}
        <div className="grid lg:grid-cols-3 gap-6 mb-12">
          <ActivityChart />
          <div className="space-y-6">
            <StatsCard
              title="Weekly Distance"
              value="127 km"
              subtitle="across all animals"
              icon={MapPin}
              gradient="bg-gradient-primary"
              trend={{ value: 15, isPositive: true }}
            />
            <StatsCard
              title="Health Score"
              value="92%"
              subtitle="excellent condition"
              icon={TrendingUp}
              gradient="bg-health-success"
              trend={{ value: 3, isPositive: true }}
            />
          </div>
        </div>

        {/* Animals Grid */}
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-3xl font-bold">Your Animals</h2>
            <AddAnimalDialog onAddAnimal={handleAddAnimal} />
          </div>
          
          {animals.length === 0 ? (
            <div className="text-center py-16">
              <Activity className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No animals yet</h3>
              <p className="text-muted-foreground mb-6">Add your first animal to start tracking their health and fitness.</p>
              <AddAnimalDialog onAddAnimal={handleAddAnimal} />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {animals.map((animal) => (
                <AnimalCard
                  key={animal.id}
                  animal={animal}
                  onViewDetails={handleViewDetails}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
