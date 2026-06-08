import React from 'react'
import AsideBar from './AsideBar'
import Navbar from './Navbar'
import HomeSect from './HomeSect'
import { Route, Routes } from 'react-router-dom'
import MenuSect from './MenuSect'
import SearchSect from './SearchSect'
import Cart from './Cart'

const MainSection = () => {
    return (
        <>
            <div className="FlexBoxNA">
                <AsideBar />
                <div className="NextToBT">
                    <Navbar />
                    <Routes>
                        <Route index element={<HomeSect />} />
                        <Route path='menu' element={<MenuSect />} />
                        <Route path='search' element={<SearchSect />} />
                        <Route path='cart' element={<Cart />} />
                    </Routes>
                </div>
            </div>
        </>
    )
}

export default MainSection