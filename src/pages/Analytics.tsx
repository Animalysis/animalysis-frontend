import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  ArrowLeft, BarChart3, TrendingUp, TrendingDown, Calendar,
  Activity, Heart, Zap, MapPin, Award, Target, AlertTriangle,
  Download, Share, Filter
} from "lucide-react";

const Analytics = () => {
  const [selectedAnimal, setSelectedAnimal] = useState("all");
  const [timeRange, setTimeRange] = useState("7d");

  // Mock analytics data
  const analyticsData = {
    summary: {
      totalAnimals: 3,
      avgHealthScore: 92,
      totalCaloriesBurned: 15420,
      activeHours: 156,
      trendsImproved: 8,
      trendsDeclined: 2
    },
    healthTrends: [
      {
        metric: "Heart Rate Variability",
        value: 95,
        change: "+5%",
        trend: "up",
        status: "excellent",
        animals: ["Buddy", "Luna"]
      },
      {
        metric: "Activity Level",
        value: 88,
        change: "+12%", 
        trend: "up",
        status: "good",
        animals: ["Buddy", "Whiskers", "Luna"]
      },
      {
        metric: "Sleep Quality",
        value: 91,
        change: "-2%",
        trend: "down",
        status: "good",
        animals: ["Whiskers", "Luna"]
      },
      {
        metric: "Nutrition Score",
        value: 85,
        change: "+8%",
        trend: "up",
        status: "good",
        animals: ["Buddy", "Whiskers"]
      }
    ],
    animalPerformance: [
      {
        name: "Buddy",
        healthScore: 94,
        weeklyProgress: 88,
        caloriesBurned: 2940,
        activeMinutes: 315,
        achievements: ["Daily Goal Streak", "Weekly Champion"],
        alerts: []
      },
      {
        name: "Whiskers",
        healthScore: 89,
        weeklyProgress: 76,
        caloriesBurned: 1050,
        activeMinutes: 120,
        achievements: ["Consistency Award"],
        alerts: ["Low activity yesterday"]
      },
      {
        name: "Luna",
        healthScore: 95,
        weeklyProgress: 95,
        caloriesBurned: 5950,
        activeMinutes: 420,
        achievements: ["Perfect Week", "Elite Performer"],
        alerts: []
      }
    ],
    insights: [
      {
        type: "positive",
        title: "Excellent Week for Luna",
        description: "Luna has exceeded all activity goals this week with 95% performance score.",
        icon: Award,
        color: "text-health-success"
      },
      {
        type: "warning",
        title: "Whiskers Activity Declining",
        description: "Whiskers' activity has decreased by 15% compared to last week. Consider increasing playtime.",
        icon: AlertTriangle,
        color: "text-health-warning"
      },
      {
        type: "info",
        title: "Buddy's Heart Rate Improving",
        description: "Consistent exercise routine is showing positive effects on Buddy's cardiovascular health.",
        icon: Heart,
        color: "text-health-primary"
      }
    ]
  };

  const getHealthScoreColor = (score: number) => {
    if (score >= 90) return "text-health-success";
    if (score >= 75) return "text-health-accent";
    return "text-health-warning";
  };

  const getTrendIcon = (trend: string) => {
    return trend === "up" ? TrendingUp : TrendingDown;
  };

  const getTrendColor = (trend: string) => {
    return trend === "up" ? "text-health-success" : "text-health-warning";
  };

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
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold">Analytics & Reports</h1>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Select value={selectedAnimal} onValueChange={setSelectedAnimal}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Animals</SelectItem>
                <SelectItem value="buddy">Buddy</SelectItem>
                <SelectItem value="whiskers">Whiskers</SelectItem>
                <SelectItem value="luna">Luna</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="24h">24 Hours</SelectItem>
                <SelectItem value="7d">7 Days</SelectItem>
                <SelectItem value="30d">30 Days</SelectItem>
                <SelectItem value="90d">90 Days</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 pb-12">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="health">Health Trends</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="border border-white/20 bg-gradient-glass backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Avg Health Score</p>
                      <p className={`text-3xl font-bold ${getHealthScoreColor(analyticsData.summary.avgHealthScore)}`}>
                        {analyticsData.summary.avgHealthScore}%
                      </p>
                    </div>
                    <Heart className="h-8 w-8 text-health-primary" />
                  </div>
                  <div className="mt-4">
                    <Progress value={analyticsData.summary.avgHealthScore} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-white/20 bg-gradient-glass backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Calories Burned</p>
                      <p className="text-3xl font-bold">{analyticsData.summary.totalCaloriesBurned.toLocaleString()}</p>
                    </div>
                    <Zap className="h-8 w-8 text-health-secondary" />
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Across all animals this week
                  </p>
                </CardContent>
              </Card>

              <Card className="border border-white/20 bg-gradient-glass backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Active Hours</p>
                      <p className="text-3xl font-bold">{analyticsData.summary.activeHours}h</p>
                    </div>
                    <Activity className="h-8 w-8 text-health-accent" />
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Combined activity time
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Performance Chart Placeholder */}
            <Card className="border border-white/20 bg-gradient-glass backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="w-5 h-5 mr-2 text-health-primary" />
                  Weekly Activity Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-muted-foreground">
                  Interactive activity chart would be displayed here
                </div>
              </CardContent>
            </Card>

            {/* Quick Insights */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border border-white/20 bg-gradient-glass backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-lg">Positive Trends</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="w-4 h-4 text-health-success" />
                      <span className="text-sm">Heart rate variability improved by 5%</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="w-4 h-4 text-health-success" />
                      <span className="text-sm">Activity levels up 12% across all animals</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="w-4 h-4 text-health-success" />
                      <span className="text-sm">Nutrition scores improving weekly</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-white/20 bg-gradient-glass backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-lg">Areas for Attention</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <AlertTriangle className="w-4 h-4 text-health-warning" />
                      <span className="text-sm">Whiskers needs more active playtime</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <TrendingDown className="w-4 h-4 text-health-warning" />
                      <span className="text-sm">Sleep quality slightly decreased</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            <div className="grid gap-6">
              {analyticsData.animalPerformance.map((animal) => (
                <Card key={animal.name} className="border border-white/20 bg-gradient-glass backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>{animal.name}'s Performance</span>
                      <Badge className={`${getHealthScoreColor(animal.healthScore)} bg-transparent border`}>
                        Health Score: {animal.healthScore}%
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                      <div className="space-y-2">
                        <p className="text-sm font-medium">Weekly Progress</p>
                        <Progress value={animal.weeklyProgress} className="h-3" />
                        <p className="text-xs text-muted-foreground">{animal.weeklyProgress}% of goals met</p>
                      </div>
                      
                      <div className="text-center">
                        <p className="text-2xl font-bold text-health-secondary">{animal.caloriesBurned}</p>
                        <p className="text-sm text-muted-foreground">Calories Burned</p>
                      </div>
                      
                      <div className="text-center">
                        <p className="text-2xl font-bold text-health-accent">{animal.activeMinutes}</p>
                        <p className="text-sm text-muted-foreground">Active Minutes</p>
                      </div>
                      
                      <div className="space-y-2">
                        <p className="text-sm font-medium">Achievements</p>
                        <div className="space-y-1">
                          {animal.achievements.map((achievement, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              <Award className="w-3 h-3 mr-1" />
                              {achievement}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    {animal.alerts.length > 0 && (
                      <div className="mt-4 p-3 bg-health-warning/10 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <AlertTriangle className="w-4 h-4 text-health-warning" />
                          <span className="text-sm font-medium">Alerts</span>
                        </div>
                        {animal.alerts.map((alert, index) => (
                          <p key={index} className="text-sm text-muted-foreground mt-1">
                            {alert}
                          </p>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="health" className="space-y-6">
            <div className="grid gap-6">
              {analyticsData.healthTrends.map((trend, index) => {
                const TrendIcon = getTrendIcon(trend.trend);
                return (
                  <Card key={index} className="border border-white/20 bg-gradient-glass backdrop-blur-sm">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center">
                            <Heart className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h3 className="font-semibold">{trend.metric}</h3>
                            <p className="text-sm text-muted-foreground">
                              Affects: {trend.animals.join(", ")}
                            </p>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <div className="flex items-center space-x-2">
                            <TrendIcon className={`w-4 h-4 ${getTrendColor(trend.trend)}`} />
                            <span className={`font-medium ${getTrendColor(trend.trend)}`}>
                              {trend.change}
                            </span>
                          </div>
                          <p className="text-2xl font-bold">{trend.value}%</p>
                          <Badge variant="outline" className="mt-1">
                            {trend.status}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="mt-4">
                        <Progress value={trend.value} className="h-2" />
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="insights" className="space-y-6">
            <div className="grid gap-6">
              {analyticsData.insights.map((insight, index) => {
                const Icon = insight.icon;
                return (
                  <Card key={index} className="border border-white/20 bg-gradient-glass backdrop-blur-sm">
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className={`p-3 rounded-full bg-current/10`}>
                          <Icon className={`w-6 h-6 ${insight.color}`} />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">{insight.title}</h3>
                          <p className="text-muted-foreground mt-1">{insight.description}</p>
                          
                          <div className="flex items-center space-x-2 mt-4">
                            <Button variant="outline" size="sm">
                              View Details
                            </Button>
                            <Button variant="outline" size="sm">
                              <Share className="w-3 h-3 mr-1" />
                              Share
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Weekly Summary */}
            <Card className="border border-white/20 bg-gradient-glass backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="w-5 h-5 mr-2 text-health-primary" />
                  Weekly Summary Report
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-health-success">{analyticsData.summary.trendsImproved}</p>
                    <p className="text-sm text-muted-foreground">Metrics Improved</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-health-warning">{analyticsData.summary.trendsDeclined}</p>
                    <p className="text-sm text-muted-foreground">Metrics Declined</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-health-accent">{analyticsData.summary.avgHealthScore}%</p>
                    <p className="text-sm text-muted-foreground">Overall Health Score</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Analytics;