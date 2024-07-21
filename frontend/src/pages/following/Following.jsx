import React from "react";
import "./style.scss";
import axios from "axios";
import useSWR from "swr";
import host from "../../host";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

const Following = () => {
  const pixiToken = Cookies.get("pixiToken");
  const { userId } = jwtDecode(pixiToken);

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

  return <div>Following</div>;
};

export default Following;
