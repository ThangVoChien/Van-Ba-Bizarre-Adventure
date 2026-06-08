"use client";

import { useEffect, useState } from 'react';
import { MapContainer, Marker, Polyline, GeoJSON, Pane } from 'react-leaflet';
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
    { id: 'AF', name: "AFRICA", coords: [8.0, 20.0] as [number, number], width: 200, tracking: '15px', transform: 'scale(0.8)' }
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
    } else if (africanCountries.includes(name)) {
      // Single dark distinct wood tone for all of Africa
      return {
        fillColor: '#3e220e',
        weight: 1.5, // Slightly thick stroke matching fill color to close any subpixel gaps between countries
        color: '#3e220e', // Same as fill color to hide borders completely
        fillOpacity: 1,
        className: 'africa-continent' // Custom class without individual drop shadows
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

  const handleCountryClick = (feature: any) => {
    const name = feature?.properties?.name;
    
    if (africanCountries.includes(name)) {
      setSelectedLoc({
        id: 99,
        name: "Lục địa Châu Phi",
        year: "1911",
        desc: "Bác làm phụ bếp trên con tàu Đô đốc Latouche-Tréville, đi qua nhiều cảng biển ở Châu Phi như Dakar (Senegal), Madagascar, Algeria, Ai Cập... để tìm hiểu đời sống của nhân dân thuộc địa.",
        coords: [8.0, 20.0],
        videoId: ""
      });
      return;
    }

    let searchString = "";
    if (name === "Vietnam") searchString = "Việt Nam";
    else if (name === "France") searchString = "Pháp";
    else if (name === "United States of America") searchString = "Mỹ";
    else if (name === "United Kingdom") searchString = "Anh";
    else if (name === "Russia") searchString = "Liên Xô";
    else if (name === "China") searchString = "Trung Quốc";
    else if (name === "Thailand") searchString = "Thái Lan";

    if (searchString) {
      const locs = journeyLocations.filter(l => l.name.includes(searchString));
      if (locs.length > 0) {
        if (locs.length > 1) {
          setSelectedLoc({
            id: locs[0].id,
            name: searchString,
            year: locs.map(l => l.year).join(" & "),
            desc: locs.map(l => `📍 ${l.name}: ${l.desc}`).join("\n\n"),
            coords: locs[0].coords,
            videoId: locs[0].videoId
          });
        } else {
          setSelectedLoc(locs[0]);
        }
      }
    }
  };

  const onEachFeature = (feature: any, layer: L.Layer) => {
    layer.on({
      click: () => handleCountryClick(feature)
    });
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
          <>
            {/* Render all non-African countries on the default pane */}
            <GeoJSON
              key="rest-of-world"
              data={{ ...geoData, features: geoData.features.filter((f: any) => !africanCountries.includes(f.properties.name)) }}
              style={getCountryStyle}
              onEachFeature={onEachFeature}
            />
            {/* Render Africa in a custom pane to apply an outer shadow without internal shadows */}
            <Pane name="africaPane" className="wooden-continent" style={{ zIndex: 400 }}>
              <GeoJSON
                key="africa"
                data={{ ...geoData, features: geoData.features.filter((f: any) => africanCountries.includes(f.properties.name)) }}
                style={getCountryStyle}
                onEachFeature={onEachFeature}
              />
            </Pane>
          </>
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
        <div className="fixed-overlay" onClick={() => setSelectedLoc(null)}>
          <div className="fixed-overlay-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setSelectedLoc(null)}>✕</button>
            <div className="popup-header">
              <span className="popup-year">{selectedLoc.year}</span>
              <h3 className="popup-title">{selectedLoc.name}</h3>
            </div>
            <div className="popup-body">
              <p className="popup-desc">{selectedLoc.desc}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
