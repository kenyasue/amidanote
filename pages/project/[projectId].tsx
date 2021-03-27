import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Notification from "../../components/Notification";

import {
  Tooltip,
  Row,
  Col,
  Input,
  Button,
  Select,
  Modal,
  Switch,
  Form,
} from "antd";
const { Option } = Select;

const { Search } = Input;
import {
  SettingOutlined,
  FileAddOutlined,
  DiffOutlined,
  DoubleRightOutlined,
} from "@ant-design/icons";

import { useSession, providers, SessionProvider } from "next-auth/client";
import { useStateContext, useDispatchContext } from "../../lib/reducer/context";
import TreeView from "../../components/home/documentTree";
import Header from "../../components/header";
import Footer from "../../components/footer";
import ContentView from "../../components/home/conetntView";
import ProjectSelector from "../../components/home/projectSelector";

import useActions from "../../actions/useActions";
import utils from "../../lib/util";

export default function Page({
  project,
  documents,
  document,
  providers,
}: {
  project: any;
  documents: any;
  document: any;
  providers: any;
}) {
  const [documentUpdated, setDocumentUpdated] = useState(false);
  const [showMenuResponsive, setShowMenuResponsive] = useState(false);
  const [showPreview, setShowPreview] = useState(true);
  const router = useRouter();

  const {
    actionChangeCurrentDocument,
    actionCreateNewDocument,
    actionChangeKeyword,
    actionSetCurrentProjectId,
  } = useActions();
  const state = useStateContext();

  useEffect(() => {
    actionSetCurrentProjectId(parseInt(router.query.projectId as string));
  }, [state.projects]);

  useEffect(() => {
    if (documentUpdated) {
      setDocumentUpdated(false);
    }
  }, [state.documents]);

  useEffect(() => {
    setShowMenuResponsive(false);
  }, [state.selectedDocument]);

  useEffect(() => {
    if (showMenuResponsive)
      setTimeout(() => {
        setShowPreview(false);
      }, 500);
    // css transition is 0.5sec
    else setShowPreview(true);
  }, [showMenuResponsive]);

  const layoutStyles = {
    left: "",
  };
  if (utils.isMobile()) {
    if (showMenuResponsive) layoutStyles.left = "0vw";
    else layoutStyles.left = "-100vw";
  }

  return (
    <>
      <Row className="header">
        <Col span={24} className="padding-1">
          <Header providers={providers} />
        </Col>
      </Row>
      <Row className="home">
        <Col
          style={layoutStyles}
          xs={{ span: 24 }}
          sm={{ span: 6 }}
          className="sider "
        >
          <Row className="sider-header">
            <Col span={24} className="padding-left-1 ">
              <ProjectSelector />
            </Col>
          </Row>
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
              <Tooltip title="New Note">
                <Button
                  type="primary"
                  icon={<FileAddOutlined />}
                  style={{ width: 48, marginLeft: 6 }}
                  size="middle"
                  onClick={(e) => {
                    setDocumentUpdated(true);
                    actionCreateNewDocument(
                      parseInt(router.query.projectId as string)
                    );
                  }}
                />
              </Tooltip>
            </Col>
          </Row>
          <Row className="sider-menu">
            <Col span={24}>
              <TreeView />
            </Col>
          </Row>
        </Col>
        <Col xs={{ span: 24 }} md={{ span: 18 }} className="main">
          {utils.isMobile() ? (
            <DoubleRightOutlined
              className="show-sidebar-btn"
              onClick={() => setShowMenuResponsive(!showMenuResponsive)}
            />
          ) : null}
          <div style={{ display: showPreview ? "block" : "none" }}>
            <ContentView></ContentView>
          </div>
        </Col>
      </Row>
      <Row className="footer">
        <Col span={24} className="padding-1">
          <Footer />
        </Col>
      </Row>
      <Notification />
    </>
  );
}

Page.getInitialProps = async (context: SessionProvider) => {
  return {
    providers: await providers(),
  };
};
