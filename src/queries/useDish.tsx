import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { dishApiRequest } from '@/apiRequests/dish'
import { CreateDishBodyType, UpdateDishBodyType } from '@/validationsSchema/dish.schema'

export const useGetDishListQuery = () => {
  return useQuery({
    queryKey: ['dishes'],
    queryFn: async () => {
      const res = await dishApiRequest.listDish()
      return res.payload.data
    }
  })
}

export const useGetDishQuery = (id: number) => {
  return useQuery({
    queryKey: ['dish', id],
    queryFn: async () => {
      const res = await dishApiRequest.getDish(id)
      return res.payload.data
    },
    enabled: id !== undefined
  })
}

export const useUpdateDishMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, body }: { id: number; body: UpdateDishBodyType }) => {
      return dishApiRequest.updateDish(id, body)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['dishes']
      })
    }
  })
}

export const useAddDishMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ body }: { body: CreateDishBodyType }) => {
      return dishApiRequest.addDish(body)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['dishes']
      })
    }
  })
}

export const useDeleteDishMutatuion = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: dishApiRequest.deleteDish,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['dishes']
      })
    }
  })
}
