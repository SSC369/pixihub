import React from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import Loader from "../../components/loader/Loader";
import "./style.scss";
import useSWR from "swr";
import host from "../../host";
import NotFound from "../../components/notFound/NotFound";
import { useNavigate } from "react-router-dom";
import empty from "../../assets/empty.jpg";

const Favorites = () => {
  const navigate = useNavigate();
  const pixiToken = Cookies.get("pixiToken");

  const fetcher = async (url) => {
    try {
      const { data } = await axios.get(url, {
        headers: {
          "auth-token": pixiToken,
        },
      });
      return data?.favorites;
    } catch (error) {
      toast.error(error.message, { duration: 1000 });
    }
  };

  const { data, isLoading, error } = useSWR(
    `${host}/api/like/favorites`,
    fetcher
  );

  const renderEmptyView = () => {
    return (
      <div className="empty-view-container">
        <img className="empty-image" src={empty} />
        <h2>Oops! Its's Empty</h2>
      </div>
    );
  };

  if (error) {
    return <NotFound />;
  }

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="favorites-container">
          <h1>Favorites</h1>

          {data?.length === 0 ? (
            renderEmptyView()
          ) : (
            <ul className="images-list-container">
              {data?.map((i) => {
                const { imageId, imageUrl } = i;

                return (
                  <li
                    onClick={() => navigate(`/image-details/${imageId}`)}
                    key={imageId}
                  >
                    <div className="image-container">
                      <img src={imageUrl} />
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}
    </>
  );
};

export default Favorites;
