import { Skeleton } from "@/components/ui/skeleton"

export function LoadingSkeleton() {
  return (
    <div className="space-y-4 pt-5">
      <div className="border-4 border-gray-300 mx-auto my-10 max-w-4xl w-full px-4 sm:px-8 py-8">
        <div className="flex justify-center mb-4">
          <Skeleton className="h-20 w-40" />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-6 w-3/4 mx-auto" />
          <Skeleton className="h-6 w-5/6 mx-auto" />
          <Skeleton className="h-6 w-2/3 mx-auto" />
          <Skeleton className="h-8 w-1/2 mx-auto" />
          <Skeleton className="h-6 w-1/3 mx-auto" />
        </div>
      </div>
      <div className="flex justify-center">
        <Skeleton className="h-10 w-64" />
      </div>
    </div>
  )
}

