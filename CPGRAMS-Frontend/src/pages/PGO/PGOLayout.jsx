import React from 'react';
import Sidebar from './components/Sidebar';
import Footer from '../../components/footer/Footer';
import { Outlet } from 'react-router-dom';
import HeaderLayout from '../../components/header/Header-Layout/HeaderLayout';

function PGOLayout() {
    return (
        <>
            <section className='flex flex-col min-h-screen'>
        {/* <HeaderLayout/> */}
                <Sidebar />
                <div className="ml-46 max-[640px]:ml-0 flex-1 ">
                    <Outlet />
                </div>
            </section>
            <Footer />
        </>
    );
}

export default PGOLayout;
