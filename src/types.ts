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
