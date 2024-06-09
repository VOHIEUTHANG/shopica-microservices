export interface ChangePasswordRequest {
  id: number;
  currentPassword: string;
  newPassword: string;
}
