import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Stethoscope, Utensils, BarChart3, Calendar, 
  Heart, Activity, MapPin, Settings 
} from "lucide-react";

const QuickActions = () => {
  const actions = [
    {
      title: "Health Records",
      description: "View medical history and appointments",
      icon: Stethoscope,
      href: "/health-records",
      color: "text-health-primary",
      bgColor: "bg-health-primary/10"
    },
    {
      title: "Feeding Schedule",
      description: "Manage meals and nutrition tracking",
      icon: Utensils,
      href: "/feeding",
      color: "text-health-secondary",
      bgColor: "bg-health-secondary/10"
    },
    {
      title: "Analytics & Reports",
      description: "View detailed analytics and insights",
      icon: BarChart3,
      href: "/analytics",
      color: "text-health-accent",
      bgColor: "bg-health-accent/10"
    },
    {
      title: "Activity Tracking",
      description: "Monitor real-time location and activity",
      icon: Activity,
      href: "/dashboard",
      color: "text-health-success",
      bgColor: "bg-health-success/10"
    }
  ];

  return (
    <Card className="border border-white/20 bg-gradient-glass backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Settings className="w-5 h-5 mr-2 text-health-primary" />
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {actions.map((action) => {
            const Icon = action.icon;
            return (
              <Link key={action.title} to={action.href}>
                <Button
                  variant="outline"
                  className="w-full h-auto p-4 flex flex-col items-start space-y-2 hover:shadow-hover transition-all duration-300 group"
                >
                  <div className="flex items-center space-x-3 w-full">
                    <div className={`p-2 rounded-lg ${action.bgColor} group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className={`w-5 h-5 ${action.color}`} />
                    </div>
                    <div className="text-left">
                      <h4 className="font-medium">{action.title}</h4>
                      <p className="text-sm text-muted-foreground">{action.description}</p>
                    </div>
                  </div>
                </Button>
              </Link>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActions;