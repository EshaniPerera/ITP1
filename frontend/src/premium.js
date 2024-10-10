import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./premium.css";
import { saveAs } from "file-saver";

function Premium() {
  const [premium, setPremium] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const generateReport = () => {
    const headers = "Username,Full Name,Phone,Email\n";
    const csvContent = premium
      .map(
        (data) =>
          `${data.username},${data.first_name} ${data.last_name},${data.phone_number},${data.email}`
      )
      .join("\n");

    const blob = new Blob([headers + csvContent], {
      type: "text/csv;charset=utf-8;",
    });
    saveAs(blob, "premium_customers_report.csv");
  };

  useEffect(() => {
    getPremiumCustomers();
  }, []);

  const handleDelete = async (username) => {
    try {
      await axios.delete(`http://localhost:8800/premium/${username}`);
      getPremiumCustomers(); // Refresh the list after deletion
    } catch (err) {
      console.error("Error deleting customer:", err);
    }
  };

  const getPremiumCustomers = async () => {
    try {
      const response = await axios.get("http://localhost:8800/premiumbatch");
      setPremium(response.data);
    } catch (error) {
      console.error(
        "Error:",
        error.response ? error.response.data : error.message
      );
    }
  };

  const filteredPremium = premium.filter((data) => {
    const searchTermLower = searchTerm.toLowerCase();
    return (
      (data.username &&
        data.username.toLowerCase().includes(searchTermLower)) ||
      (data.first_name &&
        data.first_name.toLowerCase().includes(searchTermLower)) ||
      (data.last_name &&
        data.last_name.toLowerCase().includes(searchTermLower)) ||
      (data.email && data.email.toLowerCase().includes(searchTermLower))
    );
  });

  const totalPremiumCustomers = premium.length;

  return (
    <div className="d-flex vh-100 bg-primary justify-content-center align-items-center">
      <div className="w-75 bg-white rounded p-3">
        <input
          type="text"
          placeholder="Search..."
          className="form-control mt-3"
          style={{ width: "300px", height: "40px" }}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <h4 className="mt-3">
          Total Premium Customers: {filteredPremium.length}
        </h4>


        <div>
          <button className="btn btn-primary" onClick={generateReport}>Genearate Report</button>
        </div>

        <table className="table">
          <thead>
            <tr>
              <th>Username</th>
              <th>First Name</th>
              <th>Phone</th>
              <th>Email</th>
              <th>Badge Status</th> {/* New column */}
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredPremium.map((data) => (
              <tr key={data.username}>
                <td>{data.username}</td>
                <td>{`${data.first_name}`}</td>
                <td>{data.phone_number}</td>
                <td>{data.email}</td>
                <td>
                  {data.badge_status === "New" && (
                    <span className="badge badge-new">New</span>
                  )}
                  {data.badge_status === "30 Days Badge" && (
                    <span className="badge badge-30-days">30 Days</span>
                  )}
                  {data.badge_status === "90 Days Badge" && (
                    <span className="badge badge-90-days">90 Days</span>
                  )}
                </td>

                <td>
                  <Link
                    to={`/update/${data.username}`}
                    className="btn btn-primary"
                  >
                    Update
                  </Link>
                  <button
                    className="btn btn-danger ms-2"
                    onClick={() => handleDelete(data.username)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Premium;
