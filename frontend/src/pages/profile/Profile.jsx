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
import { app } from "../../utils/firebase";
import Loader from "../../components/loader/Loader";
import { RxCross2 } from "react-icons/rx";
import { GoPerson } from "react-icons/go";
import { FiEdit2 } from "react-icons/fi";

const Profile = () => {
  const [file, setFile] = useState();
  const [imageUrl, setImageUrl] = useState("");
  const [username, setUsername] = useState("");

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
            <div className="row">
              {imageUrl === "" ? (
                <div className="profile-image">
                  <GoPerson />
                </div>
              ) : (
                <div className="image">
                  <img src={imageUrl} />
                </div>
              )}

              <label htmlFor="file">
                <RxCross2 />
                <FiEdit2 className="edit" />
              </label>

              <input
                onChange={(e) => setFile(e.target.files[0])}
                id="file"
                style={{ display: "none" }}
                type="file"
              />
            </div>

            <div className="name-email">
              <div className="input-container">
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <label htmlFor="username">Username</label>
                  <FiEdit2 />
                </div>
                <input
                  onChange={(e) => setUsername(e.target.value)}
                  id="username"
                  value={username}
                  type="text"
                />
              </div>

              <div className="input-container">
                <label>Email</label>
                <input
                  style={{ pointerEvents: "none" }}
                  id="email"
                  placeholder={data?.email}
                  type="email"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Profile;
