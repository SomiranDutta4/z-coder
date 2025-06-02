import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Avatar } from '@mui/material';
import { selectUser } from '../../features/userSlice';
import './Profile.css';
import axios from 'axios';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase';

function Profile() {
    const user = useSelector(selectUser);
    const [editMode, setEditMode] = useState(false);
    const [bio, setBio] = useState("");
    const [newBio, setNewBio] = useState("");

    useEffect(() => {
        const getBio = async () => {
            try {
                const retrieveBio = await axios.get('/api/users/bio', {
                    params: { uid: user.uid }
                });
                setBio(retrieveBio.data);
            } catch (error) {
                console.error(error);
                alert("Error Occurred");
            }
        };

        if (user?.uid) {
            getBio();
        }
    }, [user?.uid]);

    const handleSignOut = () => {
        signOut(auth).then(() => {
            // Sign-out successful
        }).catch((error) => {
            // An error happened
            console.error("Error signing out:", error);
        });
    };

    const saveBio = async () => {
        try {
            await axios.put('/api/users/update', {
                uid: user.uid,
                bio: newBio,
            });
            alert("Bio saved successfully");
            setBio(newBio);
            setEditMode(false);
        } catch (error) {
            console.error(error);
            alert("Error Occurred");
        }
    };

    return (
        <div className='profile-home'>
            <div className="profile-container">
                <Avatar src={user?.photo} alt={user?.displayName} className="profile-avatar" />
                <h1>{user?.displayName}</h1>
                <h3>{user?.email}</h3>
                {editMode ? (
                    <>
                        <textarea rows={5} value={newBio} onChange={(e) => setNewBio(e.target.value)} placeholder="Bio" />
                        <button onClick={saveBio}>Save</button>
                    </>
                ) : (
                    <>
                        <h5>{bio}</h5>
                        <button onClick={() => {
                            setNewBio(bio);
                            setEditMode(true);
                        }}>Edit Profile</button>
                        <button onClick={handleSignOut}>Sign Out</button>
                    </>
                )}
            </div>
        </div>
    );
}

export default Profile;
