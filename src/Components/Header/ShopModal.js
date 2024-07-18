import React from 'react';
import './modal.css';

export default function ShopModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-btn" onClick={onClose}>✕</button>
        <h2>CỬA HÀNG</h2>
        <h3>Chào mừng bạn đến với cửa hàng của chúng tôi! Duyệt qua bộ sưu tập đồ trang sức cao cấp độc quyền của chúng tôi, bao gồm:</h3>
        <h3>Nhẫn:</h3>  <p>Từ nhẫn đính hôn đến nhẫn thời trang, hãy tìm chiếc nhẫn hoàn hảo.</p>
        <h3>Dây chuyền:</h3>  <p>Những món đồ trang nhã và vượt thời gian cho mọi dịp.</p>
        <h3>Vòng tay:</h3>  <p>Bông tai được chế tác đẹp mắt với nhiều kiểu dáng và chất liệu khác nhau.</p>
        <h3>Bông tai:</h3>  <p>Thông tin về cửa hàng...</p>
        <h3>Đội ngũ nhân viên chuyên nghiệp của chúng tôi luôn sẵn sàng giúp bạn tìm được món đồ hoàn hảo cho bất kỳ dịp nào. Hãy ghé thăm cửa hàng của chúng tôi hoặc mua sắm trực tuyến để khám phá bộ sưu tập đầy đủ của chúng tôi.</h3>  
      </div>
    </div>
  );
}
