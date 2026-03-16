import { User } from 'src/schemas/user.schema';

export function welcomeRegisterEmail(user: User) {
  const name = user?.fullname ?? 'Bạn';
  const email = user?.email ?? '';
  const createdAt = new Date();

  return `
  <div style="margin:0;padding:0;background:#f6f7fb;font-family:Arial,sans-serif">
    <div style="max-width:720px;margin:0 auto;padding:24px">
      
      <div style="background:#ffffff;border-radius:14px;overflow:hidden;box-shadow:0 8px 24px rgba(0,0,0,.06)">
        
        <div style="padding:22px 24px;background:linear-gradient(135deg,#111827,#2563eb);color:#fff">
          <div style="font-size:20px;font-weight:700">
            🎉 Chào mừng bạn đến với hệ thống
          </div>
          <div style="margin-top:6px;font-size:13px;opacity:.9">
            Tài khoản của bạn đã được tạo thành công
          </div>
        </div>

        <div style="padding:22px 24px">

          <div style="font-size:15px;color:#111827;line-height:1.7">
            Xin chào <b>${escapeHtml(name)}</b>,
            <br/><br/>
            Cảm ơn bạn đã đăng ký tài khoản tại hệ thống của chúng tôi.  
            Chúng tôi rất vui khi được đồng hành cùng bạn.
          </div>

          <div style="margin-top:18px;background:#f9fafb;border:1px solid #eef2f7;border-radius:12px;padding:16px">
            <div style="font-weight:700;margin-bottom:10px">Thông tin tài khoản</div>

            <div style="font-size:14px;line-height:1.7;color:#111827">
              <div><b>Họ tên:</b> ${escapeHtml(name)}</div>
              ${email ? `<div><b>Email:</b> ${escapeHtml(email)}</div>` : ''}
              <div><b>Thời gian đăng ký:</b> ${escapeHtml(
                createdAt.toLocaleString('vi-VN'),
              )}</div>
            </div>
          </div>

          <div style="margin-top:18px;font-size:14px;color:#374151;line-height:1.7">
            Bạn có thể bắt đầu sử dụng tài khoản để:
            <ul style="margin-top:8px;padding-left:18px">
              <li>Quản lý thông tin cá nhân</li>
              <li>Thực hiện các giao dịch nhanh chóng</li>
              <li>Theo dõi lịch sử hoạt động</li>
            </ul>
          </div>

          <div style="margin-top:20px;color:#6b7280;font-size:12px;line-height:1.6">
            Nếu bạn không thực hiện đăng ký này, vui lòng bỏ qua email hoặc liên hệ bộ phận hỗ trợ của chúng tôi.
          </div>

        </div>

      </div>

      <div style="text-align:center;margin-top:14px;color:#9ca3af;font-size:12px">
        © ${new Date().getFullYear()} Hệ thống của bạn • Email được gửi tự động
      </div>

    </div>
  </div>
  `;
}

function escapeHtml(input: string) {
  return String(input ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
