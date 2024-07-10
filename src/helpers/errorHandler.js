import toast from "react-hot-toast";

const errorHandler = (data, single = 0) => {
  if (single) {
    toast.error(data);
  } else {
    data.map(el => {
      if (el.message) {
        toast.error(el.message);
      } else {
        toast.error(el);
      }
    })
  }
}
export default errorHandler;
