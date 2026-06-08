"use client";

import dynamic from 'next/dynamic';

const MapComponent = dynamic(() => import('../components/MapComponent'), {
  ssr: false,
  loading: () => (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#0f172a', color: 'white' }}>
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-red-500"></div>
      <p style={{ marginLeft: '20px', fontSize: '1.2rem' }}>Đang tải bản đồ...</p>
    </div>
  )
});

export default function Home() {
  return (
    <>
      <div className="app-header">
        <h1 className="app-title">Hành trình Cứu nước</h1>
        <p className="app-subtitle">Hồ Chí Minh (1911 – 1941)</p>
      </div>
      
      <MapComponent />
    </>
  );
}
