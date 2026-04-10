'use client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Minus, Plus } from 'lucide-react'
import Image from 'next/image'
import { useEffect, useMemo, useState } from 'react'
import Quantity from './quantity'
import { useGetDishListQuery } from '@/queries/useDish'
import { GuestCreateOrdersBodyType } from '@/validationsSchema/guest.shema'
import { formatCurrency } from '@/lib/utils'

export default function MenuPage() {
  const [orders, setOrders] = useState<GuestCreateOrdersBodyType>([])
  const { data } = useGetDishListQuery()
  const dishes = useMemo(() => {
    return data ?? []
  }, [data])

  const handleQuantityChange = (dishId: number, quantity: number) => {
    setOrders((prevOrders) => {
      // 1. Nếu quantity = 0, xóa món ăn khỏi giỏ hàng
      if (quantity === 0) {
        return prevOrders.filter((order) => order.dishId !== dishId)
      }
      // 2. Nếu đã có trong danh sách, cập nhật số lượng mới.
      const existingOrderIndex = prevOrders.findIndex((order) => order.dishId === dishId)
      if (existingOrderIndex !== -1) {
        const newOrders = [...prevOrders]
        newOrders[existingOrderIndex] = {
          ...newOrders[existingOrderIndex],
          quantity: quantity
        }
        return newOrders
      }
      // 3. Nếu món ăn chưa có, thêm mới vào mảng
      return [...prevOrders, { dishId, quantity }]
    })
  }
  const totalPrice = useMemo(() => {
    return orders.reduce((result, order) => {
      if (!orders) return
      const priceDish = dishes.find((dish) => dish.id === order.dishId).price
      return result + order.quantity * priceDish
    }, 0)
  }, [dishes, orders])
  return (
    <div className='w-full flex items-center justify-center'>
      <div className='grid grid-row-2 gap-3 '>
        <h1 className='text-xl text-center font-bold'>Đơn hàng</h1>
        <div className='space-y-4'>
          {dishes.map((dish, index) => {
            return (
              <div key={index} className='flex gap-5'>
                <p>{index + 1}</p>
                <Image
                  src={dish.image}
                  alt={dish.name}
                  height={100}
                  width={100}
                  quality={100}
                  className='object-cover w-[80px] h-[80px] rounded-md'
                />
                <div className='space-y-1'>
                  <h3 className='font-bold'>{dish.name}</h3>
                  <p>{dish.description}</p>
                  <p className='font-semibold'>{formatCurrency(dish.price)}</p>
                </div>
                <div className='flex-shrink-0 ml-auto flex justify-center items-center'>
                  <Quantity
                    value={orders.find((order) => order.dishId === dish.id)?.quantity || 0}
                    onChange={(value) => handleQuantityChange(dish.id, value)}
                  />
                </div>
              </div>
            )
          })}
        </div>
        <div className='w-full'>
          <Button variant='outline' className='w-full flex justify-between'>
            <span>Đặt hàng · {orders.length} món</span>
            <span>{formatCurrency(totalPrice)}</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
