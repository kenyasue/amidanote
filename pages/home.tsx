import { useEffect, useState } from "react";

import { Layout, Row, Col, Input, Button, Space } from "antd";
const { Search } = Input;
import {
  PlusOutlined,
  FileAddOutlined,
  FolderAddOutlined,
} from "@ant-design/icons";
import { Menu } from "antd";

import { useStateContext, useDispatchContext } from "../lib/reducer/context";
import TreeView from "../components/home/documentTree";
import Header from "../components/header";
import Footer from "../components/footer";
import ContentView from "../components/home/conetntView";

import useActions from "../actions/useActions";

export default function Home() {
  const [documentUpdated, setDocumentUpdated] = useState(false);
  const {
    actionChangeCurrentDocument,
    actionCreateNewDocument,
    actionChangeKeyword,
  } = useActions();
  const state = useStateContext();

  useEffect(() => {
    if (documentUpdated) {
      actionChangeCurrentDocument(state.documents[state.documents.length - 1]);
      setDocumentUpdated(false);
    }
  }, [state.documents]);

  return (
    <>
      <Row className="header">
        <Col span={24} className="padding-1">
          <Header providers={{}} />
        </Col>
      </Row>
      <Row className="home">
        <Col span={6} className="sider">
          <Row className="sider-header">
            <Col span={24} className="padding-left-1 ">
              <Search
                placeholder="input search text"
                style={{ width: "calc(100% - 54px)" }}
                onChange={(e) => {
                  actionChangeKeyword(e.target.value);
                }}
                value={state.documentSearchKeyword}
              />
              <Button
                type="primary"
                icon={<FileAddOutlined />}
                style={{ width: 48, marginLeft: 6 }}
                size="middle"
                onClick={(e) => {
                  setDocumentUpdated(true);
                  actionCreateNewDocument();
                }}
              />
            </Col>
          </Row>
          <Row className="sider-menu">
            <Col span={24}>
              <TreeView />
            </Col>
          </Row>
        </Col>
        <Col span={18} className="padding-1 main">
          <ContentView></ContentView>
        </Col>
      </Row>
      <Row className="footer">
        <Col span={24} className="padding-1">
          <Footer />
        </Col>
      </Row>
    </>
  );
}
