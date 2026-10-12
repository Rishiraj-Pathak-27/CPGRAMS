"use client";
import {
  Camera,
  Phone,
  Mail,
  Edit,
  Calendar,
  CheckCircle,
  Menu,
  X,
  Header,
  VerticalProgressBar,
  Footer,
  PROGRESS_STEPS,
  PROFILE_DETAILS,
  useState,
  useRef,
  useEffect,
} from "../profile/ProfileConstants/profile-utils";
import axios from "axios";
import { getTabs } from "../profile/ProfileConstants/navtabs";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function CitizenProfile() {
  const [profile, setProfile] = useState(null),
    [edit, setEdit] = useState(null),
    [editing, setEditing] = useState(false),
    [tab, setTab] = useState("dashboard"),
    [aadhaarVisible, setAadhaarVisible] = useState(false),
    [passwordVisible, setPasswordVisible] = useState(false),
    [img, setImg] = useState(null),
    [showMenu, setShowMenu] = useState(false),
    fileRef = useRef(null);

  const capitalizeWords = (str) => {
    if (!str) return "";
    return str
      .split(" ")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join(" ");
  };

  const buildProfileData = (baseUser, userProfile = null) => ({
    _id: userProfile?._id || baseUser._id || "local-profile",
    name: baseUser.fullName || baseUser.name || PROFILE_DETAILS.name,
    email: baseUser.email || PROFILE_DETAILS.email,
    phone: baseUser.phoneNumber || baseUser.phone || PROFILE_DETAILS.phone,
    memberSince: baseUser.createdAt
      ? new Date(baseUser.createdAt).toLocaleString("default", {
          month: "long",
          year: "numeric",
        })
      : PROFILE_DETAILS.memberSince,
    lastLogin: userProfile?.lastLogin ? new Date(userProfile.lastLogin) : new Date(),
    accountStatus: userProfile?.accountStatus || PROFILE_DETAILS.accountStatus,
    nationality: userProfile?.nationality || PROFILE_DETAILS.nationality,
    gender: baseUser.gender || PROFILE_DETAILS.gender,
    dob:
      userProfile?.dob || baseUser.dob
        ? new Date(userProfile?.dob || baseUser.dob).toISOString().split("T")[0]
        : PROFILE_DETAILS.dob,
    address: baseUser.address || PROFILE_DETAILS.address,
    city: baseUser.city || PROFILE_DETAILS.city,
    district: baseUser.district || PROFILE_DETAILS.district,
    state: capitalizeWords(baseUser.state || PROFILE_DETAILS.state),
    pincode: baseUser.pincode || PROFILE_DETAILS.pincode,
    aadhaar: userProfile?.aadhaar || PROFILE_DETAILS.aadhaar,
    voterId: userProfile?.voterId || PROFILE_DETAILS.voterId,
    pan: userProfile?.pan || PROFILE_DETAILS.pan,
    alternatePhone: userProfile?.alternatePhone || PROFILE_DETAILS.alternatePhone,
    registrationDate: baseUser.createdAt
      ? new Date(baseUser.createdAt).toLocaleString("default", {
          month: "long",
          year: "numeric",
        })
      : PROFILE_DETAILS.registrationDate,
    profileImage: userProfile?.profileImage || baseUser.profileImage || PROFILE_DETAILS.profileImage,
    aadhaarCardUrl: userProfile?.aadhaarCardUrl || "",
    voterIdCardUrl: userProfile?.voterIdCardUrl || "",
    panCardUrl: userProfile?.panCardUrl || "",
    utilityBillUrl: userProfile?.utilityBillUrl || "",
    bankStatementUrl: userProfile?.bankStatementUrl || "",
    password: PROFILE_DETAILS.password,
  });


  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const storedUserRaw = localStorage.getItem("user");

        if (!storedUserRaw) {
          const fallbackProfile = buildProfileData(PROFILE_DETAILS, null);
          setProfile(fallbackProfile);
          setEdit(fallbackProfile);
          return;
        }

        let parsed;
        try {
          parsed = JSON.parse(storedUserRaw);
        } catch (parseError) {
          console.error("Invalid stored user payload:", parseError);
          const fallbackProfile = buildProfileData(PROFILE_DETAILS, null);
          setProfile(fallbackProfile);
          setEdit(fallbackProfile);
          return;
        }

        const loggedInUser = parsed.user || parsed;

        if (!loggedInUser) {
          const fallbackProfile = buildProfileData(PROFILE_DETAILS, null);
          setProfile(fallbackProfile);
          setEdit(fallbackProfile);
          return;
        }

        if (!token) {
          const localProfile = buildProfileData(loggedInUser, null);
          setProfile(localProfile);
          setEdit(localProfile);
          return;
        }

        let userProfile = null;

        //Try fetching from backend
        try {
          const res = await axios.get(
            `http://localhost:5000/api/userProfile/getUser?userId=${loggedInUser._id}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          userProfile = res.data;

          //Ownership check
          if (userProfile.userId._id.toString() !== loggedInUser._id.toString()) {
            toast.error("Unauthorized: This profile does not belong to the logged-in user");
            return;
          }
        } catch (err) {
          if (err.response?.status === 404) {
            console.warn("No userProfile found, falling back to localStorage data only.");
            userProfile = null;
          } else {
            console.error("Error fetching profile:", err);
            toast.error("Failed to load profile data");
            return;
          }
        }

        // Merge localStorage + profile or fallback
        const profileData = buildProfileData(loggedInUser, userProfile);

        setProfile(profileData);
        setEdit(profileData);
      } catch (err) {
        console.error("Unhandled error:", err);
        const fallbackProfile = buildProfileData(PROFILE_DETAILS, null);
        setProfile(fallbackProfile);
        setEdit(fallbackProfile);
        toast.error("An unexpected error occurred");
      }
    };

    fetchProfile();
  }, []);



  const save = async () => {
    try {
      const token = localStorage.getItem("token");
      const storedUserRaw = localStorage.getItem("user");
      const parsedUser = storedUserRaw ? JSON.parse(storedUserRaw) : null;
      const loggedInUser = parsedUser?.user || parsedUser || {};

      if (!token) {
        const localUpdatedProfile = buildProfileData({ ...loggedInUser, ...edit }, null);
        setProfile(localUpdatedProfile);
        setEdit(localUpdatedProfile);
        setEditing(false);
        setImg(null);
        toast.success("Profile updated locally.");
        return;
      }

      const formData = new FormData();

      for (const key in edit) {
        if (
          key !== "password" &&
          key !== "visiblePassword" &&
          key !== "lastLogin" &&
          edit[key] !== undefined
        ) {
          formData.append(key, edit[key]);
        }
      }

      const safeNationality =
        Array.isArray(edit.nationality) ? edit.nationality[0] : edit.nationality || "N/A";
      formData.set("nationality", safeNationality);

      if (fileRef.current?.files?.[0]) {
        formData.append("profileImage", fileRef.current.files[0]);
      }
      if (edit.aadhaarCardFile) {
        formData.append("aadhaarCardUrl", edit.aadhaarCardFile);
      }
      if (edit.voterIdCardFile) {
        formData.append("voterIdCardUrl", edit.voterIdCardFile);
      }
      if (edit.panCardFile) {
        formData.append("panCardUrl", edit.panCardFile);
      }
      if (edit.utilityBillFile) {
        formData.append("utilityBillUrl", edit.utilityBillFile);
      }
      if (edit.bankStatementFile) {
        formData.append("bankStatementUrl", edit.bankStatementFile);
      }
      
      formData.set("aadhaar", edit.aadhaar || "");
      formData.set("voterId", edit.voterId || "");
      formData.set("pan", edit.pan || "");
      formData.set("alternatePhone", edit.alternatePhone || "");

      let response;

      try {
        response = await axios.put(
          `http://localhost:5000/api/userProfile/${profile._id}`, //updating userProfile
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
      } catch (err) {
        if (err.response?.status === 404) {
          console.warn("⚠️ Profile not found. Attempting to create new profile...");

          formData.append("userId", loggedInUser._id);

          //creating  new userProfile
          response = await axios.post(`http://localhost:5000/api/userProfile`, formData, {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          });
        } else {
          console.error("❌ PUT error:", err.response?.data || err.message);
          throw err;
        }
      }

      if (response.status === 200 || response.status === 201) {
        setProfile(response.data.profile);
        setEditing(false);
        setImg(null);
        toast.success("Profile saved successfully!");
      }
    } catch (err) {
      console.error("🔥 Failed to save/create profile:", err.response?.data || err.message);
      toast.error("Error saving profile");
    }
  };


  useEffect(() => {
    if (!editing) {
      const timer = setInterval(() => {
        setProfile((prev) => ({ ...prev, lastLogin: new Date() }));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [editing]);

  const update = (field, val) => setEdit((prev) => ({ ...prev, [field]: val }));

  const uploadImg = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const url = ev.target?.result;
        setImg(url);
        editing
          ? setEdit((prev) => ({ ...prev, profileImage: url }))
          : setProfile((prev) => ({ ...prev, profileImage: url }));
      };
      reader.readAsDataURL(file);
    }
  };

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-gray-500 text-lg">Loading profile...</p>
      </div>
    );
  }

  if (!profile || !edit) return <div>Loading...</div>;

  const tabs = getTabs({
    edit,
    update,
    editing,
    profile,
    aadhaarVisible,
    setAadhaarVisible,
    passwordVisible,
    setPasswordVisible,
  });


  return (
    <div className="min-h-screen bg-gray-50 transition-colors duration-300 overflow-x-hidden">
      <Header
        setTrackModalOpen={() => { }}
        handleAuthAction={() => { }}
        isLoggedIn
        handleLogout={() => { }}
      />
      <div className="min-h-screen flex flex-col md:flex-row bg-gray-100 overflow-x-hidden">
        <div className="hidden md:block">
          <VerticalProgressBar
            steps={PROGRESS_STEPS}
            activeStep={tab}
            setActiveStep={setTab}
            title={
              <span className="block mt-8 mb-[-30px] text-3xl font-bold">
                Profile Setup
              </span>
            }
            progressLineStyle={{ height: "550px", left: "48px" }}
          />
        </div>

        {!showMenu && (
          <div className="md:hidden fixed top-20 left-4 z-20">
            <button
              onClick={() => setShowMenu(true)}
              className="bg-blue-600 text-white p-1 rounded-full shadow-lg hover:bg-blue-700"
              aria-label="Open menu"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        )}
        {showMenu && (
          <>
            <button
              onClick={() => setShowMenu(false)}
              className="fixed top-4 right-4 z-30 bg-blue-600 text-white p-1 rounded-full shadow-lg hover:bg-blue-700 md:hidden"
            >
              <X className="w-6 h-6" />
            </button>
            <div className="md:hidden fixed inset-0 z-15 bg-black/30 backdrop-blur">
              <div className="fixed left-0 top-0 h-full w-[70vw] max-w-xs">
                <VerticalProgressBar
                  steps={PROGRESS_STEPS}
                  activeStep={tab}
                  setActiveStep={(t) => {
                    setTab(t);
                    setShowMenu(false);
                  }}
                  title={
                    <span className="text-3xl font-bold">Profile Setup</span>
                  }
                  className="fixed bottom-0 rounded-lg left-1 right-0 h-full px-7 py-4 flex flex-col gap-y-10 md:static md:h-full"
                  progressLineClassName="!bottom-32"
                  progressLineStyle={{ height: "410px", left: "30px" }}
                />
              </div>
            </div>
          </>
        )}

        <div className="flex-1 p-4 md:p-8 lg:p-16 bg-white w-full min-w-0">
          {/* profile header code below */}
          <div className="bg-white border-gray-200 rounded-lg shadow-sm border mb-8">
            <div className="p-6">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                <div className="relative">
                  <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200">
                    <img
                      src={
                        img ||
                        (editing ? edit?.profileImage : profile?.profileImage) ||
                        "https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg"
                      }
                      alt="profile picture"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <label className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700 transition-colors">
                    <Camera className="w-4 h-4" />
                    <input
                      ref={fileRef}
                      type="file"
                      accept="image/*"
                      onChange={uploadImg}
                      className="hidden"
                    />
                  </label>
                </div>

                <div className="flex-1 text-center md:text-left">
                  <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
                    <h1 className="text-3xl font-bold text-gray-900">
                      {profile.name}
                    </h1>
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Verified
                      </span>
                    </div>
                    <button
                      onClick={
                        editing
                          ? save
                          : () => {
                            setEdit(profile);
                            setEditing(true);
                          }
                      }
                      className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-300 rounded-full shadow-md transition-all duration-200 group w-full sm:w-auto"
                    >
                      <Edit className="w-4 h-4 transition-transform duration-200 group-hover:rotate-6" />
                      {editing ? "Save Changes" : "Edit Profile"}
                    </button>

                  </div>

                  <div className="flex flex-col sm:flex-row sm:flex-wrap gap-4 text-gray-600">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      <span>{profile.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      <span>{profile.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>Member since: {profile.memberSince}</span>
                    </div>
                  </div>
                  <div className="mt-2 text-sm text-gray-600 break-words">
                    Last login:{" "}
                    {profile.lastLogin.toLocaleString(undefined, {
                      hour: "2-digit",
                      minute: "2-digit",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}{" "}
                    • Account Status: {profile.accountStatus}
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/*  nav tabs rendered here */}
          {tabs[tab]}
        </div>
      </div>
      <Footer />
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}
