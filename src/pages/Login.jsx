import React, { useState } from 'react'
import Add from '../img/addAvatar.png'
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from '../firebase'
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {

    const [err, setErr] = useState(false);
    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault()
        const email = e.target[0].value;
        const password = e.target[1].value;
        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigate('/')

        } catch (err) {
            setErr(true)
        }

    }

    return (
        <div className='formContainer'>
            <div className='formWrapper'>
                <span className='logo'>Chat Away</span>
                <span className='title'>Login</span>
                <form onSubmit={handleSubmit}>
                    <input type="email" placeholder='email' />
                    <input type="password" placeholder='senha' />

                    <button>Logar</button>
                </form>
                <p>Você não tem conta ainda? <Link to="/register" >Registre - se</Link> </p>
            </div>
        </div>
    )
}

export default Login