import { HealthRecordResponse, HealthRecordCreate, HealthRecordUpdate } from '@/types';

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

// Generic API request function
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }

  return response.json();
}

// GET /api/health-records - Get all records
export async function getHealthRecords(): Promise<HealthRecordResponse[]> {
  return apiRequest<HealthRecordResponse[]>('/api/health-records');
}

// GET /api/health-records/{record_id} - Get specific record
export async function getHealthRecord(recordId: string): Promise<HealthRecordResponse> {
  return apiRequest<HealthRecordResponse>(`/api/health-records/${recordId}`);
}

// POST /api/health-records - Create new record
export async function createHealthRecord(record: HealthRecordCreate): Promise<HealthRecordResponse> {
  return apiRequest<HealthRecordResponse>('/api/health-records', {
    method: 'POST',
    body: JSON.stringify(record),
  });
}

// PUT /api/health-records/{record_id} - Update record
export async function updateHealthRecord(
  recordId: string,
  updates: HealthRecordUpdate
): Promise<HealthRecordResponse> {
  return apiRequest<HealthRecordResponse>(`/api/health-records/${recordId}`, {
    method: 'PUT',
    body: JSON.stringify(updates),
  });
}

// DELETE /api/health-records/{record_id} - Delete record
export async function deleteHealthRecord(recordId: string): Promise<{ success: boolean; message: string }> {
  return apiRequest<{ success: boolean; message: string }>(`/api/health-records/${recordId}`, {
    method: 'DELETE',
  });
}

// GET /api/health-records/upcoming - Get upcoming appointments
export async function getUpcomingAppointments(): Promise<HealthRecordResponse[]> {
  return apiRequest<HealthRecordResponse[]>('/api/health-records/upcoming');
}

// GET /api/health-records/recent - Get recent records
export async function getRecentRecords(): Promise<HealthRecordResponse[]> {
  return apiRequest<HealthRecordResponse[]>('/api/health-records/recent');
}