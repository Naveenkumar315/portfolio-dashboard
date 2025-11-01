
interface LoaderProps {
  message?: string;
  size?: number;
}

export default function Loader({ message = "Loading...", size = 40 }: LoaderProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 p-6">
      <svg
        className="animate-spin text-blue-500"
        width={size}
        height={size}
        viewBox="0 0 24 24"
      >
        <circle
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeOpacity="0.25"
          strokeWidth="4"
        />
        <path
          d="M22 12a10 10 0 00-10-10"
          stroke="currentColor"
          strokeWidth="4"
          strokeLinecap="round"
        />
      </svg>

      <p className="text-sm text-gray-500">{message}</p>
    </div>
  );
}
