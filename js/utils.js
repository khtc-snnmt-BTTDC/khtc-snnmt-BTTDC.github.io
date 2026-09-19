// ==============================================================================
// UTILS.JS — Hàm tiện ích, tính toán nghiệp vụ & Xuất file Excel
// Sở Nông nghiệp và Môi trường TP.HCM — Phòng Kế hoạch - Tài chính
// Phiên bản: 1.0.0 · Cập nhật: 19/09/2026
// ==============================================================================

const UTILS = {
  // 1. ĐỊNH DẠNG SỐ VÀ TIỀN TỆ
  dinhDangSo: function(val, decimals = 0) {
    if (val === null || val === undefined || isNaN(val) || val === '') return '-';
    const num = Number(val);
    return num.toLocaleString('vi-VN', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    });
  },

  dinhDangDienTich: function(val) {
    if (val === null || val === undefined || isNaN(val) || val === '') return '-';
    return this.dinhDangSo(val, 0) + ' m²';
  },

  dinhDangTien: function(val) {
    if (val === null || val === undefined || isNaN(val) || val === '') return '-';
    return this.dinhDangSo(val, 0) + ' tr.đ';
  },

  dinhDangTyLe: function(val) {
    if (val === null || val === undefined || isNaN(val) || val === '') return '-';
    return this.dinhDangSo(val, 1) + '%';
  },

  dinhDangNgay: function(dateStr) {
    if (!dateStr) return '-';
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      const day = String(d.getDate()).padStart(2, '0');
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const year = d.getFullYear();
      return `${day}/${month}/${year}`;
    } catch (e) {
      return dateStr;
    }
  },

  // 2. CÔNG THỨC NGHIỆP VỤ (THEO MẪU EXCEL SỞ)
  tinhTyLeDienTich: function(daThuHoi, tongThuHoi) {
    const d = Number(daThuHoi) || 0;
    const t = Number(tongThuHoi) || 0;
    if (t <= 0) return 0;
    return Math.round((d / t) * 10000) / 100;
  },

  tinhTyLeChiTra: function(daChiTra, tongDuyet) {
    const c = Number(daChiTra) || 0;
    const t = Number(tongDuyet) || 0;
    if (t <= 0) return 0;
    return Math.round((c / t) * 10000) / 100;
  },

  tinhTyLeGiaiNgan: function(giaiNgan, keHoach) {
    const g = Number(giaiNgan) || 0;
    const k = Number(keHoach) || 0;
    if (k <= 0) return 0;
    return Math.round((g / k) * 10000) / 100;
  },

  tinhChenhLechTienDo: function(ngayThucTe, ngayKeHoach) {
    if (!ngayThucTe || !ngayKeHoach) return null;
    const d1 = new Date(ngayThucTe);
    const d2 = new Date(ngayKeHoach);
    if (isNaN(d1.getTime()) || isNaN(d2.getTime())) return null;
    const diffTime = d1.getTime() - d2.getTime();
    return Math.round(diffTime / (1000 * 60 * 60 * 24)); // Số ngày
  },

  // 3. TẠO BADGE TRỰC QUAN TRÊN GIAO DIỆN
  taoBadgeNhom: function(nhom) {
    if (nhom === 'Trọng điểm') {
      return `<span class="badge badge-trong-diem">★ Trọng điểm</span>`;
    }
    return `<span class="badge badge-thong-thuong">Thông thường</span>`;
  },

  taoBadgeTinhTrang: function(tinhTrang) {
    switch (tinhTrang) {
      case 'Đã hoàn thành':
        return `<span class="badge badge-hoan-thanh">Đã hoàn thành</span>`;
      case 'Cơ bản hoàn thành':
        return `<span class="badge badge-co-ban">Cơ bản HT</span>`;
      case 'Đang triển khai':
        return `<span class="badge badge-dang-lam">Đang triển khai</span>`;
      case 'Chưa triển khai':
        return `<span class="badge badge-chua-lam">Chưa triển khai</span>`;
      default:
        return `<span class="badge">${tinhTrang || '-'}</span>`;
    }
  },

  taoBadgeChenhLech: function(chenhLechNgay) {
    if (chenhLechNgay === null || chenhLechNgay === undefined) return '-';
    const n = Number(chenhLechNgay);
    if (n > 0) {
      return `<span class="badge badge-cham">Chậm ${n} ngày</span>`;
    } else if (n === 0) {
      return `<span class="badge badge-dung-han">Đúng hạn</span>`;
    } else {
      return `<span class="badge badge-som">Sớm ${Math.abs(n)} ngày</span>`;
    }
  },

  // 4. XUẤT FILE EXCEL THEO ĐÚNG MẪU BÁO CÁO CỦA SỞ (SHEETJS)
  xuatBaoCaoExcel: function(danhSachDuAn, tongHopTP, dsKhoKhan, tenKy = '09/2026') {
    if (typeof XLSX === 'undefined') {
      alert('Thư viện SheetJS (XLSX) chưa được tải. Vui lòng kiểm tra kết nối internet.');
      return;
    }

    const wb = XLSX.utils.book_new();

    // 4.1. Sheet 1: Tổng hợp toàn TP
    const ws1_data = [
      ['TỔNG HỢP TIẾN ĐỘ BỒI THƯỜNG, GPMB TOÀN THÀNH PHỐ', '', ''],
      ['Kỳ báo cáo:', `Tháng ${tenKy}`, ''],
      ['', '', ''],
      ['Chỉ tiêu', 'Giá trị', 'Nguồn / Ghi chú'],
      ['Tổng số dự án đang theo dõi', tongHopTP.tong_so_du_an || danhSachDuAn.length, 'Đếm số dự án có tên tại Danh mục dự án'],
      ['Trong đó - số dự án trọng điểm', tongHopTP.so_du_an_trong_diem || 0, 'Theo Danh mục dự án trọng điểm UBND TP ban hành'],
      ['Số dự án đã hoàn thành / cơ bản hoàn thành', tongHopTP.so_du_an_hoan_thanh || 0, ''],
      ['Số dự án đang triển khai', tongHopTP.so_du_an_dang_trien_khai || 0, ''],
      ['Số dự án chưa triển khai', tongHopTP.so_du_an_chua_trien_khai || 0, ''],
      ['Số dự án chậm tiến độ so với kế hoạch', tongHopTP.so_du_an_cham_tien_do || 0, 'Đếm dự án có Chênh lệch tiến độ > 0 ngày'],
      ['Tổng diện tích phải thu hồi toàn TP (m²)', tongHopTP.tong_dien_tich_thu_hoi_tp || 0, ''],
      ['Tổng diện tích đã thu hồi, bàn giao (m²)', tongHopTP.tong_dien_tich_da_thu_hoi_tp || 0, 'TT44/2026/TT-BTC Mẫu số 03'],
      ['Tỷ lệ % diện tích hoàn thành toàn TP', (tongHopTP.ty_le_dien_tich_hoan_thanh_tp || 0) + '%', ''],
      ['Tổng giá trị bồi thường theo phương án duyệt (triệu đồng)', tongHopTP.tong_kinh_phi_duyet_tp || 0, ''],
      ['Giá trị đã chi trả lũy kế toàn TP (triệu đồng)', tongHopTP.tong_gia_tri_da_chi_tra_tp || 0, 'TT44/2026/TT-BTC Mẫu số 03'],
      ['Tỷ lệ % giá trị bồi thường đã chi trả toàn TP', (tongHopTP.ty_le_chi_tra_kinh_phi_tp || 0) + '%', ''],
      ['Tổng kế hoạch vốn bồi thường, GPMB năm toàn TP (triệu đồng)', tongHopTP.tong_ke_hoach_von_nam_tp || 0, 'Luật Đầu tư công 58/2024/QH15, NĐ 85/2025/NĐ-CP'],
      ['Giá trị giải ngân lũy kế toàn TP (triệu đồng)', tongHopTP.tong_giai_ngan_nam_tp || 0, ''],
      ['Tỷ lệ % giải ngân vốn so với kế hoạch năm toàn TP', (tongHopTP.ty_le_giai_ngan_von_tp || 0) + '%', '']
    ];
    const ws1 = XLSX.utils.aoa_to_sheet(ws1_data);
    XLSX.utils.book_append_sheet(wb, ws1, 'Tổng hợp toàn TP');

    // 4.2. Sheet 2: Danh mục dự án (31 cột)
    const ws2_data = [
      ['THEO DÕI TIẾN ĐỘ BỒI THƯỜNG, HỖ TRỢ, TÁI ĐỊNH CƯ CÁC DỰ ÁN'],
      ['Phòng Kế hoạch - Tài chính tổng hợp, báo cáo Ban Giám đốc Sở và UBND Thành phố.'],
      [
        'STT', 'Tên dự án', 'Dự án thành phần\n(nếu có)', 'Chủ đầu tư /\nĐơn vị GPMB', 'Địa bàn\n(Phường/Xã)', 'Nhóm dự án',
        'Tổng diện tích\nphải thu hồi (m²)', 'Diện tích đã thu hồi,\nbàn giao (m²)', 'Tỷ lệ %\nhoàn thành diện tích',
        'Tổng số hộ/tổ chức\nthuộc diện thu hồi đất', 'Số đã có TB thu hồi đất', 'Số đã kiểm đếm',
        'Số đã có phương án bồi thường được duyệt', 'Số đã công khai PA', 'Số đã nhận tiền bồi thường', 'Số đã bàn giao mặt bằng',
        'Tổng giá trị bồi thường, hỗ trợ theo phương án duyệt (triệu đồng)', 'Giá trị đã chi trả lũy kế (triệu đồng)', 'Tỷ lệ % giá trị đã chi trả',
        'Số hộ thuộc diện tái định cư', 'Số đã bố trí nền/căn hộ TĐC', 'Số còn lại chưa bố trí TĐC',
        'Kế hoạch vốn bồi thường, GPMB năm (triệu đồng)', 'Giá trị giải ngân lũy kế trong năm (triệu đồng)', 'Tỷ lệ % giải ngân vốn so với KH năm',
        'Mốc hoàn thành GPMB theo kế hoạch', 'Ngày hoàn thành thực tế/dự kiến', 'Chênh lệch tiến độ (ngày)', 'Tình trạng tổng thể', 'Kỳ báo cáo', 'Ghi chú'
      ]
    ];

    danhSachDuAn.forEach((da, idx) => {
      const tyLeDT = UTILS.tinhTyLeDienTich(da.dien_tich_da_thu_hoi, da.tong_dien_tich_thu_hoi);
      const tyLeChiTra = UTILS.tinhTyLeChiTra(da.gia_tri_da_chi_tra, da.tong_kinh_phi_duyet);
      const tyLeGN = UTILS.tinhTyLeGiaiNgan(da.giai_ngan_luy_ke_nam, da.ke_hoach_von_nam);
      const chenhLech = UTILS.tinhChenhLechTienDo(da.ngay_hoan_thanh_thuc_te, da.moc_ke_hoach_gpmb);
      const conLaiTDC = (da.so_ho_tai_dinh_cu || 0) - (da.so_da_bo_tri_tdc || 0);

      ws2_data.push([
        idx + 1,
        da.ten_du_an || '',
        da.du_an_thanh_phan || '',
        da.chu_dau_tu_don_vi_gpmb || da.chu_dau_tu_chu_quan || '',
        da.dia_ban || '',
        da.nhom_du_an || 'Thông thường',
        da.tong_dien_tich_thu_hoi || 0,
        da.dien_tich_da_thu_hoi || 0,
        tyLeDT + '%',
        da.tong_so_ho_anh_huong || 0,
        da.so_co_tb_thu_hoi || 0,
        da.so_da_kiem_dem || 0,
        da.so_da_duyet_pa || 0,
        da.so_da_cong_khai_pa || 0,
        da.so_da_nhan_tien || 0,
        da.so_da_ban_giao_mb || 0,
        da.tong_kinh_phi_duyet || 0,
        da.gia_tri_da_chi_tra || 0,
        tyLeChiTra + '%',
        da.so_ho_tai_dinh_cu || 0,
        da.so_da_bo_tri_tdc || 0,
        conLaiTDC,
        da.ke_hoach_von_nam || 0,
        da.giai_ngan_luy_ke_nam || 0,
        tyLeGN + '%',
        UTILS.dinhDangNgay(da.moc_ke_hoach_gpmb),
        UTILS.dinhDangNgay(da.ngay_hoan_thanh_thuc_te),
        chenhLech !== null ? chenhLech : '',
        da.tinh_trang_tong_the || 'Đang triển khai',
        da.ma_ky || tenKy,
        da.ghi_chu || ''
      ]);
    });

    const ws2 = XLSX.utils.aoa_to_sheet(ws2_data);
    XLSX.utils.book_append_sheet(wb, ws2, 'Danh mục dự án');

    // 4.3. Sheet 3: Khó khăn - Kiến nghị
    const ws3_data = [
      ['TỔNG HỢP KHÓ KHĂN, VƯỚNG MẮC VÀ KIẾN NGHỊ'],
      ['Căn cứ: Thông tư 44/2026/TT-BTC, Mẫu số 03'],
      [''],
      ['STT', 'Tên dự án', 'Số văn bản/\nbáo cáo nguồn', 'Loại vướng mắc', 'Nội dung vướng mắc, khó khăn', 'Đơn vị chịu trách nhiệm xử lý', 'Đề xuất, kiến nghị', 'Cấp thẩm quyền xử lý', 'Trạng thái', 'Kỳ báo cáo']
    ];

    (dsKhoKhan || []).forEach((item, idx) => {
      ws3_data.push([
        idx + 1,
        item.ten_du_an || '',
        item.so_van_ban_nguon || '',
        item.loai_vuong_mac || '',
        item.noi_dung_vuong_mac || '',
        item.don_vi_xu_ly || '',
        item.de_xuat_kien_nghi || '',
        item.cap_tham_quyen || '',
        item.trang_thai || 'Chờ xử lý',
        item.ma_ky || tenKy
      ]);
    });

    const ws3 = XLSX.utils.aoa_to_sheet(ws3_data);
    XLSX.utils.book_append_sheet(wb, ws3, 'Khó khăn - Kiến nghị');

    // Tạo tên file xuất ra máy tính người dùng
    const safeTenKy = tenKy.replace(/[\/\\:]/g, '_');
    const tenFile = `Theo_doi_tien_do_boi_thuong_GPMB_${safeTenKy}.xlsx`;
    XLSX.writeFile(wb, tenFile);
  }
};
