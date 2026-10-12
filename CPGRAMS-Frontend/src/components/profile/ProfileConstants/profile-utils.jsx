import { useState, useRef, useEffect } from "react";
import {
  User,
  MapPin,
  Shield,
  FileText,
  Camera,
  Phone,
  Mail,
  Edit,
  Eye,
  EyeOff,
  Lock,
  Calendar,
  CheckCircle,
  BarChart3,
  Menu,
  X,
} from "lucide-react";
import Header from "../../header/MainHeader";
import VerticalProgressBar from "./VerticalProgressBar";
import Footer from "../../footer/Footer";

const PROGRESS_STEPS = [
  { id: "dashboard", label: "Dashboard", icon: BarChart3, number: 1 },
  { id: "personal", label: "Personal Details", icon: User, number: 2 },
  { id: "contact", label: "Contact Info", icon: Phone, number: 3 },
  { id: "address", label: "Address Details", icon: MapPin, number: 4 },
  { id: "identity", label: "Identity Verification", icon: Shield, number: 5 },
  { id: "account", label: "Account Settings", icon: Lock, number: 6 },
  { id: "documents", label: "Documents", icon: FileText, number: 7 },
];

const STATES = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
];

const PROFILE_DETAILS = {
  name: "John J. Doe",
  email: "johndoe@gmail.com",
  phone: "+91 9999999999",
  memberSince: "June 2025",
  lastLogin: new Date(),
  accountStatus: "Active",
  nationality: "Indian",
  gender: "male",
  dob: "1995-06-15",
  address: "123, MG Road, Sector 15, Near City Mall",
  city: "New Delhi",
  district: "Central Delhi",
  state: "Delhi",
  pincode: "110001",
  aadhaar: "1234 5678 9012",
  voterId: "ABC1234567",
  pan: "ABCDE1234F",
  alternatePhone: "+91 8888888888",
  username: "johndoe123",
  registrationDate: "June 2025",
  password: "••••••••",
  profileImage: null,
  visiblePassword: "271205",
};

const FormField = ({
  label,
  type = "text",
  placeholder,
  disabled,
  value,
  onChange,
  pattern,
  maxLength,
  rows,
  className = "",
}) => (
  <div className="space-y-2">
    <label className="block text-sm font-medium text-gray-900">{label}</label>
    {type === "textarea" ? (
      <textarea
        rows={rows || 3}
        placeholder={placeholder}
        disabled={disabled}
        value={value}
        onChange={onChange}
        className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500 ${className}`}
      />
    ) : (
      <input
        type={type}
        placeholder={placeholder}
        disabled={disabled}
        value={value}
        onChange={onChange}
        pattern={pattern}
        maxLength={maxLength}
        className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500 ${className}`}
      />
    )}
  </div>
);



export {
  User,
  MapPin,
  Shield,
  FileText,
  Camera,
  Phone,
  Mail,
  Edit,
  Eye,
  EyeOff,
  Lock,
  Calendar,
  CheckCircle,
  BarChart3,
  Menu,
  X,
  Header,
  VerticalProgressBar,
  Footer,
  PROGRESS_STEPS,
  STATES,
  PROFILE_DETAILS,
  FormField,
  useState,
  useRef,
  useEffect,
};
