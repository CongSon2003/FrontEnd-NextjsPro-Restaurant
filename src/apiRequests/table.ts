import http from '@/lib/http'
import {
  CreateTableBodyType,
  TableListResponseType,
  TableResponseType,
  UpdateTableBodyType
} from '@/validationsSchema/table.shema'

export const tableApiRequest = {
  list: () => {
    return http.get<TableListResponseType>('tables')
  },
  add: (body: CreateTableBodyType) => {
    return http.post<TableResponseType>('tables', body)
  },
  getTable: (id: number) => {
    return http.get<TableResponseType>(`tables/${id}`)
  },
  updateTable: (id: number, body: UpdateTableBodyType) => {
    return http.put<TableResponseType>(`tables/${id}`, body)
  },
  deleteTable: (id: number) => {
    return http.delete<TableResponseType>(`tables/${id}`)
  }
}
