import React, { useEffect, useState } from "react";

function UserProfile() {
  const username = localStorage.getItem("username");
  const userDetails = JSON.parse(localStorage.getItem("userDetails"));
  const [badge, setBadge] = useState(null);

  useEffect(() => {
    if (userDetails && userDetails[0].registration_date) {
      const registrationDate = new Date(userDetails[0].registration_date); // Assuming registration_date is in 'YYYY-MM-DD' format
      const currentDate = new Date();

      // Calculate the difference in days between registration date and current date
      const timeDifference = currentDate - registrationDate;
      const daysDifference = Math.floor(timeDifference / (1000 * 3600 * 24));

      // Check if the user has completed 90 days since registration
      if (daysDifference >= 90) {
        setBadge("🎉 90 Days Badge"); // Set the badge when 90 days are completed
      }
    }
  }, [userDetails]);


  if (!userDetails) {
    return <div className="max-w-2xl mx-auto mt-10 p-8 bg-white shadow-md rounded-lg">No user details available.</div>;
  }

  return (
    <div className="max-w-2xl mx-auto mt-10 p-8 bg-white shadow-md rounded-lg">
      <h2 className="text-3xl font-bold text-center mb-6 text-orange-600">User Profile</h2>

      <div className="space-y-4">
        <div>
          <label className="block text-gray-600 text-sm font-bold mb-2">First Name</label>
          <input
            type="text"
            value={userDetails[0].first_name}
            readOnly
            className="w-full border border-gray-300 p-3 rounded-lg bg-gray-100 cursor-not-allowed"
          />
        </div>

        <div>
          <label className="block text-gray-600 text-sm font-bold mb-2">Last Name</label>
          <input
            type="text"
            value={userDetails[0].last_name}
            readOnly
            className="w-full border border-gray-300 p-3 rounded-lg bg-gray-100 cursor-not-allowed"
          />
        </div>

        <div>
          <label className="block text-gray-600 text-sm font-bold mb-2">Email</label>
          <input
            type="email"
            value={userDetails[0].email}
            readOnly
            className="w-full border border-gray-300 p-3 rounded-lg bg-gray-100 cursor-not-allowed"
          />
        </div>

        <div>
          <label className="block text-gray-600 text-sm font-bold mb-2">Phone Number</label>
          <input
            type="tel"
            value={userDetails[0].phone_number}
            readOnly
            className="w-full border border-gray-300 p-3 rounded-lg bg-gray-100 cursor-not-allowed"
          />
        </div>

        <div>
          <label className="block text-gray-600 text-sm font-bold mb-2">Username</label>
          <input
            type="text"
            value={username}
            readOnly
            className="w-full border border-gray-300 p-3 rounded-lg bg-gray-100 cursor-not-allowed"
          />
        </div>

        <div>
          <label className="block text-gray-600 text-sm font-bold mb-2">City</label>
          <input
            type="text"
            value={userDetails[0].city}
            readOnly
            className="w-full border border-gray-300 p-3 rounded-lg bg-gray-100 cursor-not-allowed"
          />
        </div>

        <div>
          <label className="block text-gray-600 text-sm font-bold mb-2">Premium Customer</label>
          <input
            type="text"
            value={userDetails[0].is_premium_customer ? "Yes" : "No"}
            readOnly
            className="w-full border border-gray-300 p-3 rounded-lg bg-gray-100 cursor-not-allowed"
          />
        </div>

        {/* Display the badge if the user has completed 90 days */}
        {badge && (
          <div className="bg-green-200 text-green-800 p-2 rounded-lg mt-4 text-center font-bold">
            {badge}
          </div>
        )}
        

      </div>
    </div>
  );
}

export default UserProfile;
