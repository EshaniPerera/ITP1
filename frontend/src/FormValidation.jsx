import React, { useState } from 'react';
import './App.css'

const FormValidation = () => {
const [formData, setFormData] = useState({
    username: '',
    email:'',
    password: '',
    confirmPassword: ''
})

const [errors, sertErrors] = useState ({})

const handleChange = (e) => {
    const { name, value } = e.target; 
    setFormData({
        ...formData, // 

        [name]: value
    });
};

const handleSubmit = (e) => {
   e.preventDefault()
   const validationErrors = {}
   if(!FormData.username.trim()){
    validationErrors.username = "username is required"
   }

   if(!FormData.email.trim()){
    validationErrors.email = "email is required"
   } else if (!/\S+@\S+\.\S+/.test(formData.email)){
    validationErrors.email = "email is not valid"
   }

   if(!FormData.password.trim()){
    validationErrors.password = "password is required"
   } else if (formData.password.length < 6){
    validationErrors.password = "password should be at least 6 char"
   }

   if(!FormData.confirmPassword !== formDatapassword){
    validationErrors.confirmPassword = "password not matched"
   } 

   sertErrors(validationErrors)

   if(Object.keys(validationErrors).length == 0) {
    alert("Form submitted successfully")
   }

}
return (
    <form onSubmit={handleSubmit}> 
        <div>
            <label>UserName:</label>
            <input 
            type="text"
            name="username"
            placeholder='username'
            autoComplete='off'
            onChange={handleChange}
            />
            {errors.username && <span>{errors.username}</span>}
        </div>
        <div>
            <label>Email:</label>
            <input 
            type="email"
            name="email"
            placeholder='example@gmail.com'
            autoComplete='off'
            onChange={handleChange}
            />
            {errors.email && <span>{errors.email}</span>}
        </div>
        <div>
            <label>Password:</label>
            <input 
             type="password"
             name="password"
             placeholder='******'
             onChange={handleChange}
             />
              {errors.password && <span>{errors.password}</span>}
        </div>
        
        <div>
            <label>Confirm password:</label>
            <input 
             type="password"
             name="confirmPassword"
             placeholder='******'
             onChange={handleChange}
             />
              {errors.confirmPassword && <span>{errors.confirmPassword}</span>}
        </div>

        <button type="submit">Submit</button>
    </form>
)
};

export default FormValidation;