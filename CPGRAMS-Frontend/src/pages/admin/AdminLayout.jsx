import React from 'react';
// import Footer from '../../components/footer/footer';
import { Outlet } from 'react-router-dom';
import AdminSidebar from './components/AdminSidebar';

function AdminLayout() {
    return (
        <>
            <section className='flex flex-col min-h-screen'>
                <AdminSidebar />
                <div className="ml-46 max-[640px]:ml-0 flex-1 ">
                    <Outlet />
                </div>
            </section>
            {/* <Footer /> */}
        </>
    );
}

export default AdminLayout;
