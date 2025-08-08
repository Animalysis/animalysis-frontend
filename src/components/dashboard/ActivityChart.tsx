import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { name: "Mon", calories: 340, heartRate: 72 },
  { name: "Tue", calories: 520, heartRate: 85 },
  { name: "Wed", calories: 280, heartRate: 68 },
  { name: "Thu", calories: 620, heartRate: 90 },
  { name: "Fri", calories: 450, heartRate: 78 },
  { name: "Sat", calories: 720, heartRate: 95 },
  { name: "Sun", calories: 380, heartRate: 70 },
];

const ActivityChart = () => {
  return (
    <Card className="col-span-2 border border-white/20 bg-gradient-glass backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Weekly Activity Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted-foreground))" opacity={0.3} />
            <XAxis 
              dataKey="name" 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
            />
            <YAxis 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
                boxShadow: "var(--shadow-card)"
              }}
            />
            <Line
              type="monotone"
              dataKey="calories"
              stroke="hsl(var(--health-secondary))"
              strokeWidth={3}
              dot={{ fill: "hsl(var(--health-secondary))", strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: "hsl(var(--health-secondary))", strokeWidth: 2 }}
            />
            <Line
              type="monotone"
              dataKey="heartRate"
              stroke="hsl(var(--health-primary))"
              strokeWidth={3}
              dot={{ fill: "hsl(var(--health-primary))", strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: "hsl(var(--health-primary))", strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
        
        <div className="flex justify-center space-x-6 mt-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-health-secondary"></div>
            <span className="text-sm text-muted-foreground">Calories Burned</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-health-primary"></div>
            <span className="text-sm text-muted-foreground">Heart Rate</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ActivityChart;