// All report figures and editorial content live here so they can be updated together.
export const report = {
  school: 'Trường THPT Phú Nhuận',
  pastYear: '2025–2026',
  nextYear: '2026–2027',
  qualifications: [
    { value: 46, label: 'Thạc sĩ' },
    { value: 3, label: 'Giáo viên đang học cao học' }
  ],
  guidance: [
    { value: 4, label: 'Đợt tư vấn tuyển sinh tại trường' },
    { value: 40, suffix: '+', label: 'Trường đại học, cao đẳng tham gia' }
  ],
  teacherTargets: [
    { value: 138, suffix: '/138', label: 'Lao động Tiên tiến' },
    { value: 25, label: 'Giáo viên giỏi cấp trường' },
    { value: 40, label: 'Chiến sĩ thi đua cơ sở' }
  ],
  overview: [
    { value: 2400, label: 'Học sinh', detail: '1.286 học sinh nữ', icon: 'users' },
    { value: 57, label: 'Lớp học', detail: '6 lớp chương trình tích hợp', icon: 'school' },
    { value: 116, label: 'Giáo viên', detail: '46 thạc sĩ · 3 đang học cao học', icon: 'book-open' },
    { value: 22, label: 'Nhân viên', detail: 'Đồng hành cùng hoạt động nhà trường', icon: 'heart-handshake' }
  ],
  organization: [
    ['Ban giám hiệu', '1 Hiệu trưởng · 2 Phó hiệu trưởng'],
    ['Tổ chuyên môn', '11 tổ chuyên môn · 1 tổ Văn phòng'],
    ['Chi bộ', '34 đảng viên'],
    ['Công đoàn', '130 công đoàn viên'],
    ['Đoàn thanh niên', 'Gần 2.000 đoàn viên · 57 chi đoàn'],
    ['Ban đại diện CMHS', '33 thành viên · 1 Trưởng ban · 11 Phó trưởng ban']
  ],
  results: [
    { value: 100, suffix: '%', label: 'Rèn luyện Tốt, Khá', color: 'green' },
    { value: 98.16, decimals: 2, suffix: '%', label: 'Học tập Tốt, Khá', color: 'coral' },
    { value: 100, suffix: '%', label: 'Lên lớp thẳng', color: 'green' },
    { value: 15.54, decimals: 2, suffix: '%', label: 'Học sinh xuất sắc', color: 'gold' }
  ],
  graduation: { university: 97.53, score: 22.93, previousScore: 22.85, highest: 28, lowest: 15.1, perfect: [['Toán', 6], ['Vật lí', 1], ['Lịch sử', 2], ['Tiếng Anh', 2]], note: 'Trúng tuyển đại học đợt 1 · Thống kê ngày 30/8/2026' },
  achievements: {
    academic: [
      { value: 43, title: 'Học sinh giỏi Thành phố', text: 'Khối 12 · 24 giải Nhì, 19 giải Ba', icon: 'trophy' },
      { value: 53, title: 'Olympic Thành phố', text: 'Khối 10, 11 · 1 giải Nhất, 19 giải Nhì, 33 giải Ba', icon: 'medal' },
      { value: 7, title: 'Olympic 30/4', text: 'Khối chuyên · 1 HCV, 2 HCB, 4 HCĐ', icon: 'award' },
      { value: 5, title: 'Khoa học kỹ thuật', text: 'Cấp Thành phố · 3 giải Nhì, 2 giải Ba', icon: 'microscope' },
      { value: 7, title: 'Toán trên máy tính cầm tay', text: 'Cấp Thành phố · 1 giải Nhì, 6 giải Ba', icon: 'calculator' }
    ],
    sport: [
      { value: 9, title: 'Thể thao học sinh Thành phố', text: '1 HCV · 2 HCB · 6 HCĐ', icon: 'medal' },
      { value: 4, title: 'Thể thao học sinh toàn quốc', text: '3 HCV · 1 HCĐ · Điền kinh, Cầu lông', icon: 'trophy' },
      { value: 7, title: 'Cúp Quốc gia môn Cờ vua', text: '4 HCV · 1 HCB · 2 HCĐ', icon: 'crown' }
    ],
    teachers: [
      { value: 136, title: 'Lao động tiên tiến', text: '136/136 · Tỷ lệ 100%', icon: 'users' },
      { value: 21, title: 'Giáo viên giỏi cấp trường', text: 'Năm học 2025–2026', icon: 'book-open' },
      { value: 44, title: 'Chiến sĩ thi đua cơ sở', text: 'Cán bộ, giáo viên, nhân viên · Đang đề xuất', icon: 'award' }
    ]
  },
  honors: 'Tập thể Lao động Xuất sắc; giấy khen thành tích tiêu biểu trong thực hiện nhiệm vụ giáo dục phổ thông theo Quyết định 3812/QĐ-SGDĐT ngày 07/8/2026. Chi bộ hoàn thành tốt nhiệm vụ; Đoàn TNCS hoàn thành xuất sắc nhiệm vụ.',
  clubs: { count: 24, students: 1500, items: [
    ['music', 'Âm nhạc PNY', 'Giải Khuyến khích Tiếng hát Chú Ve con Hè 2026'],
    ['sparkles', 'Nhảy PND', 'Giải Nhì Vũ điệu thanh xuân; giải Nhì Flashmob Hội trại 9/1'],
    ['cpu', 'Tin học', 'Giải Tiềm năng Hội thi Trí tuệ nhân tạo TP.HCM 2026']
  ] },
  education: [
    ['shield-check', 'Nề nếp & văn hóa ứng xử', 'Theo dõi chuyên cần, tác phong; thi đua lớp hằng tuần và phối hợp với gia đình để giáo dục học sinh.'],
    ['compass', 'Hướng nghiệp có định hướng', '4 đợt tư vấn tuyển sinh với hơn 40 trường đại học, cao đẳng; tư vấn tại lớp và tham quan đại học.'],
    ['heart-pulse', 'Kỹ năng sống & tâm lý', 'Ứng xử trên mạng, phòng chống bạo lực, tác hại thuốc lá điện tử, an toàn giao thông và tài chính cá nhân.'],
    ['leaf', 'Trường học hạnh phúc', 'Hoạt động trải nghiệm, về nguồn, phong trào xanh – sạch – đẹp; ghi nhận học sinh tham gia câu lạc bộ.']
  ],
  charity: [
    { value: 164951000, suffix: ' đ', label: 'Ủng hộ đồng bào bị thiên tai', detail: 'Qua 2 đợt quyên góp' },
    { value: 60000000, suffix: ' đ', label: 'Công trình Nhà tình bạn', detail: 'Hỗ trợ học sinh Trường THPT Trần Văn Quan' },
    { value: 15, suffix: ' suất', label: 'Học bổng Gương sáng học đường', detail: '1 triệu đồng / suất' },
    { value: 22, suffix: ' học sinh', label: 'Quà Xuân tặng bạn', detail: 'Tổng giá trị 11 triệu đồng' }
  ],
  charityMore: [
    'Tặng 1.000 tập trắng cho học sinh khó khăn tại phường Cầu Kiệu.',
    'Tặng 1.000 tập trắng và 3 học bổng, mỗi suất 1 triệu đồng tại xã Bình Mỹ.',
    'Thăm mẹ Việt Nam Anh hùng và gia đình chính sách: quà tặng trị giá 4 triệu đồng.',
    'Văn nghệ Cây mùa xuân 2026, quỹ Giúp bạn vượt khó – học tốt, hiến máu và các hoạt động cộng đồng.'
  ],
  nextOverview: [ { value: 2439, label: 'Học sinh' }, { value: 57, label: 'Lớp học' }, { value: 138, label: 'Cán bộ, giáo viên, nhân viên' } ],
  directions: [
    ['01', 'Đổi mới tư duy', 'Thực hiện Chương trình GDPT 2018; học đi đôi với hành, phát triển năng lực và tính tự học.'],
    ['02', 'Chuyển biến mạnh mẽ', 'Chuyển đổi số, giáo dục thông minh, nâng cao năng lực số và từng bước đưa tiếng Anh thành ngôn ngữ thứ hai.'],
    ['03', 'Kết quả thực chất', 'Đổi mới kiểm tra đánh giá, STEM gắn với thực tiễn, hướng nghiệp và xây dựng trường học hạnh phúc, trường học xanh.']
  ],
  solutions: [
    ['monitor', 'Dạy & học trên nền tảng số', 'LMS K12online.vn; dành 50% thời gian dạy học để giao nhiệm vụ và hướng dẫn tự học trực tuyến. Học bạ số và CSDL ngành cho 100% học sinh khối 10, 11.'],
    ['brain-circuit', 'AI an toàn, có trách nhiệm', 'Triển khai Experience AI và Khung năng lực số cho học sinh; hướng dẫn sử dụng trí tuệ nhân tạo an toàn, có trách nhiệm.'],
    ['clipboard-check', 'Đánh giá vì sự tiến bộ', 'Bám sát năng lực, hạn chế ghi nhớ máy móc; không dùng kết quả thi thử, khảo sát để xếp hạng hoặc tạo áp lực thành tích.'],
    ['flask-conical', 'Học từ trải nghiệm thực tế', 'STEM/STEAM và nghiên cứu khoa học gắn thực tiễn. Mỗi tổ bộ môn xây dựng ít nhất 1 tiết trải nghiệm/khối/năm; hướng nghiệp từ khối 10 đến 12.']
  ],
  programs: [
    { icon: 'languages', title: 'Tiếng Anh', amount: '2 tiết / tuần', description: 'Với giáo viên nước ngoài, dành cho khối 10 và 11.' },
    { icon: 'laptop', title: 'Tin học quốc tế', amount: '2 tiết / tuần', description: 'Nâng cao kỹ năng tin học theo chuẩn chứng chỉ MOS.' },
    { icon: 'brain-circuit', title: 'Experience AI', amount: '1 tiết / tuần', description: 'Tiếp cận trí tuệ nhân tạo và năng lực số.' },
    { icon: 'palette', title: 'Nghệ thuật & kỹ năng', amount: 'Phát triển toàn diện', description: 'Thanh nhạc, Guitar, Piano, Vẽ và kỹ năng sống.' },
    { icon: 'waves', title: 'Bơi an toàn', amount: 'Ưu tiên khối 10', description: 'Phổ cập kỹ năng bơi, phòng chống đuối nước.' }
  ],
  infrastructure: [ ['2', 'Phòng STEM'], ['2', 'Phòng học Google'], ['49/49', 'Phòng học có máy tính kết nối mạng'], ['100%', 'Trang bị máy lạnh'], ['3', 'Màn hình LED'] ],
  development: 'Phát triển kho học liệu dùng chung, Google Education và E-Learning LMS; bồi dưỡng giáo viên về tin học, ngoại ngữ, nghiên cứu khoa học, chủ nhiệm và tư vấn học đường. Huy động nguồn lực để nâng cao cơ sở vật chất; phát triển thư viện mở, tủ sách lớp học, không gian xanh.',
  targets: [
    { value: 100, suffix: '%', label: 'Rèn luyện Tốt, Khá' },
    { value: 97, suffix: '%', label: 'Học tập Tốt, Khá' },
    { value: 20, suffix: '%', label: 'Học sinh xuất sắc' },
    { value: 100, suffix: '%', label: 'Lên lớp thẳng' },
    { value: 100, suffix: '%', label: 'Tốt nghiệp THPT' }
  ],
  targetMore: [
    ['Học sinh', 'Không có học sinh học lực Chưa đạt. Các kỳ thi HSG/Olympic/KHKT cấp Thành phố: 50–80% học sinh hoặc đề tài dự thi đạt giải.'],
    ['Đội ngũ', '138/138 Lao động Tiên tiến; 25 giáo viên giỏi cấp trường; 40 Chiến sĩ thi đua cơ sở.'],
    ['Tập thể', 'Phấn đấu Lao động Tiên tiến, Lao động Xuất sắc; Bằng khen UBND Thành phố và Bằng khen Thủ tướng Chính phủ.']
  ],
  partnership: [
    ['Nhà trường', 'Xây dựng môi trường an toàn, hạnh phúc; giáo dục toàn diện và quản trị dân chủ, kỷ cương.'],
    ['Thầy cô', 'Giỏi chuyên môn, tận tâm, gương mẫu; đổi mới phương pháp và lan tỏa năng lượng tích cực.'],
    ['Cha mẹ học sinh', 'Theo dõi học tập, rèn luyện; phối hợp với giáo viên, góp ý và tham gia đánh giá chất lượng.'],
    ['Học sinh', 'Chủ động tự học, sáng tạo; tham gia hoạt động, rèn luyện thể thao, nghệ thuật và trách nhiệm cộng đồng.']
  ]
};
