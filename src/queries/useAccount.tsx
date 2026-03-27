import { accountApiRequest } from '@/apiRequests/account'
import { UpdateEmployeeAccountBodyType } from '@/validationsSchema/account.shema'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

// custom hook
export const useAccountMeQuery = () => {
  return useQuery({
    queryKey: ['account-profile'],
    queryFn: () =>
      accountApiRequest.getMe().then((res) => {
        return res
      })
  })
}
export const useUpdateMeMutation = () => {
  return useMutation({
    mutationFn: accountApiRequest.updateMe
  })
}

export const useChangePasswordMutation = () => {
  return useMutation({
    mutationFn: accountApiRequest.changePassword
  })
}

/// use Employee
export const useGetAccountListQuery = () => {
  return useQuery({
    queryKey: ['accounts-list'],
    queryFn: async () => {
      const res = await accountApiRequest.list()
      return res.payload.data
    }
  })
}

export const useGetAccountQuery = (id: number) => {
  return useQuery({
    queryKey: ['account-employee', id],
    queryFn: async () => {
      const res = await accountApiRequest.getEmployee(id)
      return res.payload
    },
    enabled: id !== undefined
  })
}

export const useAddAccountMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: accountApiRequest.addEmployee,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['accounts-list']
      })
    }
  })
}

export const useUpdateAccountMutatuion = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, body }: { id: number; body: UpdateEmployeeAccountBodyType }) =>
      accountApiRequest.updateEmployee(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['accounts-list']
      })
    }
  })
}

export const useDeleteAccountMutatuion = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: accountApiRequest.deleteEmployee,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['accounts-list']
      })
    }
  })
}
