export default function GlobalSkeleton() {
    return (
        <div className="w-full min-h-screen p-6 space-y-6 animate-pulse container mx-auto">
            {/* Header Skeleton */}
            <div className="flex items-center justify-between border-b pb-4 border-gray-200 dark:border-gray-800">
                <div className="h-8 w-40 bg-gray-300 dark:bg-gray-700 rounded"></div>
                <div className="flex space-x-4">
                    <div className="h-8 w-20 bg-gray-300 dark:bg-gray-700 rounded"></div>
                    <div className="h-8 w-8 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
                </div>
            </div>

            {/* Hero / Banner Skeleton */}
            <div className="h-48 w-full bg-gray-300 dark:bg-gray-700 rounded-lg"></div>

            {/* Content Grid Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
                <div className="h-40 bg-gray-300 dark:bg-gray-700 rounded-lg"></div>
                <div className="h-40 bg-gray-300 dark:bg-gray-700 rounded-lg"></div>
                <div className="h-40 bg-gray-300 dark:bg-gray-700 rounded-lg"></div>
            </div>
        </div>
    );
}