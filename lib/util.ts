import axios from "axios";
import type { file as FileModel } from "@prisma/client";
import crypto from "crypto";
import { responseInterface } from "swr";
import formidable, { File } from "formidable";
import type { NextApiRequest, NextApiResponse } from "next";

export interface FormData {
  fields: any;
  files: any;
}

export default class utils {
  static isEmpty = (val: string): boolean => {
    return val === undefined || val === null || val == "";
  };

  static isEmptyNumber = (val: number): boolean => {
    return val === undefined || val === null || val === NaN;
  };

  static defaultFetcher = async (url: string) => {
    const res = await axios(url);
    return res.data;
  };

  static randomString = (length: number) => {
    var result = "";
    var characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  };

  static wait = (duration: number) => {
    return new Promise((res) => {
      setTimeout(() => {
        res(null);
      }, duration * 1000);
    });
  };

  static waitToUpdate = (obj: any, paramName: string) => {
    const initialObj = obj[paramName];

    return new Promise((res) => {
      const timer = setInterval(() => {
        console.log(initialObj, obj[paramName]);
        if (initialObj !== obj[paramName]) {
          clearTimeout(timer);
          res(null);
        }
      }, 1000);
    });
  };

  static isMobile = (): boolean => {
    if (typeof window !== "undefined") {
      return window.innerWidth < 768;
    }

    return false;
  };

  static isBrowser = (): boolean => {
    return typeof window !== "undefined";
  };

  static truncateString = (str: string, limit: number = 16): string => {
    let suffix = "";
    if (str.length > limit) suffix = "...";

    return str.substr(0, limit) + suffix;
  };

  static parseForm = (request: NextApiRequest): Promise<FormData> => {
    return new Promise((res, rej) => {
      const form: formidable = new formidable.IncomingForm({
        maxFieldsSize: parseInt(process.env.MAX_FILESIZE) * 1024 * 1024,
      });

      form.on("error", function (err: any) {
        console.error(err);
      });

      form.on("end", function () {});

      form.parse(request, (err, fields, files) => {
        if (err) rej(err);
        else res({ fields, files });
      });
    });
  };

  static sha1 = (original: string): string => {
    const shasum = crypto.createHash("sha1");
    shasum.update(original);
    const hash = shasum.digest("hex");
    return hash;
  };

  static getThumbUrl = (file: FileModel, accessToken: string): string => {
    return `/api/file/${file.thumbnailPath}?token=${utils.sha1(accessToken)}`;
  };

  static copyToClipboard = (str: string) => {
    const el = document.createElement("textarea");
    el.value = str;
    el.setAttribute("readonly", "");
    el.style.position = "absolute";
    el.style.left = "-9999px";
    document.body.appendChild(el);
    el.select();
    document.execCommand("copy");
    document.body.removeChild(el);
  };
}
