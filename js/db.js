// ==============================================================================
// DB.JS — Tầng truy xuất Cơ sở dữ liệu (Supabase Data Access Layer)
// Sở Nông nghiệp và Môi trường TP.HCM — Phòng Kế hoạch - Tài chính
// Phiên bản: 1.0.0 · Cập nhật: 19/09/2026
// ==============================================================================

const DB = {
  client: null,

  // Dữ liệu bộ nhớ tạm thời khi chưa kết nối Supabase thật (để UI hoạt động ngay)
  _mockData: {
    du_an: [
      {
        id: 'DA_VD4_DATP15',
        stt_hien_thi: 1,
        ten_du_an: 'DATP 1-5 Bồi thường, TĐC và xây dựng đường gom - đường Vành đai 4 TP.HCM',
        du_an_thanh_phan: 'DATP 1-5',
        chu_dau_tu_don_vi_gpmb: 'Ban Bồi thường, GPMB TP.HCM',
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
        ghi_chu: 'Ví dụ minh họa theo mẫu Sở - xóa trước khi nhập số liệu thật',
        trang_thai_nop: 'da_nop'
      },
      {
        id: 'DA_XUYEN_TAM',
        stt_hien_thi: 2,
        ten_du_an: 'Cải tạo rạch Xuyên Tâm',
        du_an_thanh_phan: '',
        chu_dau_tu_don_vi_gpmb: 'Ban Bồi thường, GPMB TP.HCM',
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
        ghi_chu: 'Khẩn trương hoàn tất 10 hộ cuối cùng',
        trang_thai_nop: 'da_nop'
      }
    ],
    kho_khan: [
      {
        id: 1,
        ten_du_an: 'DATP 1-5 Bồi thường, TĐC và xây dựng đường gom - đường Vành đai 4 TP.HCM',
        so_van_ban_nguon: 'BC số 142/BC-BTGPMB',
        loai_vuong_mac: 'Tái định cư',
        noi_dung_vuong_mac: 'Một số hộ dân chưa đồng thuận vị trí nền tái định cư tại khu vực giáp ranh',
        don_vi_xu_ly: 'UBND huyện Củ Chi',
        de_xuat_kien_nghi: 'Kiến nghị UBND TP xem xét bổ sung chính sách hỗ trợ tạm cư',
        cap_tham_quyen: 'UBND Thành phố',
        trang_thai: 'Đang xử lý',
        ma_ky: '09/2026'
      }
    ],
    ky_bao_cao: [
      { ma_ky: '09/2026', tieu_de_ky: 'Tháng 09 năm 2026', trang_thai: 'dang_thu_thap' },
      { ma_ky: '08/2026', tieu_de_ky: 'Tháng 08 năm 2026', trang_thai: 'da_khoa' }
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
      console.log('[DB] Đang chạy chế độ Demo (chưa cấu hình Key Supabase thực tế).');
    }
  },

  // 2. LẤY DANH SÁCH DỰ ÁN & TIẾN ĐỘ THEO KỲ
  layDanhSachTienDo: async function(maKy) {
    const ky = maKy || CONFIG.KY_MAC_DINH;
    if (this.client) {
      try {
        const { data, error } = await this.client
          .from(CONFIG.VIEWS.TIEN_DO_CHI_TIET)
          .select('*')
          .eq('ma_ky', ky)
          .order('stt_hien_thi', { ascending: true });
        
        if (error) throw error;
        if (data && data.length > 0) return data;
      } catch (err) {
        console.warn('[DB] Lỗi truy vấn Supabase, sử dụng mock data:', err);
      }
    }
    // Trả về mock data nếu chưa kết nối hoặc dữ liệu trống
    return this._mockData.du_an.filter(d => !d.ma_ky || d.ma_ky === ky);
  },

  // 3. LẤY SỐ LIỆU TỔNG HỢP TOÀN TP (15 CHỈ TIÊU VĨ MÔ)
  layTongHopToanTP: async function(maKy) {
    const ky = maKy || CONFIG.KY_MAC_DINH;
    if (this.client) {
      try {
        const { data, error } = await this.client
          .from(CONFIG.VIEWS.TONG_HOP_TOAN_TP)
          .select('*')
          .eq('ma_ky', ky)
          .single();
        if (!error && data) return data;
      } catch (err) {
        console.warn('[DB] Lỗi lấy tổng hợp TP từ Supabase:', err);
      }
    }

    // Tự động tính toán từ mock data
    const list = this._mockData.du_an.filter(d => !d.ma_ky || d.ma_ky === ky);
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

  // 4. LẤY DANH SÁCH KHÓ KHĂN - KIẾN NGHỊ
  layDanhSachKhoKhan: async function(maKy) {
    const ky = maKy || CONFIG.KY_MAC_DINH;
    if (this.client) {
      try {
        const { data, error } = await this.client
          .from(CONFIG.BANG.KHO_KHAN)
          .select('*, du_an(ten_du_an)')
          .eq('ma_ky', ky);
        if (!error && data) {
          return data.map(k => ({
            ...k,
            ten_du_an: k.du_an ? k.du_an.ten_du_an : k.ten_du_an
          }));
        }
      } catch (err) {
        console.warn('[DB] Lỗi lấy danh sách khó khăn kiến nghị:', err);
      }
    }
    return this._mockData.kho_khan.filter(k => !k.ma_ky || k.ma_ky === ky);
  },

  // 5. CẬP NHẬT TIẾN ĐỘ DỰ ÁN
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

  // 6. LẤY DANH SÁCH KỲ BÁO CÁO
  layDanhSachKy: async function() {
    if (this.client) {
      try {
        const { data, error } = await this.client
          .from(CONFIG.BANG.KY_BAO_CAO)
          .select('*')
          .order('ngay_bat_dau', { ascending: false });
        if (!error && data) return data;
      } catch (err) {
        console.warn('[DB] Lỗi lấy danh sách kỳ báo cáo:', err);
      }
    }
    return this._mockData.ky_bao_cao;
  }
};
