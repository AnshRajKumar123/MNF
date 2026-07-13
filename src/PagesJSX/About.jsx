import React, { useState, useEffect } from "react";
import AnotherNav from './AnotherNav';
import '../PagesCSS/About.css';
import { ResturantIG, midnightAboutData } from '../assets/assest';
import { Link } from 'react-router-dom';
import { motion } from "framer-motion";

const About = () => {
    const [selectedMember, setSelectedMember] = useState(null);

    useEffect(() => {
        if (selectedMember) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }
        return () => { document.body.style.overflow = "auto"; };
    }, [selectedMember]);

    const teamMembersList = [
        {
            img: ResturantIG.AyushPhoto,
            name: "Ayush Kumar",
            role: "Team Leader",
            bio: "Ayush leads MNF’s structural project roadmap, scaling operational dispatches flawlessly.",
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
            bio: "Ansh constructs clean, premium fluid interfaces matching real-time user needs.",
            skills: ["React.js", "UI/UX Layout", "Animations Matrix"],
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
            bio: "Aditya architects core system security layers and transaction validation infrastructure paths.",
            skills: ["Node.js", "APIs Engine", "Database System"],
            social: {
                instagram: "https://www.instagram.com/adityathakur_911/",
                linkedin: "https://www.linkedin.com/in/aditya-raj-911-/",
                email: "mailto:adityaraj9112009@gmail.com"
            }
        }
    ];

    return (
        <div className="ProAboutSuiteWrapper">
            <AnotherNav />

            {/* SECTION 1: IMMERSIVE HERO BILLBOARD BANNER */}
            <section className="ProAboutBanner">
                <div className="BannerGlacialOverlay"></div>
                <div className="BannerTypographyContent">
                    <h1>{midnightAboutData.banner.title}</h1>
                    <p>{midnightAboutData.banner.subtitle}</p>
                </div>
            </section>

            {/* SECTION 2: THE HISTORY CHRONICLES SPLIT */}
            <section className="ProAboutJourney">
                <div className="JourneyInfoTextColumn">
                    <h2>{midnightAboutData.journey.title}</h2>
                    <p>{midnightAboutData.journey.p1}</p>
                    <p>{midnightAboutData.journey.p2}</p>
                    <p>{midnightAboutData.journey.p3}</p>
                    <p>{midnightAboutData.journey.p4}</p>
                </div>
                <div className="JourneyGraphicCardColumn">
                    <div className="JourneyImageWrapper">
                        <img src={ResturantIG.AboutImage} alt="Kitchen Log System" />
                    </div>
                </div>
            </section>

            {/* SECTION 3: SYSTEM VALUES MESH BENTO MATRIX */}
            <section className="ProAboutMission">
                <span className="ProTaglineSectionText">{midnightAboutData.mission.tagline}</span>
                <h2>{midnightAboutData.mission.title}</h2>
                <p className="MissionMainSubtitleText">{midnightAboutData.mission.description}</p>

                <div className="MissionBentoMatrixGrid">
                    {midnightAboutData.mission.cards.map((card, idx) => {
                        const icons = [ResturantIG.QualityIngredients, ResturantIG.Sustainability, ResturantIG.CommunityFirst];
                        return (
                            <div key={idx} className="MissionValueCardUnit">
                                <div className="ValueIconCapFrame"><img src={icons[idx]} alt="" /></div>
                                <h3>{card.title}</h3>
                                <p>{card.text}</p>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* SECTION 4: THE PEOPLE BEHIND SYSTEM FRAMEWORK */}
            <section className="ProAboutTeamDeck">
                <h2>{midnightAboutData.team.title}</h2>
                <p className="TeamMainSubtitleText">{midnightAboutData.team.subtitle}</p>

                <div className="TeamCardsMatrixGrid">
                    {teamMembersList.map((member, i) => (
                        <motion.div
                            className="ProTeamMemberProfileCard"
                            key={i}
                            whileHover={{ scale: 1.04, translateY: -4 }}
                            onClick={() => setSelectedMember(member)}
                        >
                            <div className="MemberAvatarShieldFrame">
                                <img src={member.img} alt={member.name} />
                            </div>
                            <h3>{member.name}</h3>
                            <span>{member.role}</span>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* SECTION 5: CALL TO ACTION BRAND OVERLAY */}
            <section className="ProAboutCtaStation">
                <div className="AboutCtaBoxContainer">
                    <div className="BackgroundGraphicLeft"><img src={ResturantIG.AbsoluteBurg} alt="" /></div>
                    <div className="BackgroundGraphicRight"><img src={ResturantIG.AbsolutePizz} alt="" /></div>

                    <div className="CtaTypographyHub">
                        <h2>{midnightAboutData.cta.title}</h2>
                        <p>{midnightAboutData.cta.subtitle}</p>
                        <Link to="/mainWebsite/menu" className="CtaTerminalRedirectBtn">
                            {midnightAboutData.cta.btnText} <i className='bx bx-right-arrow-alt'></i>
                        </Link>
                    </div>
                </div>
            </section>

            {/* DYNAMIC BIO PROFILE COMPLIANCE MODAL LAYER */}
            {selectedMember && (
                <div className="TeamModalOverlay" onClick={() => setSelectedMember(null)}>
                    <div className="TeamModal" onClick={(e) => e.stopPropagation()}>
                        <button className="CloseModal" onClick={() => setSelectedMember(null)}>✕</button>
                        <img src={selectedMember.img} className="ModalImg" alt="" />
                        <h2>{selectedMember.name}</h2>
                        <p className="ModalRole">{selectedMember.role}</p>
                        <p className="ModalBio">{selectedMember.bio}</p>

                        <div className="ModalSkills">
                            {selectedMember.skills.map((skill, i) => (
                                <span key={i}>{skill}</span>
                            ))}
                        </div>

                        <div className="SocialLinks">
                            <a href={selectedMember.social.instagram} target="_blank" rel="noreferrer"><i className='bx bxl-instagram'></i></a>
                            <a href={selectedMember.social.linkedin} target="_blank" rel="noreferrer"><i className='bx bxl-linkedin'></i></a>
                            <a href={selectedMember.social.email}><i className='bx bx-envelope'></i></a>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default About;