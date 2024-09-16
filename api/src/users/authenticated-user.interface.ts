export default interface AuthenticaredUser {
  id: number;
  email: string;
  firstName: string | null;
  lastName: string | null;
}
