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

  // 3 Nhóm tài khoản & Phân quyền hệ thống
  VAI_TRO: {
    ADMIN_TONG: {
      ma: 'admin_tong',
      ten: 'Quản trị hệ thống (Phòng Kế hoạch - Tài chính Sở)',
      ten_ngan: 'Admin KHTC Sở',
      bieu_tuong: '👑',
      tai_khoan_mac_dinh: 'khtc.snnmt',
      mo_ta: 'Toàn quyền quản trị hệ thống, xem toàn bộ số liệu 2 phân khu, cấu hình và xuất báo cáo tổng hợp.'
    },
    QUAN_LY_BTTDC: {
      ma: 'quan_ly_bttdc',
      ten: 'Quản lý báo cáo BTTDC (Phòng Bồi thường, hỗ trợ, tái định cư Sở)',
      ten_ngan: 'Quản lý BTTDC',
      bieu_tuong: '📋',
      tai_khoan_mac_dinh: 'bttdc.snnmt',
      mo_ta: 'Theo dõi, đôn đốc toàn TP; nhập liệu cho TẤT CẢ dự án; có quyền thêm, xóa dự án; thêm, xóa kỳ báo cáo.'
    },
    DON_VI_THUC_HIEN: {
      ma: 'don_vi_thuc_hien',
      ten: 'Đơn vị trực tiếp thực hiện công tác bồi thường GPMB',
      ten_ngan: 'Đơn vị thực hiện',
      bieu_tuong: '🏗️',
      tai_khoan_mac_dinh: 'BQLDA_DTXD_VuonLai',
      mo_ta: 'Chỉ nhập và thấy tiến độ dự án của chính đơn vị mình phụ trách.'
    }
  },

  // Danh mục tài khoản gợi ý đăng nhập nhanh
  TAI_KHOAN_GOI_Y: [
    {
      ten_dang_nhap: 'khtc.snnmt',
      mat_khau: 'khtc123',
      ho_ten: 'Phòng Kế hoạch - Tài chính (Sở NN&MT)',
      vai_tro: 'admin_tong',
      ma_don_vi: 'SNNMT_KHTC',
      nhom_label: '👑 Nhóm 1: Admin KHTC Sở'
    },
    {
      ten_dang_nhap: 'bttdc.snnmt',
      mat_khau: 'bttdc123',
      ho_ten: 'Phòng Bồi thường, hỗ trợ, tái định cư Sở',
      vai_tro: 'quan_ly_bttdc',
      ma_don_vi: 'SNNMT_BTTDC',
      nhom_label: '📋 Nhóm 2: Quản lý BTTDC Sở'
    },
    {
      ten_dang_nhap: 'BQLDA_DTXD_VuonLai',
      mat_khau: 'vuonlai123',
      ho_ten: 'Ban QLDA ĐTXD phường Vườn Lài',
      vai_tro: 'don_vi_thuc_hien',
      ma_don_vi: 'BQLDA_VUONLAI',
      nhom_label: '🏗️ Nhóm 3: Đơn vị trực tiếp (Vườn Lài)'
    }
  ],

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
  Object.freeze(CONFIG.VAI_TRO);
  Object.freeze(CONFIG.BANG);
  Object.freeze(CONFIG.VIEWS);
}
