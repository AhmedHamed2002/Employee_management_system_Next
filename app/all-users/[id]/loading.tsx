export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-neutral-900 flex items-center justify-center px-6 py-24">
      <div className="w-full max-w-4xl bg-white dark:bg-neutral-800 rounded-2xl shadow-lg p-8 border border-gray-200 dark:border-gray-700">
        <div className="animate-pulse space-y-6">
          <div className="flex items-center gap-6">
            <div className="w-36 h-36 bg-gray-300 dark:bg-neutral-700 rounded-full"></div>
            <div>
              <div className="h-6 bg-gray-300 dark:bg-neutral-700 rounded w-40 mb-2"></div>
              <div className="h-4 bg-gray-300 dark:bg-neutral-700 rounded w-60"></div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-8">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="h-5 bg-gray-300 dark:bg-neutral-700 rounded w-full"
              ></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
