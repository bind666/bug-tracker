import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { FaHome, FaUser, FaTicketAlt, FaSignOutAlt, FaBars, FaTimes } from "react-icons/fa";

//Navbar
const Navbar = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate("/auth");
    };

    const navLinkClass = ({ isActive }) =>
        `flex items-center gap-2 px-4 py-2 rounded-md transition-all ${isActive ? "bg-purple-700 text-white" : "text-purple-300 hover:bg-purple-800"}`;

    return (
        <nav className="fixed top-0 left-0 w-full z-50 bg-gradient-to-r from-gray-900 to-black text-purple-100 shadow-md p-4">
            <div className="flex justify-between items-center">
                <div className="text-xl font-bold text-purple-400">🚀 Project Panel</div>

                {/* Mobile menu icon */}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="md:hidden text-purple-200 focus:outline-none text-2xl"
                >
                    {isOpen ? <FaTimes /> : <FaBars />}
                </button>

                {/* Desktop menu */}
                <div className="hidden md:flex items-center gap-6 text-lg font-semibold">
                    <NavLink to="/dashboard" className={navLinkClass}>
                        <FaHome /> Dashboard
                    </NavLink>
                    <NavLink to="/tickets" className={navLinkClass}>
                        <FaTicketAlt /> Tickets
                    </NavLink>
                    <NavLink to="/profile" className={navLinkClass}>
                        <FaUser /> Profile
                    </NavLink>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-white font-bold transition duration-300"
                    >
                        <FaSignOutAlt /> Logout
                    </button>
                </div>
            </div>

            {/* Mobile dropdown menu */}
            {isOpen && (
                <div className="flex flex-col mt-4 gap-2 md:hidden text-md font-medium">
                    <NavLink to="/dashboard" className={navLinkClass} onClick={() => setIsOpen(false)}>
                        <FaHome /> Dashboard
                    </NavLink>
                    <NavLink to="/tickets" className={navLinkClass} onClick={() => setIsOpen(false)}>
                        <FaTicketAlt /> Tickets
                    </NavLink>
                    <NavLink to="/profile" className={navLinkClass} onClick={() => setIsOpen(false)}>
                        <FaUser /> Profile
                    </NavLink>
                    <button
                        onClick={() => {
                            setIsOpen(false);
                            handleLogout();
                        }}
                        className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-white font-bold transition duration-300"
                    >
                        <FaSignOutAlt /> Logout
                    </button>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
