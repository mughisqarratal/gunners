"use client";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-6 mt-auto">
      <div className="container mx-auto text-center px-4">
        <p className="text-sm sm:text-base">
          &copy; {new Date().getFullYear()} Guns N' Roses ID
        </p>
      </div>
    </footer>
  );
}
