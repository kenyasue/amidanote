import { createContext, useContext, Dispatch } from "react";
import type { file as fileModel } from "@prisma/client";
import { GlobalState, Action } from "../lib/reducer/reducer";
import axios from "axios";
import useSWR, { mutate } from "swr";
import { User } from "next-auth";
import { ActionTypes } from "../lib/reducer/actionTypes";
import Utils from "../lib/util";
import * as notificationActions from "./notifications";
import FileDownload from "js-file-download";

export const actionFileUpload = async (
  state: GlobalState,
  dispatch: Dispatch<Action>,
  file: File,
  documentId: number
) => {
  var formData = new FormData();
  var imagefile = document.querySelector("#file");
  formData.append("file", file);
  formData.append("documentId", documentId.toString());

  await axios.post(`/api/file`, formData, {
    headers: {
      acceesstoken: state.accessToken,
      "Content-Type": "multipart/form-data",
    },
    onUploadProgress: (progressEvent) => {
      console.log(progressEvent.loaded, file.size);
      dispatch({
        type: ActionTypes.setUploadProgress,
        payload: Math.ceil((progressEvent.loaded / file.size) * 100),
      });
    },
  });

  dispatch({
    type: ActionTypes.setUploadProgress,
    payload: 100,
  });

  console.log("upload done");

  setTimeout(() => {
    dispatch({
      type: ActionTypes.setUploadProgress,
      payload: 0,
    });
  }, 1000);
};

export const actionFileDownload = async (
  state: GlobalState,
  dispatch: Dispatch<Action>,
  file: fileModel
) => {
  axios({
    url: `/api/file/${file.path}`,
    method: "GET",
    responseType: "blob", // Important
  }).then((response) => {
    FileDownload(response.data, file.name);
  });
};
