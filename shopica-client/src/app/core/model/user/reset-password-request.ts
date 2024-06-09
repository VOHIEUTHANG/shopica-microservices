export interface ResetPasswordRequest {
  email: string;
  resetToken: string;
  newPassword: string;
}
