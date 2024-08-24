import { InfinitySpin } from "react-loader-spinner";
import "./style.scss";

const Loader = () => {
  return (
    <div className="loading-container">
      <InfinitySpin
        visible={true}
        width="200"
        color="var(--text1)"
        ariaLabel="infinity-spin-loading"
      />
    </div>
  );
};

export default Loader;
