import React, { useEffect, useState } from 'react';
import {
    Home,
    Users,
    FolderOpen,
    Calendar,
    FileText,
    BarChart3,
    Settings
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
// import axios from "axios";
import { useNavigate } from 'react-router-dom';


const Sidebar = () => {
    const [activeNav, setActiveNav] = useState('Dashboard');
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate()

    const toggleNavbar = () => setIsOpen(!isOpen);


    useEffect(() => {
        if (location.pathname.includes('team')) setActiveNav('Team');
        else if (location.pathname.includes('ofc-com')) setActiveNav('Grievance');
        else if (location.pathname.includes('activity')) setActiveNav('Activity');
        else if (location.pathname.includes('reminder')) setActiveNav('Reminder');
        else if (location.pathname.includes('PGO-Rejister')) setActiveNav('PGO-Rejister');
        else if (location.pathname.includes('PGOFeedback')) setActiveNav('Feedback');
        else setActiveNav('Dashboard');
    }, [location.pathname]);


    const handleLogout = async () => {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        navigate("/")
    };


    return (
        <>
            {/* NAVBAR */}
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
                                <Link to="/PGO-Dashboard">
                                    <button
                                        onClick={() => setActiveNav('Dashboard')}
                                        className={`flex items-center w-full py-2 px-3 rounded-md ${activeNav === 'Dashboard'
                                            ? "text-white bg-blue-700 dark:bg-blue-600"
                                            : "text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                                            }`}
                                    >
                                        <Home className="w-5 h-5 mr-2" />
                                        Dashboard
                                    </button>
                                </Link>
                            </li>
                            <li>
                                <Link to="team">
                                    <button
                                        onClick={() => setActiveNav('Team')}
                                        className={`flex items-center w-full py-2 px-3 rounded-md ${activeNav === 'Team'
                                            ? "text-white bg-blue-700 dark:bg-blue-600"
                                            : "text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                                            }`}
                                    >
                                        <Users className="w-5 h-5 mr-2" />
                                        Team
                                    </button>
                                </Link>
                            </li>
                            <li>
                                <Link to="ofc-com">
                                    <button
                                        onClick={() => setActiveNav('Grievance')}
                                        className={`flex items-center w-full py-2 px-3 rounded-md ${activeNav === 'Grievance'
                                            ? "text-white bg-blue-700 dark:bg-blue-600"
                                            : "text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                                            }`}
                                    >
                                        <FolderOpen className="w-5 h-5 mr-2" />
                                        Grievance
                                    </button>
                                </Link>
                            </li>
                            <li>
                                <Link to="recent-activity">
                                    <button
                                        onClick={() => setActiveNav('Activity')}
                                        className={`flex items-center w-full py-2 px-3 rounded-md ${activeNav === 'Activity'
                                            ? "text-white bg-blue-700 dark:bg-blue-600"
                                            : "text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                                            }`}
                                    >
                                        <Calendar className="w-5 h-5 mr-2" />
                                        Activity
                                    </button>
                                </Link>
                            </li>

                            <li>
                                <Link to="reminder">
                                    <button
                                        onClick={() => setActiveNav('Reminder')}
                                        className={`flex items-center w-full py-2 px-3 rounded-md ${activeNav === 'Reminder'
                                            ? "text-white bg-blue-700 dark:bg-blue-600"
                                            : "text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                                            }`}
                                    >
                                        <FileText className="w-5 h-5 mr-2" />
                                        Reminder
                                    </button>
                                </Link>
                            </li>

                            <li>
                                <Link to="PGOFeedback">
                                    <button

                                        className={`flex items-center w-full py-2 px-3 rounded-md ${activeNav === 'Feedback'
                                            ? "text-white bg-blue-700 dark:bg-blue-600"
                                            : "text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                                            }`}
                                    >
                                        <FileText className="w-5 h-5 mr-2" />
                                        Feedback
                                    </button>
                                </Link>
                            </li>


                            {JSON.parse(localStorage.getItem("user"))?.role !== "officer" && (
                                <li>
                                    <Link to='PGO-Rejister'>
                                        <button
                                            onClick={() => setActiveNav('PGO-Rejister')}
                                            className={`flex items-center w-full py-2 px-3 rounded-md ${activeNav === 'PGO-Rejister'
                                                ? "text-white bg-blue-700 dark:bg-blue-600"
                                                : "text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                                                }`}
                                        >
                                            <BarChart3 className="w-5 h-5 mr-2" />
                                            PGO Rejister
                                        </button>
                                    </Link>
                                </li>
                            )}

                            <hr />
                            <li className="flex justify-between px-3 w-full border border-gray-200 bg-white shadow-[0px_0px_7px_1px_rgba(0,_0,_0,_0.2)] rounded-xl py-2 z-50 animate-fadeIn">

                                <Link to="PGOProfile" className="hover:text-blue-600">
                                    My Profile
                                </Link>


                                <span className="">
                                    Setting
                                </span>

                                <span onClick={handleLogout} className="cursor-pointer hover:text-red-800">
                                    Logout
                                </span>
                            </li>
                        </ul>
                    </div>
                )}
            </nav>

            {/* SIDEBAR */}
            <nav className="hidden sm:flex bg-white shadow-md px-6 py-3 justify-between items-center">
                <div className="text-xl font-semibold text-gray-800"></div>

                <div className="flex items-center gap-6 text-gray-700 relative">
                    <details className="relative">
                        <summary className="list-none cursor-pointer hover:text-blue-600 transition duration-200">
                            <i className="fa-solid fa-user text-lg"></i>
                        </summary>

                        <div
                            className="absolute right-0 mt-4 w-40 bg-white border rounded-md shadow-lg z-50"
                        >
                            <Link to="PGOProfile" className="block px-4 py-2 rounded-md hover:bg-gray-100">
                                Profile
                            </Link>

                            <span className="block px-4 py-2 rounded-md hover:bg-gray-100">Settings</span>
                            <span onClick={handleLogout} className="block px-4 py-2 cursor-pointer rounded-md text-red-500 hover:bg-gray-100">Logout</span>
                        </div>
                    </details>
                </div>
            </nav>

            <div className="hidden sm:flex w-44 bg-red border-r border-gray-200 h-[150vh] flex-col absolute  left-0 top-0">
                <div className="p-4 border-b border-gray-100">
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
                        <Link to="/PGO-Dashboard">
                            <button
                                onClick={() => setActiveNav('Dashboard')}
                                className={`w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${activeNav === 'Dashboard'
                                    ? 'bg-purple-50 text-purple-700 border-r-2 border-purple-700'
                                    : 'text-gray-600 hover:bg-purple-50 hover:text-purple-700 hover:border-r-2 hover:border-purple-700'
                                    }`}
                            >
                                <Home className="w-5 h-5 mr-3 flex-shrink-0" />
                                <span className="truncate">Dashboard</span>
                            </button>
                        </Link>

                        <Link to="team">
                            <button
                                onClick={() => setActiveNav('Team')}
                                className={`w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${activeNav === 'Team'
                                    ? 'bg-purple-50 text-purple-700 border-r-2 border-purple-700'
                                    : 'text-gray-600 hover:bg-purple-50 hover:text-purple-700 hover:border-r-2 hover:border-purple-700'
                                    }`}
                            >
                                <Users className="w-5 h-5 mr-3 flex-shrink-0" />
                                <span className="truncate">Team</span>
                            </button>
                        </Link>

                        <Link to="ofc-com">
                            <button
                                onClick={() => setActiveNav('Grievance')}
                                className={`w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${activeNav === 'Grievance'
                                    ? 'bg-purple-50 text-purple-700 border-r-2 border-purple-700'
                                    : 'text-gray-600 hover:bg-purple-50 hover:text-purple-700 hover:border-r-2 hover:border-purple-700'
                                    }`}
                            >
                                <FolderOpen className="w-5 h-5 mr-3 flex-shrink-0" />
                                <span className="truncate">Grievance</span>
                            </button>
                        </Link>

                        <Link to="recent-activity">
                            <button
                                onClick={() => setActiveNav('Activity')}
                                className={`w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${activeNav === 'Activity'
                                    ? 'bg-purple-50 text-purple-700 border-r-2 border-purple-700'
                                    : 'text-gray-600 hover:bg-purple-50 hover:text-purple-700 hover:border-r-2 hover:border-purple-700'
                                    }`}
                            >
                                <Calendar className="w-5 h-5 mr-3 flex-shrink-0" />
                                <span className="truncate">Activity</span>
                            </button>
                        </Link>

                        <Link to="reminder">
                            <button
                                onClick={() => setActiveNav('Reminder')}
                                className={`w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${activeNav === 'Reminder'
                                    ? 'bg-purple-50 text-purple-700 border-r-2 border-purple-700'
                                    : 'text-gray-600 hover:bg-purple-50 hover:text-purple-700 hover:border-r-2 hover:border-purple-700'
                                    }`}
                            >
                                <FileText className="w-5 h-5 mr-3 flex-shrink-0" />
                                <span className="truncate">Reminder</span>
                            </button>
                        </Link>

                        <Link to="PGOFeedback">
                            <button
                                className={`w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${activeNav === 'Feedback'
                                    ? 'bg-purple-50 text-purple-700 border-r-2 border-purple-700'
                                    : 'text-gray-600 hover:bg-purple-50 hover:text-purple-700 hover:border-r-2 hover:border-purple-700'
                                    }`}
                            >
                                <FileText className="w-5 h-5 mr-3 flex-shrink-0" />
                                <span className="truncate">Feedback</span>
                            </button>
                        </Link>

                        <Link to="pgo-settings">
                            <button
                                className={`w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${activeNav === 'Feedback'
                                    ? 'bg-purple-50 text-purple-700 border-r-2 border-purple-700'
                                    : 'text-gray-600 hover:bg-purple-50 hover:text-purple-700 hover:border-r-2 hover:border-purple-700'
                                    }`}
                            >
                                <FileText className="w-5 h-5 mr-3 flex-shrink-0" />
                                <span className="truncate">Settings</span>
                            </button>
                        </Link>

                        {JSON.parse(localStorage.getItem("user"))?.role !== "officer" && (
                            <Link to='PGO-Rejister'>
                                <button
                                    onClick={() => setActiveNav('PGO-Rejister')}
                                    className={`w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${activeNav === 'PGO-Rejister'
                                        ? 'bg-purple-50 text-purple-700 border-r-2 border-purple-700'
                                        : 'text-gray-600 hover:bg-purple-50 hover:text-purple-700 hover:border-r-2 hover:border-purple-700'
                                        }`}
                                >
                                    <BarChart3 className="w-5 h-5 mr-3 flex-shrink-0" />
                                    <span className="truncate">PGO Rejister</span>
                                </button>
                            </Link>
                        )}

                    </nav>
                </div>

                {/* <div className="p-3 border-t border-gray-100">
                    <button className="w-full flex items-center px-3 py-2.5 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-all duration-200">
                        <Settings className="w-5 h-5 mr-3 flex-shrink-0" />
                        <span className="truncate">Settings</span>
                    </button>
                </div> */}
            </div>
        </>
    );
};

export default Sidebar;
