"use client";

import { useEffect } from "react";
import logger from "@/utils/logger";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log to your reporting service
    logger.error(error, "error");
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-6 py-12">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-red-600 mb-2">
            ⚠️ Something went wrong
          </h2>
          <p className="text-gray-600 mb-6">
            We encountered an unexpected error. You can try again or report this issue.
          </p>
        </div>

        <div className="bg-gray-100 rounded-lg p-4 mb-6 text-sm text-gray-800 overflow-x-auto">
          <p className="font-semibold text-gray-900 mb-1">Error Message:</p>
          <pre className="whitespace-pre-wrap break-words">{error.message}</pre>

          {error.digest && (
            <>
              <p className="font-semibold text-gray-900 mt-3 mb-1">Error Digest:</p>
              <pre className="whitespace-pre-wrap break-words">{error.digest}</pre>
            </>
          )}

          {error.stack && (
            <>
              <p className="font-semibold text-gray-900 mt-3 mb-1">Stack Trace:</p>
              <pre className="text-gray-700 text-xs whitespace-pre-wrap break-words">
                {error.stack}
              </pre>
            </>
          )}
        </div>

        <div className="flex justify-center gap-3">
          <button
            onClick={() => reset()}
            className="px-5 py-2.5 bg-red-600 text-white rounded-lg shadow hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
          <button
            onClick={() => window.location.reload()}
            className="px-5 py-2.5 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Reload Page
          </button>
        </div>
      </div>

      <footer className="mt-8 text-gray-400 text-sm">
        <p>Error boundary by <span className="font-semibold text-gray-500">Next.js</span></p>
      </footer>
    </div>
  );
}
