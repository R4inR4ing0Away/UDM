import React from 'react';
import '../App.css';
import Navbar from '../components/Navbar';
import aboutBg from '../assets/about.jpg';

const About = () => {
  const faqs = [
    {
      question: "WHEN WAS TRAPKINGS FOUNDED?",
      answer: "TrapKings was officially launched on October 18, 2024 by founder Elijah Lomboy."
    },
    {
      question: "WHAT INSPIRED THE BRAND?",
      answer: "The brand draws inspiration from streetwear pioneers like Traplord and Trapstar, combined with Elijah's vision for entrepreneurial hustle."
    },
    {
      question: "WHAT'S SPECIAL ABOUT THE REFLECTIVE COLLECTION?",
      answer: "Our third collection features innovative designs that reflect light when hit by camera flash, creating unique photographic effects."
    },
    {
      question: "WHERE ARE YOUR PRODUCTS MADE?",
      answer: "We work with ethical manufacturers who share our commitment to quality and streetwear culture."
    },
    {
      question: "WHAT DOES TRAPKINGS REPRESENT?",
      answer: "The brand embodies the hustle and grind of young entrepreneurs making their mark in the world."
    },
    {
      question: "HOW CAN I STAY UPDATED ON NEW DROPS?",
      answer: "Follow us on Instagram @trapkings and subscribe to our newsletter for exclusive early access."
    }
  ];

  return (
    <div style={{
      minHeight: '100vh',
      width: '100vw',
      background: `url(${aboutBg}) center center/cover no-repeat`,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 0,
      margin: 0
    }}>
      <Navbar />
      <section className="about-hero" style={{width: '100%'}}>
        <div style={{
          background: '#fff',
          borderRadius: '12px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.10)',
          padding: '2rem 2rem 1.2rem 2rem',
          margin: '100px auto 2rem auto',
          maxWidth: 900,
          textAlign: 'center',
          position: 'relative',
          top: 0,
          zIndex: 2
        }}>
          <h1 style={{ fontFamily: 'Arial, sans-serif', fontWeight: 600, fontSize: '2.5rem', color: '#222', textAlign: 'center', letterSpacing: 1, marginBottom: '2rem', margin: 0 }}>ABOUT TRAPKINGS</h1>
        </div>
        <div className="about-content">
          <p>
            TrapKings is a clothing brand founded by Elijah Lomboy, inspired by popular streetwear brands like Traplord and Trapstar. 
            Elijah launched TrapKings on October 18, 2024. The brand's popularity grew organically through word-of-mouth in the streetwear community.
          </p>
          <p>
            The debut Gothic Cross collection established our signature aesthetic, while our current Reflective collection 
            pushes boundaries with light-reactive designs. Each piece is crafted for those who live at the intersection 
            of street culture and entrepreneurial ambition.
          </p>
          <p className="highlight">
            MORE THAN CLOTHING - A MOVEMENT FOR THE HUSTLERS AND DREAMERS.
          </p>
        </div>
      </section>
    </div>
  );
};

export default About;