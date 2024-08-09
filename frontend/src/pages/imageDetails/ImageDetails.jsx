import React, { useEffect, useState } from "react";
import "./style.scss";
import useSWR from "swr";
import Cookies from "js-cookie";
import axios from "axios";
import Loader from "../../components/loader/Loader";
import { useNavigate, useParams } from "react-router-dom";
import dayjs from "dayjs";
import { jwtDecode } from "jwt-decode";
import moment from "moment";
import {
  MdOutlineBookmarkAdd,
  MdOutlineBookmarkAdded,
  MdFavoriteBorder,
  MdFavorite,
} from "react-icons/md";

import toast from "react-hot-toast";
import { FiUser } from "react-icons/fi";
import { FaRegComment } from "react-icons/fa6";
import { LuDownload } from "react-icons/lu";
import { BiShareAlt } from "react-icons/bi";
import { RxCross2, RxDotFilled } from "react-icons/rx";
import { AiOutlineDelete } from "react-icons/ai";
import host from "../../host";
import CollectionsModal from "../../components/collectionModal/CollectionModal";
import empty from "../../assets/no-review.jpg";

const downloadImage = async (url) => {
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", "temp");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const ImageDetails = () => {
  const [liked, setLiked] = useState(false);
  const [bookmarkModal, setBookmarkModal] = useState(false);
  const [bookmark, setBookmark] = useState(false);
  const [reviewsModal, setReviewsModal] = useState(false);
  const [review, setReview] = useState("");
  const { imageId } = useParams();
  const pixiToken = Cookies.get("pixiToken");
  const { userId: id } = jwtDecode(pixiToken);
  const navigate = useNavigate();

  const fetcher = async (url) => {
    try {
      const { data } = await axios.get(url);

      return data;
    } catch (error) {
      console.log(error.message);
    }
  };
  const { data, isLoading, error } = useSWR(
    `${host}/api/image/getimage/${imageId}`,
    fetcher
  );

  const isLiked = async () => {
    try {
      const url = `${host}/api/like/user-like/${imageId}`;
      const res = await axios.get(url, {
        headers: {
          "auth-token": pixiToken,
        },
      });

      if (res.status === 200) {
        if (res.data.liked) {
          setLiked(true);
        }
      } else {
        toast.error(res.data.msg, { duration: 1000 });
      }
    } catch (error) {
      toast.error(error.message, { duration: 1000 });
    }
  };

  useEffect(() => {
    isLiked();
  }, []);

  const likesFetcher = async (url) => {
    try {
      const { data } = await axios.get(url);
      return data.likesCount;
    } catch (error) {
      toast.error(error.message, { duration: 1000 });
    }
  };
  const {
    data: likes,
    mutate: likesMutate,
    isLoading: likesLoading,
  } = useSWR(`${host}/api/like/image-likes/${imageId}`, likesFetcher);

  const handleDislike = async () => {
    try {
      setLiked(false);
      const url = `${host}/api/like/remove-like/${imageId}`;
      const res = await axios.delete(url, {
        headers: {
          "auth-token": pixiToken,
        },
      });
      if (res.status === 200) {
        likesMutate();
      }
    } catch (error) {
      toast.error(error.message, { duration: 1000 });
    }
  };

  const handleLike = async () => {
    try {
      setLiked(true);
      const url = `${host}/api/like/add-like`;

      const res = await axios.post(
        url,
        {
          imageId,
        },
        {
          headers: {
            "auth-token": pixiToken,
          },
        }
      );
      if (res.status === 201) {
        likesMutate();
      }
    } catch (error) {
      toast.error(error.message, { duration: 1000 });
    }
  };

  //comments fetching
  const reviewsFetcher = async (url) => {
    try {
      const res = await axios.get(url);
      if (res.status === 200) {
        return res.data.reviews;
      }
    } catch (error) {
      toast.error(error.message, { duration: 1000 });
    }
  };

  const {
    data: reviewsData,
    isLoading: reviewsLoading,
    mutate: reviewsMutate,
  } = useSWR(`${host}/api/review/get-reviews/${imageId}`, reviewsFetcher);

  const handleComment = async () => {
    try {
      const url = `${host}/api/review/add-review`;
      const res = await axios.post(
        url,
        {
          imageId,
          review,
          date: new Date(),
        },
        {
          headers: {
            "auth-token": pixiToken,
          },
        }
      );

      if (res.status === 201) {
        toast.success(res.data.msg, { duration: 1000 });
        reviewsMutate();
        setReview("");
      }
    } catch (error) {
      toast.error(error.message, { duration: 1000 });
    }
  };

  const handleDelete = async (id) => {
    try {
      const url = `${host}/api/review/delete-review/${id}`;
      const res = await axios.delete(url);
      if (res.status === 200) {
        reviewsMutate();
        toast.success(res.data.msg, { duration: 1000 });
      }
    } catch (error) {
      toast.error(error.message, { duration: 1000 });
    }
  };

  const renderEmptyView = () => {
    return (
      <div className="empty-reviews-container">
        <img className="empty-image" src={empty} />
        <p>Oops! Its's Empty</p>
      </div>
    );
  };

  return (
    <div className="image-details-container">
      {isLoading || likesLoading || reviewsLoading ? (
        <Loader />
      ) : (
        <div className="image-details">
          <div className="image">
            <img src={data?.imageUrl} />
          </div>
          <div className="details">
            <h2>{data?.title}</h2>
            <p className="desc">{data?.description}</p>
            <div className="icons-container">
              {liked ? (
                <MdFavorite color="red" onClick={handleDislike} />
              ) : (
                <MdFavoriteBorder onClick={handleLike} />
              )}

              <FaRegComment
                onClick={() => setReviewsModal(true)}
                className="comments"
              />
              <LuDownload onClick={() => downloadImage(data?.imageUrl)} />
              <BiShareAlt />

              {bookmark ? (
                <MdOutlineBookmarkAdded
                  onClick={() => {
                    setBookmarkModal(true);
                  }}
                  color="green"
                />
              ) : (
                <MdOutlineBookmarkAdd
                  onClick={() => {
                    setBookmarkModal(true);
                  }}
                />
              )}
            </div>
            <p className="likes">
              {likes} <span>Likes</span>
            </p>
            <p onClick={() => setReviewsModal(true)} className="reviews-count">
              View all {reviewsData.length} Reviews
            </p>
            <p className="date">{dayjs(data?.date).format("MMM D, YYYY")}</p>

            <div
              onClick={() => navigate(`/profile/${data?.userId}`)}
              className="profile-container"
            >
              <div className="profile">
                <FiUser />
              </div>
              <p className="name">{data?.username}</p>
            </div>
          </div>
        </div>
      )}

      {reviewsModal && (
        <div className={`reviews-modal-overlay `}>
          <div className={`reviews-modal `}>
            <div className="row">
              <h4>Reviews</h4>
              <RxCross2 onClick={() => setReviewsModal(false)} />
            </div>

            <div className="add-review">
              <input
                value={review}
                onChange={(e) => setReview(e.target.value)}
                type="text"
              />
              <button
                style={
                  review.length === 0
                    ? { opacity: "0.5", pointerEvents: "none" }
                    : {}
                }
                onClick={handleComment}
              >
                Send
              </button>
            </div>

            {reviewsLoading ? (
              <Loader />
            ) : (
              <>
                {reviewsData.length === 0 ? (
                  renderEmptyView()
                ) : (
                  <div className="reviews-container">
                    {reviewsData?.map((r) => {
                      const {
                        review,
                        username,
                        reviewId,
                        profileImage,
                        date,
                        userId,
                      } = r;

                      return (
                        <li key={reviewId} className="review-item">
                          {profileImage.length === 0 ? (
                            <div
                              style={{ cursor: "pointer" }}
                              onClick={() => navigate(`/profile/${userId}`)}
                              className="profile"
                            >
                              <FiUser />
                            </div>
                          ) : (
                            <img src={profileImage} />
                          )}

                          <div className="review-details">
                            <div className="name">
                              <p
                                style={{ cursor: "pointer" }}
                                onClick={() => navigate(`/profile/${userId}`)}
                              >
                                {username}
                              </p>
                              <RxDotFilled />
                              <span>{moment(date).fromNow()}</span>
                            </div>

                            <p className="review">{review}</p>
                            {userId === id && (
                              <AiOutlineDelete
                                onClick={() => handleDelete(reviewId)}
                                className="deleteIcon"
                              />
                            )}
                          </div>
                        </li>
                      );
                    })}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {bookmarkModal && (
        <CollectionsModal
          setBookmark={setBookmark}
          imageId={imageId}
          onClose={() => setBookmarkModal(false)}
        />
      )}
    </div>
  );
};

export default ImageDetails;
