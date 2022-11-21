import React, { useState } from 'react'
import Add from '../img/addAvatar.png'
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, storage } from '../firebase';
import { db } from '../firebase';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";
import { Link, Navigate, useNavigate } from 'react-router-dom';

const Register = () => {
    const navigate = useNavigate();
    const [err, setErr] = useState(false);
    const handleSubmit = async (e) => {
        e.preventDefault()
        const displayName = e.target[0].value;
        const email = e.target[1].value;
        const password = e.target[2].value;
        const file = e.target[3].files[0];
        try {
            const res = await createUserWithEmailAndPassword(auth, email, password);

            const storageRef = ref(storage, displayName);

            const uploadTask = uploadBytesResumable(storageRef, file);

            uploadTask.on(


                (error) => {
                    setErr(true)
                },
                () => {

                    getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
                        await updateProfile(res.user, {
                            displayName,
                            photoURL: downloadURL,
                        });
                        await setDoc(doc(db, "users", res.user.uid), {
                            uid: res.user.uid,
                            displayName,
                            email,
                            photoURL: downloadURL,
                        });

                        await setDoc(doc(db, "userChats", res.user.uid), {});
                        navigate('/')
                        console.log('Foi')
                    });

                }
            );

        } catch (err) {
            setErr(true)
        }

    }

    return (
        <div className='formContainer'>
            <div className='formWrapper'>
                <span className='logo'>Chat Away</span>
                <span className='title'>Registro</span>
                <form onSubmit={handleSubmit}>
                    <input type="text" placeholder='nome' />
                    <input type="email" placeholder='email' />
                    <input type="password" placeholder='senha' />
                    <input style={{ display: 'none' }} type="file" name="" id="file" />
                    <label htmlFor="file">
                        <img src={Add} alt="" />
                        <span> Adicionar um avatar </span>
                    </label>
                    <button>Registrar</button>
                </form>
                <p>Você não tem conta ainda? <Link to={'/login'}>Logar</Link></p>
            </div>
        </div>
    )
}

export default Register