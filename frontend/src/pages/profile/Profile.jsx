import React, { useEffect, useState } from "react";
import "./style.scss";
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

const Profile = () => {
  const [file, setFile] = useState();
  const [imageUrl, setImageUrl] = useState("");
  const [username, setUsername] = useState("");
  const [assets, setAssets] = useState(0);
  const [followers, setFollowers] = useState(0);
  const [following, setFollowing] = useState(0);
  const pixiToken = Cookies.get("pixiToken");
  const { userId: id } = jwtDecode(pixiToken);
  const [editName, setEditName] = useState(false);
  const { userId } = useParams();

  const fetcher = async (url) => {
    try {
      const { data } = await axios.get(url);
      return data.userDetails;
    } catch (error) {
      toast.error(error.message, { duration: 1000 });
    }
  };
  const { isLoading, error, data, mutate } = useSWR(
    `${host}/api/auth/profile/${userId}`,
    fetcher
  );

  useEffect(() => {
    const retrieveAssets = async () => {
      try {
        const url = `${host}/api/image/getAssets/${userId}`;
        const res = await axios.get(url);
        if (res.status === 200) {
          setAssets(res.data.assets.length);
        }
      } catch (error) {
        toast.error(error.message, { duration: 1000 });
      }
    };
    const retrieveFollowers = async () => {
      try {
        const url = `${host}/api/follower/followers/${userId}`;
        const res = await axios.get(url);

        if (res.status === 200) {
          setFollowers(res.data.followers.length);
        }
      } catch (error) {
        toast.error(error.message, { duration: 1000 });
      }
    };
    const retrieveFollowingCount = async () => {
      try {
        const url = `${host}/api/follower/following/${userId}`;
        const res = await axios.get(url);

        if (res.status === 200) {
          setFollowing(res.data.followingData.length);
        }
      } catch (error) {
        toast.error(error.message, { duration: 1000 });
      }
    };
    retrieveAssets();
    retrieveFollowers();
    retrieveFollowingCount();
  }, []);

  useEffect(() => {
    if (!isLoading) {
      setUsername(data?.username);
      setImageUrl(data?.profileImage);
    }
  }, [isLoading]);

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

  return (
    <>
      {isLoading ? (
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
                  <button
                    style={!editName ? { boxShadow: "var(--shadow)" } : {}}
                  >
                    {id === userId ? (
                      <FiEdit2 onClick={() => setEditName(!editName)} />
                    ) : (
                      <TbUserHexagon />
                    )}
                  </button>
                </div>
              </div>

              <div className="input-container">
                <label>Email</label>
                <div className="name">
                  <input
                    style={{ pointerEvents: "none" }}
                    id="email"
                    placeholder={data?.email}
                    type="email"
                  />
                  <button>
                    <HiOutlineMail />
                  </button>
                </div>
              </div>
            </div>

            <div className="profile-statistics">
              <div>
                <span>Assets</span>
                <p>{assets}</p>
              </div>

              <div>
                <span>Followers</span>
                <p>{followers}</p>
              </div>
              <div>
                <span>Following</span>
                <p>{following}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Profile;
