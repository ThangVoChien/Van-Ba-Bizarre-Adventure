"use client";

import { useEffect, useState } from 'react';
import { MapContainer, Marker, Polyline, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Journey Data with exact GPS coordinates
const journeyLocations = [
  {
    id: 1,
    name: "Cảng Nhà Rồng, Việt Nam",
    year: "1911",
    desc: "Bác rời quê hương, bắt đầu hành trình 30 năm bôn ba tìm đường cứu nước.",
    coords: [10.768, 106.706] as [number, number],
    videoId: "YOUR_YOUTUBE_ID_1"
  },
  {
    id: 2,
    name: "Paris, Pháp",
    year: "1911–1919",
    desc: "Gửi 'Yêu sách 8 điểm' tại Hội nghị Versailles, tiếp cận chủ nghĩa Mác-Lênin.",
    coords: [48.8566, 2.3522] as [number, number],
    videoId: "YOUR_YOUTUBE_ID_2"
  },
  {
    id: 10,
    name: "New York & Boston, Mỹ",
    year: "1912–1913",
    desc: "Làm thuê tại Mỹ, nghiên cứu về cuộc đấu tranh giành độc lập và Tuyên ngôn Độc lập Mỹ.",
    coords: [40.7128, -74.0060] as [number, number],
    videoId: "YOUR_YOUTUBE_ID_10"
  },
  {
    id: 3,
    name: "London, Anh",
    year: "1913–1914",
    desc: "Làm thợ ảnh, nghiên cứu phong trào công nhân Anh.",
    coords: [51.5074, -0.1278] as [number, number],
    videoId: "YOUR_YOUTUBE_ID_3"
  },
  {
    id: 4,
    name: "Moscow, Liên Xô",
    year: "1923–1924",
    desc: "Dự Đại hội Quốc tế Cộng sản, học tập đường lối cách mạng vô sản.",
    coords: [55.7558, 37.6173] as [number, number],
    videoId: "YOUR_YOUTUBE_ID_4"
  },
  {
    id: 5,
    name: "Quảng Châu, Trung Quốc",
    year: "1924–1927",
    desc: "Thành lập Hội Việt Nam Cách mạng Thanh niên, đào tạo cán bộ cốt cán.",
    coords: [23.1291, 113.2644] as [number, number],
    videoId: "YOUR_YOUTUBE_ID_5"
  },
  {
    id: 6,
    name: "Udon Thani, Thái Lan",
    year: "1928–1929",
    desc: "Xây dựng cơ sở cách mạng trong kiều bào Việt kiều.",
    coords: [17.4138, 102.7872] as [number, number],
    videoId: "YOUR_YOUTUBE_ID_6"
  },
  {
    id: 7,
    name: "Hong Kong",
    year: "1930",
    desc: "Chủ trì Hội nghị thành lập Đảng Cộng sản Việt Nam.",
    coords: [22.3193, 114.1694] as [number, number],
    videoId: "YOUR_YOUTUBE_ID_7"
  },
  {
    id: 8,
    name: "Côn Minh, Trung Quốc",
    year: "1938–1940",
    desc: "Chuẩn bị các điều kiện về nước trực tiếp lãnh đạo cách mạng.",
    coords: [25.0453, 102.7100] as [number, number],
    videoId: "YOUR_YOUTUBE_ID_8"
  },
  {
    id: 9,
    name: "Pác Bó, Cao Bằng",
    year: "1941",
    desc: "Sau 30 năm, Bác trở về đất nước, trực tiếp lãnh đạo cách mạng đến thắng lợi.",
    coords: [22.9806, 106.0504] as [number, number],
    videoId: "YOUR_YOUTUBE_ID_9"
  }
];

const createCustomIcon = () => {
  return L.divIcon({
    className: 'custom-marker',
    html: `<div class="marker-pulse"></div>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10]
  });
};

export default function MapComponent() {
  const [mounted, setMounted] = useState(false);
  const [selectedLoc, setSelectedLoc] = useState<typeof journeyLocations[0] | null>(null);
  const [geoData, setGeoData] = useState(null);

  useEffect(() => {
    setMounted(true);
    // Fetch the GeoJSON world map data
    fetch('/world.geo.json')
      .then(res => res.json())
      .then(data => {
        // Remove Russia's Chukotka Peninsula pieces that cross the 180 meridian
        // AND remove the Kaliningrad exclave in Europe
        if (data && data.features) {
          const russia = data.features.find((f: any) => f.properties.name === "Russia");
          if (russia && russia.geometry.type === "MultiPolygon") {
            // Filter out polygons that have negative longitudes (cross 180)
            // AND filter out polygons with longitude < 25 (Kaliningrad is ~20-22)
            russia.geometry.coordinates = russia.geometry.coordinates.filter((polygon: any) => {
              // Check the first coordinate of the first ring
              const firstLng = polygon[0][0][0];
              return firstLng > 25;
            });
          }
        }
        setGeoData(data);
      })
      .catch(err => console.error("Could not load GeoJSON", err));
  }, []);

  if (!mounted) return null;

  const pathCoords = journeyLocations.map(loc => loc.coords);

  const africanCountries = [
    'Angola', 'Burundi', 'Benin', 'Burkina Faso', 'Botswana', 'Central African Republic',
    'Ivory Coast', 'Cameroon', 'Democratic Republic of the Congo', 'Republic of the Congo',
    'Djibouti', 'Algeria', 'Egypt', 'Eritrea', 'Ethiopia', 'Gabon', 'Ghana', 'Guinea',
    'Gambia', 'Guinea Bissau', 'Equatorial Guinea', 'Kenya', 'Liberia', 'Libya', 'Lesotho',
    'Morocco', 'Madagascar', 'Mali', 'Mozambique', 'Mauritania', 'Malawi', 'Namibia',
    'Niger', 'Nigeria', 'Rwanda', 'Western Sahara', 'Sudan', 'South Sudan', 'Senegal',
    'Sierra Leone', 'Somaliland', 'Somalia', 'Chad', 'Togo', 'Tunisia',
    'United Republic of Tanzania', 'Uganda', 'South Africa', 'Zambia', 'Zimbabwe'
  ];

  const visitedCountries = [
    "Vietnam", "France", "United Kingdom", "Russia", "China", "Thailand", "United States of America",
    ...africanCountries
  ];

  const countryLabels = [
    { id: 'VN', name: "VIETNAM", coords: [20.5, 104.5] as [number, number], width: 40, tracking: '1px', transform: 'scale(0.4)' },
    { id: 'FR', name: "FRANCE", coords: [46.5, 2.5] as [number, number], width: 60, tracking: '2px', transform: 'scale(0.4)' },
    { id: 'UK', name: "U.K.", coords: [54.0, -2.5] as [number, number], width: 40, tracking: '1px', transform: 'scale(0.4)' },
    { id: 'RU', name: "RUSSIA", coords: [56.0, 95.0] as [number, number], width: 250, tracking: '16px', transform: 'scale(0.9)' },
    { id: 'CN', name: "CHINA", coords: [36.0, 104.0] as [number, number], width: 120, tracking: '8px', transform: 'scale(0.7)' },
    { id: 'TH', name: "THAILAND", coords: [15.5, 101.0] as [number, number], width: 60, tracking: '1px', transform: 'scale(0.35)' },
    { id: 'US', name: "USA", coords: [38.0, -97.0] as [number, number], width: 100, tracking: '6px', transform: 'scale(0.7)' },
    { id: 'AF', name: "AFRICA", coords: [0.0, 20.0] as [number, number], width: 200, tracking: '15px', transform: 'scale(0.8)' }
  ];

  const createCountryLabel = (label: any) => {
    return L.divIcon({
      className: 'country-label-icon',
      html: `<div style="font-size: 10px; letter-spacing: ${label.tracking}; width: ${label.width}px; text-align: center; transform: ${label.transform}; transform-origin: center;">${label.name}</div>`,
      iconSize: [label.width, 30],
      iconAnchor: [label.width / 2, 15]
    });
  };

  // Function to deterministically assign a wood color to a country
  const getCountryStyle = (feature: any) => {
    const name = feature?.properties?.name || feature?.id || "Unknown";

    // Map specific colors to specific countries for the wooden effect
    const colorMap: Record<string, string> = {
      "Vietnam": "#8b5a2b", // Walnut (Dark)
      "France": "#d49a6a", // Oak (Medium light)
      "United Kingdom": "#b06d3b", // Cherry (Medium dark)
      "Russia": "#e8c382", // Pine (Very light)
      "China": "#dca965", // Maple (Warm light)
      "Thailand": "#c18a53", // Teak (Medium warm)
      "United States of America": "#a0522d" // Sienna (Reddish brown)
    };

    if (visitedCountries.includes(name) && colorMap[name]) {
      return {
        fillColor: colorMap[name],
        weight: 1,
        color: 'rgba(0,0,0,0.6)', // Subtle edge line
        fillOpacity: 1,
        className: 'wooden-continent' // Apply drop shadow
      };
    } else if (visitedCountries.includes(name)) {
      let hash = 0;
      for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
      }
      // Palette of natural wood tones
      const colors = ['#e8c382', '#dca965', '#c88647', '#8f5629', '#583216'];
      return {
        fillColor: colors[Math.abs(hash) % colors.length],
        weight: 1,
        color: 'rgba(0,0,0,0.6)', // Subtle edge line
        fillOpacity: 1,
        className: 'wooden-continent' // Apply drop shadow
      };
    } else {
      // Faded background style for unvisited countries
      return {
        fillColor: '#34495e', // Slightly lighter/darker than the wall to give a subtle outline
        weight: 0.5,
        color: '#2c3e50',
        fillOpacity: 0.6,
        className: 'unvisited-continent'
      };
    }
  };

  return (
    <div className="map-frame-wrapper">
      <MapContainer
        center={[15, 20]}
        zoom={3}
        zoomControl={false}
        dragging={false}
        scrollWheelZoom={false}
        doubleClickZoom={false}
        touchZoom={false}
        boxZoom={false}
        keyboard={false}
        style={{ height: '100%', width: '100%' }}
        attributionControl={false}
      >
        {/* Render the world map using GeoJSON polygons to look like wooden cutouts */}
        {geoData && (
          <GeoJSON
            data={geoData}
            style={getCountryStyle}
          />
        )}

        {/* Render Country Labels */}
        {countryLabels.map(label => (
          <Marker
            key={label.id}
            position={label.coords}
            icon={createCountryLabel(label)}
            interactive={false} // Disable clicking on labels
          />
        ))}

        {/* Render the dotted path line connecting the stops (TEMPORARILY HIDDEN) */}
        {/* 
        <Polyline 
          positions={pathCoords} 
          pathOptions={{ 
            color: '#ef4444', 
            weight: 3, 
            dashArray: '10, 10', 
            opacity: 0.8,
            lineJoin: 'round',
            className: 'path-line'
          }} 
        />
        */}

        {/* Render markers for each journey stop (TEMPORARILY HIDDEN) */}
        {/* 
        {journeyLocations.map((loc) => (
          <Marker 
            key={loc.id} 
            position={loc.coords} 
            icon={createCustomIcon()}
            eventHandlers={{
              click: () => setSelectedLoc(loc),
            }}
          />
        ))}
        */}
      </MapContainer>

      {/* Fixed UI Overlay for Selected Location */}
      {selectedLoc && (
        <div className="fixed-overlay">
          <div className="fixed-overlay-content">
            <button className="close-btn" onClick={() => setSelectedLoc(null)}>✕</button>
            <div className="popup-header">
              <span className="popup-year">{selectedLoc.year}</span>
              <h3 className="popup-title">{selectedLoc.name}</h3>
            </div>

            <p className="popup-desc">{selectedLoc.desc}</p>

            <div className="popup-video-container">
              {selectedLoc.videoId && selectedLoc.videoId !== 'YOUR_YOUTUBE_ID' && !selectedLoc.videoId.startsWith('YOUR_YOUTUBE_ID') ? (
                <iframe
                  width="100%"
                  height="100%"
                  src={`https://www.youtube.com/embed/${selectedLoc.videoId}?controls=1`}
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              ) : (
                <div className="popup-video-placeholder">
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '8px', margin: '0 auto', display: 'block' }}>
                    <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
                    <path d="m10 15 5-3-5-3z" />
                  </svg>
                  <p>Mã QR Video sẽ tích hợp tại đây</p>
                  <small>Nhóm cập nhật link YouTube sau</small>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
