import React, { useState, useEffect } from "react";
import AnotherNav from './AnotherNav'
import '../PagesCSS/About.css'
import { ResturantIG } from '../assets/assest'
import { Link } from 'react-router-dom'
import { motion } from "framer-motion";

const About = () => {

    const [selectedMember, setSelectedMember] = useState(null);

    useEffect(() => {
        if (selectedMember) {
            document.body.style.overflow = "hidden";   // stop scrolling
        } else {
            document.body.style.overflow = "auto";     // allow scrolling
        }

        // Cleanup (very important)
        return () => {
            document.body.style.overflow = "auto";
        };
    }, [selectedMember]);

    return (
        <>
            <AnotherNav />

            <section className='AboutSection'>
                <section className="BannerSectionAbout">
                    <h1>Our Story: From a Simple Idea to Your Table</h1>
                    <p>Discover the passion and dedication that goes into every magical bite we create.</p>
                </section>

                <section className='OurJourneyAbout'>
                    <div className="InfoOurJourney">
                        <h1>Our Journey</h1>
                        <p>The foundation of MidNight N Food emerged from a basic late-night experience. The team leader Ayush Kumar and backend developer Aditya Raj stepped out for tea during their coding break. The team members stood under streetlights while discussing the absence of a service which would understand midnight food desires. The team members from student origins created this startup to serve students.</p>
                        <p>The university students faced MST (Mid-Semester Tests) at that particular time. Students used their evenings to create during the time when their days were filled with academic work and school responsibilities. The team members Ayush Kumar developed the concept while Aditya Raj constructed the foundation and Ansh Raj designed the user interface and user experience.</p>
                        <p>The team members experienced minimal sleep but generated countless ideas while maintaining strong motivation levels. Our goal was to create a meaningful platform which would unite late-night food cravings with high-quality comfort and easy access.</p>
                        <p>Our initial service area covered a 5–7 km radius but we aim to expand our reach to all hostels and PGs and night-owls throughout the entire city. The service operates as our dedication to create comfort during nighttime hours.</p>
                    </div>
                    <div className='ImageOurJourney'>
                        <img src={ResturantIG.AboutImage} />
                    </div>
                </section>
            </section>

            <section className='OurMissionAbout'>
                <p>What we believe in</p>
                <h1>Our Mission & Values</h1>
                <span>Our company exists to create unforgettable late-night food experiences for all customers. The team at MidNight N Food understands that <br /> excellent food provides comfort and happiness to people who need it most during late-night hunger. Our values determine all our <br /> decisions starting from ingredient selection to delivering hot meals directly to customers' homes.</span>

                <div className="ThreeCardsOfInd">
                    <div className="CardsThree">
                        <img src={ResturantIG.QualityIngredients} />
                        <h1>Quality Ingredients</h1>
                        <p>We carefully source fresh, high-quality ingredients to make every late-night meal taste exceptional. Your midnight cravings deserve the best — and that’s exactly what we serve.</p>
                    </div>
                    <div className="CardsThree">
                        <img src={ResturantIG.Sustainability} />
                        <h1>Sustainability</h1>
                        <p>We’re committed to responsible cooking, eco-friendly packaging, and reducing waste wherever possible. Great food shouldn’t cost the planet — even at midnight.</p>
                    </div>
                    <div className="CardsThree">
                        <img src={ResturantIG.CommunityFirst} />
                        <h1>Community First</h1>
                        <p>We believe in giving back and supporting the people who support us. From local suppliers to night-shift workers, our community inspires everything we do.</p>
                    </div>
                </div>
            </section>

            <section className='OurTeamAbout'>
                <h1>The People Behind the Munch</h1>
                <p>Our team is a passionate group of night-owls, food lovers, and creators dedicated to making your late-night <br /> experience unforgettable. From the kitchen to your doorstep, we work around the clock to bring you comfort, flavor, <br /> and freshness — exactly when you need it.</p>

                <div className="OurTeamPhoto">

                    {[
                        {
                            img: ResturantIG.AyushPhoto,
                            name: "Ayush Kumar",
                            role: "Team Leader",
                            bio: "Ayush leads MNF’s direction...",
                            skills: ["Leadership", "Product Strategy", "Team Management"],
                            social: {
                                instagram: "https://www.instagram.com/offical_ayush_100/",
                                linkedin: "https://linkedin.com/in/ayush-here",
                                email: "mailto:ayush.kbc.695@gmail.com"
                            }
                        },
                        {
                            img: ResturantIG.AnshPhoto,
                            name: "Ansh Raj",
                            role: "FrontEnd Developer",
                            bio: "Ansh designs UI/UX...",
                            skills: ["React.js", "UI/UX", "Animations"],
                            social: {
                                instagram: "https://www.instagram.com/its_ansh_raj_874/",
                                linkedin: "https://www.linkedin.com/in/golu-kumar-375992392/",
                                email: "mailto:golu.kkpncc.99008@gmail.com"
                            }
                        },
                        {
                            img: ResturantIG.AdityaPhoto,
                            name: "Aditya Raj",
                            role: "BackEnd Developer",
                            bio: "Aditya builds backend system...",
                            skills: ["Node.js", "APIs", "Database Architecture"],
                            social: {
                                instagram: "https://www.instagram.com/adityathakur_911/",
                                linkedin: "https://www.linkedin.com/in/aditya-raj-911-/",
                                email: "mailto:adityaraj9112009@gmail.com"
                            }
                        }
                    ].map((member, i) => (
                        <motion.div
                            className="MembersPhoto"
                            key={i}
                            whileHover={{ scale: 1.07 }}
                            onClick={() => setSelectedMember(member)}
                        >
                            <div className="MemberNameMain">
                                <img src={member.img} />
                            </div>
                            <h2>{member.name}</h2>
                            <p>{member.role}</p>
                        </motion.div>
                    ))}

                </div>

            </section>

            <section className='TasteMagicAbout'>
                <div className="BoxSectionMagic">
                    <div className="Burger"><img src={ResturantIG.AbsoluteBurg} /></div>
                    <div className='Pizaa'><img src={ResturantIG.AbsolutePizz} /></div>
                    <h1>Ready to Satisfy Your Cravings?</h1>
                    <p>Join the MNF family and discover your new favorite late-night meals. Explore our menu <br /> filled with fresh flavors and crave-worthy ingredients.</p>
                    <Link to="/mainWebsite/menu"><button>Crave Mode: ON</button></Link>
                </div>
            </section>

            {selectedMember && (
                <div className="TeamModalOverlay" onClick={() => setSelectedMember(null)}>
                    <div className="TeamModal" onClick={(e) => e.stopPropagation()}>

                        <button className="CloseModal" onClick={() => setSelectedMember(null)}>
                            ✕
                        </button>

                        <img src={selectedMember.img} className="ModalImg" />

                        <h2>{selectedMember.name}</h2>
                        <p className="ModalRole">{selectedMember.role}</p>
                        <p className="ModalBio">{selectedMember.bio}</p>

                        <div className="ModalSkills">
                            {selectedMember.skills.map((skill, i) => (
                                <span key={i}>{skill}</span>
                            ))}
                        </div>

                        <div className="SocialLinks">
                            <a href={selectedMember.social.instagram} target="_blank">
                                <i className="ri-instagram-line"></i>
                            </a>
                            <a href={selectedMember.social.linkedin} target="_blank">
                                <i className="ri-linkedin-fill"></i>
                            </a>
                            <a
                                href={selectedMember.social.email}
                                target="_self"
                                rel="noopener noreferrer"
                                onClick={(e) => {
                                    window.location.href = selectedMember.social.email;
                                }}
                            >
                                <i className="ri-mail-fill"></i>
                            </a>
                        </div>
                    </div>
                </div>
            )}

        </>
    )
}

export default About