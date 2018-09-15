import axiosService from "@/plugin/axios";
import parent from "../index";

const BaseURL = parent.BaseURL + "/file";

export default {
  BaseURL,
  post({ filename, filelength, filesha1 }) {
    axiosService.post(BaseURL, { filename, filelength, filesha1 });
  },
  put({ writetoken, position, data, size }) {
    var form = new FormData();
    form.append(writeToken);
    form.append(position);
    form.append("file", data);
    form.append("length", size);
    axiosService.put(BaseURL, { writetoken, position, data, size });
  },
  complite(writetoken) {
    axiosService.post(BaseURL + "/complite", { writetoken });
  },
  get(fileid) {
    axiosService.get(BaseURL + "/" + fileid);
  }
};
