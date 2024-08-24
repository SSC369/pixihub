import React, { useState } from "react";
import axios from "axios";
import useSWR from "swr";
import host from "../../host";
import "./style.scss";
import { BiImageAdd } from "react-icons/bi";
import Loader from "../../components/loader/Loader";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import empty from "../../assets/empty.jpg";
import { MdDelete } from "react-icons/md";
import { AiOutlineDelete } from "react-icons/ai";

const Images = ({ id }) => {
  const navigate = useNavigate();
  const { userId } = useParams();

  const fetcher = async (url) => {
    try {
      const { data } = await axios.get(url);

      return data;
    } catch (error) {
      console.log(error.message);
    }
  };
  const { data, error, mutate, isLoading } = useSWR(
    `${host}/api/image/getAssets/${userId || id}`,
    fetcher
  );

  const EmptyView = () => (
    <div className="empty-view-container">
      <img className="empty-image" src={empty} />
      <h2>No Images Found</h2>
    </div>
  );

  const handleImageDelete = async (id) => {
    try {
      const url = host + "/api/image/delete-image/" + id;
      const res = await axios.delete(url);
      if (res.status === 200) {
        toast.success(res.data.msg, { duration: 1000 });
        mutate();
      }
    } catch (error) {
      toast.error(error.message, { duration: 1000 });
    }
  };

  return (
    <>
      {isLoading ? (
        <>
          <Loader />
        </>
      ) : (
        <div className="images-container">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: "40px",
            }}
          >
            <h1>My Images</h1>
            <div onClick={() => navigate("/add-image")} className="add-image">
              <BiImageAdd />
              <p>Add Image</p>
            </div>
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
                    <div className="">
                      <img src={imageUrl} />

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleImageDelete(_id);
                        }}
                        className="deleteButton"
                      >
                        <AiOutlineDelete />
                      </button>
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

export default Images;
