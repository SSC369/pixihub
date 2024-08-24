import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import useSWR from "swr";
import host from "../../host";
import Loader from "../../components/loader/Loader";
import NotFound from "../../components/notFound/NotFound";
import "./style.scss";
import { FiUser } from "react-icons/fi";
import dayjs from "dayjs";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import { MdDeleteOutline } from "react-icons/md";
import empty from "../../assets/empty.jpg";
import toast from "react-hot-toast";

const CollectionDetails = () => {
  const { collectionId } = useParams();
  const navigate = useNavigate();
  const pixiToken = Cookies.get("pixiToken");
  const { userId } = jwtDecode(pixiToken);

  const fetcher = async (url) => {
    try {
      const res = await axios.get(url);
      return res.data?.collection;
    } catch (error) {
      toast.error(error.message, { duration: 1000 });
    }
  };

  const { data, isLoading, mutate, error } = useSWR(
    `${host}/api/collection/${collectionId}`,
    fetcher
  );

  if (error) {
    return <NotFound />;
  }

  const EmptyView = () => (
    <div className="empty-view-container">
      <img className="empty-image" src={empty} />
      <h2>No Images Found</h2>
    </div>
  );

  const handleRemoveImage = async (id) => {
    try {
      const url = `${host}/api/collection/remove-image/${collectionId}/${id}`;
      const res = await axios.put(url);
      if (res.status === 200) {
        toast.success(res.data.msg, { duration: 1000 });
        mutate();
      }
    } catch (error) {
      toast.error(error.message, { duration: 1000 });
    }
  };

  const handleDeleteCollection = async () => {
    try {
      const url = host + "/api/collection/" + collectionId;
      const res = await axios.delete(url);
      if (res.status === 200) {
        const { data } = res;
        toast.success(data.msg, { duration: 1000 });
        setTimeout(() => {
          navigate("/collections");
        }, 1000);
      }
    } catch (error) {
      toast.error(error.message, { duration: 1000 });
    }
  };
  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="collection-container">
          <h2>{data?.name}</h2>

          <div className="row">
            <span>Created By:</span>
            <div
              onClick={() => navigate(`/profile/${userId}`)}
              className="profile-container"
            >
              {data?.userDetails.profileImage.length === 0 ? (
                <div className="profile">
                  <FiUser />
                </div>
              ) : (
                <img src={data?.userDetails.profileImage} />
              )}

              <p className="name">{data?.userDetails.username}</p>
            </div>
          </div>

          <div className="date">
            <span>Date of creation:</span>
            <p>{dayjs(data?.date).format("MMM D, YYYY")}</p>
          </div>

          <div className="date">
            <span>Total Assets:</span>
            <p>{data?.imagesDetails.length}</p>
          </div>

          {data?.imagesDetails.length === 0 ? (
            EmptyView()
          ) : (
            <ul className="collection-images">
              {data?.imagesDetails.map((d) => {
                const { imageId, imageUrl, title } = d;
                return (
                  <li key={imageId}>
                    <img
                      onClick={() => navigate(`/image-details/${imageId}`)}
                      src={imageUrl}
                    />
                    <div className="icon">
                      {userId === data?.userDetails._id && (
                        <MdDeleteOutline
                          onClick={() => handleRemoveImage(imageId)}
                        />
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          )}

          <button onClick={handleDeleteCollection} className="deleteIcon">
            <MdDeleteOutline />
          </button>
        </div>
      )}
    </>
  );
};

export default CollectionDetails;
