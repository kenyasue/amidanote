import { useRef, useEffect, useState } from "react";
import { Tabs } from "antd";
const { TabPane } = Tabs;

import { useStateContext, useDispatchContext } from "../../lib/reducer/context";
import { ActionTypes } from "../../lib/reducer/actionTypes";
import useActions from "../../actions/useActions";

import PreviewView from "./previewView";
import MarkdownView from "./markdownView";
import MediaView from "./mediaView";

const component = () => {
  const state = useStateContext();
  const { actionChangeActiveTab } = useActions();
  const [activeTab, setActiveTab] = useState("preview");

  return (
    <Tabs
      defaultActiveKey="1"
      activeKey={state.activeTab}
      tabPosition="top"
      className="markdownview-top"
      onChange={(key) => {
        actionChangeActiveTab(key);
      }}
    >
      <TabPane tab="View" key="preview">
        <PreviewView />
      </TabPane>
      <TabPane tab="Edit" key="edit">
        <MarkdownView />
      </TabPane>
      <TabPane tab="Media" key="media">
        <MediaView />
      </TabPane>
    </Tabs>
  );
};

export default component;
