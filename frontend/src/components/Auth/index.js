import React, { useState } from 'react';
import GoogleIcon from '@mui/icons-material/Google';
import './index.css';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth, provider } from '../../firebase';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Index() {
    const navigate = useNavigate();
    const [register, setRegister] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const createUser = async (user) => {
        try {
            await axios.post('/api/users/create', {
                uid: user.uid,
                bio: "No current bio",
            });
        } catch (error) {
            console.error("Error creating user:", error);
        }
    };

    const handleSignInGoogle = () => {
        signInWithPopup(auth, provider).then((res) => {
            const user = res.user;
            createUser(user);
            navigate("/");
        }).catch((error) => {
            setError(error.message);
            setLoading(false);
        });
    };

    const handleRegister = (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        if (email === "" || password === "" || username === "") {
            setError('Reduired field/s are missing');
            setLoading(false);
        } else {
            createUserWithEmailAndPassword(auth, email, password).then((res) => {
                console.log(res);
                setLoading(false);
                navigate("/");
            }).catch((error) => {
                console.log(error.code);
                setError(error.message);
                setLoading(false);
            })
        }
    }

    const handleSignIn = (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        if (email === "" || password === "") {
            setError('Reduired field/s are missing');
            setLoading(false);
        } else {
            signInWithEmailAndPassword(auth, email, password).then((res) => {
                console.log(res);
                setLoading(false);
                navigate("/");
            }).catch((error) => {
                console.log(error.code);
                setError(error.message);
                setLoading(false);
            })
        }
    }

    return (
        <div className='auth'>
            <div className='auth-container'>
                <img src="/uploads/Zcoder-logo.png" alt="Project Logo" className='logo' />
                <p>One Stop Destination for All Your Coding Needs</p>
                <div className='sign-options'>
                    <div className='single-option' onClick={handleSignInGoogle}>
                        <GoogleIcon />
                        <p>Login with Google</p>
                    </div>
                    <div className='auth-login'>
                        <div className='auth-login-container'>
                            {register ? (
                                <>
                                    <div className='input-field'>
                                        <p>Username</p>
                                        <input value={username} onChange={(e) => setUsername(e.target.value)} type='text' />
                                    </div>
                                    <div className='input-field'>
                                        <p>Email</p>
                                        <input value={email} onChange={(e) => setEmail(e.target.value)} type='email' />
                                    </div>
                                    <div className='input-field'>
                                        <p>Password</p>
                                        <input value={password} onChange={(e) => setPassword(e.target.value)} type='password' />
                                    </div>
                                    <button className='ask-button' onClick={handleRegister} disabled={loading} style={{ marginTop: "10px" }}>
                                        {loading ? 'Saving Info...' : 'Register'}
                                    </button>
                                </>
                            ) : (
                                <>
                                    <div className='input-field'>
                                        <p>Email</p>
                                        <input value={email} onChange={(e) => setEmail(e.target.value)} type='email' />
                                    </div>
                                    <div className='input-field'>
                                        <p>Password</p>
                                        <input value={password} onChange={(e) => setPassword(e.target.value)} type='password' />
                                    </div>
                                    <button className='ask-button' onClick={handleSignIn} disabled={loading} style={{ marginTop: "10px" }}>
                                        {loading ? 'Signing In...' : 'Login'}
                                    </button>
                                </>
                            )}
                            <p onClick={() => setRegister(!register)} className='toggle-register'>
                                {register ? "Login?" : "Register?"}
                            </p>
                        </div>
                    </div>
                </div>
                {error && <p style={{ color: "red", fontSize: "15px" }}>{error}</p>}
            </div>
        </div>
    );
}

export default Index;
