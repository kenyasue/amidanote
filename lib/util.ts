import axios from "axios";
import { responseInterface } from "swr";

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
}
