"use client";

import React, { useEffect, useState } from 'react';
import { MapContainer, Marker, Polyline, GeoJSON, Pane } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Journey Data with exact GPS coordinates
const journeyLocations = [
  { id: 1, name: "Việt Nam", year: "1911", desc: "Ngày 5/6/1911, người thanh niên Nguyễn Tất Thành lên tàu Amiral Latouche-Tréville rời Tổ quốc.", coords: [10.768, 106.706] as [number, number] },
  { id: 2, name: "Singapore", year: "1911", desc: "Tàu dừng chân tại Singapore trên hành trình sang Pháp.", coords: [1.2, 103.8] as [number, number] },
  { id: 3, name: "Colombo, Sri Lanka", year: "1911", desc: "Điểm dừng chân trên biển Ấn Độ Dương.", coords: [5.9, 80.5] as [number, number] },
  { id: 4, name: "Madagascar", year: "1911", desc: "Bác chứng kiến nỗi khổ của người dân thuộc địa tại châu Phi.", coords: [-18.8, 47.5] as [number, number] },
  { id: 5, name: "Cape Town, Nam Phi", year: "1911", desc: "Điểm vòng qua mũi nam của lục địa châu Phi.", coords: [-35.0, 20.0] as [number, number] },
  { id: 6, name: "Dakar, Senegal", year: "1911", desc: "Tàu cập cảng Tây Phi trước khi hướng về châu Âu.", coords: [14.6, -17.4] as [number, number] },
  { id: 7, name: "Le Havre, Pháp", year: "1911", desc: "Điểm đến đầu tiên tại Pháp. Bác bắt đầu cuộc sống lao động và tìm hiểu nước Pháp.", coords: [49.4, 0.1] as [number, number] },
  { id: 8, name: "Paris, Pháp", year: "1917-1923", desc: "Nơi Bác gửi Yêu sách của nhân dân An Nam và tham gia sáng lập Đảng Cộng sản Pháp.", coords: [48.8566, 2.3522] as [number, number] },
  { id: 9, name: "Rio de Janeiro, Brazil", year: "1912", desc: "Làm việc trên các con tàu vận tải, Bác có dịp đến Nam Mỹ.", coords: [-22.9, -43.1] as [number, number] },
  { id: 10, name: "Buenos Aires, Argentina", year: "1912", desc: "Bác đến Argentina, tìm hiểu đời sống giai cấp công nhân Nam Mỹ.", coords: [-34.6, -58.3] as [number, number] },
  { id: 11, name: "New York, Mỹ", year: "1912", desc: "Bác đến Mỹ, chứng kiến sự phân biệt chủng tộc và tìm hiểu Tuyên ngôn Độc lập Mỹ.", coords: [40.7128, -74.0060] as [number, number] },
  { id: 12, name: "Boston, Mỹ", year: "1912-1913", desc: "Làm việc tại khách sạn Omni Parker House.", coords: [42.3, -71.0] as [number, number] },
  { id: 13, name: "London, Anh", year: "1913-1917", desc: "Bác làm nghề cào tuyết, đốt lò, phụ bếp... và tham gia Công đoàn Thủy thủ quốc tế.", coords: [51.5074, -0.1278] as [number, number] },
  { id: 14, name: "Berlin, Đức", year: "1923", desc: "Trạm trung chuyển trên đường từ Pháp sang Liên Xô.", coords: [52.5, 13.4] as [number, number] },
  { id: 15, name: "Petrograd, Liên Xô", year: "1923", desc: "Bác đến quê hương của Cách mạng Tháng Mười (nay là St. Petersburg).", coords: [59.9, 30.3] as [number, number] },
  { id: 16, name: "Moscow, Liên Xô", year: "1923-1924", desc: "Nơi Bác học tập tại Đại học Phương Đông và tham dự Đại hội Quốc tế Cộng sản.", coords: [55.7558, 37.6173] as [number, number] },
  { id: 17, name: "Vladivostok, Liên Xô", year: "1924", desc: "Điểm trung chuyển bằng tuyến đường sắt xuyên Siberia.", coords: [43.1, 131.9] as [number, number] },
  { id: 18, name: "Quảng Châu, Trung Quốc", year: "1924-1927", desc: "Nơi thành lập Hội Việt Nam Cách mạng Thanh niên.", coords: [23.1291, 113.2644] as [number, number] },
  { id: 19, name: "Bangkok, Thái Lan", year: "1928", desc: "Bác hoạt động bí mật tại Thái Lan với bí danh Thầu Chín.", coords: [13.7, 100.5] as [number, number] },
  { id: 20, name: "Udon Thani, Thái Lan", year: "1928-1929", desc: "Bác xây dựng cơ sở cách mạng trong cộng đồng Việt kiều ở Bản Nỏng.", coords: [17.4138, 102.7872] as [number, number] },
  { id: 21, name: "Hong Kong", year: "1930", desc: "Nơi diễn ra Hội nghị thành lập Đảng Cộng sản Việt Nam (3/2/1930).", coords: [22.3193, 114.1694] as [number, number] },
  { id: 22, name: "Hạ Môn, Trung Quốc", year: "1932", desc: "Nơi Bác tạm lánh sau khi thoát khỏi nhà tù Victoria (Hong Kong).", coords: [24.4, 118.0] as [number, number] },
  { id: 23, name: "Thượng Hải, Trung Quốc", year: "1933", desc: "Bác bí mật liên lạc với tổ chức để quay lại Liên Xô.", coords: [31.2, 121.4] as [number, number] },
  { id: 24, name: "Urumqi, Trung Quốc", year: "1938", desc: "Trên đường từ Moscow trở lại Trung Quốc.", coords: [43.8, 87.6] as [number, number] },
  { id: 25, name: "Tây Ninh (Xining)", year: "1938", desc: "Điểm dừng chân trên tuyến đường bộ.", coords: [36.6, 101.7] as [number, number] },
  { id: 26, name: "Tây An (Xi'an)", year: "1938", desc: "Hoạt động tại Văn phòng Bát Lộ Quân.", coords: [34.3, 108.9] as [number, number] },
  { id: 27, name: "Côn Minh, Trung Quốc", year: "1940", desc: "Nơi Bác nhận định thời cơ cách mạng Việt Nam đã đến.", coords: [25.0, 102.7] as [number, number] },
  { id: 28, name: "Quế Lâm, Trung Quốc", year: "1940", desc: "Bác tổ chức lớp huấn luyện cán bộ và xuất bản báo.", coords: [25.2, 110.2] as [number, number] },
  { id: 29, name: "Pác Bó, Cao Bằng", year: "1941", desc: "Ngày 28/1/1941, Bác chính thức đặt chân về Tổ quốc sau 30 năm.", coords: [22.9806, 106.0504] as [number, number] }
];

// Helper function to generate bezier curve points for smooth oceanic paths
function getBezierCurve(start: [number, number], end: [number, number], control: [number, number], steps: number = 30): [number, number][] {
  const curve: [number, number][] = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const lat = (1 - t) * (1 - t) * start[0] + 2 * (1 - t) * t * control[0] + t * t * end[0];
    const lng = (1 - t) * (1 - t) * start[1] + 2 * (1 - t) * t * control[1] + t * t * end[1];
    curve.push([lat, lng]);
  }
  return curve;
}

// Map routes based on historical journey map (colors divided by stages)
const historicalRoutes = [
  // Chặng 1 (Xanh dương đậm) & Chặng 2 (Xanh lá - Vòng quanh Châu Phi)
  { id: '1', color: '#1e3a8a', start: [10.7, 106.7] as [number, number], end: [1.2, 103.8] as [number, number], control: [5.0, 108.0] as [number, number] }, // SG -> Singapore
  { id: '2', color: '#1e3a8a', start: [1.2, 103.8] as [number, number], end: [5.9, 80.5] as [number, number], control: [8.0, 95.0] as [number, number] }, // Singapore -> Sri Lanka
  { id: '3', color: '#888888', start: [5.9, 80.5] as [number, number], end: [-18.8, 47.5] as [number, number], control: [-5.0, 65.0] as [number, number] }, // Sri Lanka -> Madagascar
  { id: '4', color: '#16a34a', start: [-18.8, 47.5] as [number, number], end: [-35.0, 20.0] as [number, number], control: [-30.0, 40.0] as [number, number] }, // Madagascar -> Cape Town
  { id: '5', color: '#16a34a', start: [-35.0, 20.0] as [number, number], end: [-4.0, 11.0] as [number, number], control: [-20.0, 5.0] as [number, number] }, // Cape Town -> Congo/Gabon
  { id: '6', color: '#16a34a', start: [-4.0, 11.0] as [number, number], end: [14.6, -17.4] as [number, number], control: [5.0, -5.0] as [number, number] }, // Gabon -> Dakar
  { id: '7', color: '#16a34a', start: [14.6, -17.4] as [number, number], end: [38.7, -9.1] as [number, number], control: [30.0, -25.0] as [number, number] }, // Dakar -> Lisbon
  { id: '8', color: '#16a34a', start: [38.7, -9.1] as [number, number], end: [49.4, 0.1] as [number, number], control: [45.0, -10.0] as [number, number] }, // Lisbon -> Le Havre

  // Chặng 3: Pháp - Nam Mỹ - Mỹ - Anh - Pháp (Xanh chàm / Indigo)
  { id: '9', color: '#4338ca', start: [49.4, 0.1] as [number, number], end: [-22.9, -43.1] as [number, number], control: [20.0, -40.0] as [number, number] }, // France -> Rio de Janeiro
  { id: '10', color: '#4338ca', start: [-22.9, -43.1] as [number, number], end: [-34.6, -58.3] as [number, number], control: [-30.0, -45.0] as [number, number] }, // Rio -> Buenos Aires
  { id: '11', color: '#4338ca', start: [-34.6, -58.3] as [number, number], end: [40.7, -74.0] as [number, number], control: [5.0, -60.0] as [number, number] }, // Buenos Aires -> New York
  { id: '12', color: '#4338ca', start: [40.7, -74.0] as [number, number], end: [42.3, -71.0] as [number, number], control: [41.0, -72.0] as [number, number] }, // NY -> Boston
  { id: '13', color: '#4338ca', start: [42.3, -71.0] as [number, number], end: [51.5, -0.1] as [number, number], control: [55.0, -40.0] as [number, number] }, // Boston -> London
  { id: '14', color: '#4338ca', start: [51.5, -0.1] as [number, number], end: [48.8, 2.3] as [number, number], control: [50.0, 1.0] as [number, number] }, // London -> Paris

  // Chặng 4: Pháp - Liên Xô (Hồng / Đỏ nhạt)
  { id: '15', color: '#e11d48', start: [48.8, 2.3] as [number, number], end: [52.5, 13.4] as [number, number], control: [51.0, 8.0] as [number, number] }, // Paris -> Berlin
  { id: '16', color: '#e11d48', start: [52.5, 13.4] as [number, number], end: [59.9, 30.3] as [number, number], control: [56.0, 20.0] as [number, number] }, // Berlin -> Petrograd
  { id: '17', color: '#e11d48', start: [59.9, 30.3] as [number, number], end: [55.7, 37.6] as [number, number], control: [58.0, 35.0] as [number, number] }, // Petrograd -> Moscow

  // Chặng 5: Liên Xô - Trung Quốc (Xanh da trời)
  { id: '18', color: '#0ea5e9', start: [55.7, 37.6] as [number, number], end: [43.1, 131.9] as [number, number], control: [65.0, 80.0] as [number, number] }, // Moscow -> Vladivostok
  { id: '19', color: '#0ea5e9', start: [43.1, 131.9] as [number, number], end: [23.1, 113.2] as [number, number], control: [35.0, 130.0] as [number, number] }, // Vladivostok -> Guangzhou

  // Chặng 6: Trung Quốc - Xiêm (Xanh lá mạ)
  { id: '20', color: '#22c55e', start: [23.1, 113.2] as [number, number], end: [13.7, 100.5] as [number, number], control: [18.0, 110.0] as [number, number] }, // Guangzhou -> Bangkok
  { id: '21', color: '#22c55e', start: [13.7, 100.5] as [number, number], end: [17.4, 102.7] as [number, number], control: [15.0, 101.0] as [number, number] }, // Bangkok -> Udon Thani

  // Chặng 7: Xiêm - Trung Quốc (Vàng)
  { id: '22', color: '#eab308', start: [17.4, 102.7] as [number, number], end: [13.7, 100.5] as [number, number], control: [16.0, 102.0] as [number, number] }, // Udon Thani -> Bangkok
  { id: '23', color: '#eab308', start: [13.7, 100.5] as [number, number], end: [1.2, 103.8] as [number, number], control: [8.0, 100.0] as [number, number] }, // Bangkok -> Singapore
  { id: '24', color: '#eab308', start: [1.2, 103.8] as [number, number], end: [22.3, 114.1] as [number, number], control: [10.0, 110.0] as [number, number] }, // Singapore -> Hong Kong

  // Chặng 8: Hong Kong - Liên Xô (Cam)
  { id: '25', color: '#f97316', start: [22.3, 114.1] as [number, number], end: [24.4, 118.0] as [number, number], control: [23.0, 116.0] as [number, number] }, // Hong Kong -> Xiamen
  { id: '26', color: '#f97316', start: [24.4, 118.0] as [number, number], end: [31.2, 121.4] as [number, number], control: [28.0, 122.0] as [number, number] }, // Xiamen -> Shanghai
  { id: '27', color: '#f97316', start: [31.2, 121.4] as [number, number], end: [43.1, 131.9] as [number, number], control: [35.0, 128.0] as [number, number] }, // Shanghai -> Vladivostok
  { id: '28', color: '#f97316', start: [43.1, 131.9] as [number, number], end: [55.7, 37.6] as [number, number], control: [60.0, 90.0] as [number, number] }, // Vladivostok -> Moscow

  // Chặng 9: Liên Xô - Trung Quốc (Đỏ)
  { id: '29', color: '#ef4444', start: [55.7, 37.6] as [number, number], end: [43.8, 87.6] as [number, number], control: [52.0, 60.0] as [number, number] }, // Moscow -> Urumqi
  { id: '30', color: '#ef4444', start: [43.8, 87.6] as [number, number], end: [36.6, 101.7] as [number, number], control: [40.0, 95.0] as [number, number] }, // Urumqi -> Xining
  { id: '31', color: '#ef4444', start: [36.6, 101.7] as [number, number], end: [34.3, 108.9] as [number, number], control: [35.0, 105.0] as [number, number] }, // Xining -> Xi'an
  { id: '32', color: '#ef4444', start: [34.3, 108.9] as [number, number], end: [25.0, 102.7] as [number, number], control: [30.0, 105.0] as [number, number] }, // Xi'an -> Kunming

  // Chặng 10: Trung Quốc - Việt Nam (Đỏ thẫm)
  { id: '33', color: '#991b1b', start: [25.0, 102.7] as [number, number], end: [25.2, 110.2] as [number, number], control: [26.0, 106.0] as [number, number] }, // Kunming -> Guilin
  { id: '34', color: '#991b1b', start: [25.2, 110.2] as [number, number], end: [22.9, 106.0] as [number, number], control: [24.0, 108.0] as [number, number] }, // Guilin -> Pac Bo
];

const createCustomIcon = () => {
  return L.divIcon({
    className: 'custom-marker',
    html: `<div class="marker-pulse"></div>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10]
  });
};

const createArrowIcon = (angle: number, color: string) => {
  return L.divIcon({
    className: 'custom-arrow-icon',
    html: `<svg width="14" height="14" viewBox="0 0 24 24" style="transform: rotate(${angle}deg); filter: drop-shadow(0 2px 2px rgba(0,0,0,0.5));">
            <path fill="${color}" d="M24 12l-24-12v24z"/>
           </svg>`,
    iconSize: [14, 14],
    iconAnchor: [7, 7]
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
        coords: [8.0, 20.0]
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
            coords: locs[0].coords
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

        {/* Render Historical Routes (Flowing Dashed Lines with Arrows) */}
        <Pane name="routesPane" style={{ zIndex: 500 }}>
          {historicalRoutes.map(route => {
            const curvePoints = getBezierCurve(route.start, route.end, route.control);
            // Angle of the tangent at midpoint is parallel to the line from start to end
            const angle = Math.atan2(route.start[0] - route.end[0], route.end[1] - route.start[1]) * (180 / Math.PI);
            const midPoint = curvePoints[Math.floor(curvePoints.length / 2)];

            return (
              <React.Fragment key={`route-${route.id}`}>
                {/* The Path */}
                <Polyline
                  positions={curvePoints}
                  pathOptions={{
                    color: route.color,
                    weight: 2.5,
                    dashArray: '8, 8',
                    opacity: 0.8,
                    className: 'flowing-path'
                  }}
                />
                <Marker
                  position={midPoint}
                  icon={createArrowIcon(angle, route.color)}
                  interactive={false}
                />
              </React.Fragment>
            );
          })}
        </Pane>

        {/* Render markers for each journey stop (TEMPORARILY HIDDEN based on user request) */}
        {/*
        {journeyLocations.map((loc) => (
          <Marker 
            key={`loc-${loc.id}`}
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
