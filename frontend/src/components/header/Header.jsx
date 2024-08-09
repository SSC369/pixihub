import React, { useContext, useEffect, useState } from "react";
import { CgProfile } from "react-icons/cg";
import "./style.scss";
import toast, { Toaster } from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { FaCameraRetro } from "react-icons/fa";
import { CiLogin } from "react-icons/ci";
import { LuPower } from "react-icons/lu";
import { FaImages } from "react-icons/fa";
import { FaUserEdit } from "react-icons/fa";
import { PiHeart } from "react-icons/pi";
import { BsFolder } from "react-icons/bs";
import { FiDownload } from "react-icons/fi";
import { RiUserFollowLine } from "react-icons/ri";
import { jwtDecode } from "jwt-decode";
import { searchContext } from "../../context/searchContext";

const Header = () => {
  const [menu, setMenu] = useState(false);
  const [search, setSearch] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const { query, setQuery } = useContext(searchContext);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const path = pathname.slice(1);
  const jwtToken = Cookies.get("pixiToken");

  const handleLogout = () => {
    Cookies.remove("jwtToken");
    toast.success("Signed out successfully", { duration: 1000 });
    setTimeout(() => {
      navigate("/login");
    }, 1000);
  };
  const handleLogin = () => {
    navigate("/login");
  };

  useEffect(() => {
    if (jwtToken === undefined) {
      navigate("/login");
    }
  }, []);

  let userId;
  if (jwtToken !== undefined) {
    const data = jwtDecode(jwtToken);
    userId = data.userId;
  }

  return (
    <>
      <nav className="navbar">
        <div onClick={() => navigate("/")} className="logo">
          <p>Pixihub</p>
          <span>
            <FaCameraRetro />
          </span>
        </div>

        <div className="header-profile-container">
          <CgProfile onClick={() => setMenu(!menu)} />
          {menu && (
            <ul className="profile-menu">
              <li
                style={
                  path === `/profile/${userId}`
                    ? { borderBottom: "2px solid var(--bg5)" }
                    : {}
                }
                onClick={() => navigate(`/profile/${userId}`)}
              >
                <p>Profile</p>
                <FaUserEdit />
              </li>
              <li
                style={
                  path === `images/${userId}`
                    ? { borderBottom: "2px solid var(--bg5)" }
                    : {}
                }
                onClick={() => navigate(`/images/${userId}`)}
              >
                <p>My Images</p>
                <FaImages />
              </li>

              <li
                style={
                  path === "favorites"
                    ? { borderBottom: "2px solid var(--bg5)" }
                    : {}
                }
                onClick={() => navigate("/favorites")}
              >
                <p>Favorites</p>
                <PiHeart />
              </li>
              <li
                style={
                  path === "collections"
                    ? { borderBottom: "2px solid var(--bg5)" }
                    : {}
                }
                onClick={() => navigate("/collections")}
              >
                <p>Collections</p>
                <BsFolder />
              </li>
              <li
                style={
                  path === "downloads"
                    ? { borderBottom: "2px solid var(--bg5)" }
                    : {}
                }
                onClick={() => navigate("/downloads")}
              >
                <p>Downloads</p>
                <FiDownload />
              </li>
              <li
                style={
                  path === "following"
                    ? { borderBottom: "2px solid var(--bg5)" }
                    : {}
                }
                onClick={() => navigate("/following")}
              >
                <p>Following</p>
                <RiUserFollowLine />
              </li>

              <li>
                {jwtToken ? (
                  <>
                    <p onClick={handleLogout}>Logout</p>
                    <CiLogin />
                  </>
                ) : (
                  <>
                    <p onClick={handleLogin}>Login</p>
                    <LuPower />
                  </>
                )}
              </li>
            </ul>
          )}
        </div>
      </nav>
    </>
  );
};

export default Header;
