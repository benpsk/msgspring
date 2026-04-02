export interface CreateContactRequestRecord {
  full_name: string;
  email: string;
  country: string;
  message?: string;
}

export interface ContactRequestRecord {
  id: number;
  full_name: string;
  email: string;
  country: string;
  message: string | null;
  created_at: Date;
}

export interface ContactRequestRow {
  id: number;
  full_name: string;
  email: string;
  country: string;
  message: string | null;
  created_at: Date | string;
}
