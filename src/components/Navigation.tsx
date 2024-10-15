import Link from 'next/link';

const Navigation = () => {
  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">
          Travel App
        </Link>
        <div className="space-x-4">
          <Link href="/" className="hover:text-gray-300">
            Home
          </Link>
          <Link href="/trips" className="hover:text-gray-300">
            Trips
          </Link>
          <Link href="/currency" className="hover:text-gray-300">
            Currency
          </Link>
          <Link href="/weather" className="hover:text-gray-300">
            Weather
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
