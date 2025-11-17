export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-12">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-5">
          <p className="text-gray-500 text-sm sm:text-base">About us</p>
          <p className="text-gray-500 text-sm sm:text-base">Contact</p>
          <p className="text-gray-500 text-sm sm:text-base">Privacy Policy</p>
          <p className="text-gray-500 text-sm sm:text-base">Terms of Service</p>
        </div>

        <div className="border-t border-gray-200 mt-6 sm:mt-8 pt-6 sm:pt-8 text-center text-gray-500 text-sm sm:text-base">
          <p>&copy; 2024 News Today. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
