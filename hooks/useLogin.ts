import { useLoginContext } from "@/components/shared/LoginProvider";

export function useLogin() {
  return useLoginContext();
}
