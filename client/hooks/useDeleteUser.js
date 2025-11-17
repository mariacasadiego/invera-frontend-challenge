import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteUser } from "@/services/userService";

export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteUser,
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