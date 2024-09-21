export interface IAddresses {
  id: string;
  userId: string;
  country?: string | null;
  state?: string | null;
  city?: string | null;
  createdAt?: Date;
}
