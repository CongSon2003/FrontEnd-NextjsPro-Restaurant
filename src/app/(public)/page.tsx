import { dishApiRequest } from '@/apiRequests/dish'
import { DishListResType } from '@/validationsSchema/dish.schema'
import Image from 'next/image'

export default async function Home() {
  let dishList: DishListResType['data'] = []
  try {
    const result = await dishApiRequest.listDish({
      cache: 'force-cache', // Sử dụng cache để tăng tốc độ tải trang, dữ liệu sẽ được cập nhật khi có sự thay đổi nhờ revalidateTag
      next: { tags: ['dishes'] } // Gắn tag 'dishes' để dễ dàng quản lý cache và revalidate khi có sự thay đổi
    })
    console.log('🚀 ~ file: page.tsx:11 ~ Home ~ result:', result)
    const {
      payload: { data }
    } = result
    dishList = data
  } catch (error) {
    return <div>Something went wrong</div>
  }
  return (
    <div className='w-full space-y-4'>
      {/* Banner Section */}
      <div className='relative w-full h-[60vh] min-h-96 overflow-hidden flex items-end justify-center'>
        <Image
          src='/banner.png'
          alt='Banner Nhà hàng Big Boy'
          fill
          priority
          quality={100}
          className='object-cover object-center z-0'
        />
        <div className='absolute inset-0 bg-black/40 z-10'></div>

        {/* Sửa py-35 thành py-36 */}
        <div className='z-20 relative text-white py-36 px-4 sm:px-10 md:px-20 text-center'>
          <h1 className='text-3xl sm:text-5xl md:text-6xl font-bold uppercase tracking-wider mb-3'>Nhà hàng Big Boy</h1>
          <p className='text-sm sm:text-base md:text-lg font-light opacity-90'>Vị ngon, trọn khoảnh khắc</p>
        </div>
      </div>

      {/* Menu Section */}
      <section className='max-w-7xl mx-auto space-y-10 py-16 px-4'>
        <h2 className='text-center text-3xl font-bold'>Đa dạng các món ăn</h2>

        {/* Xử lý trạng thái Loading */}
        {dishList.length === 0 ? (
          <p className='text-center'>Hiện tại nhà hàng chưa có món ăn nào.</p>
        ) : (
          <div className='grid grid-cols-1 md:grid-cols-2 gap-10'>
            {dishList.map((dish: DishListResType['data'][number]) => (
              <div
                className='flex gap-4 w-full group cursor-pointer border border-gray-100 rounded-xl p-4 hover:shadow-xl transition-all duration-300'
                key={dish.id || dish.name} // Ưu tiên dùng id thay vì index
              >
                <div className='relative shrink-0 w-30 h-30 sm:w-37.5 sm:h-37.5 overflow-hidden rounded-md'>
                  <Image
                    // Kiểm tra nếu src không có http thì nối domain vào
                    src={dish.image.startsWith('http') ? dish.image : `http://localhost:4000${dish.image}`}
                    fill
                    unoptimized
                    sizes='(max-width: 768px) 120px, 150px'
                    alt={dish.name}
                    className='object-cover transition-transform duration-500 group-hover:scale-110'
                  />
                </div>
                <div className='flex flex-col justify-center space-y-1 flex-1'>
                  <h3 className='text-xl font-bold text-gray-800'>{dish.name}</h3>
                  <p className='text-gray-500 italic line-clamp-2 text-sm'>
                    {dish.description || 'Hương vị đậm đà, khó quên.'}
                  </p>
                  <p className='font-bold text-orange-600 text-xl'>{Number(dish.price).toLocaleString()}đ</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
