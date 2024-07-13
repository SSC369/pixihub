import React, { useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import useSWR from "swr";
import host from "../../host";
import "./style.scss";
import { BiImageAdd } from "react-icons/bi";
import Loader from "../../components/loader/Loader";
import { useNavigate } from "react-router-dom";
import empty from "../../assets/empty.jpg";

const Images = () => {
  const navigate = useNavigate();

  const fetcher = async (url) => {
    try {
      const pixiToken = Cookies.get("pixiToken");
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
  const { data, error, mutate, isLoading } = useSWR(
    `${host}/api/image/getAssets`,
    fetcher
  );

  const EmptyView = () => (
    <div className="empty-view-container">
      <img className="empty-image" src={empty} />
      <h2>No Images Found</h2>
    </div>
  );

  return (
    <>
      {isLoading ? (
        <>
          <Loader />
        </>
      ) : (
        <div className="images-container">
          <div onClick={() => navigate("/add-image")} className="add-image">
            <BiImageAdd />
            <p>Add Image</p>
          </div>

          {data?.assets?.length === 0 ? (
            <EmptyView />
          ) : (
            <ul className="images-list-container">
              {data?.assets?.map((i) => {
                const { title, _id, imageUrl } = i;

                return (
                  <li
                    onClick={() => navigate(`/image-details/${_id}`)}
                    key={_id}
                  >
                    <div className="image-container">
                      <img src={imageUrl} />
                    </div>

                    <p>{title}</p>
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

export default Images;
