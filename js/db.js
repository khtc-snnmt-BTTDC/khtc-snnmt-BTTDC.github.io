// ==============================================================================
// DB.JS — Tầng truy xuất Cơ sở dữ liệu (Supabase Data Access Layer)
// Sở Nông nghiệp và Môi trường TP.HCM — Phòng Kế hoạch - Tài chính
// Hỗ trợ phân quyền 3 nhóm: Admin KHTC, Quản lý BTTDC, Đơn vị trực tiếp thực hiện
// Phiên bản: 1.2.0 · Cập nhật: 19/09/2026
// ==============================================================================

const DB = {
  client: null,

  // Dữ liệu mẫu nội bộ khi chạy offline hoặc dự phòng
  _mockData: {
    tai_khoan: [
      {
        id: 'user-01',
        ten_dang_nhap: 'khtc.snnmt',
        mat_khau_hash: 'khtc123',
        ho_ten: 'Phòng Kế hoạch - Tài chính (Sở NN&MT)',
        vai_tro: 'admin_tong',
        ma_don_vi: 'KHTC.SNNMT',
        ten_don_vi: 'Phòng Kế hoạch - Tài chính Sở'
      },
      {
        id: 'user-01-slug',
        ten_dang_nhap: 'KHTC.SNNMT',
        mat_khau_hash: 'khtc123',
        ho_ten: 'Phòng Kế hoạch - Tài chính Sở',
        vai_tro: 'admin_tong',
        ma_don_vi: 'KHTC.SNNMT',
        ten_don_vi: 'Phòng Kế hoạch - Tài chính Sở'
      },
      {
        id: 'user-02',
        ten_dang_nhap: 'bttdc.snnmt',
        mat_khau_hash: 'bttdc123',
        ho_ten: 'Phòng Bồi thường, hỗ trợ, tái định cư trực thuộc Sở',
        vai_tro: 'quan_ly_bttdc',
        ma_don_vi: 'BTTDC.SNNMT',
        ten_don_vi: 'Phòng Bồi thường, Hỗ trợ, Tái định cư Sở'
      },
      {
        id: 'user-02-slug',
        ten_dang_nhap: 'BTTDC.SNNMT',
        mat_khau_hash: 'bttdc123',
        ho_ten: 'Phòng Bồi thường, hỗ trợ, tái định cư Sở',
        vai_tro: 'quan_ly_bttdc',
        ma_don_vi: 'BTTDC.SNNMT',
        ten_don_vi: 'Phòng Bồi thường, hỗ trợ, tái định cư Sở'
      },
      {
        id: 'user-03',
        ten_dang_nhap: 'BQLDA_DTXD_VuonLai',
        mat_khau_hash: 'vuonlai123',
        ho_ten: 'Ban QLDA ĐTXD phường Vườn Lài',
        vai_tro: 'don_vi_thuc_hien',
        ma_don_vi: 'BQLDA.VuonLai',
        ten_don_vi: 'Ban QLDA ĐTXD phường Vườn Lài'
      },
      {
        id: 'user-03-slug',
        ten_dang_nhap: 'BQLDA.VuonLai',
        mat_khau_hash: 'vuonlai123',
        ho_ten: 'Ban QLDA ĐTXD phường Vườn Lài',
        vai_tro: 'don_vi_thuc_hien',
        ma_don_vi: 'BQLDA.VuonLai',
        ten_don_vi: 'Ban QLDA ĐTXD phường Vườn Lài'
      },
      {
        id: 'user-04-giaothong',
        ten_dang_nhap: 'BQLDA.GiaoThong.HCM',
        mat_khau_hash: '123456',
        ho_ten: 'BQL DA ĐTXD các công trình giao thông thành phố',
        vai_tro: 'don_vi_thuc_hien',
        ma_don_vi: 'BQLDA.GiaoThong.HCM',
        ten_don_vi: 'Ban QLDA Giao thông TP.HCM'
      },
      {
        id: 'user-05-dian',
        ten_dang_nhap: 'BQLDA.DiAn',
        mat_khau_hash: '123456',
        ho_ten: 'Ban QLDA ĐTXD phường Dĩ An',
        vai_tro: 'don_vi_thuc_hien',
        ma_don_vi: 'BQLDA.DiAn',
        ten_don_vi: 'Ban QLDA ĐTXD phường Dĩ An'
      },
      {
        id: 'user-06-brvt',
        ten_dang_nhap: 'BQLDA.GiaoThong.NNBRVT',
        mat_khau_hash: '123456',
        ho_ten: 'BQL DA ĐTXD các CT Giao thông và NN Bà Rịa - Vũng Tàu',
        vai_tro: 'don_vi_thuc_hien',
        ma_don_vi: 'BQLDA.GiaoThong.NNBRVT',
        ten_don_vi: 'Ban QLDA Giao thông - Nông nghiệp BR-VT'
      },
      {
        id: 'user-07',
        ten_dang_nhap: 'ban_gpmb_tp',
        mat_khau_hash: 'gpmb123',
        ho_ten: 'Ban Bồi thường GPMB TP.HCM',
        vai_tro: 'don_vi_thuc_hien',
        ma_don_vi: 'BAN_GPMB_TP',
        ten_don_vi: 'Ban Bồi thường GPMB TP.HCM'
      }
    ],

    don_vi: [
      { ma_don_vi: 'KHTC.SNNMT', ten_don_vi: 'Phòng Kế hoạch - Tài chính Sở' },
      { ma_don_vi: 'BTTDC.SNNMT', ten_don_vi: 'Phòng Bồi thường, hỗ trợ, tái định cư Sở' },
      { ma_don_vi: 'BQLDA.VuonLai', ten_don_vi: 'Ban QLDA ĐTXD phường Vườn Lài' },
      { ma_don_vi: 'BQLDA.GiaoThong.HCM', ten_don_vi: 'BQL DA ĐTXD các công trình giao thông thành phố' },
      { ma_don_vi: 'BQLDA.DiAn', ten_don_vi: 'Ban QLDA ĐTXD phường Dĩ An' },
      { ma_don_vi: 'BQLDA.GiaoThong.NNBRVT', ten_don_vi: 'Ban QLDA Giao thông và Nông nghiệp BR-VT' },
      { ma_don_vi: 'SNNMT_KHTC', ten_don_vi: 'Phòng Kế hoạch - Tài chính, Sở Nông nghiệp và Môi trường' },
      { ma_don_vi: 'SNNMT_BTTDC', ten_don_vi: 'Phòng Bồi thường, hỗ trợ, tái định cư trực thuộc Sở' },
      { ma_don_vi: 'BQLDA_VUONLAI', ten_don_vi: 'Ban QLDA ĐTXD phường Vườn Lài' },
      { ma_don_vi: 'BAN_GPMB_TP', ten_don_vi: 'Ban Bồi thường, GPMB TP.HCM' },
      { ma_don_vi: 'BAN_QLDA_GIAOTHONG', ten_don_vi: 'Ban Quản lý Dự án ĐTXD các Công trình Giao thông' },
      { ma_don_vi: 'BQLDA_CUCHI', ten_don_vi: 'Ban Bồi thường GPMB huyện Củ Chi' },
      { ma_don_vi: 'BQLDA_BINHTHANH', ten_don_vi: 'Ban Bồi thường GPMB quận Bình Thạnh' }
    ],

    du_an: [
      {
        id: 'DA_VUON_LAI_01',
        stt_hien_thi: 1,
        ten_du_an: 'Dự án Nâng cấp, mở rộng đường Vườn Lài và xây dựng cầu Vàm Thuật',
        du_an_thanh_phan: 'Đoạn qua phường Vườn Lài',
        ma_don_vi_gpmb: 'BQLDA.VuonLai',
        chu_dau_tu_don_vi_gpmb: 'Ban QLDA ĐTXD phường Vườn Lài',
        dia_ban: 'Phường Vườn Lài',
        nhom_du_an: 'Trọng điểm',
        tong_dien_tich_thu_hoi: 95000,
        dien_tich_da_thu_hoi: 42000,
        tong_so_ho_anh_huong: 680,
        so_co_tb_thu_hoi: 680,
        so_da_kiem_dem: 650,
        so_da_duyet_pa: 580,
        so_da_cong_khai_pa: 520,
        so_da_nhan_tien: 480,
        so_da_ban_giao_mb: 410,
        tong_kinh_phi_duyet: 850000,
        gia_tri_da_chi_tra: 420000,
        so_ho_tai_dinh_cu: 120,
        so_da_bo_tri_tdc: 85,
        ke_hoach_von_nam: 500000,
        giai_ngan_luy_ke_nam: 380000,
        moc_ke_hoach_gpmb: '2027-06-30',
        ngay_hoan_thanh_thuc_te: '2027-06-30',
        tinh_trang_tong_the: 'Đang triển khai',
        ma_ky: '09/2026',
        ghi_chu: 'Dự án trọng điểm của phường Vườn Lài, giải ngân đạt tiến độ',
        trang_thai_nop: 'da_nop'
      },
      {
        id: 'DA_001',
        stt_hien_thi: 1,
        ten_du_an: 'Dự án đầu tư xây dựng đường cao tốc TP. Hồ Chí Minh - Mộc Bài giai đoạn 1: Dự án TP3 - Bồi thường, hỗ trợ, tái định cư',
        du_an_thanh_phan: 'Dự án thành phần 3',
        ma_don_vi_gpmb: 'BQLDA.GiaoThong.HCM',
        chu_dau_tu_don_vi_gpmb: 'BQL DA ĐTXD các công trình giao thông thành phố',
        dia_ban: 'Khu vực Thành phố Hồ Chí Minh cũ',
        nhom_du_an: 'Dự án trọng điểm',
        tong_dien_tich_thu_hoi: 2150000,
        dien_tich_da_thu_hoi: 980000,
        tong_so_ho_anh_huong: 3200,
        so_co_tb_thu_hoi: 3100,
        so_da_kiem_dem: 2950,
        so_da_duyet_pa: 2700,
        so_da_cong_khai_pa: 2600,
        so_da_nhan_tien: 2400,
        so_da_ban_giao_mb: 2200,
        tong_kinh_phi_duyet: 7200000,
        gia_tri_da_chi_tra: 4800000,
        so_ho_tai_dinh_cu: 850,
        so_da_bo_tri_tdc: 620,
        ke_hoach_von_nam: 3500000,
        giai_ngan_luy_ke_nam: 2900000,
        moc_ke_hoach_gpmb: '2027-12-31',
        ngay_hoan_thanh_thuc_te: '2027-12-31',
        tinh_trang_tong_the: 'Đang triển khai',
        ma_ky: '09/2026',
        ghi_chu: 'Dự án trọng điểm cao tốc TP.HCM - Mộc Bài',
        trang_thai_nop: 'da_nop'
      },
      {
        id: 'DA_120',
        stt_hien_thi: 120,
        ten_du_an: 'Dự án Nâng cấp, mở rộng đường ĐT 743 đoạn qua địa bàn TP Dĩ An',
        du_an_thanh_phan: 'Đoạn Dĩ An',
        ma_don_vi_gpmb: 'BQLDA.DiAn',
        chu_dau_tu_don_vi_gpmb: 'Ban QLDA ĐTXD phường Dĩ An',
        dia_ban: 'Khu vực Bình Dương cũ',
        nhom_du_an: 'Thông thường',
        tong_dien_tich_thu_hoi: 180000,
        dien_tich_da_thu_hoi: 145000,
        tong_so_ho_anh_huong: 920,
        so_co_tb_thu_hoi: 920,
        so_da_kiem_dem: 910,
        so_da_duyet_pa: 890,
        so_da_cong_khai_pa: 880,
        so_da_nhan_tien: 850,
        so_da_ban_giao_mb: 820,
        tong_kinh_phi_duyet: 1650000,
        gia_tri_da_chi_tra: 1420000,
        so_ho_tai_dinh_cu: 180,
        so_da_bo_tri_tdc: 165,
        ke_hoach_von_nam: 600000,
        giai_ngan_luy_ke_nam: 550000,
        moc_ke_hoach_gpmb: '2026-12-31',
        ngay_hoan_thanh_thuc_te: '2026-12-31',
        tinh_trang_tong_the: 'Cơ bản hoàn thành',
        ma_ky: '09/2026',
        ghi_chu: 'Tiến độ bồi thường đạt yêu cầu',
        trang_thai_nop: 'da_nop'
      },
      {
        id: 'DA_VD4_DATP15',
        stt_hien_thi: 2,
        ten_du_an: 'DATP 1-5 Bồi thường, TĐC và xây dựng đường gom - đường Vành đai 4 TP.HCM',
        du_an_thanh_phan: 'DATP 1-5',
        ma_don_vi_gpmb: 'BQLDA_CUCHI',
        chu_dau_tu_don_vi_gpmb: 'Ban Bồi thường GPMB huyện Củ Chi',
        dia_ban: 'Củ Chi',
        nhom_du_an: 'Trọng điểm',
        tong_dien_tich_thu_hoi: 850000,
        dien_tich_da_thu_hoi: 320000,
        tong_so_ho_anh_huong: 4200,
        so_co_tb_thu_hoi: 4000,
        so_da_kiem_dem: 3900,
        so_da_duyet_pa: 3600,
        so_da_cong_khai_pa: 3400,
        so_da_nhan_tien: 3100,
        so_da_ban_giao_mb: 2800,
        tong_kinh_phi_duyet: 4500000,
        gia_tri_da_chi_tra: 1750000,
        so_ho_tai_dinh_cu: 1500,
        so_da_bo_tri_tdc: 900,
        ke_hoach_von_nam: 2000000,
        giai_ngan_luy_ke_nam: 950000,
        moc_ke_hoach_gpmb: '2027-12-31',
        ngay_hoan_thanh_thuc_te: '2028-03-31',
        tinh_trang_tong_the: 'Đang triển khai',
        ma_ky: '09/2026',
        ghi_chu: 'Ví dụ minh họa theo mẫu Sở',
        trang_thai_nop: 'da_nop'
      },
      {
        id: 'DA_XUYEN_TAM',
        stt_hien_thi: 3,
        ten_du_an: 'Cải tạo môi trường, bồi thường giải phóng mặt bằng rạch Xuyên Tâm',
        du_an_thanh_phan: '',
        ma_don_vi_gpmb: 'BQLDA_BINHTHANH',
        chu_dau_tu_don_vi_gpmb: 'Ban Bồi thường GPMB quận Bình Thạnh',
        dia_ban: 'Bình Thạnh',
        nhom_du_an: 'Trọng điểm',
        tong_dien_tich_thu_hoi: 120000,
        dien_tich_da_thu_hoi: 118000,
        tong_so_ho_anh_huong: 1850,
        so_co_tb_thu_hoi: 1850,
        so_da_kiem_dem: 1850,
        so_da_duyet_pa: 1850,
        so_da_cong_khai_pa: 1800,
        so_da_nhan_tien: 1780,
        so_da_ban_giao_mb: 1750,
        tong_kinh_phi_duyet: 1200000,
        gia_tri_da_chi_tra: 1150000,
        so_ho_tai_dinh_cu: 450,
        so_da_bo_tri_tdc: 440,
        ke_hoach_von_nam: 800000,
        giai_ngan_luy_ke_nam: 780000,
        moc_ke_hoach_gpmb: '2026-12-31',
        ngay_hoan_thanh_thuc_te: '2026-12-31',
        tinh_trang_tong_the: 'Cơ bản hoàn thành',
        ma_ky: '09/2026',
        ghi_chu: 'Dự án sắp hoàn thành bàn giao mặt bằng',
        trang_thai_nop: 'da_nop'
      }
    ],

    kho_khan: [
      {
        id: 1,
        ten_du_an: 'Dự án Nâng cấp, mở rộng đường Vườn Lài và xây dựng cầu Vàm Thuật',
        so_van_ban_nguon: 'BC số 45/BC-BQLDA',
        loai_vuong_mac: 'Chính sách bồi thường, giá đất',
        noi_dung_vuong_mac: 'Kiến nghị thẩm định điều chỉnh đơn giá bồi thường đất nông nghiệp xen kẽ',
        don_vi_xu_ly: 'UBND quận / Hội đồng thẩm định giá đất TP',
        de_xuat_kien_nghi: 'Đề nghị sớm có hướng dẫn hệ số điều chỉnh giá đất',
        cap_tham_quyen: 'UBND Thành phố',
        trang_thai: 'Đang xử lý',
        ma_ky: '09/2026',
        ma_don_vi_gpmb: 'BQLDA_VUONLAI'
      },
      {
        id: 2,
        ten_du_an: 'DATP 1-5 Bồi thường, TĐC và xây dựng đường gom - đường Vành đai 4 TP.HCM',
        so_van_ban_nguon: 'BC số 142/BC-BTGPMB',
        loai_vuong_mac: 'Tái định cư',
        noi_dung_vuong_mac: 'Một số hộ dân chưa đồng thuận vị trí nền tái định cư tại khu vực giáp ranh',
        don_vi_xu_ly: 'UBND huyện Củ Chi',
        de_xuat_kien_nghi: 'Kiến nghị UBND TP xem xét bổ sung chính sách hỗ trợ tạm cư',
        cap_tham_quyen: 'UBND Thành phố',
        trang_thai: 'Đang xử lý',
        ma_ky: '09/2026',
        ma_don_vi_gpmb: 'BQLDA_CUCHI'
      }
    ],

    ky_bao_cao: [
      { ma_ky: '09/2026', tieu_de_ky: 'Tháng 09 năm 2026', trang_thai: 'dang_thu_thap' },
      { ma_ky: '08/2026', tieu_de_ky: 'Tháng 08 năm 2026', trang_thai: 'da_khoa' },
      { ma_ky: '07/2026', tieu_de_ky: 'Tháng 07 năm 2026', trang_thai: 'da_khoa' }
    ]
  },

  // 1. KHỞI TẠO CLIENT
  init: function() {
    if (window.supabase && CONFIG.SUPABASE_URL && CONFIG.SUPABASE_KEY && !CONFIG.SUPABASE_KEY.includes('placeholder')) {
      try {
        this.client = window.supabase.createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_KEY);
        console.log('[DB] Kết nối Supabase thành công:', CONFIG.SUPABASE_URL);
      } catch (err) {
        console.warn('[DB] Không thể kết nối Supabase, chuyển sang chế độ Demo:', err);
      }
    } else {
      console.log('[DB] Đang chạy chế độ Demo.');
    }
  },

  // 2. XÁC THỰC ĐĂNG NHẬP (HỖ TRỢ 3 NHÓM TÀI KHOẢN)
  dangNhap: async function(tenDangNhap, matKhau) {
    if (!tenDangNhap) return { success: false, error: 'Vui lòng nhập tên đăng nhập!' };

    // Thử xác thực trực tiếp qua CSDL Supabase
    if (this.client) {
      try {
        const { data, error } = await this.client
          .from(CONFIG.BANG.TAI_KHOAN)
          .select('*, don_vi(*)')
          .ilike('ten_dang_nhap', tenDangNhap.trim())
          .eq('mat_khau_hash', matKhau.trim())
          .eq('kich_hoat', true)
          .maybeSingle();

        if (!error && data) {
          const user = {
            id: data.id,
            ten_dang_nhap: data.ten_dang_nhap,
            ho_ten: data.ho_ten,
            vai_tro: data.vai_tro,
            ma_don_vi: data.ma_don_vi,
            ten_don_vi: data.don_vi ? data.don_vi.ten_don_vi : (data.ho_ten || 'Đơn vị cơ sở')
          };
          return { success: true, user };
        }
      } catch (err) {
        console.warn('[DB] Supabase auth check fallback to mock:', err);
      }
    }

    // Fallback Mock accounts
    const mock = this._mockData.tai_khoan.find(
      u => u.ten_dang_nhap.toLowerCase() === tenDangNhap.trim().toLowerCase() && u.mat_khau_hash === matKhau.trim()
    );

    if (mock) {
      return { success: true, user: { ...mock } };
    }

    return { success: false, error: 'Tên đăng nhập hoặc mật khẩu không chính xác!' };
  },

  // 3. LẤY DANH SÁCH DỰ ÁN & TIẾN ĐỘ THEO KỲ (ÁP DỤNG BỘ LỌC PHÂN QUYỀN)
  layDanhSachTienDo: async function(maKy, currentUser) {
    const ky = maKy || CONFIG.KY_MAC_DINH;
    let list = [];

    if (this.client) {
      try {
        let query = this.client
          .from(CONFIG.VIEWS.TIEN_DO_CHI_TIET)
          .select('*')
          .eq('ma_ky', ky)
          .order('stt_hien_thi', { ascending: true });

        // PHÂN QUYỀN NHÓM 3: Đơn vị thực hiện chỉ thấy dự án của mình
        if (currentUser && currentUser.vai_tro === 'don_vi_thuc_hien' && currentUser.ma_don_vi) {
          query = query.eq('ma_don_vi_gpmb', currentUser.ma_don_vi);
        }

        const { data, error } = await query;
        if (!error && data && data.length > 0) {
          return data;
        }
      } catch (err) {
        console.warn('[DB] Lỗi truy vấn view tien_do_chi_tiet:', err);
      }
    }

    // Fallback Mock data
    list = this._mockData.du_an.filter(d => !d.ma_ky || d.ma_ky === ky);
    if (currentUser && currentUser.vai_tro === 'don_vi_thuc_hien' && currentUser.ma_don_vi) {
      list = list.filter(d => d.ma_don_vi_gpmb === currentUser.ma_don_vi);
    }
    return list;
  },

  // 4. LẤY SỐ LIỆU TỔNG HỢP VĨ MÔ (TÍNH TOÁN THEO QUYỀN HẠN)
  layTongHopToanTP: async function(maKy, currentUser, danhSachHienTai) {
    const ky = maKy || CONFIG.KY_MAC_DINH;

    // Nếu là đơn vị thực hiện -> Tự động tính toán tổng hợp chỉ cho tập dự án của đơn vị mình
    if (currentUser && currentUser.vai_tro === 'don_vi_thuc_hien') {
      const list = danhSachHienTai || await this.layDanhSachTienDo(ky, currentUser);
      return this._tinhTongHopTuDanhSach(ky, list);
    }

    // Nếu là Admin KHTC hoặc Quản lý BTTDC -> Lấy số liệu toàn TP từ View Supabase
    if (this.client) {
      try {
        const { data, error } = await this.client
          .from(CONFIG.VIEWS.TONG_HOP_TOAN_TP)
          .select('*')
          .eq('ma_ky', ky)
          .maybeSingle();

        if (!error && data) return data;
      } catch (err) {
        console.warn('[DB] Lỗi truy vấn view v_tong_hop_toan_tp:', err);
      }
    }

    // Fallback tính toán từ mock
    const list = danhSachHienTai || await this.layDanhSachTienDo(ky, currentUser);
    return this._tinhTongHopTuDanhSach(ky, list);
  },

  // Hàm tính toán nội bộ 15 chỉ tiêu vĩ mô từ danh sách dự án
  _tinhTongHopTuDanhSach: function(ky, list) {
    if (!list || list.length === 0) {
      return {
        ma_ky: ky,
        tong_so_du_an: 0,
        so_du_an_trong_diem: 0,
        so_du_an_hoan_thanh: 0,
        so_du_an_dang_trien_khai: 0,
        so_du_an_chua_trien_khai: 0,
        so_du_an_cham_tien_do: 0,
        tong_dien_tich_thu_hoi_tp: 0,
        tong_dien_tich_da_thu_hoi_tp: 0,
        ty_le_dien_tich_hoan_thanh_tp: 0,
        tong_kinh_phi_duyet_tp: 0,
        tong_gia_tri_da_chi_tra_tp: 0,
        ty_le_chi_tra_kinh_phi_tp: 0,
        tong_ke_hoach_von_nam_tp: 0,
        tong_giai_ngan_nam_tp: 0,
        ty_le_giai_ngan_von_tp: 0
      };
    }

    const tongDT = list.reduce((sum, d) => sum + (Number(d.tong_dien_tich_thu_hoi) || 0), 0);
    const daThuDT = list.reduce((sum, d) => sum + (Number(d.dien_tich_da_thu_hoi) || 0), 0);
    const tongKP = list.reduce((sum, d) => sum + (Number(d.tong_kinh_phi_duyet) || 0), 0);
    const daChiKP = list.reduce((sum, d) => sum + (Number(d.gia_tri_da_chi_tra) || 0), 0);
    const tongKHV = list.reduce((sum, d) => sum + (Number(d.ke_hoach_von_nam) || 0), 0);
    const daGN = list.reduce((sum, d) => sum + (Number(d.giai_ngan_luy_ke_nam) || 0), 0);

    const soCham = list.filter(d => {
      const ch = UTILS.tinhChenhLechTienDo(d.ngay_hoan_thanh_thuc_te, d.moc_ke_hoach_gpmb);
      return ch !== null && ch > 0;
    }).length;

    return {
      ma_ky: ky,
      tong_so_du_an: list.length,
      so_du_an_trong_diem: list.filter(d => d.nhom_du_an === 'Trọng điểm').length,
      so_du_an_hoan_thanh: list.filter(d => d.tinh_trang_tong_the === 'Đã hoàn thành' || d.tinh_trang_tong_the === 'Cơ bản hoàn thành').length,
      so_du_an_dang_trien_khai: list.filter(d => d.tinh_trang_tong_the === 'Đang triển khai').length,
      so_du_an_chua_trien_khai: list.filter(d => d.tinh_trang_tong_the === 'Chưa triển khai').length,
      so_du_an_cham_tien_do: soCham,
      tong_dien_tich_thu_hoi_tp: tongDT,
      tong_dien_tich_da_thu_hoi_tp: daThuDT,
      ty_le_dien_tich_hoan_thanh_tp: tongDT > 0 ? Math.round((daThuDT / tongDT) * 10000) / 100 : 0,
      tong_kinh_phi_duyet_tp: tongKP,
      tong_gia_tri_da_chi_tra_tp: daChiKP,
      ty_le_chi_tra_kinh_phi_tp: tongKP > 0 ? Math.round((daChiKP / tongKP) * 10000) / 100 : 0,
      tong_ke_hoach_von_nam_tp: tongKHV,
      tong_giai_ngan_nam_tp: daGN,
      ty_le_giai_ngan_von_tp: tongKHV > 0 ? Math.round((daGN / tongKHV) * 10000) / 100 : 0
    };
  },

  // 5. LẤY DANH SÁCH KHÓ KHĂN - KIẾN NGHỊ (ÁP DỤNG PHÂN QUYỀN)
  layDanhSachKhoKhan: async function(maKy, currentUser) {
    const ky = maKy || CONFIG.KY_MAC_DINH;
    if (this.client) {
      try {
        let query = this.client
          .from(CONFIG.BANG.KHO_KHAN)
          .select('*, du_an(ten_du_an, ma_don_vi_gpmb)')
          .eq('ma_ky', ky);

        const { data, error } = await query;
        if (!error && data) {
          let res = data.map(k => ({
            ...k,
            ten_du_an: k.du_an ? k.du_an.ten_du_an : k.ten_du_an,
            ma_don_vi_gpmb: k.du_an ? k.du_an.ma_don_vi_gpmb : null
          }));

          if (currentUser && currentUser.vai_tro === 'don_vi_thuc_hien' && currentUser.ma_don_vi) {
            res = res.filter(k => k.ma_don_vi_gpmb === currentUser.ma_don_vi);
          }
          return res;
        }
      } catch (err) {
        console.warn('[DB] Lỗi lấy khó khăn kiến nghị:', err);
      }
    }

    let list = this._mockData.kho_khan.filter(k => !k.ma_ky || k.ma_ky === ky);
    if (currentUser && currentUser.vai_tro === 'don_vi_thuc_hien' && currentUser.ma_don_vi) {
      list = list.filter(k => k.ma_don_vi_gpmb === currentUser.ma_don_vi);
    }
    return list;
  },

  // 6. CẬP NHẬT TIẾN ĐỘ DỰ ÁN
  capNhatTienDo: async function(duLieu) {
    if (this.client) {
      try {
        const { data, error } = await this.client
          .from(CONFIG.BANG.TIEN_DO)
          .upsert(duLieu, { onConflict: 'ma_du_an, ma_ky' });
        if (error) throw error;
        return { success: true, data };
      } catch (err) {
        console.error('[DB] Lỗi cập nhật tiến độ:', err);
        return { success: false, error: err.message };
      }
    }

    // Mock update
    const idx = this._mockData.du_an.findIndex(d => d.id === duLieu.ma_du_an);
    if (idx >= 0) {
      this._mockData.du_an[idx] = { ...this._mockData.du_an[idx], ...duLieu };
    }
    return { success: true };
  },

  // 7. THÊM DỰ ÁN MỚI (DÀNH CHO ADMIN & QUẢN LÝ BTTDC)
  themDuAn: async function(duAnMoi) {
    if (this.client) {
      try {
        const { data, error } = await this.client
          .from(CONFIG.BANG.DU_AN)
          .insert(duAnMoi);
        if (error) throw error;

        // Tạo luôn bản ghi tiến độ rỗng cho kỳ hiện tại
        await this.client.from(CONFIG.BANG.TIEN_DO).insert({
          ma_du_an: duAnMoi.id,
          ma_ky: CONFIG.KY_MAC_DINH,
          tinh_trang_tong_the: 'Đang triển khai'
        });

        return { success: true, data };
      } catch (err) {
        console.error('[DB] Lỗi thêm dự án:', err);
        return { success: false, error: err.message };
      }
    }

    // Mock insert
    this._mockData.du_an.push({
      ...duAnMoi,
      stt_hien_thi: this._mockData.du_an.length + 1,
      ma_ky: CONFIG.KY_MAC_DINH,
      tinh_trang_tong_the: 'Đang triển khai'
    });
    return { success: true };
  },

  // 8. XÓA DỰ ÁN (DÀNH CHO ADMIN & QUẢN LÝ BTTDC)
  xoaDuAn: async function(daId) {
    if (this.client) {
      try {
        // Xóa tiến độ trước
        await this.client.from(CONFIG.BANG.TIEN_DO).delete().eq('ma_du_an', daId);
        await this.client.from(CONFIG.BANG.KHO_KHAN).delete().eq('ma_du_an', daId);
        const { error } = await this.client.from(CONFIG.BANG.DU_AN).delete().eq('id', daId);
        if (error) throw error;
        return { success: true };
      } catch (err) {
        console.error('[DB] Lỗi xóa dự án:', err);
        return { success: false, error: err.message };
      }
    }

    // Mock delete
    this._mockData.du_an = this._mockData.du_an.filter(d => d.id !== daId);
    return { success: true };
  },

  // 9. LẤY DANH SÁCH KỲ BÁO CÁO
  layDanhSachKy: async function() {
    if (this.client) {
      try {
        const { data, error } = await this.client
          .from(CONFIG.BANG.KY_BAO_CAO)
          .select('*')
          .order('ngay_bat_dau', { ascending: false });
        if (!error && data && data.length > 0) return data;
      } catch (err) {
        console.warn('[DB] Lỗi lấy danh sách kỳ báo cáo:', err);
      }
    }
    return this._mockData.ky_bao_cao;
  },

  // 10. THÊM KỲ BÁO CÁO MỚI (DÀNH CHO ADMIN & QUẢN LÝ BTTDC)
  themKyBaoCao: async function(kyMoi) {
    if (this.client) {
      try {
        const { data, error } = await this.client
          .from(CONFIG.BANG.KY_BAO_CAO)
          .insert(kyMoi);
        if (error) throw error;
        return { success: true, data };
      } catch (err) {
        console.error('[DB] Lỗi thêm kỳ báo cáo:', err);
        return { success: false, error: err.message };
      }
    }

    // Mock
    this._mockData.ky_bao_cao.unshift(kyMoi);
    return { success: true };
  },

  // 11. XÓA KỲ BÁO CÁO (DÀNH CHO ADMIN & QUẢN LÝ BTTDC)
  xoaKyBaoCao: async function(maKy) {
    if (this.client) {
      try {
        const { error } = await this.client
          .from(CONFIG.BANG.KY_BAO_CAO)
          .delete()
          .eq('ma_ky', maKy);
        if (error) throw error;
        return { success: true };
      } catch (err) {
        console.error('[DB] Lỗi xóa kỳ báo cáo:', err);
        return { success: false, error: err.message };
      }
    }

    this._mockData.ky_bao_cao = this._mockData.ky_bao_cao.filter(k => k.ma_ky !== maKy);
    return { success: true };
  },

  // 12. LẤY DANH SÁCH ĐƠN VỊ THỰC HIỆN
  layDanhSachDonVi: async function() {
    if (this.client) {
      try {
        const { data, error } = await this.client
          .from(CONFIG.BANG.DON_VI)
          .select('*')
          .eq('kich_hoat', true)
          .order('ten_don_vi', { ascending: true });
        if (!error && data && data.length > 0) return data;
      } catch (err) {
        console.warn('[DB] Lỗi lấy danh sách đơn vị:', err);
      }
    }
    return this._mockData.don_vi;
  }
};
