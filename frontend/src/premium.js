import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './premium.css'; 
import { saveAs } from 'file-saver';

function Premium() {
  const [premium, setPremium] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const generateReport = () => {
    const headers = 'Id,Name,Phone,Email\n';
    const csvContent = premium.map(data =>
      `${data.id},${data.name},${data.phone_number},${data.email}`
    ).join('\n');

    const blob = new Blob([headers + csvContent], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'premium_customers_report.csv');
  };

  useEffect(() => {
    axios.get('http://localhost:8800/')
      .then(res => setPremium(res.data))
      .catch(err => console.log(err));
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8800/premium/${id}`);
      window.location.reload();
    } catch (err) {
      console.log(err);
    }
  };

  const filteredPremium = premium.filter(data =>
    data.id.toString().includes(searchTerm)
  );

  // Calculate the total number of premium customers
  const totalPremiumCustomers = premium.length;



  return (
    
    <div className='d-flex vh-100 bg-primary justify-content-center align-items-center'>
      <div className='w-75 bg-white rounded p-3'>

    
        {/* Correct Link usage */}
        <Link to="/create" className='btn btn-success'>Add+</Link>

        <input 
          type="text" 
          placeholder="Search..." 
          className="form-control mt-3"
          style={{ width: '300px', height: '40px' }}
          onChange={e => setSearchTerm(e.target.value)}
        />

        {/* Display the total number of premium customers */}
        <h4 className="mt-3">Total Premium Customers: {totalPremiumCustomers}</h4>

        {/* Button to generate report */}
        <button className="btn btn-info mt-3" onClick={generateReport}>Download Report</button>

        <table className='table'>
          <thead>
            <tr>
              <th>Id</th>
              <th>Name</th>
              <th>Phone</th>
              <th>Email</th>
              <th>Action</th>
              
            </tr>
          </thead>
          <tbody>
            {filteredPremium.map((data, i) => (
              <tr key={i}>
                <td>{data.id}</td>
                <td>{data.name}</td>
                <td>{data.phone_number}</td> 
                <td>{data.email}</td> 
                <td>
                  
                <Link to={`/update/${data.id}`} className='btn btn-primary'>Update</Link>
                <button className='btn btn-danger ms-2' onClick={() => handleDelete(data.id)}>Delete</button>
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
