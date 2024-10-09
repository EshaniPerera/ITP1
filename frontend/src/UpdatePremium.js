import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

function UpdatePremium() {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const {id} = useParams();
    const navigate = useNavigate();

    useEffect(() => {
      axios.get(`http://localhost:8800/premium/${id}`)
          .then(res => {
              setName(res.data.name);
              setEmail(res.data.email);
          })
          .catch(err => console.log(err));
  }, [id]);

    //passing data to the backend
    function handleSubmit(event) {
        event.preventDefault();
        axios.put(`http://localhost:8800/update/${id}`, { name, email })
          .then(res => {
            console.log(res);
            navigate('/premium'); // Navigate to another page after update
          })
          .catch(err => {
            console.error(err);
          });
      }
    
  return (
    <div className='d-flex vh-100 bg-primary justify-content-center align-items-center'>
        <div className='w-50 bg-white rounded p-3'>
        <form onSubmit={handleSubmit}>
                <h2>Update Premium Customer</h2>
                <div className='mb-2'>
                <label>Name</label>
                        <input
                            type="text"
                            placeholder='Enter Name'
                            className='form-control'
                            value={name}
                            onChange={e => setName(e.target.value)}
                    />
                </div>
                <div className='mb-2'>
                <label>Email</label>
                        <input
                            type="email"
                            placeholder='Enter Email'
                            className='form-control'
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                    />
                </div>
                <button className='btn btn-success'>Update</button>
                </form>
           
            
        </div>
    </div>
  )
}

export default UpdatePremium;