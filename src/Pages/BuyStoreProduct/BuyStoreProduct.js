import React, { useState } from 'react';
import { combineReducers } from 'redux';

const BuyDiamond = () => {
    const [name, setName] = useState('Nguyen Quoc Nam');
    const [phone, setPhone] = useState('0987656789');
    const [codeOrder, setCodeOrder] = useState('aaaaaa');                         /** Mã đơn hàng đã mua ở cửa hàng  * */
    const [codeProduct, setCodeProduct] = useState('bbbbbb');  /** Mã sản phẩm có sẵn trong cửa hàng  * */
    const [totalPrice, setTotalPrice] = useState('340,000,000');

    const styles = {
        container: {
            fontFamily: 'Arial, sans-serif',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '20px',
            margin: 'auto',
            backgroundColor: '#FFFFFF',
            borderRadius: '8px',
            boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
            width: '80%',
            maxWidth: '800px',
            marginTop: '20px',
        },
        header: {
            fontSize: '24px',
            marginBottom: '20px',
        },
        form: {
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
        },
        inputRow: {
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '20px',
            width: '100%',
        },
        label: {
            display: 'flex',
            flexDirection: 'column',
            flex: '1 1 auto',
            marginRight: '10px',
        },
        input: {
            padding: '8px',
            marginTop: '5px',
            width: '100%',
            backgroundColor:'#C2C2C2',
        },
        button: {
            marginTop: '20px',
            backgroundColor: 'black',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            cursor: 'pointer',
            borderRadius: '5px',
            alignSelf: 'center',
        },
        totalPrice: {
            textAlign: 'center',
            fontSize: '18px',
            margin: '20px 0',
            fontWeight: 'bold',
        }
    };

    const handlePurchase = () => {
        alert('Purchase confirmed');
    };


    return (
        <div style={{height:'70vh'}}>
            <div style={styles.container}>
                <h1 style={styles.header}>Buy GEM #20001</h1>
                <form style={styles.form}>
                    <div style={styles.inputRow}>
                        <label style={styles.label}>
                            Name:
                            <input style={styles.input} type="text" value={name} onChange={e => setName(e.target.value)} />
                        </label>
                        <label style={styles.label}>
                            Phone:
                            <input style={styles.input} type="text" value={phone} onChange={e => setPhone(e.target.value)} />
                        </label>
                    </div>
                    <div style={styles.inputRow}>
                        <label style={styles.label}>
                            Order code:
                            <input style={styles.input} type="text" value={codeOrder} onChange={e => setCodeOrder(e.target.value)} />
                        </label>
                        <label style={styles.label}>
                            Product code:
                            <input style={styles.input} type="text" value={codeProduct} onChange={e => setCodeProduct(e.target.value)} />
                        </label>
                    </div>
                    
                    <div style={styles.totalPrice}>
                        Total price: {totalPrice}
                    </div>
                    <button style={styles.button} type="button" onClick={handlePurchase}>Purchase</button>
                </form>
                <footer style={{ textAlign: 'right', marginTop: '20px', color: 'black' }}>
                    <p>By staff: To Hoang Trung Hieu Staff ID: 0001</p>
                </footer>
            </div>
        </div>
    );
};

export default BuyDiamond;
