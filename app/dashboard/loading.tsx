import { Loader2 } from 'lucide-react';

export default function DashboardLoading() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center p-8">
      <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
      <p className="mt-4 text-sm font-medium text-gray-500">
        Loading contents...
      </p>
    </div>
  );
}