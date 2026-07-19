import React from 'react'
import 'boxicons'
import HeroSect from './ComponentJSX/HeroSect'
import { Route, Routes } from 'react-router-dom'
import MainSection from './ComponentJSX/MainSection'
import Footer from './ComponentJSX/Footer'
import SignInUp from './ComponentJSX/SignInUp'
import About from './PagesJSX/About'
import HelpSupport from './PagesJSX/HelpSupport'
import ReportFraud from './PagesJSX/ReportFraud'
import ScrollToTop from './ComponentJSX/ScrollToTop'
import Profile from './ComponentJSX/Profile'
import FraudSuccess from './PagesJSX/FraudSuccess'
import HelpSuccess from './PagesJSX/HelpSuccess'
import TrackOrder from './PagesJSX/TrackOrder'
import { Toaster } from "react-hot-toast";
import ProtectedRoute from "./ComponentJSX/ProtectedRoute";

const App = () => {
    return (
        <>
            <ScrollToTop />
            <Toaster position="top-center" />
            <Routes>
                
                <Route path='/' element={<HeroSect />} />
                <Route path='/signInUp' element={<SignInUp />} />


                <Route element={<ProtectedRoute />}>

                    <Route path='/mainWebsite/*' element={<MainSection />} />
                    <Route path='/about' element={<About />} />
                    <Route path='/help-support' element={<HelpSupport />} />
                    <Route path='/report-fraud' element={<ReportFraud />} />
                    <Route path='/profile' element={<Profile />} />
                    <Route path="/fraud-success" element={<FraudSuccess />} />
                    <Route path="/help-success" element={<HelpSuccess />} />
                    <Route path='/track-order' element={<TrackOrder />} />
                    
                </Route>
            </Routes>
            <Footer />
        </>
    )
}

export default App