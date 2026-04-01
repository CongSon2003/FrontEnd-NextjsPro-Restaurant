import z from 'zod'

export const TableStatus = {
  Available: 'Available',
  Hidden: 'Hidden',
  Reserved: 'Reserved'
} as const

export const TableStatusValues = [TableStatus.Available, TableStatus.Hidden, TableStatus.Reserved] as const

export const createTableBody = z.object({
  number: z.coerce.number().positive({ message: 'Số hiệu bàn phải là số dương > 0' }),
  capacity: z.coerce.number().positive({ message: 'Sức chứa phải là số dương > 0' }),
  status: z.enum(TableStatusValues).optional()
})

export type CreateTableBodyType = z.TypeOf<typeof createTableBody>

export const TableSchema = z.object({
  number: z.coerce.number(),
  capacity: z.coerce.number(),
  status: z.enum(TableStatusValues),
  token: z.string(),
  createdAt: z.date(),
  updatedAt: z.date()
})

export const TableResponse = z.object({
  data: TableSchema,
  message: z.string()
})

export type TableResponseType = z.TypeOf<typeof TableResponse>

export const TableListResponse = z.object({
  data: z.array(TableSchema),
  message: z.string()
})

export type TableListResponseType = z.TypeOf<typeof TableListResponse>

export const UpdateTableBody = z.object({
  changeToken: z.boolean(),
  capacity: z.coerce.number().positive(),
  status: z.enum(TableStatusValues).optional()
})

export type UpdateTableBodyType = z.TypeOf<typeof UpdateTableBody>

export const TableParams = z.object({
  number: z.coerce.number()
})

export type TableParamsType = z.TypeOf<typeof TableParams>
