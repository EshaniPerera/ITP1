import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './premium.css';
import { saveAs } from 'file-saver';

function Premium() {
  const [premium, setPremium] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const generateReport = () => {
    const headers = 'Username,Name,Phone,Email\n';
    const csvContent = premium.map(data =>
      `${data.username},${data.first_name} ${data.last_name},${data.phone_number},${data.email}`
    ).join('\n');

    const blob = new Blob([headers + csvContent], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'premium_customers_report.csv');
  };

  useEffect(() => {
    getPremiumCustomers();
  }, []);

  const getPremiumCustomers = async () => {
    try {
      console.log('Fetching premium customers...');
      const response = await axios.get('http://localhost:8800/premium');
      console.log('Premium customers:', response.data);
      setPremium(response.data);
    } catch (error) {
      console.error('Error:', error.response ? error.response.data : error.message);
    }
  };

  const handleDelete = async (username) => {
    try {
      await axios.delete(`http://localhost:8800/premium/${username}`);
      getPremiumCustomers(); // Refresh the list after deletion
    } catch (err) {
      console.error('Error deleting customer:', err);
    }
  };

  const filteredPremium = premium.filter(data => {
    if (!data) {
      console.warn('Encountered undefined data in premium list');
      return false;
    }
    const searchTermLower = searchTerm.toLowerCase();
    return (
      (data.username && data.username.toLowerCase().includes(searchTermLower)) ||
      (data.first_name && data.first_name.toLowerCase().includes(searchTermLower)) ||
      (data.last_name && data.last_name.toLowerCase().includes(searchTermLower)) ||
      (data.email && data.email.toLowerCase().includes(searchTermLower))
    );
  });

  const totalPremiumCustomers = premium.length;

  return (
    <div className='d-flex vh-100 bg-primary justify-content-center align-items-center'>
      <div className='w-75 bg-white rounded p-3'>
        <input
          type="text"
          placeholder="Search..."
          className="form-control mt-3"
          style={{ width: '300px', height: '40px' }}
          onChange={e => setSearchTerm(e.target.value)}
        />

        <h4 className="mt-3">Total Premium Customers: {totalPremiumCustomers}</h4>

        <button className="btn btn-info mt-3" onClick={generateReport}>Download Report</button>

        <table className='table'>
          <thead>
            <tr>
              <th>Username</th>
              <th>Name</th>
              <th>Phone</th>
              <th>Email</th>
              {/* <th>Badge Status</th> */}
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredPremium.map((data) => (
              <tr key={data.username}>
                <td>{data.username}</td>
                <td>{`${data.first_name} ${data.last_name}`}</td>
                <td>{data.phone_number}</td>
                <td>{data.email}</td>
                {/* <td>{data.badge_status || 'N/A'}</td> */}
                <td>
                  <Link to={`/update/${data.username}`} className='btn btn-primary'>Update</Link>
                  <button className='btn btn-danger ms-2' onClick={() => handleDelete(data.username)}>Delete</button>
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