export default interface AuthenticaredUser {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
}
