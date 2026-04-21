import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
      <h2 className="text-2xl font-bold mb-2">Page not found</h2>
      <p className="mb-6 opacity-75">The page you&apos;re looking for doesn&apos;t exist or has moved.</p>
      <Link
        href="/"
        className="px-6 py-2 rounded-lg bg-black text-white hover:opacity-90 transition-opacity"
      >
        Back home
      </Link>
    </div>
  );
}
