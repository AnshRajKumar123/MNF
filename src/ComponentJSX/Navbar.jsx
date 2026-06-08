import React, { useEffect, useRef, useState } from 'react'
import '../ComponentCSS/Navbar.css'
import { Link, useNavigate } from 'react-router-dom'

const Navbar = () => {
    const [searchTerm, setSearchTerm] = useState('')
    const searchRef = useRef(null)
    const navigate = useNavigate()

    const [userProfile, setUserProfile] = useState(null);

    // Load user profile
    useEffect(() => {
        const saved = JSON.parse(localStorage.getItem("MNF_UserProfile"));
        setUserProfile(saved);

        // Listen for profile updates from Profile.jsx
        const handleUpdate = () => {
            const updated = JSON.parse(localStorage.getItem("MNF_UserProfile"));
            setUserProfile(updated);
        };

        window.addEventListener("profileUpdated", handleUpdate);

        return () => window.removeEventListener("profileUpdated", handleUpdate);
    }, []);

    // 🎯 Focus input when pressing ⌘ + K
    useEffect(() => {
        const handleShortcut = (e) => {
            if (e.metaKey && e.key.toLowerCase() === 'k') { // ⌘ + K
                e.preventDefault()
                searchRef.current?.focus()
            }
        }

        window.addEventListener('keydown', handleShortcut)
        return () => window.removeEventListener('keydown', handleShortcut)
    }, [])

    // 🔍 Function to trigger search
    const handleSearch = () => {
        if (searchTerm.trim() === '') return
        // Navigate to search results page
        navigate(`/mainWebsite/search?query=${encodeURIComponent(searchTerm)}`)
        console.log("Searching for:", searchTerm)
    }

    // ⚡ Trigger search when pressing Enter
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSearch()
        }
    }

    return (
        <nav>
            <Link to='/' className="WebNavLogo">
                <h1>MidNight N Food</h1>
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
                <button onClick={handleSearch}>
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
                            <button onClick={() => { window.dispatchEvent(new Event('openOrderDetail')); localStorage.setItem('showOrderDetail', JSON.stringify(true)); }}>Order Tracking</button>
                            <Link to="/about"><button>About Us</button></Link>
                            <Link to="/report-fraud"><button>Report a Fraud</button></Link>
                            <Link to="/help-support"><button>Help and Support</button></Link>
                        </div>
                    </div>
                </div>

                <Link to='/profile'>
                    <button className="NaviAccount NaviAdd">
                        {userProfile?.image ? (
                            <img src={userProfile.image} className="NavProfileImg" />
                        ) : (
                            <span className="NavProfileLetter">
                                {userProfile?.name ? userProfile.name.charAt(0).toUpperCase() : "A"}
                            </span>
                        )}
                    </button>
                </Link>
            </div>
        </nav>
    )
}

export default Navbar