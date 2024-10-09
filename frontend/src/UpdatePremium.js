import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams, useLocation } from 'react-router-dom';

function UpdatePremium() {
    const [formData, setFormData] = useState({
        username: '',
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        city: '',
        address: '',
        password: '',
        badgeStatus: ''
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [cities] = useState(['Colombo', 'Gampaha', 'Kalutara']); // Add more cities as needed
    
    const params = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        console.log('Current URL:', location.pathname);
        console.log('Params:', params);
        const usernameFromParams = params.username;
        console.log('Username from params:', usernameFromParams);

        if (usernameFromParams) {
            fetchCustomerData(usernameFromParams);
        } else {
            setError('No username provided in URL');
            setLoading(false);
        }
    }, [params, location]);

    const fetchCustomerData = async (username) => {
        try {
            console.log('Fetching data for username:', username);
            const response = await axios.get(`http://localhost:8800/premium/${username}`);
            const customerData = response.data;
            console.log('Fetched customer data:', customerData);
            setFormData({
                username: customerData.username,
                firstName: customerData.first_name,
                lastName: customerData.last_name,
                email: customerData.email,
                phoneNumber: customerData.phone_number,
                city: customerData.city,
                address: customerData.address,
                password: '',
                // badgeStatus: customerData.badge_status || 'N/A'
            });
            setLoading(false);
        } catch (error) {
            console.error('Error fetching customer data:', error);
            setError('Error fetching customer data');
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.username) {
            console.error('Username is undefined, cannot submit update');
            return;
        }

        try {
            const response = await axios.put(`http://localhost:8800/premium/update/${formData.username}`, {
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                phoneNumber: formData.phoneNumber,
                city: formData.city,
                address: formData.address,
                password: formData.password || undefined
            });
            console.log('Update successful:', response.data);
            navigate('/premium');
        } catch (error) {
            console.error('Error updating customer:', error);
            setError('Error updating customer');
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className='d-flex vh-100 bg-primary justify-content-center align-items-center'>
            <div className='w-50 bg-white rounded p-3'>
                <h2>Update Premium Customer: {formData.username}</h2>
                <form onSubmit={handleSubmit}>
                    <div className='mb-2'>
                        <label htmlFor="firstName">First Name</label>
                        <input
                            type="text"
                            className="form-control"
                            id="firstName"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className='mb-2'>
                        <label htmlFor="lastName">Last Name</label>
                        <input
                            type="text"
                            className="form-control"
                            id="lastName"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className='mb-2'>
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            className="form-control"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className='mb-2'>
                        <label htmlFor="phoneNumber">Phone Number</label>
                        <input
                            type="tel"
                            className="form-control"
                            id="phoneNumber"
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className='mb-2'>
                        <label htmlFor="city">City</label>
                        <select
                            className="form-control"
                            id="city"
                            name="city"
                            value={formData.city}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select a city</option>
                            {cities.map((city, index) => (
                                <option key={index} value={city}>{city}</option>
                            ))}
                        </select>
                    </div>
                    <div className='mb-2'>
                        <label htmlFor="address">Address</label>
                        <input
                            type="text"
                            className="form-control"
                            id="address"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className='mb-2'>
                        <label htmlFor="password">New Password (leave blank to keep current)</label>
                        <input
                            type="password"
                            className="form-control"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                        />
                    </div>
                    {/* <div className='mb-2'>
                        <label htmlFor="badgeStatus">Badge Status</label>
                        <input
                            type="text"
                            className="form-control"
                            id="badgeStatus"
                            value={formData.badgeStatus}
                            readOnly
                        />
                    </div> */}
                    <button type="submit" className="btn btn-primary">Update Customer</button>
                </form>
            </div>
        </div>
    );
}

export default UpdatePremium;