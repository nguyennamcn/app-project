import React, { useState } from 'react';

const BuyDiamond = () => {
    const [name, setName] = useState('Nguyen Quoc Nam');
    const [phone, setPhone] = useState('0987656789');
    const [color, setColor] = useState('D');
    const [clarity, setClarity] = useState('Internally Flawless (IF)');
    const [caratWeight, setCaratWeight] = useState(1.25);
    const [cut, setCut] = useState('Excellent');
    const [totalPrice, setTotalPrice] = useState('340,000,000');


    const styles = {
        container: {
            fontFamily: 'Arial, sans-serif',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '30px',
            margin: 'auto',
            backgroundColor: '#A2F4EF',
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
            marginBottom: '10px',
            width: '100%',
        },
        label: {
            display: 'flex',
            flexDirection: 'column',
            flex: '1 1 auto',
            marginRight: '10px',
            // padding: '5px 10px',
            maxWidth: '300px',
            maxHeight: '60%',
        },
        input: {
            padding: '10px',
            marginTop: '5px',
            maxWidth: '100%',
            backgroundColor:'#C2C2C2',
        },
        button: {
            marginTop: '5px',
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
                <h1 style={styles.header}>Buy Diamond #20001</h1>
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
                                        Color:
                                        <select style={styles.input}value={color} onChange={e => setColor(e.target.value)}>
                                        <option value=''>D</option>
                                                <option value='E'>E</option>
                                                <option value='F'>F</option>
                                                <option value='G'>G</option>
                                                <option value='H'>H</option>
                                                <option value='I'>I</option>
                                                <option value='J'>J</option>
                                                <option value='K'>K</option>
                                                <option value='L'>L</option>
                                                <option value='M'>M</option>
                                        </select>
                                    </label>

                                    <label style={styles.label}>
                                        Cut:
                                        <select style={styles.input} value={cut} onChange={e => setCut(e.target.value)}>
                                            <option value="Excellent">Excellent</option>
                                            <option value="Very Good">Very Good</option>
                                            {/* Add more options as needed */}
                                        </select>
                                    </label>

                    </div>                                      
                    <div style={styles.inputRow}>
                                    <label style={styles.label}>
                                        Clarity:
                                        <select  style={styles.input} value={clarity} onChange={e => setClarity(e.target.value)}>
                                        <option value=''>IF</option>
                                                <option value='VVS1'>VVS1</option>
                                                <option value='VVS2'>VVS2</option>
                                                <option value='VS1'>VS1</option>
                                                <option value='VS2'>VS2</option>
                                                <option value='SI1'>SI1</option>
                                                <option value='SI2'>SI2</option>
                                                <option value='I1'>I1</option>
                                                <option value='I2'>I2</option>
                                        </select>
                                    </label>

                                    <label style={styles.label}>
                                                Carat Weight:
                                                <input style={styles.input} type="text" value={caratWeight} onChange={e => setCaratWeight(e.target.value)} />
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
