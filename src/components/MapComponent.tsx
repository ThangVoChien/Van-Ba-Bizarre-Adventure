"use client";

import React, { useEffect, useState, useRef } from 'react';
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
  // Chặng 1: Cảng Sài Gòn - Le Havre (Orange/Red)
  { id: '1', color: '#ea580c', start: [10.82, 106.63] as [number, number], end: [1.35, 103.81] as [number, number], control: [5.0, 108.0] as [number, number] }, // Sài Gòn -> Singapore
  { id: '2', color: '#ea580c', start: [1.35, 103.81] as [number, number], end: [5.9, 80.5] as [number, number], control: [8.0, 95.0] as [number, number] }, // Singapore -> Colombo
  { id: '3', color: '#ea580c', start: [5.9, 80.5] as [number, number], end: [11.5, 43.1] as [number, number], control: [15.0, 60.0] as [number, number] }, // Colombo -> Djibouti
  { id: '4', color: '#ea580c', start: [11.5, 43.1] as [number, number], end: [31.2, 29.9] as [number, number], control: [22.0, 38.0] as [number, number] },
  { id: '5', color: '#ea580c', start: [31.2, 29.9] as [number, number], end: [43.3, 5.4] as [number, number], control: [36.0, 20.0] as [number, number] }, // Port Said -> Marseille

  // Hành trình đi biển vòng quanh TBN sang Bắc Pháp (Chặng 1)
  { id: '6', color: '#ea580c', start: [43.3, 5.4] as [number, number], end: [36.0, -6.0] as [number, number], control: [38.0, 3.0] as [number, number] }, // Marseille -> Gibraltar
  { id: '6b', color: '#ea580c', start: [36.0, -6.0] as [number, number], end: [43.0, -10.0] as [number, number], control: [39.0, -12.0] as [number, number] }, // Gibraltar -> Mũi Tây Ban Nha (Outer)
  { id: '6c', color: '#ea580c', start: [43.0, -10.0] as [number, number], end: [48.5, -6.0] as [number, number], control: [46.0, -10.0] as [number, number] }, // Tây Ban Nha -> Mũi Tây Pháp (Outer)
  { id: '6d', color: '#ea580c', start: [48.5, -6.0] as [number, number], end: [49.5, 0.1] as [number, number], control: [50.5, -3.0] as [number, number] }, // Mũi Tây Pháp -> Le Havre (Outer)

  // Chặng 2: Đi quanh châu Phi (Green) - Chiều KIM ĐỒNG HỒ
  // Bắt đầu từ Cảng Tây Bắc (Le Havre) vòng qua Tây Ban Nha vào Địa Trung Hải
  { id: '7', color: '#16a34a', start: [49.5, 0.1] as [number, number], end: [48.5, -5.0] as [number, number], control: [49.5, -2.0] as [number, number] }, // Le Havre -> Mũi Tây Pháp
  { id: '8', color: '#16a34a', start: [48.5, -5.0] as [number, number], end: [43.0, -9.0] as [number, number], control: [45.5, -8.0] as [number, number] }, // Mũi Tây Pháp -> Mũi TBN
  { id: '9', color: '#16a34a', start: [43.0, -9.0] as [number, number], end: [36.0, -5.0] as [number, number], control: [39.5, -9.5] as [number, number] }, // Mũi TBN -> Gibraltar

  // Ghé Algeria ("Angela") và đi dọc Bắc Phi tới Ai Cập
  { id: '10', color: '#16a34a', start: [36.0, -5.0] as [number, number], end: [36.7, 3.2] as [number, number], control: [36.0, -1.0] as [number, number] }, // Gibraltar -> Algeria
  { id: '10a2', color: '#16a34a', start: [36.7, 3.2] as [number, number], end: [36.8, 10.1] as [number, number], control: [37.0, 6.0] as [number, number] }, // Algeria -> Tunisia
  { id: '10a3', color: '#16a34a', start: [36.8, 10.1] as [number, number], end: [32.8, 13.1] as [number, number], control: [35.0, 12.0] as [number, number] }, // Tunisia -> Libya
  { id: '10a4', color: '#16a34a', start: [32.8, 13.1] as [number, number], end: [31.2, 29.9] as [number, number], control: [33.0, 22.0] as [number, number] }, // Libya -> Egypt

  // Từ Ai Cập đi xuống bờ Đông Châu Phi (Biển Đỏ -> Ấn Độ Dương)
  { id: '11', color: '#16a34a', start: [31.2, 29.9] as [number, number], end: [11.5, 43.1] as [number, number], control: [23.0, 39.0] as [number, number] }, // Egypt -> Djibouti
  { id: '11b', color: '#16a34a', start: [11.5, 43.1] as [number, number], end: [11.8, 51.5] as [number, number], control: [13.5, 47.0] as [number, number] }, // Djibouti -> Mũi Sừng Châu Phi
  { id: '11c', color: '#16a34a', start: [11.8, 51.5] as [number, number], end: [2.0, 45.3] as [number, number], control: [7.0, 49.5] as [number, number] }, // Mũi Sừng Châu Phi -> Somalia
  { id: '11d', color: '#16a34a', start: [2.0, 45.3] as [number, number], end: [-4.0, 39.6] as [number, number], control: [0.0, 44.0] as [number, number] }, // Somalia -> Kenya
  { id: '11e', color: '#16a34a', start: [-4.0, 39.6] as [number, number], end: [-6.8, 39.2] as [number, number], control: [-5.5, 41.0] as [number, number] }, // Kenya -> Tanzania
  { id: '11f', color: '#16a34a', start: [-6.8, 39.2] as [number, number], end: [-12.3, 49.3] as [number, number], control: [-8.0, 45.0] as [number, number] }, // Tanzania -> Bắc Madagascar
  { id: '12', color: '#16a34a', start: [-12.3, 49.3] as [number, number], end: [-21.1, 55.5] as [number, number], control: [-16.0, 54.0] as [number, number] }, // Bắc Madagascar -> Reunion

  // Vòng qua Nam Phi sang bờ Tây
  { id: '13', color: '#16a34a', start: [-21.1, 55.5] as [number, number], end: [-33.9, 18.4] as [number, number], control: [-35.0, 40.0] as [number, number] }, // Reunion -> Cape Town
  { id: '14', color: '#16a34a', start: [-33.9, 18.4] as [number, number], end: [-8.8, 13.2] as [number, number], control: [-20.0, 10.0] as [number, number] }, // Cape Town -> Angola

  // Đi ngược lên bờ Tây Châu Phi (đẩy cong ra ngoài biển để không lẹm đất liền)
  { id: '15a', color: '#16a34a', start: [-8.8, 13.2] as [number, number], end: [-5.8, 12.0] as [number, number], control: [-7.0, 9.0] as [number, number] }, // Angola -> Congo
  { id: '15b', color: '#16a34a', start: [-5.8, 12.0] as [number, number], end: [6.5, 3.4] as [number, number], control: [0.0, 6.0] as [number, number] }, // Congo -> Nigeria
  { id: '15c', color: '#16a34a', start: [6.5, 3.4] as [number, number], end: [5.6, -0.2] as [number, number], control: [4.0, 1.5] as [number, number] }, // Nigeria -> Ghana
  { id: '15d', color: '#16a34a', start: [5.6, -0.2] as [number, number], end: [5.3, -4.0] as [number, number], control: [3.0, -2.0] as [number, number] }, // Ghana -> Cote D'Ivoire
  { id: '15e', color: '#16a34a', start: [5.3, -4.0] as [number, number], end: [14.6, -17.4] as [number, number], control: [-2.0, -15.0] as [number, number] }, // Cote D'Ivoire -> Dakar

  // Đoạn cuối: Đến Morocco ("mongo"), qua Gibraltar, rồi cập bến Cảng Đông Nam (Marseille)
  { id: '16a', color: '#16a34a', start: [14.6, -17.4] as [number, number], end: [33.5, -7.5] as [number, number], control: [24.0, -22.0] as [number, number] }, // Dakar -> Morocco
  { id: '16b', color: '#16a34a', start: [33.5, -7.5] as [number, number], end: [36.0, -5.0] as [number, number], control: [35.0, -8.0] as [number, number] }, // Morocco -> Gibraltar
  { id: '16c', color: '#16a34a', start: [36.0, -5.0] as [number, number], end: [43.3, 5.4] as [number, number], control: [38.0, 0.0] as [number, number] }, // Gibraltar -> Marseille

  // Chặng 3: Pháp - Châu Mỹ - Anh (Dark Blue)
  { id: '18', color: '#1e3a8a', start: [49.5, 0.1] as [number, number], end: [48.5, -6.5] as [number, number], control: [49.5, -3.0] as [number, number] }, // Le Havre -> Ngoài khơi Tây Pháp
  { id: '18b', color: '#1e3a8a', start: [48.5, -6.5] as [number, number], end: [14.6, -61.0] as [number, number], control: [30.0, -45.0] as [number, number] }, // Ngoài khơi Tây Pháp -> vùng Caribbean
  { id: '19', color: '#1e3a8a', start: [14.6, -61.0] as [number, number], end: [-7.0, -25.0] as [number, number], control: [5.0, -35.0] as [number, number] }, // Caribbean -> Ngoài khơi Brazil (vòng ngoài)
  { id: '19b', color: '#1e3a8a', start: [-7.0, -25.0] as [number, number], end: [-34.9, -56.1] as [number, number], control: [-25.0, -25.0] as [number, number] }, // Ngoài khơi Brazil -> Uruguay
  { id: '20', color: '#1e3a8a', start: [-34.6, -58.3] as [number, number], end: [-7.0, -30.0] as [number, number], control: [-25.0, -30.0] as [number, number] }, // Argentina -> Ngoài khơi Brazil (vòng trong)
  { id: '20b', color: '#1e3a8a', start: [-7.0, -30.0] as [number, number], end: [40.7, -74.0] as [number, number], control: [10.0, -40.0] as [number, number] }, // Ngoài khơi Brazil -> New York (chéo qua đường kia)
  { id: '21', color: '#1e3a8a', start: [40.7, -74.0] as [number, number], end: [49.5, -8.0] as [number, number], control: [45.0, -40.0] as [number, number] }, // New York -> Cửa ngõ eo biển Manche (đi vòng xuống Nam Ireland để né đất liền)
  { id: '21b', color: '#1e3a8a', start: [49.5, -8.0] as [number, number], end: [50.9, -1.4] as [number, number], control: [50.0, -4.0] as [number, number] }, // Cửa ngõ eo biển -> Anh (cảng bờ Nam)
  { id: '22', color: '#1e3a8a', start: [50.9, -1.4] as [number, number], end: [49.5, 0.1] as [number, number], control: [50.0, -0.5] as [number, number] }, // Anh -> Le Havre

  // Chặng 4: Pháp - Liên Xô (Pink/Magenta)
  { id: '23', color: '#db2777', start: [48.8, 2.3] as [number, number], end: [52.5, 13.4] as [number, number], control: [52.0, 6.0] as [number, number] }, // Paris -> Berlin
  { id: '23b', color: '#db2777', start: [52.5, 13.4] as [number, number], end: [53.5, 9.9] as [number, number], control: [53.5, 12.0] as [number, number] }, // Berlin -> Hamburg

  // Vòng ra Biển Bắc rồi vòng qua đỉnh Đan Mạch vào biển Baltic
  { id: '24', color: '#db2777', start: [53.5, 9.9] as [number, number], end: [56.5, 5.0] as [number, number], control: [54.5, 6.0] as [number, number] }, // Hamburg -> Biển Bắc (đi ra ngoài biển)
  { id: '24b', color: '#db2777', start: [56.5, 5.0] as [number, number], end: [58.5, 11.0] as [number, number], control: [58.5, 6.0] as [number, number] }, // Biển Bắc -> Ngoài khơi đỉnh Đan Mạch (vòng qua đỉnh)
  { id: '24c', color: '#db2777', start: [58.5, 11.0] as [number, number], end: [55.0, 14.0] as [number, number], control: [56.5, 12.0] as [number, number] }, // Ngoài khơi đỉnh Đan Mạch -> Nam Thụy Điển (xuyên qua eo biển Kattegat)
  { id: '24d', color: '#db2777', start: [55.0, 14.0] as [number, number], end: [57.5, 20.0] as [number, number], control: [55.5, 17.5] as [number, number] }, // Nam Thụy Điển -> Giữa biển Baltic (né phía dưới đảo Gotland)
  { id: '24e', color: '#db2777', start: [57.5, 20.0] as [number, number], end: [59.8, 24.5] as [number, number], control: [59.5, 20.0] as [number, number] }, // Giữa biển Baltic -> Cửa vịnh Phần Lan (vòng lên Bắc để né các đảo của Estonia)
  { id: '24f', color: '#db2777', start: [59.8, 24.5] as [number, number], end: [59.9, 30.3] as [number, number], control: [60.0, 27.5] as [number, number] }, // Cửa vịnh Phần Lan -> Petrograd

  // Chặng 5: Liên Xô - Trung Quốc (Purple)
  { id: '25a', color: '#9333ea', start: [55.7, 37.6] as [number, number], end: [53.2, 50.1] as [number, number], control: [54.5, 43.8] as [number, number] }, // Moscow -> Samara (Đi thẳng xuống biên giới)
  { id: '25b', color: '#9333ea', start: [53.2, 50.1] as [number, number], end: [55.1, 61.4] as [number, number], control: [54.2, 55.7] as [number, number] }, // Samara -> Chelyabinsk (Vòng lên)
  { id: '25c1', color: '#9333ea', start: [55.1, 61.4] as [number, number], end: [56.1, 69.5] as [number, number], control: [55.6, 65.45] as [number, number] }, // Chelyabinsk -> Ishim (Vòng lên phía Bắc né biên giới)
  { id: '25c2', color: '#9333ea', start: [56.1, 69.5] as [number, number], end: [55.0, 73.4] as [number, number], control: [55.55, 71.45] as [number, number] }, // Ishim -> Omsk
  { id: '25e', color: '#9333ea', start: [55.0, 73.4] as [number, number], end: [55.0, 82.9] as [number, number], control: [55.2, 78.0] as [number, number] }, // Omsk -> Novosibirsk
  { id: '25f', color: '#9333ea', start: [55.0, 82.9] as [number, number], end: [52.3, 104.3] as [number, number], control: [57.0, 93.6] as [number, number] }, // Novosibirsk -> Irkutsk (Vòng lên phía Bắc né biên giới)
  { id: '25g1', color: '#9333ea', start: [52.3, 104.3] as [number, number], end: [51.5, 111.0] as [number, number], control: [51.9, 107.65] as [number, number] }, // Irkutsk -> Đoạn võng xuống
  { id: '25g2', color: '#9333ea', start: [51.5, 111.0] as [number, number], end: [55.0, 124.0] as [number, number], control: [54.5, 117.5] as [number, number] }, // Đoạn võng -> Đỉnh vòng cung
  { id: '25h', color: '#9333ea', start: [55.0, 124.0] as [number, number], end: [48.5, 135.1] as [number, number], control: [53.5, 130.0] as [number, number] }, // Đỉnh vòng cung -> Khabarovsk
  { id: '25i', color: '#9333ea', start: [48.5, 135.1] as [number, number], end: [43.1, 133.0] as [number, number], control: [46.0, 135.5] as [number, number] }, // Khabarovsk -> Vladivostok
  // Chặng 5: Đi tàu biển từ Vladivostok đến thẳng Quảng Châu
  { id: '26a', color: '#9333ea', start: [43.1, 133.0] as [number, number], end: [33.5, 129.0] as [number, number], control: [39.0, 134.0] as [number, number] }, // Vladivostok -> Tsushima
  { id: '26b', color: '#9333ea', start: [33.5, 129.0] as [number, number], end: [31.2, 121.4] as [number, number], control: [32.5, 124.5] as [number, number] }, // Tsushima -> Shanghai
  { id: '26c', color: '#9333ea', start: [31.2, 121.4] as [number, number], end: [24.4, 118.0] as [number, number], control: [28.0, 122.5] as [number, number] }, // Shanghai -> Xiamen
  { id: '26d', color: '#9333ea', start: [24.4, 118.0] as [number, number], end: [22.3, 114.1] as [number, number], control: [22.5, 116.5] as [number, number] }, // Xiamen -> Guangzhou

  // Chặng 6: Chiều về - Tách ra xa hơn nữa so với chiều đi để nhìn thật rõ
  { id: '27a', color: '#9333ea', start: [22.3, 114.1] as [number, number], end: [24.6, 118.5] as [number, number], control: [21.6, 117.75] as [number, number] }, // Guangzhou -> Xiamen
  { id: '27b', color: '#9333ea', start: [24.6, 118.5] as [number, number], end: [31.4, 121.9] as [number, number], control: [28.2, 124.5] as [number, number] }, // Xiamen -> Shanghai
  { id: '27c', color: '#9333ea', start: [31.4, 121.9] as [number, number], end: [33.7, 129.5] as [number, number], control: [32.7, 126.5] as [number, number] }, // Shanghai -> Tsushima
  { id: '27d', color: '#9333ea', start: [33.7, 129.5] as [number, number], end: [43.1, 133.0] as [number, number], control: [39.1, 135.75] as [number, number] }, // Tsushima -> Vladivostok
  { id: '28i', color: '#9333ea', start: [43.1, 133.0] as [number, number], end: [48.8, 135.1] as [number, number], control: [47.0, 135.5] as [number, number] }, // Vladivostok -> Khabarovsk
  { id: '28h', color: '#9333ea', start: [48.8, 135.1] as [number, number], end: [55.3, 124.0] as [number, number], control: [54.6, 130.0] as [number, number] }, // Khabarovsk -> Đỉnh vòng cung
  { id: '28g2', color: '#9333ea', start: [55.3, 124.0] as [number, number], end: [51.8, 111.0] as [number, number], control: [55.6, 117.5] as [number, number] }, // Đỉnh vòng cung -> Đoạn võng
  { id: '28g1', color: '#9333ea', start: [51.8, 111.0] as [number, number], end: [52.6, 104.3] as [number, number], control: [53.0, 107.65] as [number, number] }, // Đoạn võng -> Irkutsk
  { id: '28f', color: '#9333ea', start: [52.6, 104.3] as [number, number], end: [55.3, 82.9] as [number, number], control: [58.1, 93.6] as [number, number] }, // Irkutsk -> Novosibirsk (Vòng lên phía Bắc)
  { id: '28e', color: '#9333ea', start: [55.3, 82.9] as [number, number], end: [55.3, 73.4] as [number, number], control: [56.3, 78.0] as [number, number] }, // Novosibirsk -> Omsk
  { id: '28c1', color: '#9333ea', start: [55.3, 73.4] as [number, number], end: [56.4, 69.5] as [number, number], control: [56.65, 71.45] as [number, number] }, // Omsk -> Ishim (Vòng lên phía Bắc né biên giới)
  { id: '28c2', color: '#9333ea', start: [56.4, 69.5] as [number, number], end: [55.4, 61.4] as [number, number], control: [56.7, 65.45] as [number, number] }, // Ishim -> Chelyabinsk
  { id: '28b', color: '#9333ea', start: [55.4, 61.4] as [number, number], end: [53.5, 50.1] as [number, number], control: [55.3, 55.7] as [number, number] }, // Chelyabinsk -> Samara
  { id: '28a', color: '#9333ea', start: [53.5, 50.1] as [number, number], end: [55.7, 37.6] as [number, number], control: [55.45, 43.8] as [number, number] }, // Samara -> Moscow

  // Chặng 7: Về nước (Orange)

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
  const [geoData, setGeoData] = useState<any>(null);
  const africaGeoJsonRef = useRef<any>(null);

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
                {!(route as any).hideArrow && (
                  <Marker
                    position={midPoint}
                    icon={createArrowIcon(angle, route.color)}
                    interactive={false}
                  />
                )}
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

      {/* Instruction Overlay for Affordance */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-[1000] pointer-events-none text-center w-max max-w-[90vw]">
        <p className="bg-[rgba(28,35,49,0.85)] text-[#ffe599] px-6 py-3 rounded-md border border-t-[3px] border-[#d4af37] border-x-[rgba(212,175,55,0.3)] border-b-[rgba(212,175,55,0.3)] shadow-[0_10px_25px_rgba(0,0,0,0.5)] font-['Montserrat',sans-serif] text-[0.85rem] font-semibold uppercase tracking-widest backdrop-blur-md">
          Nhấp vào các quốc gia được đánh dấu để khám phá hành trình
        </p>
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
