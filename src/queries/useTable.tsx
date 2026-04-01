import { tableApiRequest } from '@/apiRequests/table'
import { UpdateTableBodyType } from '@/validationsSchema/table.shema'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export const useTableListQuery = () => {
  return useQuery({
    queryKey: ['table-list'],
    queryFn: async () => {
      const res = await tableApiRequest.list()
      return res.payload.data
    }
  })
}

export const useGetTableQuery = (id: number) => {
  return useQuery({
    queryKey: ['table', id],
    queryFn: async () => {
      const res = await tableApiRequest.getTable(id)
      return res.payload
    },
    enabled: id !== undefined
  })
}

export const useAddTableMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: tableApiRequest.add,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['table-list']
      })
    }
  })
}

export const useUpdateTableMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, body }: { id: number; body: UpdateTableBodyType }) => {
      return tableApiRequest.updateTable(id, body)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['table-list']
      })
    }
  })
}

export const useDeleteTableMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id }: { id: number }) => {
      return tableApiRequest.deleteTable(id)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['table-list']
      })
    }
  })
}
