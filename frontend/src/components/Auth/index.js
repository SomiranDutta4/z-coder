import React, { useState } from 'react';
import GoogleIcon from '@mui/icons-material/Google';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
} from 'firebase/auth';
import { auth, provider } from '../../firebase';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Index() {
  const navigate = useNavigate();
  const [register, setRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const createUser = async (user) => {
    try {
      await axios.post(process.env.REACT_APP_backendUrl + '/api/users/create', {
        uid: user.uid,
        bio: 'No current bio',
      });
    } catch (error) {
      console.error('Error creating user:', error);
    }
  };

  const handleSignInGoogle = () => {
    setLoading(true);
    signInWithPopup(auth, provider)
      .then((res) => {
        const user = res.user;
        createUser(user);
        navigate('/');
      })
      .catch((error) => {
        setError(error.message);
      })
      .finally(() => setLoading(false));
  };

  const handleRegister = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    if (!email || !password || !username) {
      setError('Required field/s are missing');
      setLoading(false);
      return;
    }
    createUserWithEmailAndPassword(auth, email, password)
      .then(() => {
        navigate('/');
      })
      .catch((error) => {
        setError(error.message);
      })
      .finally(() => setLoading(false));
  };

  const handleSignIn = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    if (!email || !password) {
      setError('Required field/s are missing');
      setLoading(false);
      return;
    }
    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        navigate('/');
      })
      .catch((error) => {
        setError(error.message);
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="min-h-full flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black text-white px-4">
      <div className="w-full max-w-md bg-[#121212] rounded-2xl shadow-2xl p-8 animate-fadeIn">
        <div className="flex flex-col items-center mb-6">
          <img src="/uploads/z-logo.png" alt="Project Logo" className="w-32 h-auto mb-4" />
          <p className="text-center text-lg text-gray-300 font-light">
            One Stop Destination for All Your Coding Needs
          </p>
        </div>

        <button
          onClick={handleSignInGoogle}
          disabled={loading}
          className="flex items-center justify-center w-full bg-[#2d2d2d] hover:bg-white hover:text-black border border-gray-700 text-white py-2 rounded-lg mb-6 transition"
        >
          <GoogleIcon />
          <span className="ml-3">{loading ? 'Loading...' : 'Continue with Google'}</span>
        </button>

        <div className="bg-gray-700 rounded-xl px-6 py-5">
          {register && (
            <div className="mb-4">
              <label className="block text-sm mb-1">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full p-2 rounded bg-gray-800 border border-blue-500 focus:ring-2 focus:ring-blue-400 outline-none"
              />
            </div>
          )}

          <div className="mb-4">
            <label className="block text-sm mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 rounded bg-gray-800 border border-blue-500 focus:ring-2 focus:ring-blue-400 outline-none"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 rounded bg-gray-800 border border-blue-500 focus:ring-2 focus:ring-blue-400 outline-none"
            />
          </div>

          <button
            onClick={register ? handleRegister : handleSignIn}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded mt-2 transition"
          >
            {loading ? (register ? 'Registering...' : 'Signing In...') : register ? 'Register' : 'Login'}
          </button>

          <p
            onClick={() => setRegister(!register)}
            className="mt-4 text-sm text-blue-400 hover:underline text-center cursor-pointer"
          >
            {register ? 'Already have an account? Login' : "Don't have an account? Register"}
          </p>
        </div>

        {error && (
          <div className="mt-4 text-center text-sm text-red-400 font-medium">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}

export default Index;
