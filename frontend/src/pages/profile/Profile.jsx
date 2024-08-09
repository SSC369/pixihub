import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useSWR from "swr";
import host from "../../host";
import toast from "react-hot-toast";
import axios from "axios";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { HiOutlineMail } from "react-icons/hi";
import { app } from "../../utils/firebase";
import Loader from "../../components/loader/Loader";
import { RxCross2 } from "react-icons/rx";
import { GoPerson } from "react-icons/go";
import { FiEdit2 } from "react-icons/fi";
import Cookies from "js-cookie";
import { TbUserHexagon } from "react-icons/tb";
import { jwtDecode } from "jwt-decode";

import "./style.scss";
import FollowerModal from "../../components/followerModal/FollowerModal";

const Profile = () => {
  const [file, setFile] = useState();
  const [imageUrl, setImageUrl] = useState("");
  const [username, setUsername] = useState("");
  const [assets, setAssets] = useState(0);
  const [isFollowing, setFollowing] = useState(false);
  const [editName, setEditName] = useState(false);
  const [loading, setLoading] = useState(false);
  const [followerModal, setFollowerModal] = useState(false);

  const pixiToken = Cookies.get("pixiToken");
  const { userId: id } = jwtDecode(pixiToken);
  const { userId } = useParams();

  const profileFetcher = async (url) => {
    try {
      const { data } = await axios.get(url);
      return data.userDetails;
    } catch (error) {
      toast.error(error.message, { duration: 1000 });
    }
  };
  const {
    isLoading: profileLoading,
    data: profileData,
    mutate: profileMutate,
  } = useSWR(`${host}/api/auth/profile/${userId}`, profileFetcher);

  //profile user followers data
  const followersFetcher = async (url) => {
    try {
      const res = await axios.get(url);
      if (res.status === 200) {
        return res.data.followers;
      }
    } catch (error) {
      toast.error(error.message, { duration: 1000 });
    }
  };
  const {
    data: followers,
    isLoading: followersLoading,
    mutate: followersDataMutate,
  } = useSWR(`${host}/api/follower/followers/${userId}`, followersFetcher);

  //profile user following data
  const retrieveFollowingData = async (url) => {
    try {
      const res = await axios.get(url);
      if (res.status === 200) {
        return res.data.followingData;
      }
    } catch (error) {
      toast.error(error.message, { duration: 1000 });
    }
  };
  const { data: followingData, isLoading: followingDataLoading } = useSWR(
    `${host}/api/follower/following/${userId}`,
    retrieveFollowingData
  );

  //retrive assets and user is following profile's user or not
  useEffect(() => {
    setLoading(true);
    const retrieveAssets = async () => {
      try {
        const url = `${host}/api/image/getAssets/${userId}`;
        const res = await axios.get(url);
        if (res.status === 200) {
          setAssets(res.data.assets.length);
        } else {
          toast.error(res.data.msg, { duration: 1000 });
        }
      } catch (error) {
        toast.error(error.message, { duration: 1000 });
      }
    };
    const isFollowing = async () => {
      try {
        const url = `${host}/api/follower/isFollowing/${userId}/${id}`;
        const res = await axios.get(url);
        if (res.status === 200) {
          setFollowing(res.data.following);
          setLoading(false);
        } else {
          toast.error(res.data.msg, { duration: 1000 });
        }
      } catch (error) {
        toast.error(error.message, { duration: 1000 });
      }
    };
    isFollowing();
    retrieveAssets();
  }, []);

  useEffect(() => {
    if (!profileLoading) {
      setUsername(profileData?.username);
      setImageUrl(profileData?.profileImage);
    }
  }, [profileLoading]);

  const uploadFile = () => {
    const storage = getStorage(app);
    const name = new Date() + file.name;
    const storageRef = ref(storage, name);
    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        switch (snapshot.state) {
          case "paused":
            console.log("Upload is paused");
            break;
          case "running":
            console.log("Upload is running");
            break;
        }
      },
      (error) => {
        console.log(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImageUrl(downloadURL);
          setFile("");
        });
      }
    );
  };

  useEffect(() => {
    if (file) {
      uploadFile();
    }
  }, [file]);

  const handleFollow = async () => {
    try {
      const url = `${host}/api/follower/add-follower`;
      const res = await axios.post(url, {
        userId,
        followerId: id,
      });
      if (res.status === 201) {
        toast.success(res.data.msg, { duration: 1000 });
        followersDataMutate();
        setFollowing(true);
      } else {
        toast.error(res.data.msg, { duration: 1000 });
      }
    } catch (error) {
      toast.error(error.message, { duration: 1000 });
    }
  };

  const handleUnFollow = async () => {
    try {
      const url = `${host}/api/follower/remove-follower/${userId}/${id}`;
      const res = await axios.delete(url);
      if (res.status === 200) {
        toast.success(res.data.msg, { duration: 1000 });
        followersDataMutate();
        setFollowing(false);
      } else {
        toast.error(res.data.msg, { duration: 1000 });
      }
    } catch (error) {
      toast.error(error.message, { duration: 1000 });
    }
  };

  return (
    <>
      {profileLoading || followersLoading || followingDataLoading || loading ? (
        <Loader />
      ) : (
        <div className="profile-details-container">
          <div className="profile-details">
            <div className="profile-image-container">
              {imageUrl === "" ? (
                <div className="profile-image">
                  <GoPerson />
                </div>
              ) : (
                <div className="image">
                  <img src={imageUrl} />
                </div>
              )}

              {id === userId && (
                <div
                  style={{ display: "flex", alignItems: "center", gap: "40px" }}
                >
                  <RxCross2 />

                  <label htmlFor="file">
                    <FiEdit2 className="edit" />
                  </label>
                </div>
              )}

              <input
                onChange={(e) => setFile(e.target.files[0])}
                id="file"
                style={{ display: "none" }}
                type="file"
              />
            </div>

            <div className="name-email">
              <div className="input-container">
                <label>Username</label>

                <div className="name">
                  <input
                    style={editName ? {} : { pointerEvents: "none" }}
                    onChange={(e) => setUsername(e.target.value)}
                    id="username"
                    value={username}
                    type="text"
                  />

                  {id === userId ? (
                    <button
                      onClick={(e) => {
                        setEditName(!editName);
                        e.stopPropagation();
                      }}
                      style={editName ? { boxShadow: "var(--shadow)" } : {}}
                    >
                      <FiEdit2 />
                    </button>
                  ) : (
                    <button>
                      <TbUserHexagon />
                    </button>
                  )}
                </div>
              </div>

              <div className="input-container">
                <label>Email</label>
                <div className="name">
                  <input
                    style={{ pointerEvents: "none" }}
                    id="email"
                    placeholder={profileData?.email}
                    type="email"
                  />
                  <button>
                    <HiOutlineMail />
                  </button>
                </div>
              </div>
            </div>

            <div
              style={{ display: "flex", flexDirection: "column", gap: "16px" }}
            >
              <div className="profile-statistics">
                <div>
                  <span>Assets</span>
                  <p>{assets}</p>
                </div>

                <div onClick={() => setFollowerModal(true)}>
                  <span>Followers</span>
                  <p>{followers?.length}</p>
                </div>
                <div>
                  <span>Following</span>
                  <p>{followingData?.length}</p>
                </div>
              </div>

              {id !== userId && (
                <>
                  {isFollowing ? (
                    <button onClick={handleUnFollow} className="follow">
                      Unfollow
                    </button>
                  ) : (
                    <button onClick={handleFollow} className="follow">
                      Follow
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}
      {followerModal && (
        <FollowerModal
          show={followerModal}
          onClose={() => setFollowerModal(false)}
        />
      )}
    </>
  );
};

export default Profile;
