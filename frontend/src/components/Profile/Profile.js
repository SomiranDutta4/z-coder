import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Avatar } from '@mui/material';
import { selectUser } from '../../features/userSlice';
import axios from 'axios';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase';
import { useNavigate } from 'react-router-dom';

function Profile() {
  const user = useSelector(selectUser);
  const [editMode, setEditMode] = useState(false);
  const [bio, setBio] = useState('');
  const [newBio, setNewBio] = useState('');

  const navigate=useNavigate();
  const viewQuestions=()=>{
    navigate('/queries/user')
  }

  useEffect(() => {
    const getBio = async () => {
      try {
        const res = await axios.get(process.env.REACT_APP_backendUrl + '/api/users/bio', {
          params: { uid: user.uid }
        });
        setBio(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    if (user?.uid) getBio();
  }, [user?.uid]);

  const handleSignOut = () => {
    signOut(auth).catch(err => console.error("Error signing out:", err));
  };

  const saveBio = async () => {
    try {
      await axios.put(process.env.REACT_APP_backendUrl + '/api/users/update', {
        uid: user.uid,
        bio: newBio,
      });
      setBio(newBio);
      setEditMode(false);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[640px] px-4 py-8">
      <div className="w-full max-w-lg bg-[#1e293b] text-gray-200 p-8 rounded-md shadow-lg space-y-8">

        {/* Profile Info */}
        <div className="text-center">
          <Avatar
            src={user?.photo}
            alt={user?.displayName}
            className="!w-[100px] !h-[100px] mx-auto mb-4 border-2 border-blue-600"
          />
          <h1 className="text-2xl font-semibold mb-1 text-slate-100">{user?.displayName}</h1>
          <h3 className="text-slate-400 mb-6">{user?.email}</h3>

          {editMode ? (
            <>
              <textarea
                rows={4}
                value={newBio}
                onChange={(e) => setNewBio(e.target.value)}
                placeholder="Add your bio here..."
                className="w-full p-3 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none bg-[#273549] text-gray-200"
              />
              <div className="mt-4 flex justify-center gap-4">
                <button
                  onClick={saveBio}
                  className="bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 transition"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditMode(false)}
                  className="bg-slate-700 text-slate-300 px-5 py-2 rounded-md hover:bg-slate-600 transition"
                >
                  Cancel
                </button>
              </div>
            </>
          ) : (
            <>
              <p className="mb-6 whitespace-pre-wrap min-h-[80px] text-slate-300">{bio || "No bio added yet."}</p>
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => {
                    setNewBio(bio);
                    setEditMode(true);
                  }}
                  className="bg-slate-700 text-slate-300 px-5 py-2 rounded-md hover:bg-slate-600 transition"
                >
                  Edit Profile
                </button>
                <button
                  onClick={handleSignOut}
                  className="bg-slate-700 text-slate-300 px-5 py-2 rounded-md hover:bg-slate-600 transition"
                >
                  Sign Out
                </button>
              </div>
            </>
          )}
        </div>

        {/* Questions Asked Section */}
        <div>
          <h2 className="text-lg font-semibold mb-3 border-b border-slate-600 pb-2 text-slate-100">
            Questions Asked
          </h2>
          <p className="text-slate-400 mb-4">
            View all the questions you have asked.
          </p>
          <button
          onClick={viewQuestions}
            type="button"
            className="bg-slate-700 text-slate-300 px-5 py-2 rounded-md hover:bg-slate-600 transition"
          >
            View Questions
          </button>
        </div>

      </div>
    </div>
  );
}

export default Profile;
