export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100 dark:bg-neutral-950 text-gray-500 dark:text-gray-400">
      <div className="flex flex-col items-center space-y-4">
        <i className="fas fa-spinner fa-spin text-3xl"></i>
        <p className="text-lg font-medium">Loading  employees...</p>
      </div>
    </div>
  );
}
