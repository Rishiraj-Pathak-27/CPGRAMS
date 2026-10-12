import React, { useState } from 'react';
import {
    Home,
    Users,
    FolderOpen,
    Calendar,
    FileText,
    BarChart3,
    Settings,
    ShieldCheck
} from 'lucide-react';
import { Link } from 'react-router-dom';

const StaticSidebar = () => {
    const [activeNav, setActiveNav] = useState('Dashboard');
    const [isOpen, setIsOpen] = useState(false);
    const [showUserDropdown, setShowUserDropdown] = useState(false);

    const toggleNavbar = () => setIsOpen(!isOpen);

    const handleNavClick = (navItem) => {
        setActiveNav(navItem);
        setIsOpen(false);
    };

    const handleLogout = () => {
        console.log('Logout clicked');
    };


    return (
        <>
            <nav className="sm:hidden bg-white dark:bg-gray-900 w-full border-b border-gray-200 dark:border-gray-700">
                <div className="max-w-screen-xl mx-auto p-4 flex items-center justify-between">
                    <a href="#" className="flex items-center space-x-3">
                        <img
                            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTsPJ9cm0-r5p50py0yUzvM5ZtEB-xWoJRPRA&s"
                            className="h-8"
                            alt="Logo"
                        />
                        <span className="text-md font-semibold dark:text-white">Netfotech Solutions</span>
                    </a>
                    <button
                        onClick={toggleNavbar}
                        className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-800 dark:focus:ring-gray-600"
                        aria-controls="mobile-menu"
                        aria-expanded={isOpen}
                    >
                        {isOpen ? (
                            <svg
                                className="w-6 h-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        ) : (
                            <svg
                                className="w-6 h-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M4 6h16M4 12h16M4 18h16"
                                />
                            </svg>
                        )}
                    </button>
                </div>

                {isOpen && (
                    <div id="mobile-menu" className="px-4 pb-4">
                        <ul className="space-y-2 font-medium">
                            <li>
                                <button
                                    onClick={() => handleNavClick('Dashboard')}
                                    className={`flex items-center w-full py-2 px-3 rounded-md ${activeNav === 'Dashboard'
                                        ? "text-white bg-blue-700 dark:bg-blue-600"
                                        : "text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                                        }`}
                                >
                                    <Home className="w-5 h-5 mr-2" />
                                    Dashboard
                                </button>
                            </li>
                            <li>
                                <button
                                    onClick={() => handleNavClick('Officer')}
                                    className={`flex items-center w-full py-2 px-3 rounded-md ${activeNav === 'Officer'
                                        ? "text-white bg-blue-700 dark:bg-blue-600"
                                        : "text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                                        }`}
                                >
                                    <FolderOpen className="w-5 h-5 mr-2" />
                                    Rejister Officer
                                </button>
                            </li>
                            <li>
                                <button
                                    onClick={() => handleNavClick('Lead Officers')}
                                    className={`flex items-center w-full py-2 px-3 rounded-md ${activeNav === 'Lead Officers'
                                        ? "text-white bg-blue-700 dark:bg-blue-600"
                                        : "text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                                        }`}
                                >
                                    <Calendar className="w-5 h-5 mr-2" />
                                    Lead Officers
                                </button>
                            </li>

                            <li>
                                <button
                                    onClick={() => handleNavClick('Officers')}
                                    className={`flex items-center w-full py-2 px-3 rounded-md ${activeNav === 'Officers'
                                        ? "text-white bg-blue-700 dark:bg-blue-600"
                                        : "text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                                        }`}
                                >
                                    <FileText className="w-5 h-5 mr-2" />
                                    Officers
                                </button>
                            </li>

                            <li>
                                <button
                                    onClick={() => handleNavClick('All Grievance')}
                                    className={`flex items-center w-full py-2 px-3 rounded-md ${activeNav === 'All Grievance'
                                        ? "text-white bg-blue-700 dark:bg-blue-600"
                                        : "text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                                        }`}
                                >
                                    <FileText className="w-5 h-5 mr-2" />
                                    All Grievance
                                </button>
                            </li>

                            <hr />
                            <li className="flex justify-between px-3 w-full border border-gray-200 bg-white shadow-[0px_0px_7px_1px_rgba(0,_0,_0,_0.2)] rounded-xl py-2 z-50">
                                <button className="hover:text-blue-600">
                                    My Profile
                                </button>
                                <span className="">
                                    Setting
                                </span>
                                <button onClick={handleLogout} className="cursor-pointer hover:text-red-800">
                                    Logout
                                </button>
                            </li>
                        </ul>
                    </div>
                )}
            </nav>

            <nav className="hidden sm:flex bg-white border-b border-gray-300 px-6 py-3 justify-between items-center">
                <div className="text-xl font-semibold text-gray-800"></div>

                <div className="flex items-center gap-6 text-gray-700 relative">
                    <div className="relative">
                        <button
                            onClick={() => setShowUserDropdown(!showUserDropdown)}
                            className="cursor-pointer hover:text-blue-600 transition duration-200"
                        >
                            <i className="fa-solid fa-user text-lg"></i>
                        </button>

                        {showUserDropdown && (
                            <div className="absolute right-0 mt-4 w-40 bg-white border rounded-md shadow-lg z-50">
                                <button className="block w-full text-left px-4 py-2 rounded-md hover:bg-gray-100">
                                    Profile
                                </button>
                                <button className="block w-full text-left px-4 py-2 rounded-md hover:bg-gray-100">
                                    Settings
                                </button>
                                <button
                                    onClick={handleLogout}
                                    className="block w-full text-left px-4 py-2 rounded-md text-red-500 hover:bg-gray-100"
                                >
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </nav>

            <div className="hidden sm:flex w-44 bg-white border-r border-gray-200 h-screen flex-col fixed left-0 top-0">
                <div className="p-3.5 border-b border-gray-300">
                    <div className="flex items-center">
                        <div className="ml-3 overflow-hidden">
                            <div className="text-sm font-semibold text-gray-900 whitespace-nowrap">
                                Netfotech Solutions
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex-1 px-3 py-4 overflow-y-auto">
                    <nav className="flex flex-col gap-1">
                        <Link to='/Admin-Dashboard'>
                            <button
                                onClick={() => handleNavClick('Dashboard')}
                                className={`w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 relative 
          ${activeNav === 'Dashboard'
                                        ? 'bg-purple-50 text-purple-700 before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-purple-700'
                                        : 'text-gray-600 hover:bg-gray-50 hover:text-purple-700 hover:before:absolute hover:before:left-0 hover:before:top-0 hover:before:bottom-0 hover:before:w-1 hover:before:bg-purple-400'
                                    }`}
                            >
                                <Home className="w-5 h-5 mr-3 flex-shrink-0" />
                                <span className="truncate">Dashboard</span>
                            </button>

                        </Link>
                        <Link to='RejisterOfficer'>
                            <button
                                onClick={() => handleNavClick('Officer')}
                                className={`w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 relative 
          ${activeNav === 'Officer'
                                        ? 'bg-purple-50 text-purple-700 before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-purple-700'
                                        : 'text-gray-600 hover:bg-gray-50 hover:text-purple-700 hover:before:absolute hover:before:left-0 hover:before:top-0 hover:before:bottom-0 hover:before:w-1 hover:before:bg-purple-400'
                                    }`}
                            >
                                <Users className="w-5 h-5 mr-3 flex-shrink-0" />
                                <span className="truncate">Rejister Officer</span>
                            </button>

                        </Link>
                        <Link to='LeadOfficerDetails'>
                            <button
                                onClick={() => handleNavClick('Lead Officers')}
                                className={`w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 relative 
          ${activeNav === 'Lead Officers'
                                        ? 'bg-purple-50 text-purple-700 before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-purple-700'
                                        : 'text-gray-600 hover:bg-gray-50 hover:text-purple-700 hover:before:absolute hover:before:left-0 hover:before:top-0 hover:before:bottom-0 hover:before:w-1 hover:before:bg-purple-400'
                                    }`}
                            >
                                <Calendar className="w-5 h-5 mr-3 flex-shrink-0" />
                                <span className="truncate">Lead Officers</span>
                            </button>

                        </Link>
                        <Link to=''>
                            <button
                                onClick={() => handleNavClick('Officers')}
                                className={`w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 relative 
          ${activeNav === 'Officers'
                                        ? 'bg-purple-50 text-purple-700 before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-purple-700'
                                        : 'text-gray-600 hover:bg-gray-50 hover:text-purple-700 hover:before:absolute hover:before:left-0 hover:before:top-0 hover:before:bottom-0 hover:before:w-1 hover:before:bg-purple-400'
                                    }`}
                            >
                                <FileText className="w-5 h-5 mr-3 flex-shrink-0" />
                                <span className="truncate">Officers</span>
                            </button>

                        </Link>
                        <Link to=''>
                            <button
                                onClick={() => handleNavClick('All Grievance')}
                                className={`w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 relative 
          ${activeNav === 'All Grievance'
                                        ? 'bg-purple-50 text-purple-700 before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-purple-700'
                                        : 'text-gray-600 hover:bg-gray-50 hover:text-purple-700 hover:before:absolute hover:before:left-0 hover:before:top-0 hover:before:bottom-0 hover:before:w-1 hover:before:bg-purple-400'
                                    }`}
                            >
                                <FileText className="w-5 h-5 mr-3 flex-shrink-0" />
                                <span className="truncate">All Grievance</span>
                            </button>

                        </Link>
                        <Link to=''>
                            <button
                                onClick={() => handleNavClick('Settings')}
                                className={`w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 relative 
          ${activeNav === 'Settings'
                                        ? 'bg-purple-50 text-purple-700 before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-purple-700'
                                        : 'text-gray-600 hover:bg-gray-50 hover:text-purple-700 hover:before:absolute hover:before:left-0 hover:before:top-0 hover:before:bottom-0 hover:before:w-1 hover:before:bg-purple-400'
                                    }`}
                            >
                                <Settings className="w-5 h-5 mr-3 flex-shrink-0" />
                                <span className="truncate">Settings</span>
                            </button>
                        </Link>
                    </nav>
                </div>
            </div>

        </>
    );
};

export default StaticSidebar;