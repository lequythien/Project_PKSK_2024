import React, { useContext, useState } from 'react'
import { AdminContext } from '../context/AdminContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { DoctorContext } from '../context/DoctorContext'
import { useNavigate } from 'react-router-dom'

const Login = () => {
    const [state, setState] = useState('Admin')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const { setAToKen, backendUrl } = useContext(AdminContext)
    const { setDToken } = useContext(DoctorContext)

    const navigate = useNavigate()

    const onSubmitHandler = async (event) => {
        event.preventDefault()

        try {
            const response = await axios.post(`${backendUrl}/login`, { email, password })

            if (response.data.user) {
                const { role, token } = response.data.user

                if (role === 'admin' && state === 'Admin') {
                    localStorage.setItem('aToken', token)
                    setAToKen(token)
                    toast.success("Admin logged in successfully!")
                    navigate('/admin-dashboard')
                } else if (role === 'doctor' && state === 'Doctor') {
                    localStorage.setItem('dToken', token)
                    setDToken(token)
                    toast.success("Doctor logged in successfully!")
                    navigate('/doctor-dashboard')
                } else {
                    toast.error("Unauthorized role for selected login type.")
                }
                window.location.reload() 
            } else {
                toast.error(response.data.message || "Login failed.")
            }

        } catch (error) {
            console.error("Login error:", error)
            toast.error("An error occurred during login. Please try again.")
        }
    }

    return (
        <form onSubmit={onSubmitHandler} className='min-h-[80vh] flex items-center'>
            <div className='flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-[#5E5E5E] text-sm shadow-lg'>
                <p className='text-2xl font-semibold m-auto'><span className='text-primary'> {state}</span> Login</p>
                <div className='w-full'>
                    <p>Email</p>
                    <input
                        onChange={(e) => setEmail(e.target.value)}
                        value={email}
                        className='border border-[#DADADA] rounded w-full p-2 mt-1'
                        type="email"
                        required
                    />
                </div>
                <div className='w-full'>
                    <p>Password</p>
                    <input
                        onChange={(e) => setPassword(e.target.value)}
                        value={password}
                        className='border border-[#DADADA] rounded w-full p-2 mt-1'
                        type="password"
                        required
                    />
                </div>
                <button className='bg-primary text-white w-full py-2 rounded-md text-base'>Login</button>
                {state === 'Admin'
                    ? <p>Doctor Login? <span className='text-primary underline cursor-pointer' onClick={() => setState('Doctor')}>Click here</span></p>
                    : <p>Admin Login? <span className='text-primary underline cursor-pointer' onClick={() => setState('Admin')}>Click here</span></p>
                }
            </div>
        </form>
    )
}

export default Login
