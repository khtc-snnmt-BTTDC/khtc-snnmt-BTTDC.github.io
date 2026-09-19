// ==============================================================================
// CONFIG.JS — Cấu hình hệ thống Báo cáo định kỳ Sở Nông nghiệp và Môi trường
// Sở Nông nghiệp và Môi trường TP.HCM
// Phiên bản: 1.1.0 · Cập nhật: 19/09/2026
// ==============================================================================

const CONFIG = {
  // Cấu hình Supabase thực tế dự án BTTDC (Sở NN&MT TP.HCM)
  SUPABASE_URL: 'https://imgksubyxjxeidplranh.supabase.co',
  SUPABASE_KEY: 'sb_publishable_JDq4VJoeMxA3FYwEA3K-lA_8AEKM0bB',

  // Thông tin ứng dụng & Kho lưu trữ GitHub Pages
  MA_UNG_DUNG: 'BTTDC',
  TEN_HE_THONG: 'BÁO CÁO ĐỊNH KỲ SỞ NÔNG NGHIỆP VÀ MÔI TRƯỜNG',
  TEN_CO_QUAN:  'SỞ NÔNG NGHIỆP VÀ MÔI TRƯỜNG TP.HCM',
  DON_VI_CHU_TRI: 'Phòng Kế hoạch - Tài chính',
  GITHUB_REPO: 'https://github.com/khtc-snnmt-BTTDC/khtc-snnmt-BTTDC.github.io',
  TRANG_CHU_DEPLOY: 'https://khtc-snnmt-BTTDC.github.io',

  // Danh mục 2 phân khu lớn của hệ thống
  PHAN_KHU: {
    BOI_THUONG: {
      ma: 'boi_thuong',
      ten: 'Phân khu Bồi thường, Giải phóng mặt bằng & Tái định cư',
      ten_ngan: 'Bồi thường GPMB',
      bieu_tuong: '🏛️',
      mo_ta: 'Theo dõi tiến độ bồi thường, hỗ trợ, tái định cư và giải ngân vốn các dự án đầu tư theo TT 44/2026/TT-BTC & NĐ 88/2024/NĐ-CP.'
    },
    SAN_XUAT: {
      ma: 'san_xuat',
      ten: 'Phân khu Sản xuất nông nghiệp & Phát triển nông thôn',
      ten_ngan: 'Sản xuất Nông nghiệp',
      bieu_tuong: '🌾',
      mo_ta: 'Theo dõi số liệu định kỳ trồng trọt, chăn nuôi, thủy sản, lâm nghiệp và nông thôn mới theo các biểu mẫu chỉ tiêu của Sở.'
    }
  },

  // File mẫu báo cáo chính thức gửi kèm công văn Sở
  FILE_MAU_EXCEL: 'Theo_doi_tien_do_boi_thuong_GPMB.xlsx',

  // Kỳ báo cáo mặc định
  KY_MAC_DINH: '09/2026',

  // Danh mục bảng CSDL Supabase
  BANG: {
    DON_VI: 'don_vi',
    KY_BAO_CAO: 'ky_bao_cao',
    DU_AN: 'du_an',
    TIEN_DO: 'tien_do_boi_thuong',
    KHO_KHAN: 'kho_khan_kien_nghi',
    TAI_KHOAN: 'tai_khoan'
  },

  // Danh mục Views tính toán tự động
  VIEWS: {
    TIEN_DO_CHI_TIET: 'v_tien_do_chi_tiet',
    TONG_HOP_TOAN_TP: 'v_tong_hop_toan_tp'
  },

  // Danh mục phân loại
  NHOM_DU_AN: ['Trọng điểm', 'Thông thường'],
  TINH_TRANG: ['Chưa triển khai', 'Đang triển khai', 'Cơ bản hoàn thành', 'Đã hoàn thành'],
  LOAI_VUONG_MAC: [
    'Chính sách bồi thường, giá đất',
    'Tranh chấp, khiếu nại',
    'Tái định cư',
    'Di dời hạ tầng kỹ thuật',
    'Thủ tục pháp lý',
    'Khác'
  ],
  CAP_THAM_QUYEN: [
    'UBND Thành phố',
    'Sở Nông nghiệp và Môi trường',
    'UBND cấp Huyện',
    'Bộ ngành Trung ương'
  ]
};

// Đóng băng object để tránh vô tình ghi đè trong runtime
if (typeof Object.freeze === 'function') {
  Object.freeze(CONFIG);
  Object.freeze(CONFIG.PHAN_KHU);
  Object.freeze(CONFIG.BANG);
  Object.freeze(CONFIG.VIEWS);
}
