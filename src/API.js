import request from "./utils/request";

const auth = {
  verify: () =>
    request({
      url: `/auth/verify`,
      method: "GET",
    }),
};

const lineProcess = {
  get: (id) =>
    request({
      url: `/line-process/${id}`,
      method: "GET",
    }),
  update: (id, data) =>
    request({
      url: `/line-process/${id}/diagram`,
      method: "PUT",
      data,
    }),
  uploadBackground: (data) =>
    request({
      url: `/line-process/upload-background`,
      method: "POST",
      data,
    }),
};

const API = {
  auth,
  lineProcess,
};

export default API;
