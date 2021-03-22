import { message } from "antd";
import { useState, useEffect } from "react";
import { useStateContext, useDispatchContext } from "../lib/reducer/context";

export default function Notification() {
  const state = useStateContext();

  useEffect(() => {
    if (state.notificationMessageInfo)
      message.info(state.notificationMessageInfo);
  }, [state.notificationMessageInfo]);

  return <></>;
}
