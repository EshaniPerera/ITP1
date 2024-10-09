import React from "react";
import Navbar from "../../Components/Navbar";
import Hero from "../../Components/Hero";
import HeadlineCards from "../../Components/HeadlineCards";

import Category from "../../Components/Category";

function HomePage() {
  return (
    <div >
      <Navbar/>
      <Hero/>
      <HeadlineCards/>
      
      <Category/>
    </div>
  );
}

export default HomePage;
