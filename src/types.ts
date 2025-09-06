export type Pet = {
  id: string;
  name: string;
  species: string;
  breed: string;
  weight: number;
  age: number;
  user_id: string;
  createdAt: Date;
  updatedAt: Date;
};

export type PetResponse = {
  data: Pet[];
  error?: {
    code: string;
    message: string;
    issues?: Array<{ path: string[]; message: string }>;
  };
};

// Health Record Types
export interface HealthRecordBase {
  animalId: string;
  animalName: string;
  type: string; // vaccination, checkup, treatment, appointment
  title: string;
  description?: string;
  date: string; // ISO format
  veterinarian?: string;
  clinic?: string;
  status: string; // completed, ongoing, scheduled
  priority: string; // high, medium, routine
  userId: string;
}

export interface HealthRecordCreate extends HealthRecordBase {
  // For creation, all required fields are in HealthRecordBase
}

export interface HealthRecordUpdate extends Partial<HealthRecordBase> {
  // Partial update allows updating any subset of fields
}

export interface HealthRecordResponse extends HealthRecordBase {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}
