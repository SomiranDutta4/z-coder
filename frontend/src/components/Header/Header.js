import React from 'react'
import SearchIcon from '@mui/icons-material/Search'
import InboxIcon from '@mui/icons-material/Inbox'
import { Avatar } from '@mui/material'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectUser } from '../../features/userSlice'

function Header() {
    const user = useSelector(selectUser)
    const navigate = useNavigate()

    return (
        <header className="sticky top-0 z-[100000] bg-black shadow-md shadow-white/10 h-[9vh] flex items-center px-6">
            <div className="flex items-center justify-between w-full max-w-7xl mx-auto">
                {/* Left section */}
                <div className="flex items-center space-x-5">
                    <p onClick={() => navigate('/')} className="cursor-pointer">
                        <img
                            src="/uploads/z-logo.png"
                            alt="Z-coder Logo"
                            className="h-10 w-auto"
                            style={{ maxHeight: '40px' }}
                        />
                    </p>
                    <h3
                        onClick={() => navigate('/')}
                        className="text-sm font-normal text-gray-300 border border-white px-4 py-1 rounded-full cursor-pointer hover:bg-gray-600 hover:text-white transition"
                    >
                        Back to Home
                    </h3>
                </div>

                {/* Middle section */}
                <div className="hidden md:flex flex-grow max-w-xl mx-6">
                    <div className="flex items-center bg-[#242424] border border-[#2223] rounded px-4 py-2 w-full">
                        <SearchIcon className="text-white" />
                        <input
                            type="text"
                            placeholder="Search"
                            className="ml-3 w-full bg-transparent text-gray-200 outline-none border-none placeholder-gray-400"
                        />
                    </div>
                </div>

                {/* Right section */}
                <div className="flex items-center space-x-6">
                    <Link to="/profile">
                        <Avatar
                            src={user?.photo}
                            className="border border-gray-300 w-14 h-14 cursor-pointer"
                        />
                    </Link>
                    <Link to="/calendar">
                        <InboxIcon className="text-white/70 hover:bg-gray-300 hover:text-black rounded cursor-pointer p-2 transition" />
                    </Link>
                </div>
            </div>
        </header>
    )
}

export default Header
