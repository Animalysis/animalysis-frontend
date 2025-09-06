import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  getHealthRecords, 
  createHealthRecord, 
  updateHealthRecord, 
  deleteHealthRecord, 
  getUpcomingAppointments, 
  getRecentRecords 
} from "@/services/healthRecords";
import { HealthRecordResponse, HealthRecordCreate } from "@/types";
import { toast } from "sonner";
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
import { usePets } from "@/providers/pets-provider";

const HealthRecords = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [healthRecords, setHealthRecords] = useState<HealthRecordResponse[]>([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState<HealthRecordResponse[]>([]);
  const [recentRecords, setRecentRecords] = useState<HealthRecordResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { pets, isLoading: petsLoading } = usePets();
  
  // Form state
  const [selectedAnimalId, setSelectedAnimalId] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedPriority, setSelectedPriority] = useState("");

  // Fetch all health data
  useEffect(() => {
    const fetchHealthData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const [records, appointments, recent] = await Promise.all([
          getHealthRecords(),
          getUpcomingAppointments(),
          getRecentRecords()
        ]);
        
        setHealthRecords(records);
        setUpcomingAppointments(appointments);
        setRecentRecords(recent);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch health records');
        toast.error('Failed to load health records');
      } finally {
        setLoading(false);
      }
    };

    fetchHealthData();
  }, []);

  // Handle creating a new record
  const handleCreateRecord = async (recordData: HealthRecordCreate) => {
    try {
      // TODO: Replace with actual user ID from auth context
      const recordWithUser: HealthRecordCreate = {
        ...recordData,
        userId: "demo-user-id" // Placeholder - should come from auth context
      };
      
      const newRecord = await createHealthRecord(recordWithUser);
      setHealthRecords(prev => [...prev, newRecord]);
      
      // Refresh filtered data
      const [appointments, recent] = await Promise.all([
        getUpcomingAppointments(),
        getRecentRecords()
      ]);
      
      setUpcomingAppointments(appointments);
      setRecentRecords(recent);
      
      toast.success('Health record created successfully');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to create health record');
    }
  };

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
                  {petsLoading ? (
                    <div className="col-span-3 h-10 bg-muted animate-pulse rounded-md"></div>
                  ) : pets.length === 0 ? (
                    <div className="col-span-3 text-sm text-muted-foreground">
                      No pets found. Please add pets first.
                    </div>
                  ) : (
                    <Select value={selectedAnimalId} onValueChange={setSelectedAnimalId}>
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select animal" />
                      </SelectTrigger>
                      <SelectContent>
                        {pets.map((pet) => (
                          <SelectItem key={pet.id} value={pet.id}>
                            {pet.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="type" className="text-right">
                    Type
                  </Label>
                  <Select value={selectedType} onValueChange={setSelectedType}>
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
                  <Input id="title" className="col-span-3" placeholder="Record title" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="description" className="text-right">
                    Description
                  </Label>
                  <Textarea id="description" className="col-span-3" placeholder="Description" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="vet" className="text-right">
                    Veterinarian
                  </Label>
                  <Input id="vet" className="col-span-3" placeholder="Veterinarian name" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="clinic" className="text-right">
                    Clinic
                  </Label>
                  <Input id="clinic" className="col-span-3" placeholder="Clinic name" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="date" className="text-right">
                    Date
                  </Label>
                  <Input id="date" type="date" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="status" className="text-right">
                    Status
                  </Label>
                  <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="scheduled">Scheduled</SelectItem>
                      <SelectItem value="ongoing">Ongoing</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="priority" className="text-right">
                    Priority
                  </Label>
                  <Select value={selectedPriority} onValueChange={setSelectedPriority}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="routine">Routine</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end">
                <Button 
                  className="bg-gradient-primary hover:bg-gradient-secondary"
                  onClick={() => {
                    // Get the selected animal's name
                    const selectedAnimal = pets.find(pet => pet.id === selectedAnimalId);
                    const selectedAnimalName = selectedAnimal?.name || '';
                    
                    // Get other form values
                    const formData = {
                      animalName: selectedAnimalName,
                      animalId: selectedAnimalId,
                      type: selectedType,
                      title: (document.getElementById('title') as HTMLInputElement)?.value,
                      description: (document.getElementById('description') as HTMLTextAreaElement)?.value,
                      veterinarian: (document.getElementById('vet') as HTMLInputElement)?.value,
                      clinic: (document.getElementById('clinic') as HTMLInputElement)?.value,
                      date: (document.getElementById('date') as HTMLInputElement)?.value,
                      status: selectedStatus,
                      priority: selectedPriority,
                      userId: "demo-user-id" // TODO: Replace with actual user ID
                    };
                    
                    if (formData.animalId && formData.animalName && formData.type && formData.title && formData.date && formData.status && formData.priority) {
                      handleCreateRecord(formData);
                    } else {
                      toast.error('Please fill in all required fields');
                    }
                  }}
                >
                  Add Record
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </header>

      <div className="container mx-auto px-4 pb-12">
        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-300 rounded-lg text-red-700">
            <AlertTriangle className="w-5 h-5 inline mr-2" />
            {error}
          </div>
        )}
        
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
                      <p className="text-2xl font-bold">
                        {loading ? <span className="inline-block w-8 h-6 bg-muted rounded animate-pulse"></span> : 
                         healthRecords.filter(r => r.status === "completed").length}
                      </p>
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
                      <p className="text-2xl font-bold">
                        {loading ? <span className="inline-block w-8 h-6 bg-muted rounded animate-pulse"></span> : 
                         upcomingAppointments.length}
                      </p>
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
                      <p className="text-2xl font-bold">
                        {loading ? <span className="inline-block w-8 h-6 bg-muted rounded animate-pulse"></span> : 
                         healthRecords.filter(r => r.type === "vaccination").length}
                      </p>
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
                      <p className="text-2xl font-bold">
                        {loading ? <span className="inline-block w-8 h-6 bg-muted rounded animate-pulse"></span> : 
                         healthRecords.filter(r => r.status === "ongoing").length}
                      </p>
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
                {loading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex items-center justify-between p-4 bg-muted/20 rounded-lg animate-pulse">
                        <div className="flex items-center space-x-3">
                          <div className="w-5 h-5 bg-muted rounded"></div>
                          <div>
                            <div className="h-4 bg-muted rounded w-32 mb-2"></div>
                            <div className="h-3 bg-muted rounded w-24"></div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="h-4 bg-muted rounded w-20 mb-2"></div>
                          <div className="h-6 bg-muted rounded w-16"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : upcomingAppointments.length === 0 ? (
                  <div className="text-center text-muted-foreground py-8">
                    <CalendarIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No upcoming appointments</p>
                  </div>
                ) : (
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
                )}
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
                {loading ? (
                  <div className="space-y-4">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className="flex items-center justify-between p-4 bg-muted/20 rounded-lg animate-pulse">
                        <div className="flex items-center space-x-3">
                          <div className="w-5 h-5 bg-muted rounded"></div>
                          <div>
                            <div className="h-4 bg-muted rounded w-32 mb-2"></div>
                            <div className="h-3 bg-muted rounded w-24"></div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="h-4 bg-muted rounded w-20 mb-2"></div>
                          <div className="h-6 bg-muted rounded w-16"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : recentRecords.length === 0 ? (
                  <div className="text-center text-muted-foreground py-8">
                    <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No recent records</p>
                  </div>
                ) : (
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
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="appointments" className="space-y-6">
            <Card className="border border-white/20 bg-gradient-glass backdrop-blur-sm">
              <CardHeader>
                <CardTitle>All Appointments</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-4">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className="flex items-center justify-between p-4 bg-muted/20 rounded-lg animate-pulse">
                        <div className="flex items-center space-x-3">
                          <div className="w-5 h-5 bg-muted rounded"></div>
                          <div className="flex-1">
                            <div className="h-4 bg-muted rounded w-32 mb-2"></div>
                            <div className="h-3 bg-muted rounded w-24 mb-1"></div>
                            <div className="h-3 bg-muted rounded w-20"></div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="h-4 bg-muted rounded w-20 mb-2"></div>
                          <div className="h-6 bg-muted rounded w-16"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : healthRecords.filter(r => r.type === "appointment").length === 0 ? (
                  <div className="text-center text-muted-foreground py-8">
                    <CalendarIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No appointments found</p>
                  </div>
                ) : (
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
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="records" className="space-y-6">
            <Card className="border border-white/20 bg-gradient-glass backdrop-blur-sm">
              <CardHeader>
                <CardTitle>All Health Records</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-4">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                      <div key={i} className="flex items-center justify-between p-4 bg-muted/20 rounded-lg animate-pulse">
                        <div className="flex items-center space-x-3">
                          <div className="w-5 h-5 bg-muted rounded"></div>
                          <div className="flex-1">
                            <div className="h-4 bg-muted rounded w-32 mb-2"></div>
                            <div className="h-3 bg-muted rounded w-24 mb-1"></div>
                            <div className="flex items-center space-x-2">
                              <div className="w-3 h-3 bg-muted rounded"></div>
                              <div className="h-3 bg-muted rounded w-20"></div>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="h-4 bg-muted rounded w-20 mb-2"></div>
                          <div className="h-6 bg-muted rounded w-16"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : healthRecords.length === 0 ? (
                  <div className="text-center text-muted-foreground py-8">
                    <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No health records found</p>
                  </div>
                ) : (
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
                )}
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