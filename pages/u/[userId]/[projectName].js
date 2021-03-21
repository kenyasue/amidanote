import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";

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
  DoubleRightOutlined
} from "@ant-design/icons";

import { useStateContext, useDispatchContext } from "../../../lib/reducer/context";
import TreeView from "../../../components/public/documentTree";
import PreviewView from "../../../components/public/previewView";
import Header from "../../../components/public/header";
import Footer from "../../../components/footer";

import useActions from "../../../actions/useActions";
import utils from "../../../lib/util";

const component = function Home({ project,documents,document }) {

  const defaultDocument = document;
  const [documentUpdated, setDocumentUpdated] = useState(false);
  const [showMenuResponsive, setShowMenuResponsive] = useState(false);
  const [showPreview,setShowPreview] = useState(true);
  const router = useRouter();

  const {
    actionLoadDocuments,
    actionChangeKeyword,
    actionSetCurrentProjectId,
    actionChangeCurrentDocument
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
    
    if(showMenuResponsive)
      setTimeout(() => {
        setShowPreview(false);
      }, 500); // css transition is 0.5sec
    else
      setShowPreview(true);
    
  }, [showMenuResponsive]);

  const layoutStyles = {};
  if (utils.isMobile()) {

    if(showMenuResponsive)
      layoutStyles.left = "0vw";
    else
      layoutStyles.left = "-100vw";
  }

  return (
    <>
      <Row className="header">
        <Col span={24} className="padding-1">
          <Header providers={{}} />
        </Col>
      </Row>
      <Row className="home">
        <Col style={layoutStyles} xs={{ span: 24 }} sm={{ span: 6 }} className="sider">
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
              <TreeView documents={ documents } />
            </Col>
          </Row>
        </Col>
        <Col xs={{ span: 24 }} md={{ span: 18 }} className="padding-1 main" >
          {utils.isMobile() ?
            <DoubleRightOutlined className="show-sidebar-btn" onClick={() => setShowMenuResponsive(!showMenuResponsive)}/>
            : null}
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
}

export async function getServerSideProps(context) {

  const { userId, projectName } = context.params
  const docId = context.query.doc;

  try {

    // Fetch data from external API
    const projectResponse = await axios({
      method: "get",
      url: `${process.env.BASE_URL}/api/project/${encodeURIComponent(projectName)}`
    });

    if (projectResponse.data && projectResponse.data.id) {
      
      // get documents
      const documentsResponse = await axios({
        method: "get",
        url: `${process.env.BASE_URL}/api/document?project=${projectResponse.data.id}`
      });

      let document = null;


      if (docId)
        document = documentsResponse.data.find(obj => obj.id === parseInt(docId))
      else
        document = documentsResponse.data[0];
      
      const props = {
        project: projectResponse.data,
        documents: documentsResponse.data
      };

      if (document) props.document = document;
      return {
        props: props
      };
      
    } 

    return { props: { project: null } }

  } catch (e) {
    console.error(e);
    return { props: { project: null } }
  }

}


export default component;