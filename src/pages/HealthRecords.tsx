import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  ArrowLeft, Plus, Stethoscope, Pill, Syringe, Heart, 
  Calendar as CalendarIcon, FileText, AlertTriangle, CheckCircle,
  Clock, User
} from "lucide-react";

const HealthRecords = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  // Mock data
  const healthRecords = [
    {
      id: "1",
      animalName: "Buddy",
      type: "vaccination",
      title: "Annual Vaccination",
      description: "Rabies, DHPP vaccination completed",
      date: "2024-01-15",
      veterinarian: "Dr. Sarah Wilson",
      clinic: "Happy Paws Veterinary",
      status: "completed",
      priority: "routine"
    },
    {
      id: "2", 
      animalName: "Whiskers",
      type: "checkup",
      title: "Health Checkup",
      description: "Routine examination - All vitals normal",
      date: "2024-01-10",
      veterinarian: "Dr. Mike Johnson",
      clinic: "City Animal Hospital",
      status: "completed",
      priority: "routine"
    },
    {
      id: "3",
      animalName: "Luna",
      type: "treatment",
      title: "Hoof Treatment",
      description: "Treatment for minor hoof irritation",
      date: "2024-01-08",
      veterinarian: "Dr. Emily Brown",
      clinic: "Equine Health Center",
      status: "ongoing",
      priority: "medium"
    },
    {
      id: "4",
      animalName: "Buddy",
      type: "appointment",
      title: "Dental Cleaning",
      description: "Scheduled dental cleaning and examination",
      date: "2024-02-15",
      veterinarian: "Dr. Sarah Wilson",
      clinic: "Happy Paws Veterinary", 
      status: "scheduled",
      priority: "routine"
    }
  ];

  const upcomingAppointments = healthRecords.filter(record => 
    record.status === "scheduled" && new Date(record.date) >= new Date()
  );

  const recentRecords = healthRecords.filter(record => 
    record.status === "completed" || record.status === "ongoing"
  ).slice(0, 5);

  const getTypeIcon = (type: string) => {
    switch(type) {
      case "vaccination": return Syringe;
      case "checkup": return Stethoscope;
      case "treatment": return Pill;
      case "appointment": return CalendarIcon;
      default: return FileText;
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case "completed": return "bg-health-success text-white";
      case "ongoing": return "bg-health-warning text-white";
      case "scheduled": return "bg-health-accent text-white";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case "high": return "text-health-warning";
      case "medium": return "text-health-accent";
      case "routine": return "text-health-success";
      default: return "text-muted-foreground";
    }
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
                <Stethoscope className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold">Health Records</h1>
            </div>
          </div>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-gradient-primary hover:bg-gradient-secondary">
                <Plus className="w-4 h-4 mr-2" />
                Add Record
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add Health Record</DialogTitle>
                <DialogDescription>
                  Create a new health record or appointment for your animal.
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
                  <Label htmlFor="type" className="text-right">
                    Type
                  </Label>
                  <Select>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="vaccination">Vaccination</SelectItem>
                      <SelectItem value="checkup">Health Checkup</SelectItem>
                      <SelectItem value="treatment">Treatment</SelectItem>
                      <SelectItem value="appointment">Appointment</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="title" className="text-right">
                    Title
                  </Label>
                  <Input id="title" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="description" className="text-right">
                    Description
                  </Label>
                  <Textarea id="description" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="vet" className="text-right">
                    Veterinarian
                  </Label>
                  <Input id="vet" className="col-span-3" />
                </div>
              </div>
              <div className="flex justify-end">
                <Button className="bg-gradient-primary hover:bg-gradient-secondary">
                  Add Record
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </header>

      <div className="container mx-auto px-4 pb-12">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="appointments">Appointments</TabsTrigger>
            <TabsTrigger value="records">All Records</TabsTrigger>
            <TabsTrigger value="calendar">Calendar</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="border border-white/20 bg-gradient-glass backdrop-blur-sm">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-health-success" />
                    <div>
                      <p className="text-2xl font-bold">12</p>
                      <p className="text-sm text-muted-foreground">Completed</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="border border-white/20 bg-gradient-glass backdrop-blur-sm">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-5 h-5 text-health-accent" />
                    <div>
                      <p className="text-2xl font-bold">{upcomingAppointments.length}</p>
                      <p className="text-sm text-muted-foreground">Upcoming</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="border border-white/20 bg-gradient-glass backdrop-blur-sm">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <Syringe className="w-5 h-5 text-health-primary" />
                    <div>
                      <p className="text-2xl font-bold">3</p>
                      <p className="text-sm text-muted-foreground">Vaccinations</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="border border-white/20 bg-gradient-glass backdrop-blur-sm">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="w-5 h-5 text-health-warning" />
                    <div>
                      <p className="text-2xl font-bold">1</p>
                      <p className="text-sm text-muted-foreground">Ongoing</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Upcoming Appointments */}
            <Card className="border border-white/20 bg-gradient-glass backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CalendarIcon className="w-5 h-5 mr-2 text-health-primary" />
                  Upcoming Appointments
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingAppointments.map((appointment) => {
                    const Icon = getTypeIcon(appointment.type);
                    return (
                      <div key={appointment.id} className="flex items-center justify-between p-4 bg-muted/20 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Icon className="w-5 h-5 text-health-accent" />
                          <div>
                            <h4 className="font-medium">{appointment.title}</h4>
                            <p className="text-sm text-muted-foreground">
                              {appointment.animalName} • {appointment.clinic}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{appointment.date}</p>
                          <Badge className={getStatusColor(appointment.status)} variant="secondary">
                            {appointment.status}
                          </Badge>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Recent Records */}
            <Card className="border border-white/20 bg-gradient-glass backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="w-5 h-5 mr-2 text-health-secondary" />
                  Recent Records
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentRecords.map((record) => {
                    const Icon = getTypeIcon(record.type);
                    return (
                      <div key={record.id} className="flex items-center justify-between p-4 bg-muted/20 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Icon className="w-5 h-5 text-health-primary" />
                          <div>
                            <h4 className="font-medium">{record.title}</h4>
                            <p className="text-sm text-muted-foreground">
                              {record.animalName} • {record.description}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{record.date}</p>
                          <Badge className={getStatusColor(record.status)} variant="secondary">
                            {record.status}
                          </Badge>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="appointments" className="space-y-6">
            <Card className="border border-white/20 bg-gradient-glass backdrop-blur-sm">
              <CardHeader>
                <CardTitle>All Appointments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {healthRecords.filter(r => r.type === "appointment").map((appointment) => {
                    const Icon = getTypeIcon(appointment.type);
                    return (
                      <div key={appointment.id} className="flex items-center justify-between p-4 bg-muted/20 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Icon className="w-5 h-5 text-health-accent" />
                          <div>
                            <h4 className="font-medium">{appointment.title}</h4>
                            <p className="text-sm text-muted-foreground">
                              {appointment.animalName} • {appointment.clinic}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Dr. {appointment.veterinarian}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{appointment.date}</p>
                          <Badge className={getStatusColor(appointment.status)} variant="secondary">
                            {appointment.status}
                          </Badge>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="records" className="space-y-6">
            <Card className="border border-white/20 bg-gradient-glass backdrop-blur-sm">
              <CardHeader>
                <CardTitle>All Health Records</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {healthRecords.map((record) => {
                    const Icon = getTypeIcon(record.type);
                    return (
                      <div key={record.id} className="flex items-center justify-between p-4 bg-muted/20 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Icon className={`w-5 h-5 ${getPriorityColor(record.priority)}`} />
                          <div>
                            <h4 className="font-medium">{record.title}</h4>
                            <p className="text-sm text-muted-foreground">
                              {record.animalName} • {record.description}
                            </p>
                            <div className="flex items-center space-x-2 mt-1">
                              <User className="w-3 h-3 text-muted-foreground" />
                              <span className="text-xs text-muted-foreground">
                                {record.veterinarian} • {record.clinic}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{record.date}</p>
                          <Badge className={getStatusColor(record.status)} variant="secondary">
                            {record.status}
                          </Badge>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="calendar" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2 border border-white/20 bg-gradient-glass backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Appointment Calendar</CardTitle>
                </CardHeader>
                <CardContent>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    className="rounded-md border"
                  />
                </CardContent>
              </Card>
              
              <Card className="border border-white/20 bg-gradient-glass backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>
                    {selectedDate ? selectedDate.toDateString() : "Select a date"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="text-sm text-muted-foreground">
                      No appointments scheduled for this date.
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default HealthRecords;