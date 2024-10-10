import React from "react";
import Navbar from "../../Components/Navbar";
import Hero from "../../Components/Hero";
import HeadlineCards from "../../Components/HeadlineCards";
import Category from "../../Components/Category";

function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-12">
            <HeadlineCards />
          </div>
          <div className="py-12">
            <Category />
          </div>
        </div>
      </main>
      <footer className="bg-gray-800 text-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>&copy; 2024 Best Eats. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default HomePage;