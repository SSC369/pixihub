import React, { useEffect, useState } from "react";
import "./style.scss";
import useSWR from "swr";
import host from "../../host";
import axios from "axios";
import { FiMinusCircle } from "react-icons/fi";
import { IoAddCircleOutline } from "react-icons/io5";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import empty from "../../assets/no-collections.jpg";
import { Rings } from "react-loader-spinner";
import { FcOpenedFolder } from "react-icons/fc";
import { FcFolder } from "react-icons/fc";
import { useNavigate } from "react-router-dom";

const Modal = ({ onClose, imageId, setBookmark }) => {
  const [name, setName] = useState("");
  const [add, setAdd] = useState(false);
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

  useEffect(() => {
    if (isLoading === false) {
      data?.collections?.forEach((c) => {
        const { images } = c;
        if (images.includes(imageId)) {
          setBookmark(true);
        }
      });
    }
  }, [isLoading]);

  const addCollection = async () => {
    try {
      if (name.length === 0) {
        toast.error("Please enter name", { duration: 1000 });
        return;
      }
      const url = `${host}/api/collection/create-collection`;
      const res = await axios.post(
        url,
        {
          name,
        },
        {
          headers: {
            "auth-token": pixiToken,
          },
        }
      );
      if (res.status === 201) {
        toast.success(res.data.msg, { duration: 1000 });
        setName("");
        setAdd(false);
        mutate();
      }
    } catch (error) {
      toast.error(error.message, { duration: 1000 });
    }
  };

  const renderEmptyView = () => {
    return (
      <div className="empty-view-container">
        <img className="empty-image" src={empty} />
        <p>Oops! Its's Empty</p>
      </div>
    );
  };

  const renderLoadingView = () => {
    return (
      <div className="modal-loading-container">
        <Rings
          visible={true}
          height="80"
          width="80"
          color="#4fa94d"
          ariaLabel="rings-loading"
          wrapperStyle={{}}
          wrapperClass=""
        />
      </div>
    );
  };

  const handleImageIntoCollection = async (
    name,
    collectionId,
    collectionImages
  ) => {
    try {
      if (collectionImages.includes(imageId)) {
        toast.error(`Already added into ${name}`);
        return;
      }
      const url = `${host}/api/collection/add-image`;
      const res = await axios.put(
        url,
        {
          imageId,
          collectionId,
        },
        {
          headers: {
            "auth-token": pixiToken,
          },
        }
      );
      if (res.status === 204) {
        toast.success(`Image Added into ${name}`, { duration: 1000 });
        mutate();
      }
    } catch (error) {
      toast.error(error.message, { duration: 1000 });
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          &times;
        </button>
        <div className="header">
          <h3>Collections</h3>
        </div>

        <div className="create-collection-container">
          <div className="add" onClick={() => setAdd(!add)}>
            {add ? <FiMinusCircle /> : <IoAddCircleOutline />}
            <label>Create Collection</label>
          </div>

          {add && (
            <div className="input-container">
              <input
                onChange={(e) => setName(e.target.value)}
                value={name}
                type="text"
              />
              <button
                style={
                  name === "" ? { pointerEvents: "none", opacity: "0.5" } : {}
                }
                onClick={addCollection}
              >
                Add
              </button>
            </div>
          )}
        </div>

        <>
          {isLoading ? (
            renderLoadingView()
          ) : (
            <>
              {data?.collections.length === 0 ? (
                renderEmptyView()
              ) : (
                <ul className="collections-container">
                  {data?.collections?.map((c) => {
                    const { name, images, _id } = c;

                    return (
                      <li key={c._id}>
                        {images.includes(imageId) ? (
                          <FcOpenedFolder
                            onClick={() =>
                              navigate(`/collection-details/${_id}`)
                            }
                          />
                        ) : (
                          <FcFolder
                            onClick={() =>
                              handleImageIntoCollection(name, _id, images)
                            }
                          />
                        )}

                        <p>{name}</p>
                      </li>
                    );
                  })}
                </ul>
              )}
            </>
          )}
        </>
      </div>
    </div>
  );
};

export default Modal;
