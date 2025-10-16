export default function Loading() {
    return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100 dark:bg-neutral-950 text-gray-500 dark:text-gray-400">
        <i className="fas fa-spinner fa-spin text-4xl"></i>
        <p className="mt-3 text-lg font-medium">Loading settings...</p>
        </div>
    );
}
