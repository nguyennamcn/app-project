import Header from '../Components/Header/Header'
import React from 'react'
import Footer from '../Components/Footer/Footer'
import NavSide from '../Components/NavSide/NavSide'
import { useSelector } from 'react-redux';

export default function ({ Component }) {
    let userInfo = useSelector((state) => {
        return state.userReducer.userInfo;
      });
    return (
        <div className='min-h-screen h-full flex flex-col space-y-10'>
            <Header />
            <div 
                style={{
                    margin : '0',
                    display : 'flex',
            }}>
                <div
                    style={{
                        width: '13%',
                        height: '80vh'
                    }}
                >
                    <NavSide />
                </div>
                <div className="flex-grow" style={{
                    width : '87%'
                }}>
                    <Component />
                </div>
            </div>
            <Footer />
        </div>
    )
}