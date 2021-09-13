import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import {
  signIn,
  signOut,
  useSession,
  providers,
  SessionProvider,
} from "next-auth/client";
import axios from "axios";

import { Button, Modal, Avatar, Dropdown, Menu } from "antd";
import {
  LoginOutlined,
  GoogleOutlined,
  AppleOutlined,
  FacebookOutlined,
  GithubOutlined,
  UserOutlined,
  TwitterOutlined,
} from "@ant-design/icons";
import { Session } from "inspector";
import { useStateContext, useDispatchContext } from "../lib/reducer/context";
import useActions from "../actions/useActions";
import Image from "next/image";

export default function Header({ providers = {} }: { providers: any }) {
  const [showLogin, setShowLogin] = useState(false);
  const state = useStateContext();
  const [session, loading] = useSession();
  const router = useRouter();

  const { actionSignIn } = useActions();

  useEffect(() => {
    if (/^\/u\/.+$/.test(router.pathname)) {
      return;
    }

    console.log("session", session);

    if (
      !loading &&
      !session &&
      /\?callbackUrl/.test(window.location.toString())
    )
      setShowLogin(true);
    else if (!session && !loading) {
      // when user is not logged in
    }

    // redirect to home after signin
    else if (session && router.pathname !== "/") {
      (async () => {
        //
        const user = await axios({
          method: "get",
          url: `/api/user?email=${session.user.email}`,
          headers: {
            acceesstoken: session.accessToken,
          },
        });

        if (user && user.data && user.data[0]) {
          actionSignIn(user.data[0], session.accessToken);

          if (router.pathname === "/home") {
            // get default project
            const defaultProject = await axios({
              method: "get",
              url: "/api/project/default",
              headers: {
                acceesstoken: session.accessToken,
              },
            });

            router.push(`/project/${defaultProject.data.id}`);
          } else {
          }
        }
      })();
    }
  }, [loading]);

  useEffect(() => {
    console.log("router.pathname", router.pathname);
    if (router.pathname === "/home" && !session && !loading) {
      signIn();
    }
  }, []);

  return (
    <div className="header-content">
      <h1 className="title">
        <a href="https://amidanote.com">
          <img src="/images/logo2.svg" alt="me" width="48" height="48" />
          Amidanote
        </a>
      </h1>
      <div className="actions">
        {router.pathname === "/" || /^\/u\/.+$/.test(router.pathname) ? (
          <>
            <Button
              type="primary"
              icon={<LoginOutlined />}
              size="large"
              onClick={() => {
                router.push(`/home`);
              }}
            >
              Goto App
            </Button>
          </>
        ) : (
          <>
            {loading && <>Loading...</>}
            {!loading && !session && (
              <>
                <Button
                  type="primary"
                  icon={<LoginOutlined />}
                  size="large"
                  onClick={() => {
                    signIn();
                  }}
                >
                  SignIn
                </Button>
              </>
            )}
            {!loading && session && (
              <>
                <Dropdown
                  overlay={
                    <Menu>
                      <Menu.Item>
                        <a
                          href="https://app.amidanote.com/u/1/18"
                          target="_blank"
                        >
                          Help
                        </a>
                      </Menu.Item>
                      <Menu.Item>
                        <a
                          onClick={() => {
                            signOut({
                              callbackUrl: "/",
                            });
                          }}
                        >
                          Logout
                        </a>
                      </Menu.Item>
                    </Menu>
                  }
                  placement="bottomRight"
                >
                  <Button
                    type="text"
                    icon={
                      <Avatar
                        shape="square"
                        size="small"
                        icon={<UserOutlined />}
                        src={session.user.image}
                      />
                    }
                    size="large"
                  >
                    &nbsp; {session.user.name}
                  </Button>
                </Dropdown>
              </>
            )}
          </>
        )}
      </div>

      <Modal
        title="Login"
        visible={showLogin}
        onOk={() => {
          setShowLogin(false);
        }}
        onCancel={() => {
          setShowLogin(false);
        }}
        footer={null}
      >
        {providers
          ? Object.values(providers).map((providerTmp: any) => {
              let icon = <GoogleOutlined />;
              const provider: SessionProvider = providerTmp;
              if (/google/i.test(provider.name)) icon = <GoogleOutlined />;
              if (/facebook/i.test(provider.name)) icon = <FacebookOutlined />;
              if (/github/i.test(provider.name)) icon = <GithubOutlined />;
              if (/twitter/i.test(provider.name)) icon = <TwitterOutlined />;
              if (/StandaloneMode/i.test(provider.name)) icon = null;

              return (
                <Button
                  type="default"
                  block
                  icon={icon}
                  className="login-button"
                  key={provider.name}
                  onClick={() => signIn(provider.id)}
                >
                  Sign in with {provider.name}
                </Button>
              );
            })
          : null}
      </Modal>
    </div>
  );
}
