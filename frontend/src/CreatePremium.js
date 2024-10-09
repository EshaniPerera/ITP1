import React, { useState } from 'react'
import axios from 'axios';

function CreatePremium() {
    const [name, setName] = useState('')
    const [address, setAddress] = useState('')
    const [phone_number, setPhoneNumber] = useState('')
    const [email, setEmail] = useState('')
   

    //passing data to the backend
    function handleSubmit(event) {
      event.preventDefault();
      axios.post('http://localhost:8800/create', { name, address, phone_number, email })
        .then(res => {
          console.log(res);
          alert('Premium customer created successfully');
        })
        .catch(err => {
          console.error(err);
          alert('An error occurred while creating the customer.');
        });
  }
  
  return (
    <div className='d-flex vh-100 bg-primary justify-content-center align-items-center'>
        <div className='w-50 bg-white rounded p-3'>
        <form onSubmit={handleSubmit}>
            
                <h2>Add Premium Customer</h2>
                <div className='mb-2'>
                    <label htmlFor="">Name</label>
                    <input type="text" placeholder='Enter Name' className='form-control'
                    onChange={e => setName(e.target.value)}
                    />
                </div>
               < div className='mb-2'>
                        <label htmlFor="">Address</label>
                        <input type="text" placeholder='Enter Address' className='form-control'
                        onChange={e => setAddress(e.target.value)}
                        />
                    </div>
                    
                    <div className='mb-2'>
                        <label htmlFor="">Phone Number</label>
                        <input type="text" placeholder='Enter Phone Number' className='form-control'
                        onChange={e => setPhoneNumber(e.target.value)}
                        />
                    </div>

                <div className='mb-2'>
                    <label htmlFor="">Email</label>
                    <input type="email" placeholder='Enter Email' className='form-control'
                    onChange={e => setEmail(e.target.value)} 
                    />
                </div>
                <button className='btn btn-success'>Submit</button>
                
            </form>
            
        </div>
    </div>
  )
}

export default CreatePremium;