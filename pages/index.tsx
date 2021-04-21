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

import { Typography, Divider } from "antd";

const { Title, Paragraph, Text, Link } = Typography;

const { Search } = Input;
import { FileAddOutlined } from "@ant-design/icons";

import { useSession, providers, SessionProvider } from "next-auth/client";
import { useStateContext, useDispatchContext } from "../lib/reducer/context";
import Header from "../components/header";
import Footer from "../components/footer";

export default function Home({ providers }: { providers: any }) {
  const [documentUpdated, setDocumentUpdated] = useState(false);
  const state = useStateContext();

  useEffect(() => {
    if (documentUpdated) {
      setDocumentUpdated(false);
    }
  }, [state.documents]);

  return (
    <>
      <Row className="header">
        <Col span={24} className="padding-1">
          <Header providers={providers} />
        </Col>
      </Row>
      <Row className="index">
        <Col span={24} className="main">
          <div className=""></div>
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
