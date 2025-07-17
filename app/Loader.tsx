export function ThreeLoader() {
    return (
      <div className="w-full h-full flex items-center justify-center bg-black">
        <div className="flex flex-col items-center space-y-4">
          {/* Animated 3D-style loader */}
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 border-2 border-gray-300 dark:border-gray-600 rounded-full animate-spin border-t-black dark:border-t-white"></div>
            <div
              className="absolute inset-2 border-2 border-gray-200 dark:border-gray-700 rounded-full animate-spin animate-reverse border-t-gray-500 dark:border-t-gray-400"
              style={{ animationDuration: "1.5s" }}
            ></div>
            <div
              className="absolute inset-4 border-2 border-gray-100 dark:border-gray-800 rounded-full animate-spin border-t-gray-400 dark:border-t-gray-300"
              style={{ animationDuration: "2s" }}
            ></div>
          </div>

          {/* Loading text */}
          <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">
            Loading 3D Scene...
          </div>

          {/* Progress dots */}
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-pulse"></div>
            <div
              className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-pulse"
              style={{ animationDelay: "0.2s" }}
            ></div>
            <div
              className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-pulse"
              style={{ animationDelay: "0.4s" }}
            ></div>
          </div>
        </div>
      </div>
    );
  }

