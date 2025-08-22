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
  },
];

const Dashboard = () => {
  const [animals, setAnimals] = useState([]);
  const [userName, setUserName] = useState<string>("");
  const { user } = useUser();

  // Fetch user info from backend on mount
  useEffect(() => {
    async function fetchUser() {
      const token = window.localStorage.getItem("clerk_jwt");
      // Get Clerk user info and store in localStorage
      if (user) {
        window.localStorage.setItem("clerk_id", user.id);
        window.localStorage.setItem("clerk_name", user.firstName || user.fullName || "");
      }
      const backendUrl = import.meta.env.VITE_BACKEND_URL;
      let res = await fetch(`${backendUrl}/api/users`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      let data = await res.json();
      if (data.name) {
        setUserName(data.name);
      } else if (user) {
        // If user not found, create user in DB
        const clerkId = user.id;
        const name = user.firstName || user.fullName || "";
        res = await fetch(`${backendUrl}/api/users`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ clerkId, name }),
        });
        data = await res.json();
        if (data.name) setUserName(data.name);
      }
    }
    fetchUser();
    async function fetchPets() {
      if (!user) return;
      const token = window.localStorage.getItem("clerk_jwt");
      const backendUrl = import.meta.env.VITE_BACKEND_URL;
      // First, get the user_id from backend
      const userRes = await fetch(`${backendUrl}/api/users`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const userData = await userRes.json();
      console.log("/api/users response:", userData);
      const userId = userData.id;
      if (!userId) {
        console.warn("No userId returned from backend");
        return;
      }
      const res = await fetch(`${backendUrl}/api/users/${userId}/pets`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        const pets = await res.json();
        console.log("/api/users/[id]/pets response:", pets);
        setAnimals(pets);
      } else {
        console.warn("Failed to fetch pets", await res.text());
      }
    }
    fetchPets();
  }, [user]);

  const handleAddAnimal = async (newAnimal: any) => {
    // Get userId from backend (already fetched in fetchPets)
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const token = window.localStorage.getItem("clerk_jwt");
    // Get userId from last fetch
    const userRes = await fetch(`${backendUrl}/api/users`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const userData = await userRes.json();
    const userId = userData.id;
    if (!userId) {
      console.warn("No userId returned from backend");
      return;
    }
    // Send POST request to backend to add pet
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
    } else {
      console.warn("Failed to add pet", await res.text());
    }
  }

  const handleViewDetails = (id: string) => {
    window.location.href = `/animal/${id}`;
  };

  const totalAnimals = animals.length;
  const avgHeartRate = Math.round(
    animals.reduce((sum, animal) => sum + animal.heartRate, 0) / animals.length
  );
  const totalCalories = animals.reduce(
    (sum, animal) => sum + animal.caloriesBurned,
    0
  );
  const activeAnimals = animals.filter(
    (animal) => animal.status === "active"
  ).length;

  const { signOut } = useClerk();

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
