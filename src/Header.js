//import dependency components
import React from 'react'
import { useDispatch, } from 'react-redux';

//import custom components
import './Header.css'
import { logout, } from './features/userSlice';
import { auth } from './firebase';

//import Icon components
import SearchIcon from '@mui/icons-material/Search';
import HeaderOption from './HeaderOption';
import HomeIcon from '@mui/icons-material/Home';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import ChatIcon from '@mui/icons-material/Chat';
import NotificationIcon from '@mui/icons-material/Notifications';

function Header() {
    const dispatch = useDispatch()

    const logOutApp = () => {
        dispatch(logout())
        auth.signOut()
    }

  return (
    <div className='header'>
        <div className="header_left">
            <img src="https://cdn-icons-png.flaticon.com/512/3536/3536505.png" alt="Linkedin-logo" />

            <div className="header_search">
                <SearchIcon />
                <input placeholder='Search' type="text" />
            </div>
        </div>

        <div className="header_right">
            <HeaderOption Icon={HomeIcon} title='Home' />
            <HeaderOption Icon={SupervisorAccountIcon} title='My Network' />
            <HeaderOption Icon={BusinessCenterIcon} title='Jobs' />
            <HeaderOption Icon={ChatIcon} title='Messaging' />
            <HeaderOption Icon={NotificationIcon} title='Notifications' />
            <HeaderOption 
                avatar={true}
                title= 'Me'
                onClick={logOutApp}
            />
        </div>
    </div>
  )
}

export default Header