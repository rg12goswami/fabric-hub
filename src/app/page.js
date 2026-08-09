import Logo from "@/components/common/Logo";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full text-center">
        <div className="mx-auto mb-6 flex justify-center"><Logo size={64} /></div>
        <h1 className="text-3xl font-bold text-gray-800 mb-3">FabricHub</h1>
        <p className="text-gray-500 mb-8">
          The marketplace connecting fabric buyers and suppliers worldwide.
        </p>

        <div className="flex flex-col gap-3">
          <a href="/register" className="bg-teal-500 hover:bg-teal-600 text-white py-3 rounded-xl font-medium transition">
            Get Started
          </a>
          <a href="/login" className="border border-gray-200 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-50 transition">
            Login
          </a>
        </div>
      </div>
    </div>
  );
}
