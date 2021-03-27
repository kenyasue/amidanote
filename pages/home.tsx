import { useEffect, useState } from "react";

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
} from "@ant-design/icons";

import { useSession, providers, SessionProvider } from "next-auth/client";

import { useStateContext, useDispatchContext } from "../lib/reducer/context";
import TreeView from "../components/home/documentTree";
import Header from "../components/header";
import Footer from "../components/footer";
import ContentView from "../components/home/conetntView";
import ProjectSelector from "../components/home/projectSelector";

import useActions from "../actions/useActions";

export default function Home({ providers }: { providers: any }) {
  const [documentUpdated, setDocumentUpdated] = useState(false);
  const [session, loading] = useSession();

  const { actionChangeKeyword } = useActions();
  const state = useStateContext();

  return (
    <>
      <Row className="header">
        <Col span={24} className="padding-1">
          <Header providers={providers} />
        </Col>
      </Row>
      <Row className="home">
        <Col span={24} className="padding-1 main">
          {!session ? <>Please signin</> : null}
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

Home.getInitialProps = async (context: SessionProvider) => {
  return {
    providers: await providers(),
  };
};
