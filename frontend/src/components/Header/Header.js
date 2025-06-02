import React from 'react'
import SearchIcon from '@mui/icons-material/Search';
import InboxIcon from '@mui/icons-material/Inbox';
import { Avatar } from '@mui/material';
import './Header.css';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectUser } from '../../features/userSlice';



function Header() {
    const user = useSelector(selectUser);
    const navigate = useNavigate();
    const handleLogoCLick = () => {
        navigate("/");
    }

    return (
        <header>
            <div className='header-container'>
                <div className='header-left'>
                    <p onClick={handleLogoCLick}>
                        <img
                            src="/uploads/zcoder_smaller.png"
                            alt='Logo' />
                    </p>
                    <h3 onClick={handleLogoCLick}>Back to Home</h3>
                </div>
                <div className='header-middle'>
                    <div className='header-search-container'>
                        <SearchIcon />
                        <input type='text' placeholder='Search' />
                    </div>
                </div>
                <div className='header-right'>
                    <div className='header-right-container'>
                        {/* <span onClick={handleSignOut}><Avatar src={user?.photo} /></span> */}
                        <Link to='/profile'><Avatar src={user?.photo} className="avatar2" /></Link>
                        <Link to='/calendar'><InboxIcon className='calendar' /></Link>
                    </div>
                </div>
            </div>
        </header>
    )
}

export default Header