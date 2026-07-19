import React, { useEffect, useRef, useState } from 'react';
import '../ComponentCSS/Navbar.css';
import { Link, useNavigate } from 'react-router-dom';
import { midnightFoodData } from '../assets/assest';
import axios from "axios";

const Navbar = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const searchRef = useRef(null);
    const navigate = useNavigate();
    const [userProfile, setUserProfile] = useState(null);

    useEffect(() => {

        const fetchProfile = async () => {

            try {

                const response = await axios.get(
                    "http://localhost:3000/auth/profile",
                    {
                        withCredentials: true,
                    }
                );

                const user = response.data.user;

                setUserProfile({
                    name: user.fullName,
                    image: user.image,
                });

            } catch (error) {

                console.log(error);

            }

        };

        fetchProfile();

        window.addEventListener("profileUpdated", fetchProfile);

        return () => {
            window.removeEventListener("profileUpdated", fetchProfile);
        };

    }, []);

    useEffect(() => {
        const handleShortcut = (e) => {
            if (e.metaKey && e.key.toLowerCase() === 'k') {
                e.preventDefault();
                searchRef.current?.focus();
            }
        };
        window.addEventListener('keydown', handleShortcut);
        return () => window.removeEventListener('keydown', handleShortcut);
    }, []);

    const handleSearch = () => {
        if (searchTerm.trim() === '') return;
        navigate(`/mainWebsite/search?query=${encodeURIComponent(searchTerm)}`);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') handleSearch();
    };

    return (
        <nav className="ProOceanicNavbar">
            <Link to='/' className="WebNavLogo">
                <h1>{midnightFoodData.branding.title}</h1>
            </Link>

            <div className="NaviSearch">
                <i className="ri-search-line SearchIcon"></i>
                <input
                    ref={searchRef}
                    type="text"
                    placeholder="Search Food or Restaurant"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={handleKeyDown}
                />
                <button onClick={handleSearch} className="KbdShortcutBtn">
                    <i className="ri-command-line"></i>
                    <span>K</span>
                </button>
            </div>

            <div className="NaviLastOpt">
                <button className="NaviNotifi NaviAdd">
                    <i className="bx bx-bell"></i>
                </button>

                <div className="HoverEffectDrop">
                    <div className="IconHeCenter">
                        <i className="ri-menu-line"></i>
                    </div>
                    <div className="BezPadding">
                        <div className="InsideMenuBar">
                            {midnightFoodData.navMenuOptions.map((opt, idx) => (
                                opt.action ? (
                                    <button key={idx} onClick={() => {
                                        window.dispatchEvent(new Event(opt.action));
                                        localStorage.setItem('showOrderDetail', JSON.stringify(true));
                                    }}>{opt.label}</button>
                                ) : (
                                    <Link key={idx} to={opt.path}><button>{opt.label}</button></Link>
                                )
                            ))}
                        </div>
                    </div>
                </div>

                <Link to='/profile'>
                    <button className="NaviAccount NaviAdd">
                        {userProfile?.image ? (
                            <img src={userProfile.image} className="NavProfileImg" alt="" />
                        ) : (
                            <span className="NavProfileLetter">
                                {userProfile?.name ? userProfile.name.charAt(0).toUpperCase() : "A"}
                            </span>
                        )}
                    </button>
                </Link>
            </div>
        </nav>
    );
};

export default Navbar;