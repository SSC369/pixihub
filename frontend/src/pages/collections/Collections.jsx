import React from "react";
import axios from "axios";
import useSWR from "swr";
import host from "../../host";
import { FcFolder } from "react-icons/fc";
import Cookies from "js-cookie";
import empty from "../../assets/empty.jpg";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Loader from "../../components/loader/Loader";
import "./style.scss";

const Collections = () => {
  const pixiToken = Cookies.get("pixiToken");
  const navigate = useNavigate();

  const fetcher = async (url) => {
    try {
      const { data } = await axios.get(url, {
        headers: {
          "auth-token": pixiToken,
        },
      });
      return data;
    } catch (error) {
      console.log(error.message);
    }
  };
  const { data, isLoading, mutate } = useSWR(
    `${host}/api/collection/get-collections`,
    fetcher
  );

  const renderEmptyView = () => (
    <div className="empty-view-container">
      <img className="empty-image" src={empty} />
      <h2>Collections empty</h2>
    </div>
  );

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="user-collections-container">
          <>
            {data?.collections.length === 0 ? (
              renderEmptyView()
            ) : (
              <ul className="collections-container">
                {data?.collections?.map((c) => {
                  const { name, _id } = c;

                  return (
                    <li key={c._id}>
                      <FcFolder
                        onClick={() => navigate(`/collection-details/${_id}`)}
                      />
                      <p>{name}</p>
                    </li>
                  );
                })}
              </ul>
            )}
          </>
        </div>
      )}
    </>
  );
};

export default Collections;
