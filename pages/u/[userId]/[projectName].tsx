import type { document as Document } from "@prisma/client";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { GetStaticProps, GetStaticPaths, GetServerSideProps } from "next";

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
import {
  useStateContext,
  useDispatchContext,
} from "../../../lib/reducer/context";
import TreeView from "../../../components/public/documentTree";
import PreviewView from "../../../components/public/previewView";
import Header from "../../../components/header";
import Footer from "../../../components/footer";

import useActions from "../../../actions/useActions";
import utils from "../../../lib/util";

const component = function Home({
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
  const defaultDocument = document;
  const [documentUpdated, setDocumentUpdated] = useState(false);
  const [showMenuResponsive, setShowMenuResponsive] = useState(false);
  const [showPreview, setShowPreview] = useState(true);
  const router = useRouter();

  const {
    actionLoadDocuments,
    actionChangeKeyword,
    actionSetCurrentProjectId,
    actionChangeCurrentDocument,
  } = useActions();
  const state = useStateContext();

  useEffect(() => {
    if (!project) router.push(`/`);
    else {
      actionSetCurrentProjectId(project.id);
      actionLoadDocuments(project.id);
    }
  }, []);

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
      <Row className="home public">
        <Col
          style={layoutStyles}
          xs={{ span: 24 }}
          sm={{ span: 6 }}
          className="sider"
        >
          <Row className="sider-header">
            <Col span={24} className="padding-left-1 ">
              <Search
                placeholder="input search text"
                onChange={(e) => {
                  actionChangeKeyword(e.target.value);
                }}
                value={state.documentSearchKeyword}
              />
            </Col>
          </Row>
          <Row className="sider-menu">
            <Col span={24}>
              <TreeView documents={documents} />
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
            <PreviewView defaultDocument={defaultDocument} />
          </div>
        </Col>
      </Row>
      <Row className="footer">
        <Col span={24} className="padding-1">
          <Footer />
        </Col>
      </Row>
    </>
  );
};

export default component;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { userId, projectName } = context.params;
  const docId = context.query.doc;

  try {
    // Fetch data from external API
    const projectResponse = await axios({
      method: "get",
      url: `${process.env.BASE_URL}/api/project/${encodeURIComponent(
        projectName as string
      )}`,
    });

    if (projectResponse.data && projectResponse.data.id) {
      // get documents
      const documentsResponse = await axios({
        method: "get",
        url: `${process.env.BASE_URL}/api/document?project=${projectResponse.data.id}`,
      });

      let document = null;

      if (docId)
        document = documentsResponse.data.find(
          (obj: Document) => obj.id === parseInt(docId as string)
        );
      else document = documentsResponse.data[0];

      const props = {
        project: projectResponse.data,
        documents: documentsResponse.data,
        document: document,
      };

      if (document) props.document = document;
      return {
        props: props,
      };
    }

    return { props: { project: null } };
  } catch (e) {
    console.error(e);
    return { props: { project: null } };
  }
};
