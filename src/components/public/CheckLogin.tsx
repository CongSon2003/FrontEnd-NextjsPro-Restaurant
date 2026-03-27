export default function CheckLogin() {
  return (
    <div className='flex h-screen w-full items-center justify-center bg-white'>
      <div className='flex flex-col items-center gap-4'>
        {/* Vòng tròn Spinner (Sử dụng Tailwind CSS) */}
        <div className='h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600'></div>
        <p className='text-sm font-medium text-gray-600'>Đang xác thực phiên đăng nhập, vui lòng đợi...</p>
      </div>
    </div>
  )
}
