import { Link } from "react-router-dom";

const NotFound = () => {
    return (
        <div className="h-screen flex flex-col items-center justify-center text-center px-4">
            <h1 className="text-7xl font-extrabold text-red-600 mb-4">404</h1>
            <p className="text-2xl font-semibold text-red-500 mb-2">Sorry, this page doesn't exist.</p>
            <p className="text-gray-600 mb-6">
                You may have mistyped the address or the page has been moved.
            </p>
            <Link
                to="/"
                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            >
                <i className="fa-solid fa-left-long text-white" /> 
                Back to Home
            </Link>
        </div>
    );
};

export default NotFound;
