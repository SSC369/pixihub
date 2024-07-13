import React, { useEffect, useState } from "react";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { app } from "../../utils/firebase";
import "./style.scss";
import { FcAddImage } from "react-icons/fc";
import { AiOutlineDelete } from "react-icons/ai";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import host from "../../host";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddImage = () => {
  const [file, setFile] = useState();
  const [imageUrl, setImageUrl] = useState("");
  const [postData, setPostData] = useState({
    title: "",
    desc: "",
    tags: "",
  });
  const navigate = useNavigate();

  const uploadFile = () => {
    const storage = getStorage(app);
    const name = new Date() + file.name;
    const storageRef = ref(storage, name);

    const uploadTask = uploadBytesResumable(storageRef, file);
    // Register three observers:
    // 1. 'state_changed' observer, called any time the state changes
    // 2. Error observer, called on failure
    // 3. Completion observer, called on successful completion
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // Observe state change events such as progress, pause, and resume
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
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
        // Handle successful uploads on complete
        // For instance, get the download URL: https://firebasestorage.googleapis.com/...
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

  const handleChange = (e) => {
    setPostData({ ...postData, [e.target.name]: e.target.value });
  };

  const submitCondition =
    imageUrl.length > 0 &&
    postData.title.length > 0 &&
    postData.desc.length > 0 &&
    postData.tags.length > 0;

  const handlePostValidation = () => {
    const { title, desc, tags } = postData;
    if (
      imageUrl.length === 0 ||
      title.length === 0 ||
      desc.length === 0 ||
      tags.length === 0
    ) {
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { title, desc, tags } = postData;
      const tagList = tags.toLowerCase().split(",");
      const pixiToken = Cookies.get("pixiToken");
      const url = `${host}/api/image/addimage`;
      if (handlePostValidation()) {
        const response = await axios.post(
          url,
          {
            title,
            desc,
            tags: tagList,
            date: new Date(),
            imageUrl,
          },
          {
            headers: {
              "auth-token": pixiToken,
            },
          }
        );
        if (response.status === 201) {
          toast.success(response.data.msg, { duration: 1000 });
          setImageUrl("");
          setFile("");
          setPostData({
            title: "",
            tags: "",
            desc: "",
          });
          navigate("/images");
        }
      } else {
        toast.error("Invalid Details", { duration: 1000 });
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="add-image-container">
      {!imageUrl && (
        <div className="add-image">
          <label htmlFor="add">
            <FcAddImage />
          </label>
          <p>Add Image</p>
        </div>
      )}
      <input
        id="add"
        style={{ display: "none" }}
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
      />
      {imageUrl && (
        <div className="image-container">
          <img className="image" src={imageUrl} />

          <button
            type="button"
            onClick={() => setImageUrl("")}
            className="delete"
          >
            <AiOutlineDelete />
          </button>
        </div>
      )}

      <div className="post-details-container">
        <div className="input-container">
          <label htmlFor="title">Title</label>
          <input
            name="title"
            onChange={handleChange}
            value={postData.title}
            id="title"
            type="text"
          />
        </div>

        <div className="input-container">
          <label htmlFor="desc">Description</label>
          <textarea
            name="desc"
            onChange={handleChange}
            value={postData.desc}
            rows={6}
            type="text"
            id="desc"
          />
        </div>

        <div className="input-container">
          <label htmlFor="tags">Tags</label>
          <input
            name="tags"
            onChange={handleChange}
            value={postData.tags}
            placeholder="e.g: nature, sunset"
            type="text"
            id="tags"
          />
        </div>
        <button
          style={
            !submitCondition ? { opacity: "0.5", pointerEvents: "none" } : {}
          }
          type="submit"
        >
          Submit
        </button>
      </div>
    </form>
  );
};

export default AddImage;
