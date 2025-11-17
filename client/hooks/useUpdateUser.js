import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUser } from "@/services/userService";

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateUser,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['users'],
        refetchType: 'none'
      });
      queryClient.invalidateQueries({
        queryKey: ['paginatedUsers'],
        refetchType: 'active'
      });
    }
  });
};