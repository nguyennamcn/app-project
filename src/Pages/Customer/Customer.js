import React, { useState, useEffect } from 'react';
import { adornicaServ } from '../../service/adornicaServ';
import ReactPaginate from 'react-paginate';
import Modal from 'react-modal';
import './Customer.css';

Modal.setAppElement('#root'); // Đặt app element cho modal

export default function CustomerDetails() {
  const [customerDetails, setCustomerDetails] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editAddress, setEditAddress] = useState('');
  const [editDateOfBirth, setEditDateOfBirth] = useState('');
  const itemsPerPage = 7;

  useEffect(() => {
    adornicaServ.getCustomerDetails()
      .then((res) => {
        console.log(res.data.metadata);
        const sortedDetails = res.data.metadata.sort((a, b) => a.customerId - b.customerId);
        setCustomerDetails(sortedDetails);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const currentDate = new Date().toLocaleDateString();

  const filteredDetails = customerDetails.filter(detail =>
    detail.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    detail.phone.includes(searchTerm)
  );

  const offset = currentPage * itemsPerPage;
  const currentPageData = filteredDetails.slice(offset, offset + itemsPerPage);
  const pageCount = Math.ceil(filteredDetails.length / itemsPerPage);

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  const formatBirthday = (date) => {
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return new Date(date).toLocaleDateString('vi-VN', options);
  };

  const formatPrice = (price) => {
    if (price === null || price === undefined) {
      return '0';
    }
    return price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
  };

  const openCustomerModal = (customerId) => {
    const selected = customerDetails.find(detail => detail.customerId === customerId);
    setSelectedCustomer(selected);
    setEditName(selected.name);
    setEditPhone(selected.phone);
    setEditAddress(selected.address);
    setEditDateOfBirth(selected.dateOfBirth);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setSelectedCustomer(null);
    setEditName('');
    setEditPhone('');
    setEditAddress('');
    setEditDateOfBirth('');
    setModalIsOpen(false);
  };

  const updateCustomer = () => {
    const newData = {
      customerName: editName,
      customerPhone: editPhone,
      address: editAddress,
      dateOfBirth: editDateOfBirth
    };

    adornicaServ.updateCustomer(selectedCustomer.customerId, newData)
      .then((res) => {
        console.log(`Updated customer with id ${selectedCustomer.customerId}`, res.data);
        // Update customerDetails state or perform any necessary actions after update
        // For example:
        // setCustomerDetails(prevDetails => {
        //   return prevDetails.map(detail => detail.customerId === selectedCustomer.customerId ? { ...detail, ...newData } : detail);
        // });
        closeModal(); // Close modal after successful update if desired
      })
      .catch((err) => {
        console.error(`Error updating customer with id ${selectedCustomer.customerId}`, err);
        // Handle error scenarios
      });
  };

  return (
    <div className="customer-container">
      <h2 className="customer-header">CUSTOMER INFORMATION</h2>
      <input 
        type="text"
        placeholder="Search by Name or Phone"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="customer-searchBar"
      />
      <div className="customer-tableContainer">
        <table className="customer-table">
          <thead>
            <tr>
              <th className="customer-th">ID</th>
              <th className="customer-th">Name</th>
              <th className="customer-th">Phone</th>
              <th className="customer-th">Address</th>
              <th className="customer-th">Birthday</th>
              <th className="customer-th">Discount (%)</th>
              <th className="customer-th">Purchased (VND)</th>
            </tr>
          </thead>
          <tbody>
            {currentPageData.map((detail, index) => (
              <tr key={index} className={index % 2 === 0 ? 'customer-rowEven' : 'customer-rowOdd'}>
                <td className="customer-td" data-label="ID">{detail.customerId}</td>
                <td 
                  className="customer-td" 
                  data-label="Name"
                  onClick={() => openCustomerModal(detail.customerId)}
                  style={{ cursor: 'pointer', textDecoration: 'underline' }}
                >
                  {detail.name}
                </td>
                <td className="customer-td" data-label="Phone">{detail.phone}</td>
                <td className="customer-td" data-label="Address">{detail.address}</td>
                <td className="customer-td" data-label="Birthday">{formatBirthday(detail.dateOfBirth)}</td>
                <td className="customer-td" data-label="Discount (%)">{detail.percentDiscount}</td>
                <td className="customer-td" data-label="Purchased (VND)">{formatPrice(detail.totalAmountPurchased)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="customer-paginationContainer">
        <ReactPaginate
          previousLabel={'Previous'}
          nextLabel={'Next'}
          breakLabel={'...'}
          pageCount={pageCount}
          marginPagesDisplayed={2}
          pageRangeDisplayed={5}
          onPageChange={handlePageClick}
          containerClassName={'customer-pagination'}
          activeClassName={'active'}
          pageClassName={'page-item'}
          pageLinkClassName={'page-link'}
          previousClassName={'page-item'}
          previousLinkClassName={'page-link'}
          nextClassName={'page-item'}
          nextLinkClassName={'page-link'}
          breakClassName={'page-item'}
          breakLinkClassName={'page-link'}
          disabledClassName={'disabled'}
        />
      </div>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Customer Modal"
        className="customer-modal"
        overlayClassName="customer-modal-overlay"
      >
        <div className="customer-modal-content">
          <span className="customer-modal-close" onClick={closeModal}>&times;</span>
          <h2>Customer Details</h2>
          <p><strong>ID:</strong> {selectedCustomer?.customerId}</p>
          <div className="customer-edit-form">
            <label>
              <strong>Name:</strong>
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
              />
            </label>
            <label>
              <strong>Phone:</strong>
              <input
                type="text"
                value={editPhone}
                onChange={(e) => setEditPhone(e.target.value)}
              />
            </label>
            <label>
              <strong>Address:</strong>
              <input
                type="text"
                value={editAddress}
                onChange={(e) => setEditAddress(e.target.value)}
              />
            </label>
            <label>
              <strong>Birthday:</strong>
              <input
                type="text"
                value={editDateOfBirth}
                onChange={(e) => setEditDateOfBirth(e.target.value)}
              />
            </label>
          </div>
          <button onClick={updateCustomer}>Update</button>
        </div>
      </Modal>
    </div>
  );
}