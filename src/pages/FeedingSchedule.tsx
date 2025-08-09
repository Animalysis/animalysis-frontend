import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { 
  ArrowLeft, Plus, Utensils, Clock, Apple, Droplets, 
  Target, TrendingUp, Calendar, Bell, ChefHat, Scale
} from "lucide-react";

const FeedingSchedule = () => {
  const [showAddMeal, setShowAddMeal] = useState(false);

  // Mock data
  const feedingSchedules = [
    {
      id: "1",
      animalName: "Buddy",
      mealTime: "07:00",
      foodType: "Premium Dry Food",
      portion: "200g",
      calories: 320,
      completed: true,
      automated: true
    },
    {
      id: "2",
      animalName: "Buddy", 
      mealTime: "12:00",
      foodType: "Wet Food + Treats",
      portion: "150g",
      calories: 180,
      completed: true,
      automated: false
    },
    {
      id: "3",
      animalName: "Buddy",
      mealTime: "18:00", 
      foodType: "Premium Dry Food",
      portion: "200g",
      calories: 320,
      completed: false,
      automated: true
    },
    {
      id: "4",
      animalName: "Whiskers",
      mealTime: "08:00",
      foodType: "Cat Premium",
      portion: "80g",
      calories: 180,
      completed: true,
      automated: true
    },
    {
      id: "5",
      animalName: "Whiskers",
      mealTime: "19:00",
      foodType: "Cat Premium",
      portion: "80g", 
      calories: 180,
      completed: false,
      automated: true
    }
  ];

  const nutritionData = {
    "Buddy": {
      dailyCalories: 820,
      targetCalories: 1000,
      protein: 85,
      targetProtein: 120,
      mealsCompleted: 2,
      totalMeals: 3,
      waterIntake: 1.2,
      targetWater: 1.5
    },
    "Whiskers": {
      dailyCalories: 180,
      targetCalories: 300,
      protein: 45,
      targetProtein: 60,
      mealsCompleted: 1,
      totalMeals: 2,
      waterIntake: 0.8,
      targetWater: 1.0
    }
  };

  const todaySchedule = feedingSchedules.filter(meal => {
    // Filter for today's meals
    return true; // Simplified for demo
  });

  const upcomingMeals = todaySchedule.filter(meal => !meal.completed);
  const completedMeals = todaySchedule.filter(meal => meal.completed);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-health-primary/5">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Link to="/dashboard">
              <Button variant="outline" size="sm" className="border-health-primary text-health-primary hover:bg-health-primary hover:text-white">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                <Utensils className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold">Feeding Schedule</h1>
            </div>
          </div>
          
          <Dialog open={showAddMeal} onOpenChange={setShowAddMeal}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-primary hover:bg-gradient-secondary">
                <Plus className="w-4 h-4 mr-2" />
                Add Meal
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add Feeding Schedule</DialogTitle>
                <DialogDescription>
                  Create a new feeding schedule for your animal.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="animal" className="text-right">
                    Animal
                  </Label>
                  <Select>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select animal" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="buddy">Buddy</SelectItem>
                      <SelectItem value="whiskers">Whiskers</SelectItem>
                      <SelectItem value="luna">Luna</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="time" className="text-right">
                    Meal Time
                  </Label>
                  <Input id="time" type="time" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="foodType" className="text-right">
                    Food Type
                  </Label>
                  <Input id="foodType" placeholder="e.g., Premium Dry Food" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="portion" className="text-right">
                    Portion
                  </Label>
                  <Input id="portion" placeholder="e.g., 200g" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="automated" className="text-right">
                    Automated
                  </Label>
                  <Switch id="automated" className="col-span-3" />
                </div>
              </div>
              <div className="flex justify-end">
                <Button className="bg-gradient-primary hover:bg-gradient-secondary">
                  Add Schedule
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </header>

      <div className="container mx-auto px-4 pb-12">
        <Tabs defaultValue="today" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="today">Today's Schedule</TabsTrigger>
            <TabsTrigger value="nutrition">Nutrition Tracking</TabsTrigger>
            <TabsTrigger value="schedules">All Schedules</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="today" className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="border border-white/20 bg-gradient-glass backdrop-blur-sm">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <Utensils className="w-5 h-5 text-health-primary" />
                    <div>
                      <p className="text-2xl font-bold">{completedMeals.length}</p>
                      <p className="text-sm text-muted-foreground">Meals Fed</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="border border-white/20 bg-gradient-glass backdrop-blur-sm">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-5 h-5 text-health-accent" />
                    <div>
                      <p className="text-2xl font-bold">{upcomingMeals.length}</p>
                      <p className="text-sm text-muted-foreground">Upcoming</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="border border-white/20 bg-gradient-glass backdrop-blur-sm">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <Target className="w-5 h-5 text-health-secondary" />
                    <div>
                      <p className="text-2xl font-bold">
                        {Object.values(nutritionData).reduce((sum, data) => sum + data.dailyCalories, 0)}
                      </p>
                      <p className="text-sm text-muted-foreground">Calories Today</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="border border-white/20 bg-gradient-glass backdrop-blur-sm">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <Droplets className="w-5 h-5 text-health-accent" />
                    <div>
                      <p className="text-2xl font-bold">
                        {Object.values(nutritionData).reduce((sum, data) => sum + data.waterIntake, 0).toFixed(1)}L
                      </p>
                      <p className="text-sm text-muted-foreground">Water Intake</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Upcoming Meals */}
            <Card className="border border-white/20 bg-gradient-glass backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="w-5 h-5 mr-2 text-health-primary" />
                  Upcoming Meals
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingMeals.map((meal) => (
                    <div key={meal.id} className="flex items-center justify-between p-4 bg-muted/20 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center">
                          <Utensils className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h4 className="font-medium">{meal.animalName}</h4>
                          <p className="text-sm text-muted-foreground">
                            {meal.foodType} • {meal.portion}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {meal.calories} calories
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="text-right">
                          <p className="font-medium">{meal.mealTime}</p>
                          {meal.automated && (
                            <Badge variant="outline" className="text-xs">
                              <Bell className="w-3 h-3 mr-1" />
                              Automated
                            </Badge>
                          )}
                        </div>
                        <Button size="sm" className="bg-gradient-primary hover:bg-gradient-secondary">
                          Feed Now
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Completed Meals */}
            <Card className="border border-white/20 bg-gradient-glass backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ChefHat className="w-5 h-5 mr-2 text-health-success" />
                  Completed Meals
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {completedMeals.map((meal) => (
                    <div key={meal.id} className="flex items-center justify-between p-4 bg-muted/20 rounded-lg opacity-75">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-health-success rounded-full flex items-center justify-center">
                          <Utensils className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h4 className="font-medium">{meal.animalName}</h4>
                          <p className="text-sm text-muted-foreground">
                            {meal.foodType} • {meal.portion}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {meal.calories} calories
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{meal.mealTime}</p>
                        <Badge className="bg-health-success text-white" variant="secondary">
                          Completed
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="nutrition" className="space-y-6">
            {Object.entries(nutritionData).map(([animalName, data]) => (
              <Card key={animalName} className="border border-white/20 bg-gradient-glass backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Apple className="w-5 h-5 mr-2 text-health-primary" />
                    {animalName}'s Nutrition
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Daily Calories */}
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Daily Calories</span>
                        <span className="text-sm">{data.dailyCalories} / {data.targetCalories}</span>
                      </div>
                      <Progress value={(data.dailyCalories / data.targetCalories) * 100} className="h-3" />
                    </div>

                    {/* Protein Intake */}
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Protein (g)</span>
                        <span className="text-sm">{data.protein} / {data.targetProtein}</span>
                      </div>
                      <Progress value={(data.protein / data.targetProtein) * 100} className="h-3" />
                    </div>

                    {/* Meals Progress */}
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Meals Today</span>
                        <span className="text-sm">{data.mealsCompleted} / {data.totalMeals}</span>
                      </div>
                      <Progress value={(data.mealsCompleted / data.totalMeals) * 100} className="h-3" />
                    </div>

                    {/* Water Intake */}
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Water Intake (L)</span>
                        <span className="text-sm">{data.waterIntake} / {data.targetWater}</span>
                      </div>
                      <Progress value={(data.waterIntake / data.targetWater) * 100} className="h-3" />
                    </div>
                  </div>

                  {/* Nutrition Summary */}
                  <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-health-primary">{Math.round((data.dailyCalories / data.targetCalories) * 100)}%</p>
                      <p className="text-sm text-muted-foreground">Calorie Goal</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-health-secondary">{Math.round((data.protein / data.targetProtein) * 100)}%</p>
                      <p className="text-sm text-muted-foreground">Protein Goal</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-health-accent">{Math.round((data.waterIntake / data.targetWater) * 100)}%</p>
                      <p className="text-sm text-muted-foreground">Hydration Goal</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="schedules" className="space-y-6">
            <Card className="border border-white/20 bg-gradient-glass backdrop-blur-sm">
              <CardHeader>
                <CardTitle>All Feeding Schedules</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {feedingSchedules.map((schedule) => (
                    <div key={schedule.id} className="flex items-center justify-between p-4 bg-muted/20 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Utensils className="w-5 h-5 text-health-primary" />
                        <div>
                          <h4 className="font-medium">{schedule.animalName} - {schedule.mealTime}</h4>
                          <p className="text-sm text-muted-foreground">
                            {schedule.foodType} • {schedule.portion} • {schedule.calories} calories
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {schedule.automated && (
                          <Badge variant="outline">
                            <Bell className="w-3 h-3 mr-1" />
                            Auto
                          </Badge>
                        )}
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card className="border border-white/20 bg-gradient-glass backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Feeding Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Automated Feeding Notifications</h4>
                    <p className="text-sm text-muted-foreground">Get notified when automated meals are dispensed</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Meal Reminders</h4>
                    <p className="text-sm text-muted-foreground">Receive reminders for manual feeding times</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Nutrition Goal Alerts</h4>
                    <p className="text-sm text-muted-foreground">Get alerts when nutrition goals are not met</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default FeedingSchedule;