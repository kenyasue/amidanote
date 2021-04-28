import { useState, useEffect, useRef, MutableRefObject } from "react";
import axios from "axios";
import { useStateContext, useDispatchContext } from "../lib/reducer/context";
import type { file } from "@prisma/client";

const component = ({ file }: { file: file }) => {
  const state = useStateContext();
  const [base64Entity, setBase64Entity] = useState("");

  useEffect(() => {
    if (!file.thumbnailPath || file.thumbnailPath === "") return;

    (async () => {
      const fileResponse = await axios({
        method: "get",
        url: `/api/file/${file.thumbnailPath}`,
        headers: {
          acceesstoken: state.accessToken,
        },
        responseType: "arraybuffer",
      });

      var base64EncodedStr = Buffer.from(fileResponse.data, "binary").toString(
        "base64"
      );

      console.log(`data:${file.mimeType};base64,${base64EncodedStr}`);
      setBase64Entity(`data:${file.mimeType};base64,${base64EncodedStr}`);
    })();
  }, []);

  if (!file.thumbnailPath) return <></>;
  return (
    <div className="thumb">
      <img src={base64Entity} />
    </div>
  );
};
export default component;
