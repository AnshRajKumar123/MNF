import React from 'react'
import '../ComponentCSS/Footer.css'
import { ResturantIG } from '../assets/assest'
import { Link } from 'react-router-dom'

const Footer = () => {
    return (
        <footer>
            <div className="WebLogoFooter">
                <img src={ResturantIG.WebLogo} />
                <h1>MidNight N Food</h1>
            </div>

            <div className='FlexFooterLine'>
                <ul>
                    <li><b>Eternal</b></li><br />
                    <li><a href="#">MNF</a></li><br />
                    <li><a href="#">Feeding India</a></li><br />
                    <li><a href="#">Investor Relations</a></li>
                </ul>
                <ul>
                    <li><b>For Resturants</b></li><br />
                    <li><a href="#">Partner with Us</a></li><br />
                    <li><a href="#">Apps for you</a></li><br />
                </ul>
                <ul>
                    <li><b>Delivery Partners</b></li><br />
                    <li><a href="#">Partner with Us</a></li><br />
                    <li><a href="#">Apps for you</a></li><br />
                </ul>
                <ul>
                    <li><b>Legal</b></li><br />
                    <li><a href={ResturantIG.PrivacyPolicy} target='blank'>Privacy</a></li><br />
                    <li><a href={ResturantIG.SecurityPolicy} target='blank'>Security</a></li><br />
                    <li><a href={ResturantIG.TermsofService} target='blank'>Terms of Service</a></li><br />
                    <li><Link to="/help-support">Help and Support</Link></li><br />
                    <li><Link to="/report-fraud">Report a Fraud</Link></li><br />
                </ul>
                <ul>
                    <li><b>Social Links</b></li>
                    <li>
                        <a href=""><i className='bx bxl-linkedin'></i></a>
                        <a href="https://www.instagram.com/midnightnfood/" target='blank'><i className='bx bxl-instagram' ></i></a>
                        <a href=""><i className='bx bxl-facebook' ></i></a>
                        <a href=""><i className="fa-brands fa-x-twitter"></i></a>
                    </li>
                    <li><img src={ResturantIG.IOS} /></li>
                    <li><img src={ResturantIG.GooglePlay} /></li>
                </ul>
            </div>

            <hr className='HoriLine' />

            <p className='BoxiBtn'>By continuing past this page, you agree to our Terms of Service, Cookie Policy, Privacy Policy and Content Policies. All trademarks are properties of their respective owners 2008-2025 © MNF Ltd. All rights reserved.</p>
        </footer>
    )
}

export default Footer