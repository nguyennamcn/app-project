import React, { useState, useEffect } from 'react';
import { adornicaServ } from '../../service/adornicaServ';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { notification } from 'antd';

const styles = {
  container: {
    maxHeight: '70vh', // Adjust this value as needed
    overflowY: 'auto', // Add this line to enable vertical scrolling
    background: '#f0f8ff',
    padding: '30px 30px',
    maxWidth: '900px',
    margin: 'auto',
    borderRadius: '10px',
    boxShadow: '0px 0px 15px rgba(0, 0, 0, 0.2)',
    fontFamily: 'Arial, sans-serif',
  },
  form: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '15px',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
  },
  label: {
    fontSize: '15px',
    color: '#333',
    marginBottom: '5px',
    fontWeight: 'bold',
  },
  input: {
    padding: '5px',
    border: '2px solid #cccccc',
    borderRadius: '5px',
    fontSize: '20px',
  },
  button: {
    backgroundColor: '#222222',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '14px',
    gridColumn: 'span 2',
    textAlign: 'center',
  },
  addButton: {
    backgroundColor: '#00ca4d',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
    textAlign: 'center',
    gridColumn: 'span 2',
    justifySelf: 'center',
    marginTop: '20px'
  },
  deleteButton: {
    backgroundColor: 'red',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '12px',
    textAlign: 'center',
    position: 'absolute',
    top: '5px',
    right: '5px',
  },
  buttonHover: {
    backgroundColor: '#000000',
  },
  totalPrice: {
    fontSize: '15px',
    fontWeight: 'bold',
    gridColumn: 'span 2',
    textAlign: 'center',
  },
  productTitle: {
    fontSize: '18px',
    fontWeight: 'bold',
    gridColumn: 'span 2',
    textAlign: 'center',
    marginTop: '2px',
    position: 'relative',
    textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)'
  },
  subPrice: {
    width:'100%',
    gridColumn: 'span 2',
    textAlign: 'center',
  },
};

const DiamondSelection = () => {
  const [diamondItems, setDiamondItems] = useState([{ color: '', cut: '', clarity: '', carat: '', origin: '', gemBuyPrice: '0.00', gemSellPrice: '0.00' }]);
  const [formValid, setFormValid] = useState(false);
  const [gemPromotion, setGemPromotion] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    validateForm();
  }, [diamondItems]);

  useEffect(() => {
    adornicaServ.getAllCategoryBbp()
      .then((res) => {
        const diamondCategory = res.data.metadata.find(category => category.id === 6);
        if (diamondCategory) {
          setGemPromotion(diamondCategory.buyBackPromotion);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handleAddItem = () => {
    setDiamondItems([...diamondItems, { color: '', cut: '', clarity: '', carat: '', origin: '', gemBuyPrice: '0.00', gemSellPrice: '0.00' }]);
  };

  const handleDeleteItem = (index) => {
    const updatedItems = diamondItems.filter((_, i) => i !== index);
    setDiamondItems(updatedItems);
    validateForm();
  };

  const fetchPrice = async (index) => {
    const item = diamondItems[index];
    const { color, cut, clarity, carat, origin } = item;

    if (cut && carat && clarity && color && origin) {
      const caratValue = parseFloat(carat);
      if (isNaN(caratValue)) {
        console.warn('Invalid carat value');
        return;
      }

      try {
        const res = await adornicaServ.getPurchaseDiamondPrice(cut, caratValue, clarity, color, origin);
        if (res.data && res.data.metadata) {
          const priceData = res.data.metadata.find((data) => (
            data.cut === cut &&
            data.carat === caratValue &&
            data.clarity === clarity &&
            data.color === color &&
            data.origin === origin
          ));

          const updatedItems = [...diamondItems];
          if (priceData) {
            updatedItems[index].gemBuyPrice = priceData.gemBuyPrice.toFixed(0);
            updatedItems[index].gemSellPrice = priceData.gemSellPrice.toFixed(0);
          } else {
            updatedItems[index].gemBuyPrice = '0.00';
            updatedItems[index].gemSellPrice = '0.00';
            notification.error({ message: 'Không tim thấy vật liệu này' });
          }
          setDiamondItems(updatedItems);
        } else {
          console.warn('Invalid response structure', res.data);
        }
      } catch (err) {
        console.error('Error fetching price:', err);
      }
    }
  };

  const handleDiamondItemChange = (index, field, value) => {
    const newDiamondItems = [...diamondItems];
    newDiamondItems[index][field] = value;
    setDiamondItems(newDiamondItems);
    fetchPrice(index);
    validateForm();
  };

  const validateForm = () => {
    const isFormValid = diamondItems.every(item =>
      item.color && item.cut && item.clarity && item.carat && item.origin &&
      item.gemBuyPrice !== '0.00' && item.gemSellPrice !== '0.00'
    );
    setFormValid(isFormValid);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formValid) {
      alert('Vui lòng điền đầy đủ thông tin.');
      return;
    }

    const diamondData = diamondItems.map(item => ({
      cut: item.cut,
      carat: item.carat,
      clarity: item.clarity,
      color: item.color,
      origin: item.origin,
      gemBuyPrice: parseFloat(item.gemBuyPrice),
      gemSellPrice: parseFloat(item.gemSellPrice),
    }));

    localStorage.setItem('gemData', JSON.stringify(diamondData));
    navigate('/bill-diamond');
  };

  // Calculate total price dynamically
  const totalPrice = diamondItems.reduce((acc, item) => {
    const gemBuyPrice = parseFloat(item.gemBuyPrice) || 0;
    const gemSellPrice = parseFloat(item.gemSellPrice) || 0;
    const totalItemPrice = gemBuyPrice + (gemSellPrice - gemBuyPrice) * gemPromotion;
    return acc + totalItemPrice;
  }, 0).toFixed(0);

  return (
    <div style={styles.container}>
      <form style={styles.form} onSubmit={handleSubmit}>
        {diamondItems.map((item, index) => (
          <React.Fragment key={index}>
            <div style={styles.productTitle}>
              Kim cương {index + 1}
              <button type="button" style={styles.deleteButton} onClick={() => handleDeleteItem(index)}>Xóa</button>
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Màu sắc:</label>
              <select style={styles.input} value={item.color} onChange={(e) => handleDiamondItemChange(index, 'color', e.target.value)}>
                <option value=""></option>
                <option value="D">D</option>
                <option value="E">E</option>
                <option value="F">F</option>
                <option value="G">G</option>
                <option value="H">H</option>
                <option value="I">I</option>
                <option value="J">J</option>
                <option value="K">K</option>
                <option value="L">L</option>
                <option value="M">M</option>
              </select>
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Vết cắt:</label>
              <select style={styles.input} value={item.cut} onChange={(e) => handleDiamondItemChange(index, 'cut', e.target.value)}>
                <option value=""></option>
                <option value="EX">EX</option>
                <option value="G">G</option>
                <option value="F">F</option>
                <option value="P">P</option>
              </select>
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Độ tinh khiết:</label>
              <select style={styles.input} value={item.clarity} onChange={(e) => handleDiamondItemChange(index, 'clarity', e.target.value)}>
                <option value=""></option>
                <option value="FL">FL</option>
                <option value="IF">IF</option>
                <option value="VVS1">VVS1</option>
                <option value="VVS2">VVS2</option>
                <option value="VS1">VS1</option>
                <option value="VS2">VS2</option>
                <option value="SI1">SI1</option>
                <option value="SI2">SI2</option>
                <option value="I1">I1</option>
                <option value="I2">I2</option>
                <option value="I3">I3</option>
              </select>
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Khối lượng:</label>
              <input type="number" style={styles.input} value={item.carat} onChange={(e) => handleDiamondItemChange(index, 'carat', e.target.value)} />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Nguồn gốc:</label>
              <select style={styles.input} value={item.origin} onChange={(e) => handleDiamondItemChange(index, 'origin', e.target.value)}>
                <option value=""></option>
                <option value="TỰ NHIÊN">TỰ NHIÊN</option>
                <option value="NHÂN TẠO">NHÂN TẠO</option>
              </select>
            </div>
            {item.carat && item.clarity && item.color && item.cut && item.origin && formValid && (
              <>
                <div style={styles.totalPrice}>Kim cương: Giá mua {parseFloat(item.gemBuyPrice).toLocaleString('vi-VN')} VND - Giá bán {parseFloat(item.gemSellPrice).toLocaleString('vi-VN')} VND</div>
                <div style={styles.totalPrice}>Khuyến mãi : {(((parseFloat(item.gemSellPrice) - parseFloat(item.gemBuyPrice)) * parseFloat(gemPromotion)).toLocaleString('vi-Vn'))} VND</div>
                <div style={styles.totalPrice}>
                    Tổng giá trị viên kim cương: {parseFloat((parseFloat(item.gemBuyPrice) + (parseFloat(item.gemSellPrice) - parseFloat(item.gemBuyPrice)) * parseFloat(gemPromotion)).toFixed(0)).toLocaleString('vi-VN')} VND
                </div>

              </>
            )}
          </React.Fragment>  
        ))}
        <button
          type="button"
          style={styles.addButton}
          onClick={handleAddItem}
        >
          Thêm sản phẩm
        </button>
        <div style={styles.totalPrice}>Tổng tiền: {parseFloat(totalPrice).toLocaleString('vi-VN')} VND</div>
        <button
          type="submit"
          style={{
            ...styles.button,
            ...((!formValid || totalPrice <= 0) ? { backgroundColor: 'gray', cursor: 'not-allowed' } : {})
          }}
          disabled={!formValid || totalPrice <= 0}
        >
          Thu mua
        </button>
      </form>
    </div>
  );
};

export default DiamondSelection;
