import React from 'react';
import PublicIcon from '@mui/icons-material/Public';
import TerminalIcon from '@mui/icons-material/Terminal';
import SendIcon from '@mui/icons-material/Send';
import { Link } from 'react-router-dom';
import NotificationImportantIcon from '@mui/icons-material/NotificationImportant';

import './sidebar.css';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase';

function Sidebar() {
  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        // Sign-out successful
      })
      .catch((error) => {
        // An error happened
        console.error("Error signing out:", error);
      });
  };

  return (
    <div className='sidebar'>

      <div className='sidebar-container'>
        <div className='sidebar-options'>
          <div className='link-tag'>
            <NotificationImportantIcon />
            <Link to='/calendar'>Upcoming Contests!</Link>
          </div>
          <div className='sidebar-option'>
            <div className='sidebar-option-name'>
              <PublicIcon />
              <p>IMPORTANT LINKS</p>
            </div>
            <div className='link'>
              <div className='link-tag'>
                <Link to="/">All Questions</Link>
              </div>
              <div className='link-tag'>
                <Link to="/profile">User Profile</Link>
              </div>
              <div className='link-tag'>
                <Link onClick={handleSignOut}>Sign Out</Link>
              </div>
            </div>
          </div>
          <div className='sidebar-option'>
            <div className='sidebar-option-name'>
              <TerminalIcon />
              <p>CODE EDITOR</p>
            </div>
            <div className='link'>
              <div className='link-tag'>
                <Link to="/zcoderIDE">ZCoder Online IDE</Link>
              </div>
            </div>
          </div>
          <div className='sidebar-option'>
            <div className='sidebar-option-name'>
              <SendIcon />
              <p>CHAT ROOM</p>
            </div>
            <div className='link'>
              <div className='link-tag'>
                <Link to='/chatRoom'>Join a room</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
