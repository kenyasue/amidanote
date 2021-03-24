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
import { FileAddOutlined } from "@ant-design/icons";

import { useStateContext, useDispatchContext } from "../lib/reducer/context";
import Header from "../components/top/header";
import Footer from "../components/footer";

export default function Home() {
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
          <Header providers={{}} />
        </Col>
      </Row>
      <Row className="home">
        <Col span={6} className="sider"></Col>
        <Col span={18} className="padding-1 main"></Col>
      </Row>
      <Row className="footer">
        <Col span={24} className="padding-1">
          <Footer />
        </Col>
      </Row>
    </>
  );
}
