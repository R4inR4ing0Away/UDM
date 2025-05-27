import React from 'react';
import Navbar from '../components/Navbar';
import sizechart1 from '../assets/sizechart1.png';
import sizechart2 from '../assets/sizechart2.png';
import sizechart3 from '../assets/sizechart3.png';
import sizechart4 from '../assets/sizechart4.png';
import sizechartBg from '../assets/sizechart.jpg';

const SizeChart = () => {
  return (
    <div style={{
      minHeight: '100vh',
      background: `url(${sizechartBg}) center center/cover no-repeat`,
      position: 'relative'
    }}>
      <Navbar />
      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '40px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', zIndex: 2 }}>
        <div style={{
          background: 'white',
          borderRadius: 14,
          boxShadow: '0 2px 12px rgba(0,0,0,0.10)',
          padding: '18px 48px',
          marginTop: 100,
          marginBottom: 32,
          display: 'inline-block',
        }}>
          <h1 style={{ fontFamily: 'Arial, sans-serif', fontWeight: 600, fontSize: '2.5rem', color: '#222', textAlign: 'center', letterSpacing: 1, marginBottom: '2rem', margin: 0 }}>Size Chart</h1>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 32, justifyContent: 'center' }}>
          <img src={sizechart1} alt="Size Chart 1" style={{ maxWidth: 600, width: '100%', borderRadius: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }} />
          <img src={sizechart2} alt="Size Chart 2" style={{ maxWidth: 600, width: '100%', borderRadius: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }} />
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 32, justifyContent: 'center', marginTop: 32 }}>
          <img src={sizechart3} alt="Size Chart 3" style={{ maxWidth: 600, width: '100%', borderRadius: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }} />
          <img src={sizechart4} alt="Size Chart 4" style={{ maxWidth: 600, width: '100%', borderRadius: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }} />
        </div>
      </div>
    </div>
  );
};

export default SizeChart; 