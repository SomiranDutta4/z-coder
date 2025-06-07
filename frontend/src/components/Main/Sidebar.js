import React from 'react';
import PublicIcon from '@mui/icons-material/Public';
import TerminalIcon from '@mui/icons-material/Terminal';
import SendIcon from '@mui/icons-material/Send';
import NotificationImportantIcon from '@mui/icons-material/NotificationImportant';
import { Link } from 'react-router-dom';

import { signOut } from 'firebase/auth';
import { auth } from '../../firebase';

function Sidebar() {
  const handleSignOut = () => {
    signOut(auth)
      .then(() => {})
      .catch((error) => {
        console.error("Error signing out:", error);
      });
  };

  return (
    <aside className="flex flex-col w-56 h-full bg-gray-800 text-gray-300 shadow-lg border-r border-gray-700 p-6">
      {/* Upcoming Contests */}
      <div className="mb-8">
        <Link
          to="/calendar"
          className="flex items-center space-x-3 text-green-400 font-semibold hover:text-green-500 transition-colors duration-300"
        >
          <NotificationImportantIcon className="text-2xl" />
          <span className="text-lg">Upcoming Contests!</span>
        </Link>
      </div>

      {/* Important Links */}
      <nav className="mb-10">
        <h2 className="flex items-center space-x-2 mb-4 text-gray-400 uppercase tracking-wide font-semibold text-sm">
          <PublicIcon className="text-xl" />
          <span>Important Links</span>
        </h2>
        <ul className="space-y-3">
          <li>
            <Link
              to="/"
              className="block px-3 py-2 rounded hover:bg-gray-700 hover:text-white transition-colors duration-200"
            >
              All Questions
            </Link>
          </li>
          <li>
            <Link
              to="/profile"
              className="block px-3 py-2 rounded hover:bg-gray-700 hover:text-white transition-colors duration-200"
            >
              User Profile
            </Link>
          </li>
          <li>
            <button
              onClick={handleSignOut}
              className="w-full text-left px-3 py-2 rounded hover:bg-gray-700 hover:text-white transition-colors duration-200"
            >
              Sign Out
            </button>
          </li>
        </ul>
      </nav>

      {/* Code Editor */}
      <nav className="mb-10">
        <h2 className="flex items-center space-x-2 mb-4 text-gray-400 uppercase tracking-wide font-semibold text-sm">
          <TerminalIcon className="text-xl" />
          <span>Code Editor</span>
        </h2>
        <ul>
          <li>
            <Link
              to="/zcoderIDE"
              className="block px-3 py-2 rounded hover:bg-gray-700 hover:text-white transition-colors duration-200"
            >
              ZCoder Online IDE
            </Link>
          </li>
        </ul>
      </nav>

      {/* Chat Room */}
      <nav>
        <h2 className="flex items-center space-x-2 mb-4 text-gray-400 uppercase tracking-wide font-semibold text-sm">
          <SendIcon className="text-xl" />
          <span>Chat Room</span>
        </h2>
        <ul>
          <li>
            <Link
              to="/chatRoom"
              className="block px-3 py-2 rounded hover:bg-gray-700 hover:text-white transition-colors duration-200"
            >
              Join a room
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
}

export default Sidebar;
