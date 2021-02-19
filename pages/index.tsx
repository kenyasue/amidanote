import { useReducer } from "react";
import { Layout, Row, Col, Input, Button, Space } from "antd";
import {
  signIn,
  signOut,
  useSession,
  providers,
  SessionProvider,
} from "next-auth/client";

import Home from "./home";

import { appStateContext, dispatcherContext } from "../lib/reducer/context";

import Header from "../components/header";
import Footer from "../components/footer";

import reducer from "../lib/reducer/reducer";

export default function Index({ providers }: { providers: any }) {
  const [state, dispatch] = useReducer(reducer, {
    selectedDocument: {},
    triggerSave: false,
  });

  return (
    <>
      <Row className="header">
        <Col span={24} className="padding-1">
          <Header providers={providers} />
        </Col>
      </Row>
      <Row className="top">
        <Col span={24} className="padding-1">
          Welcome to undefined.md
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

Index.getInitialProps = async (context: SessionProvider) => {
  return {
    providers: await providers(),
  };
};
