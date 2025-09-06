import { useState } from "react";
import { useClerk, useUser } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import {
  Activity,
  Heart,
  MapPin,
  TrendingUp,
  Users,
  Zap,
  ArrowLeft,
} from "lucide-react";
import { Link } from "react-router-dom";
import AnimalCard from "@/components/dashboard/AnimalCard";
import StatsCard from "@/components/dashboard/StatsCard";
import AddAnimalDialog from "@/components/dashboard/AddAnimalDialog";
import ActivityChart from "@/components/dashboard/ActivityChart";
import QuickActions from "@/components/dashboard/QuickActions";
import AnimalFactCard from "@/components/dashboard/AnimalFactCard";

const Dashboard = () => {
  const [animals, setAnimals] = useState([]);
  const [userName, setUserName] = useState<string>("");
  const { user } = useUser();
  const [loading, setLoading] = useState(true);


  // Simple user creation after sign-in
  useEffect(() => {
    async function createUserIfNeeded() {
      if (!user) return;
      
      try {
        setLoading(true);
        const backendUrl = import.meta.env.VITE_BACKEND_URL;

        // Simple API call to create user if needed
        const response = await fetch(`${backendUrl}/api/users`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            clerkId: user.id,
            name: user.firstName || user.fullName || "User"
          }),
        });

        if (response.ok) {
          const userData = await response.json();
          setUserName(userData.name);
          window.localStorage.setItem("clerk_id", user.id);
          window.localStorage.setItem("clerk_name", userData.name);

          // Fetch user's pets
          const petsResponse = await fetch(`${backendUrl}/api/users/${userData.id}/pets`);
          if (petsResponse.ok) {
            const pets = await petsResponse.json();
            setAnimals(pets);
          }
        }
      } catch (error) {
        console.error("Error creating user:", error);
      } finally {
        setLoading(false);
      }
    }

    createUserIfNeeded();
  }, [user]);

  const handleAddAnimal = async (newAnimal: any) => {
    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL;
      const userId = window.localStorage.getItem("clerk_id");
      
      if (!userId) {
        console.warn("No user ID found");
        return;
      }

      const res = await fetch(`${backendUrl}/api/users/${userId}/pets`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newAnimal),
      });
      
      if (res.ok) {
        const result = await res.json();
        setAnimals((prev) => [...prev, result.pet]);
      }
    } catch (error) {
      console.error("Error adding animal:", error);
    }
  };

  const handleViewDetails = (id: string) => {
    window.location.href = `/animal/${id}`;
  };

  const totalAnimals = animals.length;
  const avgHeartRate = animals.length > 0 
    ? Math.round(animals.reduce((sum, animal) => sum + animal.heartRate, 0) / animals.length)
    : 0;
  const totalCalories = animals.reduce(
    (sum, animal) => sum + animal.caloriesBurned,
    0
  );
  const activeAnimals = animals.filter(
    (animal) => animal.status === "active"
  ).length;

  const { signOut } = useClerk();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-health-primary/5 flex items-center justify-center">
        <div className="text-center">
          <Activity className="w-12 h-12 text-health-primary animate-spin mx-auto mb-4" />
          <p className="text-lg text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-health-primary/5">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Link to="/">
              <Button
                variant="outline"
                size="sm"
                className="border-health-primary text-health-primary hover:bg-health-primary hover:text-white"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold">Dashboard</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <AddAnimalDialog onAddAnimal={handleAddAnimal} />
            <Button
              variant="outline"
              size="sm"
              className="border-health-warning text-health-warning hover:bg-health-warning hover:text-white"
              onClick={() => signOut()}
            >
              Logout
            </Button>
          </div>
        </nav>
      </header>

      <div className="container mx-auto px-4 pb-12">
        {/* Welcome Section */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-2">
            Welcome back{userName ? `, ${userName}` : ""}!
          </h1>
          <p className="text-xl text-muted-foreground">
            Here's what's happening with your animals today.
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
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
            <AnimalFactCard />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-12">
          <QuickActions />
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
              <p className="text-muted-foreground mb-6">
                Add your first animal to start tracking their health and
                fitness.
              </p>
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

export default Dashboard;
