import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AddAnimalDialogProps {
  onAddAnimal: (animal: any) => void;
}

const species = [
  { value: "dog", label: "Dog" },
  { value: "cat", label: "Cat" },
  { value: "rabbit", label: "Rabbit" },
  { value: "horse", label: "Horse" },
  { value: "cow", label: "Cow" },
  { value: "pig", label: "Pig" },
  { value: "goat", label: "Goat" },
  { value: "sheep", label: "Sheep" },
];

const AddAnimalDialog = ({ onAddAnimal }: AddAnimalDialogProps) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    species: "",
    breed: "",
    age: "",
    weight: "",
  });
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.species || !formData.breed || !formData.age || !formData.weight) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    const newAnimal = {
      name: formData.name,
      species: formData.species,
      breed: formData.breed,
      age: parseInt(formData.age),
      weight: parseFloat(formData.weight),
    };

    try {
      await onAddAnimal(newAnimal);
      setFormData({ name: "", species: "", breed: "", age: "", weight: "" });
      setOpen(false);
      
      toast({
        title: "Animal Added!",
        description: `${formData.name} has been added to your tracker.`,
      });
    } catch (error) {
      toast({
        title: "Error Adding Animal",
        description: "Failed to add animal. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-primary hover:bg-gradient-secondary transition-all duration-300">
          <Plus className="w-4 h-4 mr-2" />
          Add Animal
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[425px] border border-white/20 bg-card/95 backdrop-blur-sm">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Add New Animal</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter animal's name"
              className="border-white/20"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="species">Species *</Label>
            <Select value={formData.species} onValueChange={(value) => setFormData({ ...formData, species: value })}>
              <SelectTrigger className="border-white/20">
                <SelectValue placeholder="Select species" />
              </SelectTrigger>
              <SelectContent>
                {species.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="breed">Breed *</Label>
            <Input
              id="breed"
              value={formData.breed}
              onChange={(e) => setFormData({ ...formData, breed: e.target.value })}
              placeholder="Enter breed"
              className="border-white/20"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="age">Age (years) *</Label>
              <Input
                id="age"
                type="number"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                placeholder="Age"
                className="border-white/20"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="weight">Weight (kg) *</Label>
              <Input
                id="weight"
                type="number"
                step="0.1"
                value={formData.weight}
                onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                placeholder="Weight"
                className="border-white/20"
              />
            </div>
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-gradient-primary hover:bg-gradient-secondary">
              Add Animal
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddAnimalDialog;