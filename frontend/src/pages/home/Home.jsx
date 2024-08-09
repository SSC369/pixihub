import React from "react";
import useSWR from "swr";
import axios from "axios";
import toast from "react-hot-toast";
import "./style.scss";
import host from "../../host";
import { useNavigate } from "react-router-dom";
import Loader from "../../components/loader/Loader";
import Carousel from "../../components/carousel/Carousel";
import Hero from "../../components/hero/Hero";
import Features from "../../components/features/Features";
import Footer from "../../components/footer/Footer";

const Home = () => {
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

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="home">
          <div className="hero-carousel-container">
            <Carousel />
            <Hero />
          </div>

          <Features />
          <Footer />
          {/* {data?.length === 0 ? (
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

                    <p>{title}</p>
                  </li>
                );
              })}
            </ul>
          )} */}
        </div>
      )}
    </>
  );
};
export default Home;
