import { useRegisterContext } from "@/components/shared/RegisterProvider";

export function useRegister() {
  return useRegisterContext();
}
