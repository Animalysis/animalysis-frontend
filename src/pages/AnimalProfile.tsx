import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowLeft, Heart, Activity, MapPin, Calendar, Weight, 
  Thermometer, Droplets, Clock, Target, TrendingUp,
  Stethoscope, Pill, FileText, Camera
} from "lucide-react";

const AnimalProfile = () => {
  const { id } = useParams();
  
  // Mock data - would come from database
  const animal = {
    id: "1",
    name: "Buddy",
    species: "dog",
    breed: "Golden Retriever", 
    age: 3,
    weight: 30.5,
    image: "",
    status: "active" as const,
    owner: "John Doe",
    microchipId: "123456789",
    vetInfo: {
      clinic: "Happy Paws Veterinary",
      doctor: "Dr. Sarah Wilson",
      lastVisit: "2024-01-15",
      nextAppointment: "2024-02-15"
    },
    vitals: {
      heartRate: 85,
      temperature: 38.5,
      respiratoryRate: 25,
      bloodPressure: "120/80",
      hydrationLevel: 85
    },
    activity: {
      todayCalories: 420,
      weeklyGoal: 2800,
      weeklyProgress: 1680,
      averageSteps: 8500,
      activeMinutes: 45
    },
    location: {
      current: "Backyard",
      lastUpdate: "30 minutes ago",
      batteryLevel: 78
    }
  };

  const weeklyProgress = (animal.activity.weeklyProgress / animal.activity.weeklyGoal) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-health-primary/5">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <div className="flex items-center space-x-4">
          <Link to="/dashboard">
            <Button variant="outline" size="sm" className="border-health-primary text-health-primary hover:bg-health-primary hover:text-white">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <div className="flex items-center space-x-3">
            <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center text-white font-bold text-2xl">
              {animal.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-3xl font-bold">{animal.name}</h1>
              <p className="text-muted-foreground">{animal.breed} • {animal.age} years old</p>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 pb-12">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="health">Health Records</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="border border-white/20 bg-gradient-glass backdrop-blur-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center">
                    <Heart className="w-4 h-4 mr-2 text-health-primary" />
                    Vitals Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm">Heart Rate</span>
                      <span className="font-medium">{animal.vitals.heartRate} BPM</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Temperature</span>
                      <span className="font-medium">{animal.vitals.temperature}°C</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Hydration</span>
                      <span className="font-medium">{animal.vitals.hydrationLevel}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-white/20 bg-gradient-glass backdrop-blur-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center">
                    <Activity className="w-4 h-4 mr-2 text-health-secondary" />
                    Today's Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm">Calories Burned</span>
                      <span className="font-medium">{animal.activity.todayCalories}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Active Minutes</span>
                      <span className="font-medium">{animal.activity.activeMinutes} min</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Steps</span>
                      <span className="font-medium">{animal.activity.averageSteps.toLocaleString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-white/20 bg-gradient-glass backdrop-blur-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center">
                    <MapPin className="w-4 h-4 mr-2 text-health-accent" />
                    Location & Device
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm">Current Location</span>
                      <span className="font-medium">{animal.location.current}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Last Update</span>
                      <span className="font-medium">{animal.location.lastUpdate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Battery Level</span>
                      <span className="font-medium">{animal.location.batteryLevel}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Weekly Goal Progress */}
            <Card className="border border-white/20 bg-gradient-glass backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="w-5 h-5 mr-2 text-health-primary" />
                  Weekly Activity Goal
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span>Progress: {animal.activity.weeklyProgress} / {animal.activity.weeklyGoal} calories</span>
                    <span className="font-medium">{Math.round(weeklyProgress)}%</span>
                  </div>
                  <Progress value={weeklyProgress} className="h-3" />
                  <p className="text-sm text-muted-foreground">
                    Great progress! {animal.name} is {weeklyProgress > 60 ? 'ahead of schedule' : 'on track'} to meet this week's goal.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="health" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Vet Information */}
              <Card className="border border-white/20 bg-gradient-glass backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Stethoscope className="w-5 h-5 mr-2 text-health-primary" />
                    Veterinary Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium">Clinic</h4>
                    <p className="text-sm text-muted-foreground">{animal.vetInfo.clinic}</p>
                  </div>
                  <div>
                    <h4 className="font-medium">Doctor</h4>
                    <p className="text-sm text-muted-foreground">{animal.vetInfo.doctor}</p>
                  </div>
                  <Separator />
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium text-sm">Last Visit</h4>
                      <p className="text-sm text-muted-foreground">{animal.vetInfo.lastVisit}</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-sm">Next Appointment</h4>
                      <p className="text-sm text-muted-foreground">{animal.vetInfo.nextAppointment}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Basic Information */}
              <Card className="border border-white/20 bg-gradient-glass backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileText className="w-5 h-5 mr-2 text-health-secondary" />
                    Basic Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium text-sm">Species</h4>
                      <p className="text-sm text-muted-foreground capitalize">{animal.species}</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-sm">Weight</h4>
                      <p className="text-sm text-muted-foreground">{animal.weight} kg</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-sm">Owner</h4>
                      <p className="text-sm text-muted-foreground">{animal.owner}</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-sm">Microchip ID</h4>
                      <p className="text-sm text-muted-foreground">{animal.microchipId}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Health Records */}
            <Card className="border border-white/20 bg-gradient-glass backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Pill className="w-5 h-5 mr-2 text-health-accent" />
                  Recent Health Records
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                    <div>
                      <h4 className="font-medium">Annual Vaccination</h4>
                      <p className="text-sm text-muted-foreground">Rabies, DHPP completed</p>
                    </div>
                    <Badge variant="outline">2024-01-15</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                    <div>
                      <h4 className="font-medium">Health Checkup</h4>
                      <p className="text-sm text-muted-foreground">Routine examination - Excellent health</p>
                    </div>
                    <Badge variant="outline">2023-12-20</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                    <div>
                      <h4 className="font-medium">Dental Cleaning</h4>
                      <p className="text-sm text-muted-foreground">Professional dental cleaning completed</p>
                    </div>
                    <Badge variant="outline">2023-11-08</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity" className="space-y-6">
            {/* Activity Summary */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="border border-white/20 bg-gradient-glass backdrop-blur-sm">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <Activity className="w-5 h-5 text-health-primary" />
                    <div>
                      <p className="text-2xl font-bold">{animal.activity.todayCalories}</p>
                      <p className="text-sm text-muted-foreground">Calories Today</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="border border-white/20 bg-gradient-glass backdrop-blur-sm">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-5 h-5 text-health-secondary" />
                    <div>
                      <p className="text-2xl font-bold">{animal.activity.activeMinutes}</p>
                      <p className="text-sm text-muted-foreground">Active Minutes</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="border border-white/20 bg-gradient-glass backdrop-blur-sm">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="w-5 h-5 text-health-accent" />
                    <div>
                      <p className="text-2xl font-bold">{animal.activity.averageSteps.toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground">Steps Today</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="border border-white/20 bg-gradient-glass backdrop-blur-sm">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <Target className="w-5 h-5 text-health-success" />
                    <div>
                      <p className="text-2xl font-bold">{Math.round(weeklyProgress)}%</p>
                      <p className="text-sm text-muted-foreground">Weekly Goal</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Activity Chart would go here */}
            <Card className="border border-white/20 bg-gradient-glass backdrop-blur-sm">
              <CardHeader>
                <CardTitle>7-Day Activity Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-muted-foreground">
                  Activity chart visualization would go here
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card className="border border-white/20 bg-gradient-glass backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Profile Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button variant="outline" className="w-full justify-start">
                  <Camera className="w-4 h-4 mr-2" />
                  Update Profile Photo
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="w-4 h-4 mr-2" />
                  Edit Basic Information
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Stethoscope className="w-4 h-4 mr-2" />
                  Update Veterinary Information
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Target className="w-4 h-4 mr-2" />
                  Set Activity Goals
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AnimalProfile;