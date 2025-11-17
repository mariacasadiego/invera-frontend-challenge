import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createUser } from "@/services/userService";

export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['users'],
        refetchType: 'none'
      });
      queryClient.invalidateQueries({
        queryKey: ['paginatedUsers'],
        refetchType: 'active'
      });
    },
  });
};
