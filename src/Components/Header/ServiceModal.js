import React from 'react';
import './modal.css';

export default function ServiceModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>✕</button>
        <h2>DỊCH VỤ</h2>
        <p>Chúng tôi cung cấp nhiều dịch vụ để đáp ứng tất cả các nhu cầu về trang sức của bạn, bao gồm:</p>
        <h3>Thiết Kế Tùy Chỉnh:</h3> <p>Tạo ra một món trang sức độc đáo phản ánh phong cách cá nhân của bạn.</p>
        <h3>Sửa Chữa:</h3> <p>Khôi phục lại vẻ đẹp của những món trang sức quý giá của bạn với dịch vụ sửa chữa chuyên nghiệp.</p>
        <h3>Định Giá:</h3> <p>Đánh giá chính xác giá trị trang sức của bạn cho mục đích bảo hiểm hoặc bán lại.</p>
        <h3>Làm Sạch:</h3> <p>Giữ cho trang sức của bạn luôn sáng bóng với dịch vụ làm sạch chuyên nghiệp của chúng tôi.</p>
        
        <h3>Hãy ghé thăm cửa hàng của chúng tôi để trải nghiệm dịch vụ khách hàng tuyệt vời và chất lượng chế tác tinh xảo.</h3>
      </div>
    </div>
  );
}
