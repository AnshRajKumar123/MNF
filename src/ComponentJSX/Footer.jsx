import React from 'react';
import '../ComponentCSS/Footer.css';
import { ResturantIG, midnightFoodData, midnightFooterData } from '../assets/assest';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="ProOceanicFooter">
            <div className="ProFooterTopRow">
                <div className="WebLogoFooter">
                    <img src={ResturantIG.WebLogo} alt="Corporate Logo" />
                    <h1>{midnightFoodData.branding.title}</h1>
                </div>
            </div>

            <div className="FlexFooterLine">
                {/* Dynamic Configuration Link Columns */}
                {midnightFooterData.columns.map((col, index) => (
                    <div className="FooterLinkColumn" key={index}>
                        <h3>{col.title}</h3>
                        <ul>
                            {col.links.map((link, idx) => (
                                <li key={idx}>
                                    {link.isExternal ? (
                                        <a href={ResturantIG[link.path]} target="_blank" rel="noopener noreferrer">
                                            {link.label}
                                        </a>
                                    ) : link.path.startsWith("/") ? (
                                        <Link to={link.path}>{link.label}</Link>
                                    ) : (
                                        <a href={link.path}>{link.label}</a>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}

                {/* Social and Marketplace Application Links Column */}
                <div className="FooterLinkColumn SocialLinksColumnModifier">
                    <h3>Social Vectors</h3>
                    <div className="ProFooterSocialRow">
                        <a href="#" aria-label="LinkedIn"><i className='bx bxl-linkedin'></i></a>
                        <a href="https://www.instagram.com/midnightnfood/" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><i className='bx bxl-instagram'></i></a>
                        <a href="#" aria-label="Facebook"><i className='bx bxl-facebook'></i></a>
                        <a href="#" aria-label="Twitter"><i className='bx bxl-twitter'></i></a>
                    </div>
                    <div className="ProFooterAppDownloadPlatform">
                        <a href="#" className="AppStoreBadge"><img src={ResturantIG.IOS} alt="iOS App Store Link" /></a>
                        <a href="#" className="AppStoreBadge"><img src={ResturantIG.GooglePlay} alt="Google Play Store Link" /></a>
                    </div>
                </div>
            </div>

            <hr className="HoriLine" />

            <div className="ProFooterBottomMeta">
                <p className="BoxiBtn">{midnightFooterData.copyright}</p>
            </div>
        </footer>
    );
};

export default Footer;