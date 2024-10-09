import React, { useEffect, useState } from "react";
import { Admincategories } from "../../../Data/data.js";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import CustomAlert from "../../../Components/CommonAlert/CommonAlert";

function AdminLogin() {
  const navigate = useNavigate();

  const [showAlert, setShowAlert] = useState(false);
  const [alertDescription, setAlertDescription] = useState("");
  const [alertTopic, setAlertTopic] = useState("");
  const [buttonCount, setButtonCount] = useState(1);

  const username = localStorage.getItem("username");

  const handleButtonPress = (item) => {
    console.log("Item ID:", item.id);
    console.log("Item Code:", item.code);

    // Check if the username starts with "AUM"
    const startsWithAUM = username.startsWith("AUM");

    if (!startsWithAUM) {
      // If username doesn't start with AUM, show a restricted access alert
      setAlertTopic("Access Denied");
      setAlertDescription("You don't have permission to access this page.\nAsk Admin for Permission.");
      setShowAlert(true);
      return;  // Prevent further execution
    }

    // Allow navigation only if username starts with "AUM" and item matches
    if (item.id === 1) {
      
    } else if (item.id === 2) {
      // Navigate to the correct page for item id 2
    } else if (item.id === 3) {
      // Navigate to the correct page for item id 3
    } else if (item.id === 4) {
      // Navigate to the user management page
      
    } else if (item.id === 7) {
      navigate("/premium");
    } else {
      // Handle any other cases or restricted access
      setAlertTopic("Error");
      setAlertDescription("This is Restricted\nAsk Admin for Permission");
      setShowAlert(true);
      setButtonCount(1);
    }
  };

  const handlePositiveAction = () => {
    setShowAlert(false);
  };

  const handleNegativeAction = () => {
    setShowAlert(false);
  };

  return (
    <div className="max-w-[1640px] m-auto px-4 py-12">
      <h1 className="text-orange-600 font-bold text-4xl text-center mb-8">
        Welcome {username} to Admin Site
      </h1>
      {/* Alert */}
      {showAlert && (
        <CustomAlert
          alertvisible={showAlert}
          onPositiveAction={handlePositiveAction}
          onNegativeAction={handleNegativeAction}
          alertDescription={alertDescription}
          alertTitle={alertTopic}
          buttonCount={buttonCount}
        />
      )}
      {/* Category */}
      <div className="flex flex-col gap-6 py-6">
        {Admincategories.map((item, index) => (
          <button
            key={index}  // Make sure key is attached to the button
            style={{ backgroundColor: "white", borderColor: "white" }}
            onClick={() => handleButtonPress(item)}
          >
            <div className="bg-white p-6 flex items-center shadow-xl hover:shadow-2xl transition-shadow duration-300 rounded-lg border border-gray-200">
              <img
                src={item.image}
                alt={item.name}
                className="w-24 h-24 object-cover rounded-full border border-gray-300 mr-6"
              />
              <h2 className="font-bold text-xl text-gray-800 flex-grow">
                {item.name}
              </h2>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

export default AdminLogin;
