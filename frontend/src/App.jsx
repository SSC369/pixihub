import React, { useEffect } from "react";
import Header from "./components/header/Header";
import Cookies from "js-cookie";
import CollectionDetails from "./pages/collectionDetails/CollectionDetails";
import { Route, Routes, useNavigate } from "react-router-dom";
import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import AddImage from "./pages/addImage/AddImage";
import ImageDetails from "./pages/imageDetails/ImageDetails";
import Collections from "./pages/collections/Collections";
import Downloads from "./pages/downloads/Downloads";
import Images from "./pages/images/Images";
import Favorites from "./pages/favorites/Favorites";
import { Toaster } from "react-hot-toast";
import Profile from "./pages/profile/Profile";
import Feed from "./pages/feed/Feed";

const App = () => {
  const Wrapper = ({ children }) => {
    const navigate = useNavigate();

    useEffect(() => {
      const pixiToken = Cookies.get("pixiToken");
      if (pixiToken === undefined) {
        navigate("/login");
      }
    }, []);

    return (
      <>
        <Header />
        {children}
      </>
    );
  };

  return (
    <div className="theme">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <Wrapper>
              <Home />
            </Wrapper>
          }
        />
        <Route
          path="/image-details/:imageId"
          element={
            <Wrapper>
              <ImageDetails />
            </Wrapper>
          }
        />
        <Route
          path="/collections"
          element={
            <Wrapper>
              <Collections />
            </Wrapper>
          }
        />
        <Route
          path="/add-image"
          element={
            <Wrapper>
              <AddImage />
            </Wrapper>
          }
        />
        <Route
          path="/downloads"
          element={
            <Wrapper>
              <Downloads />
            </Wrapper>
          }
        />

        <Route
          path="/images/:userId"
          element={
            <Wrapper>
              <Images />
            </Wrapper>
          }
        />
        <Route
          path="/images"
          element={
            <Wrapper>
              <Feed />
            </Wrapper>
          }
        />
        <Route
          path="/favorites"
          element={
            <Wrapper>
              <Favorites />
            </Wrapper>
          }
        />
        <Route
          path="/collection-details/:collectionId"
          element={
            <Wrapper>
              <CollectionDetails />
            </Wrapper>
          }
        />
        <Route
          path="/profile/:userId"
          element={
            <Wrapper>
              <Profile />
            </Wrapper>
          }
        />
        <Route path="/register" element={<Register />} />
      </Routes>
      <Toaster position="top-center" reverseOrder={false} />
    </div>
  );
};

export default App;
