import React from 'react';
import './modal.css';

export default function PolicyModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn-header" onClick={onClose}>✕</button>
        <h2>CHÍNH SÁCH</h2>
        <h3>Chính sách đổi trả bảo hành</h3>
        <p>
          Tất cả các sản phẩm của chúng tôi đều được bảo hành sáu tháng. Nếu bạn gặp bất kỳ vấn đề nào với sản phẩm của mình, bạn có thể đổi nó lấy một sản phẩm mới trong thời gian này.
        </p>
        <h3>Chính sách khách hàng thân thiết</h3>
        <p>
          Chương trình khách hàng thân thiết của chúng tôi thưởng cho bạn sau mỗi lần mua hàng. Bạn kiếm được điểm có thể được đổi để giảm giá cho các đơn hàng trong tương lai. Đăng ký ngay hôm nay để bắt đầu kiếm tiền!
        </p>
        <h3>Chính sách bảo mật thông tin khách hàng</h3>
        <p>
          Chúng tôi rất nghiêm túc trong bảo mật. Tất cả thông tin cá nhân của bạn được lưu trữ an toàn và không bao giờ được chia sẻ với bên thứ ba.
        </p>
      </div>
    </div>
  );
}
