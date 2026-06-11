"use client";

import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, Marker, Polyline, GeoJSON, Pane, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Component để animate nét đứt trực tiếp bằng Javascript của Leaflet
function AnimatedPolyline({ positions, pathOptions }: any) {
  const polylineRef = useRef<any>(null);

  useEffect(() => {
    if (!polylineRef.current) return;

    let offset = 16;
    const interval = setInterval(() => {
      offset -= 1;
      if (offset <= 0) offset = 16;
      // Cập nhật dashOffset trực tiếp vào Leaflet
      if (polylineRef.current.setStyle) {
        polylineRef.current.setStyle({ dashOffset: offset.toString() });
      }
    }, 30); // Khoảng 30fps

    return () => clearInterval(interval);
  }, []);

  return (
    <Polyline
      ref={polylineRef}
      positions={positions}
      pathOptions={pathOptions}
    />
  );
}

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
  // Chặng 1: Cảng Sài Gòn - Le Havre (Orange/Red)
  { stage: 1, id: '1', color: '#ea580c', start: [10.82, 106.63] as [number, number], end: [1.35, 103.81] as [number, number], control: [5.0, 108.0] as [number, number] }, // Sài Gòn -> Singapore
  { stage: 1, id: '2', color: '#ea580c', start: [1.35, 103.81] as [number, number], end: [5.9, 80.5] as [number, number], control: [8.0, 95.0] as [number, number] }, // Singapore -> Colombo
  { stage: 1, id: '3', color: '#ea580c', start: [5.9, 80.5] as [number, number], end: [11.5, 43.1] as [number, number], control: [15.0, 60.0] as [number, number] }, // Colombo -> Djibouti
  { stage: 1, id: '4', color: '#ea580c', start: [11.5, 43.1] as [number, number], end: [31.2, 29.9] as [number, number], control: [22.0, 38.0] as [number, number] },
  { stage: 1, id: '5', color: '#ea580c', start: [31.2, 29.9] as [number, number], end: [43.3, 5.4] as [number, number], control: [36.0, 20.0] as [number, number] }, // Port Said -> Marseille

  // Hành trình đi biển vòng quanh TBN sang Bắc Pháp (Chặng 1)
  { stage: 1, id: '1_6a', color: '#ea580c', start: [43.3, 5.4] as [number, number], end: [36.0, -6.0] as [number, number], control: [38.0, 3.0] as [number, number] }, // Marseille -> Gibraltar
  { stage: 1, id: '1_6b', color: '#ea580c', start: [36.0, -6.0] as [number, number], end: [43.0, -10.0] as [number, number], control: [39.0, -12.0] as [number, number] }, // Gibraltar -> Mũi Tây Ban Nha (Outer)
  { stage: 1, id: '1_6c', color: '#ea580c', start: [43.0, -10.0] as [number, number], end: [48.5, -6.0] as [number, number], control: [46.0, -10.0] as [number, number] }, // Tây Ban Nha -> Mũi Tây Pháp (Outer)
  { stage: 1, id: '1_6d', color: '#ea580c', start: [48.5, -6.0] as [number, number], end: [49.5, 0.1] as [number, number], control: [50.5, -3.0] as [number, number] }, // Mũi Tây Pháp -> Le Havre (Outer)

  // Chặng 2: Đi quanh châu Phi (Green) - Chiều KIM ĐỒNG HỒ
  // Bắt đầu từ Cảng Tây Bắc (Le Havre) vòng qua Tây Ban Nha vào Địa Trung Hải
  { stage: 2, id: '7', color: '#16a34a', start: [49.5, 0.1] as [number, number], end: [48.5, -5.0] as [number, number], control: [49.5, -2.0] as [number, number] }, // Le Havre -> Mũi Tây Pháp
  { stage: 2, id: '8', color: '#16a34a', start: [48.5, -5.0] as [number, number], end: [43.0, -9.0] as [number, number], control: [45.5, -8.0] as [number, number] }, // Mũi Tây Pháp -> Mũi TBN
  { stage: 2, id: '9', color: '#16a34a', start: [43.0, -9.0] as [number, number], end: [36.0, -5.0] as [number, number], control: [39.5, -9.5] as [number, number] }, // Mũi TBN -> Gibraltar

  // Ghé Algeria ("Angela") và đi dọc Bắc Phi tới Ai Cập
  { stage: 2, id: '10', color: '#16a34a', start: [36.0, -5.0] as [number, number], end: [36.7, 3.2] as [number, number], control: [36.0, -1.0] as [number, number] }, // Gibraltar -> Algeria
  { stage: 2, id: '10a2', color: '#16a34a', start: [36.7, 3.2] as [number, number], end: [36.8, 10.1] as [number, number], control: [37.0, 6.0] as [number, number] }, // Algeria -> Tunisia
  { stage: 2, id: '10a3', color: '#16a34a', start: [36.8, 10.1] as [number, number], end: [32.8, 13.1] as [number, number], control: [35.0, 12.0] as [number, number] }, // Tunisia -> Libya
  { stage: 2, id: '10a4', color: '#16a34a', start: [32.8, 13.1] as [number, number], end: [31.2, 29.9] as [number, number], control: [33.0, 22.0] as [number, number] }, // Libya -> Egypt

  // Từ Ai Cập đi xuống bờ Đông Châu Phi (Biển Đỏ -> Ấn Độ Dương)
  { stage: 2, id: '2_11a', color: '#16a34a', start: [31.2, 29.9] as [number, number], end: [11.5, 43.1] as [number, number], control: [23.0, 39.0] as [number, number] }, // Egypt -> Djibouti
  { stage: 2, id: '2_11b', color: '#16a34a', start: [11.5, 43.1] as [number, number], end: [11.8, 51.5] as [number, number], control: [13.5, 47.0] as [number, number] }, // Djibouti -> Mũi Sừng Châu Phi
  { stage: 2, id: '2_11c', color: '#16a34a', start: [11.8, 51.5] as [number, number], end: [2.0, 45.3] as [number, number], control: [7.0, 49.5] as [number, number] }, // Mũi Sừng Châu Phi -> Somalia
  { stage: 2, id: '2_11d', color: '#16a34a', start: [2.0, 45.3] as [number, number], end: [-4.0, 39.6] as [number, number], control: [0.0, 44.0] as [number, number] }, // Somalia -> Kenya
  { stage: 2, id: '2_11e', color: '#16a34a', start: [-4.0, 39.6] as [number, number], end: [-6.8, 39.2] as [number, number], control: [-5.5, 41.0] as [number, number] }, // Kenya -> Tanzania
  { stage: 2, id: '2_11f', color: '#16a34a', start: [-6.8, 39.2] as [number, number], end: [-12.3, 49.3] as [number, number], control: [-8.0, 45.0] as [number, number] }, // Tanzania -> Bắc Madagascar
  { stage: 2, id: '12', color: '#16a34a', start: [-12.3, 49.3] as [number, number], end: [-21.1, 55.5] as [number, number], control: [-16.0, 54.0] as [number, number] }, // Bắc Madagascar -> Reunion

  // Vòng qua Nam Phi sang bờ Tây
  { stage: 2, id: '13', color: '#16a34a', start: [-21.1, 55.5] as [number, number], end: [-36.0, 18.0] as [number, number], control: [-38.0, 40.0] as [number, number] }, // Reunion -> Cape Town (vòng ngoài khơi xa)
  { stage: 2, id: '14', color: '#16a34a', start: [-36.0, 18.0] as [number, number], end: [-8.8, 13.2] as [number, number], control: [-20.0, 8.0] as [number, number] }, // Cape Town -> Angola (đẩy lùi ra Đại Tây Dương)

  // Đi ngược lên bờ Tây Châu Phi (đẩy cong ra ngoài biển để không lẹm đất liền)
  { stage: 2, id: '15a', color: '#16a34a', start: [-8.8, 13.2] as [number, number], end: [-5.8, 12.0] as [number, number], control: [-7.0, 9.0] as [number, number] }, // Angola -> Congo
  { stage: 2, id: '15b', color: '#16a34a', start: [-5.8, 12.0] as [number, number], end: [6.5, 3.4] as [number, number], control: [0.0, 6.0] as [number, number] }, // Congo -> Nigeria
  { stage: 2, id: '15c', color: '#16a34a', start: [6.5, 3.4] as [number, number], end: [5.6, -0.2] as [number, number], control: [4.0, 1.5] as [number, number] }, // Nigeria -> Ghana
  { stage: 2, id: '15d', color: '#16a34a', start: [5.6, -0.2] as [number, number], end: [5.3, -4.0] as [number, number], control: [3.0, -2.0] as [number, number] }, // Ghana -> Cote D'Ivoire
  { stage: 2, id: '15e', color: '#16a34a', start: [5.3, -4.0] as [number, number], end: [14.6, -17.4] as [number, number], control: [-2.0, -15.0] as [number, number] }, // Cote D'Ivoire -> Dakar

  // Đoạn cuối: Đến Morocco ("mongo"), qua Gibraltar, rồi cập bến Cảng Đông Nam (Marseille)
  { stage: 2, id: '16a', color: '#16a34a', start: [14.6, -17.4] as [number, number], end: [33.5, -7.5] as [number, number], control: [24.0, -22.0] as [number, number] }, // Dakar -> Morocco
  { stage: 2, id: '16b', color: '#16a34a', start: [33.5, -7.5] as [number, number], end: [36.0, -5.0] as [number, number], control: [35.0, -8.0] as [number, number] }, // Morocco -> Gibraltar
  { stage: 2, id: '16c', color: '#16a34a', start: [36.0, -5.0] as [number, number], end: [43.3, 5.4] as [number, number], control: [38.0, 0.0] as [number, number] }, // Gibraltar -> Marseille

  // Chặng 3: Pháp - Châu Mỹ - Anh (Dark Blue)
  { stage: 3, id: '17', color: '#1e3a8a', start: [43.3, 5.4] as [number, number], end: [49.5, 0.1] as [number, number], control: [46.0, 3.0] as [number, number] }, // Marseille -> Le Havre
  { stage: 3, id: '18', color: '#1e3a8a', start: [49.5, 0.1] as [number, number], end: [48.5, -6.5] as [number, number], control: [49.5, -3.0] as [number, number] }, // Le Havre -> Ngoài khơi Tây Pháp
  { stage: 3, id: '18b', color: '#1e3a8a', start: [48.5, -6.5] as [number, number], end: [14.6, -61.0] as [number, number], control: [30.0, -45.0] as [number, number] }, // Ngoài khơi Tây Pháp -> vùng Caribbean
  { stage: 3, id: '19', color: '#1e3a8a', start: [14.6, -61.0] as [number, number], end: [-7.0, -25.0] as [number, number], control: [5.0, -35.0] as [number, number] }, // Caribbean -> Ngoài khơi Brazil (vòng ngoài)
  { stage: 3, id: '19b', color: '#1e3a8a', start: [-7.0, -25.0] as [number, number], end: [-34.9, -56.1] as [number, number], control: [-25.0, -25.0] as [number, number] }, // Ngoài khơi Brazil -> Uruguay
  { stage: 3, id: '20', color: '#1e3a8a', start: [-34.6, -58.3] as [number, number], end: [-7.0, -30.0] as [number, number], control: [-25.0, -30.0] as [number, number] }, // Argentina -> Ngoài khơi Brazil (vòng trong)
  { stage: 3, id: '20b', color: '#1e3a8a', start: [-7.0, -30.0] as [number, number], end: [40.7, -74.0] as [number, number], control: [10.0, -40.0] as [number, number] }, // Ngoài khơi Brazil -> New York (chéo qua đường kia)
  { stage: 3, id: '21', color: '#1e3a8a', start: [40.7, -74.0] as [number, number], end: [49.5, -8.0] as [number, number], control: [45.0, -40.0] as [number, number] }, // New York -> Cửa ngõ eo biển Manche (đi vòng xuống Nam Ireland để né đất liền)
  { stage: 3, id: '21b', color: '#1e3a8a', start: [49.5, -8.0] as [number, number], end: [50.9, -1.4] as [number, number], control: [50.0, -4.0] as [number, number] }, // Cửa ngõ eo biển -> Anh (cảng bờ Nam)

  // Chặng 4: Pháp - Liên Xô (Pink/Magenta)
  { stage: 4, id: '22', color: '#db2777', start: [50.9, -1.4] as [number, number], end: [49.5, 0.1] as [number, number], control: [50.0, -0.5] as [number, number] }, // Anh -> Le Havre
  { stage: 4, id: '22_to_23', color: '#db2777', start: [49.5, 0.1] as [number, number], end: [48.8, 2.3] as [number, number], control: [49.0, 1.0] as [number, number] }, // Le Havre -> Paris
  { stage: 4, id: '23', color: '#db2777', start: [48.8, 2.3] as [number, number], end: [52.5, 13.4] as [number, number], control: [52.0, 6.0] as [number, number] }, // Paris -> Berlin
  { stage: 4, id: '23b', color: '#db2777', start: [52.5, 13.4] as [number, number], end: [53.5, 9.9] as [number, number], control: [53.5, 12.0] as [number, number] }, // Berlin -> Hamburg

  // Vòng ra Biển Bắc rồi vòng qua đỉnh Đan Mạch vào biển Baltic
  { stage: 4, id: '24', color: '#db2777', start: [53.5, 9.9] as [number, number], end: [56.5, 5.0] as [number, number], control: [54.5, 6.0] as [number, number] }, // Hamburg -> Biển Bắc (đi ra ngoài biển)
  { stage: 4, id: '24b', color: '#db2777', start: [56.5, 5.0] as [number, number], end: [58.5, 11.0] as [number, number], control: [58.5, 6.0] as [number, number] }, // Biển Bắc -> Ngoài khơi đỉnh Đan Mạch (vòng qua đỉnh)
  { stage: 4, id: '24c', color: '#db2777', start: [58.5, 11.0] as [number, number], end: [55.0, 14.0] as [number, number], control: [56.5, 12.0] as [number, number] }, // Ngoài khơi đỉnh Đan Mạch -> Nam Thụy Điển (xuyên qua eo biển Kattegat)
  { stage: 4, id: '24d', color: '#db2777', start: [55.0, 14.0] as [number, number], end: [57.5, 20.0] as [number, number], control: [55.5, 17.5] as [number, number] }, // Nam Thụy Điển -> Giữa biển Baltic (né phía dưới đảo Gotland)
  { stage: 4, id: '24e', color: '#db2777', start: [57.5, 20.0] as [number, number], end: [59.8, 24.5] as [number, number], control: [59.5, 20.0] as [number, number] }, // Giữa biển Baltic -> Cửa vịnh Phần Lan (vòng lên Bắc để né các đảo của Estonia)
  { stage: 4, id: '24f', color: '#db2777', start: [59.8, 24.5] as [number, number], end: [59.9, 30.3] as [number, number], control: [60.0, 27.5] as [number, number] }, // Cửa vịnh Phần Lan -> Petrograd
  { stage: 4, id: '24g', color: '#db2777', start: [59.9, 30.3] as [number, number], end: [55.7, 37.6] as [number, number], control: [58.0, 35.0] as [number, number] }, // Petrograd -> Moscow

  // Chặng 5: Liên Xô - Trung Quốc (Purple)
  { stage: 5, id: '25a', color: '#9333ea', start: [55.7, 37.6] as [number, number], end: [53.2, 50.1] as [number, number], control: [54.5, 43.8] as [number, number] }, // Moscow -> Samara (Đi thẳng xuống biên giới)
  { stage: 5, id: '25b', color: '#9333ea', start: [53.2, 50.1] as [number, number], end: [55.1, 61.4] as [number, number], control: [54.2, 55.7] as [number, number] }, // Samara -> Chelyabinsk (Vòng lên)
  { stage: 5, id: '25c1', color: '#9333ea', start: [55.1, 61.4] as [number, number], end: [56.1, 69.5] as [number, number], control: [55.6, 65.45] as [number, number] }, // Chelyabinsk -> Ishim (Vòng lên phía Bắc né biên giới)
  { stage: 5, id: '25c2', color: '#9333ea', start: [56.1, 69.5] as [number, number], end: [55.0, 73.4] as [number, number], control: [55.55, 71.45] as [number, number] }, // Ishim -> Omsk
  { stage: 5, id: '25e', color: '#9333ea', start: [55.0, 73.4] as [number, number], end: [55.0, 82.9] as [number, number], control: [55.2, 78.0] as [number, number] }, // Omsk -> Novosibirsk
  { stage: 5, id: '25f', color: '#9333ea', start: [55.0, 82.9] as [number, number], end: [52.3, 104.3] as [number, number], control: [57.0, 93.6] as [number, number] }, // Novosibirsk -> Irkutsk (Vòng lên phía Bắc né biên giới)
  { stage: 5, id: '25g1', color: '#9333ea', start: [52.3, 104.3] as [number, number], end: [51.5, 111.0] as [number, number], control: [51.9, 107.65] as [number, number] }, // Irkutsk -> Đoạn võng xuống
  { stage: 5, id: '25g2', color: '#9333ea', start: [51.5, 111.0] as [number, number], end: [55.0, 124.0] as [number, number], control: [54.5, 117.5] as [number, number] }, // Đoạn võng -> Đỉnh vòng cung
  { stage: 5, id: '25h', color: '#9333ea', start: [55.0, 124.0] as [number, number], end: [48.5, 135.1] as [number, number], control: [53.5, 130.0] as [number, number] }, // Đỉnh vòng cung -> Khabarovsk
  { stage: 5, id: '25i', color: '#9333ea', start: [48.5, 135.1] as [number, number], end: [43.1, 133.0] as [number, number], control: [46.0, 135.5] as [number, number] }, // Khabarovsk -> Vladivostok
  // Chặng 5: Đi tàu biển từ Vladivostok đến thẳng Quảng Châu
  { stage: 5, id: '26a', color: '#9333ea', start: [43.1, 133.0] as [number, number], end: [33.5, 129.0] as [number, number], control: [39.0, 134.0] as [number, number] }, // Vladivostok -> Tsushima
  { stage: 5, id: '26b', color: '#9333ea', start: [33.5, 129.0] as [number, number], end: [31.2, 121.4] as [number, number], control: [32.5, 124.5] as [number, number] }, // Tsushima -> Shanghai
  { stage: 5, id: '26c', color: '#9333ea', start: [31.2, 121.4] as [number, number], end: [24.4, 118.0] as [number, number], control: [28.0, 122.5] as [number, number] }, // Shanghai -> Xiamen
  { stage: 5, id: '26d', color: '#9333ea', start: [24.4, 118.0] as [number, number], end: [22.3, 114.1] as [number, number], control: [22.5, 116.5] as [number, number] }, // Xiamen -> Guangzhou

  { stage: 5, id: '27a', color: '#9333ea', start: [22.3, 114.1] as [number, number], end: [24.6, 118.5] as [number, number], control: [21.6, 117.75] as [number, number] }, // Guangzhou -> Xiamen
  { stage: 5, id: '27b', color: '#9333ea', start: [24.6, 118.5] as [number, number], end: [31.4, 121.9] as [number, number], control: [29.0, 126.0] as [number, number] }, // Xiamen -> Shanghai (Uốn cong ra xa bờ hơn để dễ nhìn)
  { stage: 5, id: '27c', color: '#9333ea', start: [31.4, 121.9] as [number, number], end: [33.7, 129.5] as [number, number], control: [32.7, 126.5] as [number, number] }, // Shanghai -> Tsushima
  { stage: 5, id: '27d', color: '#9333ea', start: [33.7, 129.5] as [number, number], end: [43.1, 133.0] as [number, number], control: [39.1, 135.75] as [number, number] }, // Tsushima -> Vladivostok
  { stage: 5, id: '28i', color: '#9333ea', start: [43.1, 133.0] as [number, number], end: [48.8, 135.1] as [number, number], control: [47.0, 135.5] as [number, number] }, // Vladivostok -> Khabarovsk
  { stage: 5, id: '28h', color: '#9333ea', start: [48.8, 135.1] as [number, number], end: [55.3, 124.0] as [number, number], control: [54.6, 130.0] as [number, number] }, // Khabarovsk -> Đỉnh vòng cung
  { stage: 5, id: '28g2', color: '#9333ea', start: [55.3, 124.0] as [number, number], end: [51.8, 111.0] as [number, number], control: [55.6, 117.5] as [number, number] }, // Đỉnh vòng cung -> Đoạn võng
  { stage: 5, id: '28g1', color: '#9333ea', start: [51.8, 111.0] as [number, number], end: [52.6, 104.3] as [number, number], control: [53.0, 107.65] as [number, number] }, // Đoạn võng -> Irkutsk
  { stage: 5, id: '28f', color: '#9333ea', start: [52.6, 104.3] as [number, number], end: [55.3, 82.9] as [number, number], control: [58.1, 93.6] as [number, number] }, // Irkutsk -> Novosibirsk (Vòng lên phía Bắc)
  { stage: 5, id: '28e', color: '#9333ea', start: [55.3, 82.9] as [number, number], end: [55.3, 73.4] as [number, number], control: [56.3, 78.0] as [number, number] }, // Novosibirsk -> Omsk
  { stage: 5, id: '28c1', color: '#9333ea', start: [55.3, 73.4] as [number, number], end: [56.4, 69.5] as [number, number], control: [56.65, 71.45] as [number, number] }, // Omsk -> Ishim (Vòng lên phía Bắc né biên giới)
  { stage: 5, id: '28c2', color: '#9333ea', start: [56.4, 69.5] as [number, number], end: [55.4, 61.4] as [number, number], control: [56.7, 65.45] as [number, number] }, // Ishim -> Chelyabinsk
  { stage: 5, id: '28b', color: '#9333ea', start: [55.4, 61.4] as [number, number], end: [53.5, 50.1] as [number, number], control: [55.3, 55.7] as [number, number] }, // Chelyabinsk -> Samara
  { stage: 5, id: '28a', color: '#9333ea', start: [53.5, 50.1] as [number, number], end: [55.7, 37.6] as [number, number], control: [55.45, 43.8] as [number, number] }, // Samara -> Moscow
  // Chặng 6: Hoạt động ở Châu Âu (Blue)
  { stage: 6, id: '6a', color: '#0ea5e9', start: [55.7, 37.6] as [number, number], end: [52.5, 13.4] as [number, number], control: [55.0, 25.0] as [number, number] }, // Moscow -> Berlin
  { stage: 6, id: '6b', color: '#0ea5e9', start: [52.5, 13.4] as [number, number], end: [48.8, 2.3] as [number, number], control: [50.0, 7.0] as [number, number] }, // Berlin -> Paris
  { stage: 6, id: '6c', color: '#0ea5e9', start: [48.8, 2.3] as [number, number], end: [50.8, 4.3] as [number, number], control: [50.0, 2.5] as [number, number] }, // Paris -> Brussels
  { stage: 6, id: '6d', color: '#0ea5e9', start: [50.8, 4.3] as [number, number], end: [52.5, 13.4] as [number, number], control: [52.0, 8.0] as [number, number] }, // Brussels -> Berlin
  { stage: 6, id: '6e', color: '#0ea5e9', start: [52.5, 13.4] as [number, number], end: [46.9, 7.4] as [number, number], control: [50.0, 11.0] as [number, number] }, // Berlin -> Switzerland
  { stage: 6, id: '6f', color: '#0ea5e9', start: [46.9, 7.4] as [number, number], end: [40.8, 14.3] as [number, number], control: [44.0, 10.0] as [number, number] }, // Switzerland -> Napoli
  { stage: 6, id: '6g', color: '#0ea5e9', start: [40.8, 14.3] as [number, number], end: [31.4, 30.1] as [number, number], control: [35.0, 24.0] as [number, number] }, // Napoli -> Port Said
  { stage: 6, id: '6h', color: '#0ea5e9', start: [31.4, 30.1] as [number, number], end: [11.3, 43.3] as [number, number], control: [21.5, 37.5] as [number, number] }, // Port Said -> Djibouti
  { stage: 6, id: '6i', color: '#0ea5e9', start: [11.3, 43.3] as [number, number], end: [5.7, 80.7] as [number, number], control: [14.0, 60.0] as [number, number] }, // Djibouti -> Sri Lanka (vòng qua Mũi Sừng Châu Phi)
  { stage: 6, id: '6j', color: '#0ea5e9', start: [5.7, 80.7] as [number, number], end: [1.15, 104.01] as [number, number], control: [7.0, 95.0] as [number, number] }, // Sri Lanka -> Singapore (vòng qua eo biển Malacca)
  { stage: 6, id: '6k', color: '#0ea5e9', start: [1.15, 104.01] as [number, number], end: [13.7, 100.5] as [number, number], control: [7.0, 105.0] as [number, number] }, // Singapore -> Bangkok

  // Chặng 7: Hoạt động ở Châu Á (Dark Green) - Lộ trình đơn giản hóa
  { stage: 7, id: '7a', color: '#15803d', start: [13.7, 100.5] as [number, number], end: [1.35, 103.8] as [number, number], control: [7.0, 102.5] as [number, number] }, // Bangkok -> Singapore
  { stage: 7, id: '7b', color: '#15803d', start: [1.35, 104.2] as [number, number], end: [31.2, 121.4] as [number, number], control: [16.0, 118.0] as [number, number] }, // Singapore -> Shanghai
  { stage: 7, id: '7c', color: '#15803d', start: [31.0, 121.6] as [number, number], end: [22.5, 114.5] as [number, number], control: [25.0, 132.0] as [number, number] }, // Shanghai -> Hong Kong (Vòng rộng ngoài khơi)
  { stage: 7, id: '7d', color: '#15803d', start: [21.9, 113.9] as [number, number], end: [1.15, 103.6] as [number, number], control: [12.0, 110.0] as [number, number] }, // Hong Kong -> Singapore
  { stage: 7, id: '7e', color: '#15803d', start: [1.15, 104.0] as [number, number], end: [22.1, 114.5] as [number, number], control: [12.0, 113.0] as [number, number] }, // Singapore -> Hong Kong
  // Chặng 8: Thượng Hải - Moskva (Black - vẽ song song với chặng 5 về)
  { stage: 8, id: '8_pre1', color: '#000000', start: [22.1, 114.5] as [number, number], end: [23.1, 113.2] as [number, number], control: [22.5, 113.5] as [number, number] }, // Hong Kong -> Guangzhou
  { stage: 8, id: '8_pre2', color: '#000000', start: [23.1, 113.2] as [number, number], end: [31.4, 121.9] as [number, number], control: [27.0, 119.0] as [number, number] }, // Guangzhou -> Shanghai
  { stage: 8, id: '8a', color: '#000000', start: [31.4, 121.9] as [number, number], end: [33.7, 129.5] as [number, number], control: [31.5, 127.5] as [number, number] }, // Shanghai -> Tsushima
  { stage: 8, id: '8b', color: '#000000', start: [33.7, 129.5] as [number, number], end: [43.1, 133.0] as [number, number], control: [40.5, 137.5] as [number, number] }, // Tsushima -> Vladivostok
  { stage: 8, id: '8c', color: '#000000', start: [43.1, 133.0] as [number, number], end: [48.8, 135.1] as [number, number], control: [46.5, 137.0] as [number, number] }, // Vladivostok -> Khabarovsk
  { stage: 8, id: '8d', color: '#000000', start: [48.8, 135.1] as [number, number], end: [55.3, 124.0] as [number, number], control: [53.0, 131.0] as [number, number] }, // Khabarovsk -> Đỉnh vòng cung
  { stage: 8, id: '8e', color: '#000000', start: [55.3, 124.0] as [number, number], end: [51.8, 111.0] as [number, number], control: [54.0, 117.5] as [number, number] }, // Đỉnh vòng cung -> Đoạn võng
  { stage: 8, id: '8f', color: '#000000', start: [51.8, 111.0] as [number, number], end: [52.6, 104.3] as [number, number], control: [51.5, 107.65] as [number, number] }, // Đoạn võng -> Irkutsk
  { stage: 8, id: '8g', color: '#000000', start: [52.6, 104.3] as [number, number], end: [55.3, 82.9] as [number, number], control: [59.5, 93.6] as [number, number] }, // Irkutsk -> Novosibirsk
  { stage: 8, id: '8h', color: '#000000', start: [55.3, 82.9] as [number, number], end: [55.3, 73.4] as [number, number], control: [57.5, 78.0] as [number, number] }, // Novosibirsk -> Omsk
  { stage: 8, id: '8i', color: '#000000', start: [55.3, 73.4] as [number, number], end: [56.4, 69.5] as [number, number], control: [57.8, 71.45] as [number, number] }, // Omsk -> Ishim
  { stage: 8, id: '8j', color: '#000000', start: [56.4, 69.5] as [number, number], end: [55.4, 61.4] as [number, number], control: [58.0, 65.45] as [number, number] }, // Ishim -> Chelyabinsk
  { stage: 8, id: '8k', color: '#000000', start: [55.4, 61.4] as [number, number], end: [53.5, 50.1] as [number, number], control: [56.5, 55.7] as [number, number] }, // Chelyabinsk -> Samara
  { stage: 8, id: '8l', color: '#000000', start: [53.5, 50.1] as [number, number], end: [55.7, 37.6] as [number, number], control: [56.5, 43.8] as [number, number] }, // Samara -> Moscow

  // Chặng 9: Hành trình về nước qua ngả Tân Cương (Red)
  { stage: 9, id: '9a', color: '#dc2626', start: [55.7, 37.6] as [number, number], end: [56.3, 44.0] as [number, number], control: [56.5, 40.8] as [number, number] }, // Moscow -> Nizhniy Novgorod
  { stage: 9, id: '9b', color: '#dc2626', start: [56.3, 44.0] as [number, number], end: [55.8, 49.1] as [number, number], control: [56.5, 46.5] as [number, number] }, // Nizhniy Novgorod -> Kazan
  { stage: 9, id: '9c', color: '#dc2626', start: [55.8, 49.1] as [number, number], end: [56.8, 60.6] as [number, number], control: [57.0, 54.8] as [number, number] }, // Kazan -> Yekaterinburg
  { stage: 9, id: '9d', color: '#dc2626', start: [56.8, 60.6] as [number, number], end: [55.0, 73.3] as [number, number], control: [56.5, 67.0] as [number, number] }, // Yekaterinburg -> Omsk
  { stage: 9, id: '9e', color: '#dc2626', start: [55.0, 73.3] as [number, number], end: [43.8, 87.6] as [number, number], control: [49.4, 80.4] as [number, number] }, // Omsk -> Urumqi
  { stage: 9, id: '9f', color: '#dc2626', start: [43.8, 87.6] as [number, number], end: [36.1, 103.8] as [number, number], control: [40.0, 95.7] as [number, number] }, // Urumqi -> Lanzhou
  { stage: 9, id: '9g', color: '#dc2626', start: [36.1, 103.8] as [number, number], end: [34.3, 108.9] as [number, number], control: [35.2, 106.3] as [number, number] }, // Lanzhou -> Xi'an

  { stage: 9, id: '10a', color: '#dc2626', start: [34.3, 108.9] as [number, number], end: [37.8, 112.5] as [number, number], control: [36.0, 110.7] as [number, number] }, // Xi'an -> Taiyuan
  { stage: 9, id: '10b', color: '#dc2626', start: [37.8, 112.5] as [number, number], end: [25.2, 110.2] as [number, number], control: [31.5, 111.3] as [number, number] }, // Taiyuan -> Guilin

  // Chặng 10: Trở về Tổ quốc (Yellow)
  { stage: 10, id: '11a', color: '#eab308', start: [25.2, 110.2] as [number, number], end: [23.1, 106.4] as [number, number], control: [24.5, 108.0] as [number, number] }, // Quế Lâm -> Quảng Tây (Tĩnh Tây)
  { stage: 10, id: '11b', color: '#eab308', start: [23.1, 106.4] as [number, number], end: [22.98, 106.05] as [number, number], control: [23.05, 106.2] as [number, number], hideArrow: true }, // Quảng Tây -> Pác Bó
];

const createCustomIcon = () => {
  return L.divIcon({
    className: 'custom-marker',
    html: `<div class="marker-pulse"></div>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10]
  });
};

const createArrowIcon = (angle: number, color: string, isMobile: boolean = false) => {
  const size = isMobile ? 12 : 16; // Tăng size lên một chút xíu để dễ nhìn trên mobile, vì đường đứt nét đã dày 2.5px
  const anchor = size / 2;
  return L.divIcon({
    className: 'custom-arrow-icon',
    html: `<svg width="${size}" height="${size}" viewBox="-12 -12 24 24" style="transform: rotate(${angle}deg); transform-origin: 50% 50%; filter: drop-shadow(0 2px 2px rgba(0,0,0,0.5)); display: block;">
            <path fill="${color}" d="M 8 0 L -10 -8 L -10 8 Z"/>
           </svg>`,
    iconSize: [size, size],
    iconAnchor: [anchor, anchor]
  });
};

const routeLegend = [
  { id: 1, prefix: "1.1 - 1.6", label: "Chặng 1: Cảng Sài Gòn - Le Havre", color: "#ea580c" },
  { id: 2, prefix: "2.1 - 2.20", label: "Chặng 2: Vòng quanh châu Phi", color: "#16a34a" },
  { id: 3, prefix: "3.1 - 3.8", label: "Chặng 3: Pháp - Châu Mỹ - Anh", color: "#1e3a8a" },
  { id: 4, prefix: "4.1 - 4.4", label: "Chặng 4: Pháp - Liên Xô", color: "#db2777" },
  { id: 5, prefix: "5.1 - 5.7", label: "Chặng 5: Moskva - Quảng Châu", color: "#9333ea" },
  { id: 6, prefix: "6.1 - 6.7", label: "Chặng 6: Moskva - Xiêm", color: "#0ea5e9" },
  { id: 7, prefix: "7.1 - 7.14", label: "Chặng 7: Hong Kong - Thượng Hải", color: "#15803d" },
  { id: 8, prefix: "8.1 - 8.3", label: "Chặng 8: Thượng Hải - Moskva", color: "#000000" },
  { id: 9, prefix: "9.1 - 9.4", label: "Chặng 9: Moskva - Quế Lâm", color: "#dc2626" },
  { id: 10, prefix: "10.1 - 10.8", label: "Chặng 10: Quế Lâm - Pác Bó", color: "#eab308" },
];

const stageStartIndices = [
  0,
  historicalRoutes.findIndex(r => r.id === '7'),
  historicalRoutes.findIndex(r => r.id === '18'),
  historicalRoutes.findIndex(r => r.id === '22_to_23'),
  historicalRoutes.findIndex(r => r.id === '25a'),
  historicalRoutes.findIndex(r => r.id === '6a'),
  historicalRoutes.findIndex(r => r.id === '7a'),
  historicalRoutes.findIndex(r => r.id === '8a'),
  historicalRoutes.findIndex(r => r.id === '9a'),
  historicalRoutes.findIndex(r => r.id === '11a'),
];

// Automatically adjust map zoom and center to perfectly fit the required coordinates
function MapFitter() {
  const map = useMap();
  useEffect(() => {
    let isFitted = false;
    const container = map.getContainer();

    const fit = () => {
      if (container.clientWidth > 0 && container.clientHeight > 0) {
        map.invalidateSize();
        let currentLeft = -85;
        let currentRight = 145;

        if (container.clientWidth > 400) {
          const extraPx = container.clientWidth - 400;
          const degreesPerPx = 230 / 400;
          // Nội suy mở rộng dần dần sang trái (thấy Mỹ) và phải (thấy Nhật Bản)
          const extraLngLeft = extraPx * degreesPerPx * 0.7;
          const extraLngRight = extraPx * degreesPerPx * 0.3;

          currentLeft = Math.max(-130, -85 - extraLngLeft);
          currentRight = Math.min(160, 145 + extraLngRight);
        }

        const currentBounds = L.latLngBounds([-40, currentLeft], [65, currentRight]);
        map.fitBounds(currentBounds, { padding: [0, 0], maxZoom: 2.5, animate: false });
        isFitted = true;
      }
    };

    fit();

    let interval: any;
    if (!isFitted) {
      interval = setInterval(() => {
        if (!isFitted) fit();
        else clearInterval(interval);
      }, 100);
    }

    const onResize = () => {
      setTimeout(() => {
        if (container.clientWidth > 0 && container.clientHeight > 0) {
          map.invalidateSize();
          let currentLeft = -85;
          let currentRight = 145;

          if (container.clientWidth > 400) {
            const extraPx = container.clientWidth - 400;
            const degreesPerPx = 230 / 400;
            const extraLngLeft = extraPx * degreesPerPx * 0.7;
            const extraLngRight = extraPx * degreesPerPx * 0.3;

            currentLeft = Math.max(-130, -85 - extraLngLeft);
            currentRight = Math.min(160, 145 + extraLngRight);
          }

          const currentBounds = L.latLngBounds([-40, currentLeft], [65, currentRight]);
          map.fitBounds(currentBounds, { padding: [0, 0], maxZoom: 2.5, animate: false });
        }
      }, 100);
    };

    window.addEventListener('resize', onResize);
    return () => {
      if (interval) clearInterval(interval);
      window.removeEventListener('resize', onResize);
    };
  }, [map]);
  return null;
}

export default function MapComponent() {
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [selectedLoc, setSelectedLoc] = useState<typeof journeyLocations[0] | null>(null);
  const [geoData, setGeoData] = useState<any>(null);
  const [routeProgress, setRouteProgress] = useState<number>(historicalRoutes.length);
  const [isExploreActive, setIsExploreActive] = useState<boolean>(false);
  const animationRef = useRef<number | null>(null);
  const africaGeoJsonRef = useRef<any>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const isCanceledRef = useRef<boolean>(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        isCanceledRef.current = true;
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current = null;
        }
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
        setRouteProgress(historicalRoutes.length); // Stop animation and show full map
        setIsExploreActive(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const startExploreAnimation = async () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    
    setSelectedLoc(null); // Ensure popup is hidden during animation
    setRouteProgress(-1);
    setIsExploreActive(true);
    isCanceledRef.current = false;

    // Phát nhạc mở đầu
    const modau = new Audio('/voice/mo_dau.wav');
    audioRef.current = modau;
    
    await new Promise<void>(resolve => {
      modau.onended = () => resolve();
      modau.onerror = () => resolve(); // Bỏ qua nếu lỗi
      modau.play().catch(() => resolve());
    });

    if (isCanceledRef.current) return;

    let currentRouteIndex = 0;

    // Chạy qua 10 chặng
    for (let stage = 1; stage <= 10; stage++) {
      if (isCanceledRef.current) break;

      const stageRoutes = historicalRoutes.filter(r => (r as any).stage === stage);
      if (stageRoutes.length === 0) continue;

      const audio = new Audio(`/voice/chang_${stage}.wav`);
      audioRef.current = audio;

      // Get duration
      const durationMs = await new Promise<number>(resolve => {
        if (audio.readyState >= 1) {
          resolve(audio.duration * 1000);
        } else {
          audio.onloadedmetadata = () => resolve(audio.duration * 1000);
          audio.onerror = () => resolve(stageRoutes.length * 500); // Mặc định 0.5s mỗi route nếu lỗi
        }
      });

      if (isCanceledRef.current) break;
      
      audio.play().catch(e => console.error(e));

      // Animate the routes of this stage over the duration of the audio!
      const startIdx = currentRouteIndex;
      const endIdx = startIdx + stageRoutes.length;

      await new Promise<void>(resolve => {
        let startTime: number | null = null;
        
        const animate = (time: number) => {
          if (isCanceledRef.current) {
            resolve();
            return;
          }
          if (startTime === null) startTime = time;
          let elapsed = time - startTime;
          let progress = elapsed / durationMs;
          
          if (progress >= 1) {
            setRouteProgress(endIdx);
            resolve();
          } else {
            setRouteProgress(startIdx + progress * stageRoutes.length);
            animationRef.current = requestAnimationFrame(animate);
          }
        };
        animationRef.current = requestAnimationFrame(animate);
      });

      currentRouteIndex = endIdx;
      
      // Wait for audio to actually end if the animation somehow finished slightly earlier
      if (audioRef.current === audio && !audio.paused && !audio.ended && !isCanceledRef.current) {
        await new Promise<void>(resolve => {
          audio.onended = () => resolve();
          audio.onerror = () => resolve();
        });
      }
    }

    if (isCanceledRef.current) return;

    // Đặt routeProgress full để Tiêu đề hiện ra ngay khi bắt đầu phát lời kết thúc
    setRouteProgress(historicalRoutes.length);

    // Phát nhạc kết thúc
    const ketthuc = new Audio('/voice/ket_thuc.wav');
    audioRef.current = ketthuc;
    await new Promise<void>(resolve => {
      ketthuc.onended = () => resolve();
      ketthuc.onerror = () => resolve();
      ketthuc.play().catch(() => resolve());
    });
    setIsExploreActive(false);
  };

  useEffect(() => {
    setMounted(true);
    setIsMobile(window.innerWidth <= 768);
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);

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

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedLoc(null);
      }
    };
    if (selectedLoc) {
      window.addEventListener('keydown', handleKeyDown);
    }

    // Highlight Africa ONLY when it's clicked/selected
    const africaPane = document.querySelector('.africa-pane') as HTMLElement;
    if (africaPane) {
      if (selectedLoc?.id === 99) {
        africaPane.style.filter = 'drop-shadow(0 0 8px #fbbf24) drop-shadow(0 0 12px #fbbf24)';
        africaPane.style.transition = 'filter 0.3s ease';
        africaPane.style.zIndex = '600';
      } else {
        africaPane.style.filter = '';
        africaPane.style.zIndex = '210';
      }
    }

    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedLoc]);

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
    { id: 'VN', name: "VIETNAM", coords: [15.5, 107.5] as [number, number], width: 40, tracking: '1px', transform: isMobile ? 'scale(0.25)' : 'scale(0.4)' },
    { id: 'FR', name: "FRANCE", coords: [46.5, 2.5] as [number, number], width: 60, tracking: '2px', transform: isMobile ? 'scale(0.25)' : 'scale(0.4)' },
    { id: 'UK', name: "U.K.", coords: [54.0, -2.5] as [number, number], width: 40, tracking: '1px', transform: isMobile ? 'scale(0.25)' : 'scale(0.4)' },
    { id: 'RU', name: "RUSSIA", coords: [56.0, 95.0] as [number, number], width: 250, tracking: '16px', transform: isMobile ? 'scale(0.5)' : 'scale(0.9)' },
    { id: 'CN', name: "CHINA", coords: [36.0, 104.0] as [number, number], width: 120, tracking: '8px', transform: isMobile ? 'scale(0.4)' : 'scale(0.7)' },
    { id: 'TH', name: "THAILAND", coords: [12.5, 101.0] as [number, number], width: 60, tracking: '1px', transform: isMobile ? 'scale(0.2)' : 'scale(0.35)' },
    { id: 'US', name: "USA", coords: [38.0, -97.0] as [number, number], width: 100, tracking: '6px', transform: isMobile ? 'scale(0.4)' : 'scale(0.7)' },
    { id: 'AF', name: "AFRICA", coords: [8.0, 20.0] as [number, number], width: 200, tracking: '15px', transform: isMobile ? 'scale(0.5)' : 'scale(0.8)' }
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
      "Vietnam": "#ef4444", // Red
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
      // Single dark distinct wood tone for all of Africa (Vietnam's old color)
      return {
        fillColor: '#8b5a2b',
        weight: 1,
        color: 'rgba(0,0,0,0.6)', // Standard black border
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

  const onEachFeature = (feature: any, layer: any) => {
    layer.on({
      mouseover: (e: any) => {
        const name = feature?.properties?.name;
        if (africanCountries.includes(name)) {
          const pane = document.querySelector('.africa-pane') as HTMLElement;
          if (pane) {
            pane.classList.add('africa-pane-hover');
          }
        } else {
          // Let CSS handle hover effects for non-African countries
        }
      },
      mouseout: (e: any) => {
        const name = feature?.properties?.name;
        if (africanCountries.includes(name)) {
          const pane = document.querySelector('.africa-pane') as HTMLElement;
          if (pane) {
            pane.classList.remove('africa-pane-hover');
          }
        } else {
          // CSS hover naturally reverts when mouse leaves
        }
      },
      click: () => {
        handleCountryClick(feature);
      },
      add: () => {
        const el = (layer as any).getElement?.() || (layer as any)._path;
        if (el) {
          el.setAttribute('tabindex', '0');
          el.setAttribute('role', 'button');
          el.setAttribute('aria-label', feature?.properties?.name || 'Country');

          el.addEventListener('keydown', (e: KeyboardEvent) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleCountryClick(feature);
            }
          });
        }
      }
    });
  };

  const isTitleHidden = routeProgress < historicalRoutes.length;
  const isButtonHidden = isExploreActive || routeProgress < historicalRoutes.length;

  return (
    <div className="map-frame-wrapper">
      <div
        className="app-header"
        style={{
          opacity: isTitleHidden ? 0 : 1,
          transition: 'opacity 0.5s ease-in-out',
          pointerEvents: isTitleHidden ? 'none' : 'auto'
        }}
      >
        <h1 className="app-title">Hành trình Cứu nước</h1>
        <p className="app-subtitle">Hồ Chí Minh (1911 – 1941)</p>
      </div>

      <MapContainer
        center={[20, 20]}
        zoom={2.5}
        zoomSnap={0.05}
        zoomControl={false}
        dragging={false}
        scrollWheelZoom={false}
        doubleClickZoom={false}
        touchZoom={false}
        boxZoom={false}
        keyboard={false}
        attributionControl={false}
        style={{ height: '100%', width: '100%' }}
      >
        <MapFitter />
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
            <Pane name="africaPane" style={{ zIndex: 210 }} className="africa-pane">
              {/* Solid underlay to close anti-aliasing gaps and prevent drop-shadow bleed */}
              <GeoJSON
                key="africa-underlay"
                data={{ type: 'FeatureCollection', features: geoData.features.filter((f: any) => africanCountries.includes(f.properties.name)) } as any}
                style={() => ({
                  fillColor: '#8b5a2b',
                  color: '#8b5a2b',
                  weight: 3,
                  fillOpacity: 1,
                  className: 'africa-continent',
                  interactive: false // Don't intercept clicks
                })}
              />
              {/* Interactive layer with black borders */}
              <GeoJSON
                key="africa-interactive"
                data={{ type: 'FeatureCollection', features: geoData.features.filter((f: any) => africanCountries.includes(f.properties.name)) } as any}
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
          {(() => {
            const stage8StartIndex = historicalRoutes.findIndex(r => r.id === '8a');
            return historicalRoutes.map((route, index) => {
              if (routeProgress <= index) return null;

              const routeLocalProgress = Math.min(1, routeProgress - index);
              const curvePoints = getBezierCurve(route.start, route.end, route.control);

              const numPoints = curvePoints.length;
              const visibleCount = Math.max(2, Math.floor(numPoints * routeLocalProgress));
              const visiblePoints = curvePoints.slice(0, visibleCount);

              const isAnimating = routeLocalProgress < 1;

              let arrowPos;
              let currentAngle;

              if (isAnimating) {
                arrowPos = visiblePoints[visiblePoints.length - 1];
                if (visiblePoints.length >= 2) {
                  const p1 = visiblePoints[visiblePoints.length - 2];
                  const p2 = visiblePoints[visiblePoints.length - 1];
                  currentAngle = Math.atan2(p1[0] - p2[0], p2[1] - p1[1]) * (180 / Math.PI);
                } else {
                  currentAngle = 0;
                }
              } else {
                const midIndex = Math.floor(curvePoints.length / 2);
                arrowPos = curvePoints[midIndex];
                currentAngle = Math.atan2(route.start[0] - route.end[0], route.end[1] - route.start[1]) * (180 / Math.PI);
              }

              return (
                <React.Fragment key={`route-${route.id}`}>
                  {/* The Path */}
                  <AnimatedPolyline
                    positions={visiblePoints}
                    pathOptions={{
                      color: route.color,
                      weight: 2.5,
                      dashArray: '8, 8',
                      opacity: 0.8
                    }}
                  />
                  {!(route as any).hideArrow && (
                    <Marker
                      position={arrowPos}
                      icon={createArrowIcon(currentAngle, route.color, isMobile)}
                      interactive={false}
                    />
                  )}
                </React.Fragment>
              );
            });
          })()}
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

      {/* Small Map Legend Overlay (Bottom Right) */}
      <div
        style={{
          position: 'absolute',
          bottom: isMobile ? '15px' : '30px',
          left: isMobile ? '15px' : '30px',
          zIndex: 9999,
          pointerEvents: 'none',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          gap: isMobile ? '4px' : '7px',
          fontFamily: "'Montserrat', sans-serif"
        }}
      >
        {routeLegend.map((item, index) => {
          const isVisible = routeProgress >= stageStartIndices[index];
          return (
            <div
              key={item.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateX(0)' : 'translateX(20px)',
                transition: 'all 0.5s ease-out'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: isMobile ? '20px' : '30px' }}>
                <div style={{ width: '100%', height: isMobile ? '2px' : '3px', backgroundColor: item.color, borderRadius: '1.5px', boxShadow: '0 1px 3px rgba(0,0,0,0.6)' }}></div>
              </div>
              <span style={{ fontSize: isMobile ? '8.5px' : '11px', fontWeight: 700, color: '#f8fafc', textShadow: '1px 1px 2px rgba(0,0,0,0.9), -1px -1px 2px rgba(0,0,0,0.9), 1px -1px 2px rgba(0,0,0,0.9), -1px 1px 2px rgba(0,0,0,0.9), 0px 2px 4px rgba(0,0,0,0.8)', letterSpacing: '0.2px', whiteSpace: 'nowrap' }}>
                {item.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Tiny Start Button */}
      <div
        style={{
          position: 'fixed',
          bottom: isMobile ? '15px' : '40px',
          left: isMobile ? 'auto' : '50%',
          right: isMobile ? '15px' : 'auto',
          transform: isMobile ? 'none' : 'translateX(-50%)',
          zIndex: 9999,
          opacity: isButtonHidden ? 0 : 1,
          transition: 'opacity 0.5s ease-in-out',
          pointerEvents: isButtonHidden ? 'none' : 'auto'
        }}
      >
        <button
          onClick={startExploreAnimation}
          style={{
            backgroundColor: '#1c2331',
            color: '#d4af37',
            padding: isMobile ? '6px 14px' : '8px 20px',
            borderRadius: '9999px',
            fontFamily: "'Montserrat', sans-serif",
            fontWeight: 700,
            fontSize: isMobile ? '11px' : '13px',
            textTransform: 'uppercase',
            letterSpacing: '1.5px',
            border: '1.5px solid #d4af37',
            boxShadow: '1px 2px 6px rgba(0,0,0,0.5)',
            cursor: 'pointer',
            transition: 'all 0.2s ease-in-out',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#262f40'; e.currentTarget.style.transform = 'scale(1.05)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#1c2331'; e.currentTarget.style.transform = 'scale(1)'; }}
          onMouseDown={(e) => { e.currentTarget.style.transform = 'scale(0.95)'; }}
          onMouseUp={(e) => { e.currentTarget.style.transform = 'scale(1.05)'; }}
        >
          Khám phá
        </button>
      </div>

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
