import React from 'react';


export default function OrderPage(){

    return(
        <div>
            <div className='Title'>
                <h1>Order</h1>
            </div>

            <div className='customer__info'>
                <h2>Customer</h2>
        
                    <label style={{display:'block'}}>Name <input type="text" 
                    style={{
                        border:'2px solid'
                    }} />
                    </label>

                    <label style={{display:'block'}}>Phone <input type="text" 
                    style={{
                        border:'2px solid'
                    }} />
                    </label>

                    <label style={{display:'block'}}>Address <input type="text" 
                    style={{
                        border:'2px solid'
                    }} />
                    </label>

                    <label style={{display:'block'}}>Buy date <input type="text" 
                    style={{
                        border:'2px solid'
                    }} />
                    </label>

                    <label style={{display:'block'}}>Payment status
                    <select style={{border:'2px solid'}}>
                        <option>Fully paid</option>
                    </select>
                    </label>

                    <label style={{display:'block'}}>Payment method
                    <select style={{border:'2px solid'}}>
                        <option>Cash</option>
                    </select>
                    </label>
            </div>
            <div className='order_info'>
                <table 
                style={{
                    borderCollapse:'collapse',
                    border:'2px solid rgb(140 140 140)',
                    fontFamily:'sans-serif',
                    fontSize:'0.8rem',
                    letterSpacing:'1px',
                }}>
                    <thead>
                        <tr>
                            <th scope='columns'>Product</th>
                            <th scope='columns'>Price</th>
                        </tr>
                    </thead>
                </table>
            </div>
            <div className='btn__purchase'></div>
        </div>
    );
}