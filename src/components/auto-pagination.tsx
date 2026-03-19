import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from '@/components/ui/pagination'
import { cn } from '@/lib/utils'
const RANGE = 2
export default function AutoPagination({ page, pageSize, pathname }) {
  let dotAfter = false
  let dotBefore = false

  const renderDotBefore = (index: number) => {
    if (!dotBefore) {
      dotBefore = true
      return (
        <PaginationItem key={index}>
          <PaginationEllipsis />
        </PaginationItem>
      )
    }
    return null
  }

  const renderDotAfter = (index: number) => {
    if (!dotAfter) {
      // eslint-disable-next-line react-hooks/immutability
      dotAfter = true
      return (
        <PaginationItem key={index}>
          <PaginationEllipsis />
        </PaginationItem>
      )
    }
    return null
  }

  /*
    pageSize = 10 (Tổng 10 trang).
    RANGE = 2 (Hiển thị 2 trang lân cận).
    page = Trang người dùng đang đứng.
  */

  const renderPagination = () => {
    return Array(pageSize)
      .fill(0)
      .map((_, index) => {
        const pageNumber = index + 1
        // Điều kiện để return về ...
        // Đang ở các trang đầu
        if (pageNumber < pageSize - RANGE + 1 && page <= RANGE * 2 + 1 && pageNumber > page + RANGE) {
          return renderDotAfter(index)
        } else if (page > RANGE * 2 + 1 && page < pageSize - RANGE * 2) {
          if (pageNumber > RANGE && pageNumber < page - RANGE) {
            return renderDotBefore(index)
          } else if (pageNumber < pageSize * RANGE + 1 && pageNumber > page + RANGE) {
            return renderDotAfter(index)
          }
        } else if (pageNumber > RANGE && page >= pageSize - RANGE * 2 && pageNumber < page - RANGE) {
          return renderDotBefore(index)
        }
        return (
          <PaginationItem key={index}>
            <PaginationLink
              onClick={(e) => {
                if (page === pageNumber) e.preventDefault()
              }}
              href={`${pathname}?page=${pageNumber}`}
              isActive={pageNumber === page}
            >
              {pageNumber}
            </PaginationLink>
          </PaginationItem>
        )
      })
  }
  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            className={cn({
              'cursor-not-allowed': page === 1
            })}
            href={`${pathname}?page=${page - 1}`}
            onClick={(e) => {
              if (page === 1) {
                e.preventDefault()
              }
            }}
          />
        </PaginationItem>
        {renderPagination()}
        {/* <PaginationItem>
          <PaginationEllipsis />
        </PaginationItem> */}
        <PaginationItem>
          <PaginationNext
            className={cn({
              'cursor-not-allowed': page === pageSize
            })}
            onClick={(e) => {
              if (page === pageSize) {
                e.preventDefault()
              }
            }}
            href={`${pathname}?page=${page + 1}`}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}
