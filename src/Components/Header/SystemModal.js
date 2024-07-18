import React from 'react';
import './modal.css';

export default function SystemModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-btn" onClick={onClose}>✕</button>
        <h2>HỆ THỐNG</h2>
        <h3>Hệ thống của chúng tôi được thiết kế để cung cấp trải nghiệm mua sắm tốt nhất cho khách hàng. Dưới đây là một số tính năng và lợi ích:</h3>
        <h3>Giao dịch an toàn:</h3>  <p>Chúng tôi sử dụng công nghệ mới nhất để đảm bảo thông tin của bạn.</p>
        <h3>Xử lý nhanh:</h3>  <p>Tận hưởng việc xử lý đơn hàng và giao hàng nhanh chóng và hiệu quả.</p>
        <h3>Hỗ trợ khách hàng:</h3>  <p>Nhóm hỗ trợ của chúng tôi luôn sẵn sàng hỗ trợ bạn nếu có bất kỳ câu hỏi hoặc thắc mắc nào.</p>
        <h3>Tìm hiểu thêm về hệ thống của chúng tôi và lợi ích của nó bằng cách truy cập cửa hàng của chúng tôi hoặc liên hệ với nhóm dịch vụ khách hàng của chúng tôi</h3>  
      </div>
    </div>
  );
}
