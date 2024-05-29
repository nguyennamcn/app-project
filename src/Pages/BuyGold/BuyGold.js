import React, { useState } from 'react';

const BuyGold = () => {
    const [name, setName] = useState('Nguyen Quoc Nam');
    const [phone, setPhone] = useState('0987656789');
    const [goldType, setGoldType] = useState('Vàng miếng SJC 999.9');
    const [weight, setWeight] = useState(3);
    const [totalPrice, setTotalPrice] = useState('8,890,000');

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
        <div>
            <div style={styles.container}>
                <h1 style={styles.header}>Buy Gold #20001</h1>
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
                            Gold type:
                            <select style={styles.input} value={goldType} onChange={e => setGoldType(e.target.value)}>
                                <option value="Vàng miếng SJC 999.9">Vàng miếng SJC 999.9</option>
                                <option value="Vàng nhẫn SJC 999.9">Vàng nhẫn SJC 999.9</option>
                                <option value="Vàng trang sức 24K">Vàng trang sức 24K</option>
                                {/* Add more options as needed */}
                            </select>
                        </label>
                        <label style={styles.label}>
                            Weight (gram):
                            <input style={styles.input} type="number" value={weight} onChange={e => setWeight(parseFloat(e.target.value))} />
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

export default BuyGold;
