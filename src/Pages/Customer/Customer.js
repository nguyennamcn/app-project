import React, { useState, useEffect } from 'react';
import { adornicaServ } from '../../service/adornicaServ';
import ReactPaginate from 'react-paginate';
import './Customer.css';

export default function CustomerDetails() {
  const [customerDetails, setCustomerDetails] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
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
                <td className="customer-td" data-label="Name">{detail.name}</td>
                <td className="customer-td" data-label="Phone">{detail.phone}</td>
                <td className="customer-td" data-label="Address">{detail.address}</td>
                <td className="customer-td" data-label="Birthday">{formatBirthday(detail.dateOfBirth)}</td>
                <td className="customer-td" data-label="Discount (%)">{detail.percentDiscount}</td>
                <td className="customer-td" data-label="Purchased (VND)">{detail.totalAmountPurchased}</td>
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
    </div>
  );
}
