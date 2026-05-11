import { useResetPasswordContext } from "@/components/shared/ResetPasswordProvider";

export function useResetPassword() {
  return useResetPasswordContext();
}
