import React from 'react';
import { UserPlus } from 'lucide-react';

const RegisterJuniorPGO = () => {
    return (
        <div className="max-w-2xl mx-auto p-6 bg-gradient-to-br from-white via-gray-50 to-blue-50 shadow-xl rounded-3xl mt-4 border border-gray-200">
            <div className="flex items-center justify-center mb-8">
                <UserPlus className="h-8 w-8 text-blue-600 mr-2" />
                <h2 className="text-3xl font-bold text-gray-800">Register Junior PG Officer</h2>
            </div>
            <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input
                        type="text"
                        name="fullName"
                        placeholder="Enter full name"
                        className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                    <input
                        type="email"
                        name="email"
                        placeholder="Enter email"
                        className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
                    <input
                        type="tel"
                        name="mobile"
                        placeholder="Enter mobile number"
                        className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                    <select
                        name="gender"
                        className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                    <input
                        type="date"
                        name="dob"
                        className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                    <input
                        type="text"
                        name="department"
                        placeholder="Enter department"
                        className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Office Location</label>
                    <input
                        type="text"
                        name="office"
                        placeholder="Enter office location"
                        className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                    <input
                        type="password"
                        name="password"
                        placeholder="Enter password"
                        className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                    <input
                        type="password"
                        name="confirmPassword"
                        placeholder="Confirm password"
                        className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>

                {/* Full width button row */}
                <div className="md:col-span-2">
                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-xl transition duration-200 shadow-md"
                    >
                        Register Officer
                    </button>
                </div>
            </form>

        </div>
    );
};

export default RegisterJuniorPGO;
