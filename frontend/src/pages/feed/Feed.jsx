import React from "react";
import useSWR from "swr";
import toast from "react-hot-toast";
import axios from "axios";
import empty from "../../assets/empty.jpg";
import "./style.scss";
import host from "../../host";
import { useNavigate } from "react-router-dom";
import Loader from "../../components/loader/Loader";

const Feed = () => {
  const navigate = useNavigate();
  const imagesFetcher = async (url) => {
    try {
      const res = await axios.get(url);
      if (res.status === 200) {
        return res.data.images;
      } else {
        toast.error(res.data.msg, { duration: 1000 });
      }
    } catch (error) {
      toast.error(error.message, { duration: 1000 });
    }
  };
  const { data, isLoading, mutate } = useSWR(
    `${host}/api/image/get-images`,
    imagesFetcher
  );

  const renderEmptyView = () => (
    <div className="empty-view-container">
      <img className="empty-image" src={empty} />
      <h2>No Images Found</h2>
    </div>
  );

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="feed">
          {data?.length === 0 ? (
            renderEmptyView()
          ) : (
            <ul className="images-list-container">
              {data?.map((i) => {
                const { title, _id, imageUrl } = i;

                return (
                  <li
                    onClick={() => navigate(`/image-details/${_id}`)}
                    key={_id}
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

export default Feed;
