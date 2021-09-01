import { useState, useEffect, useRef, MutableRefObject } from "react";

import { Typography, Row, Col, Divider, Button, Space } from "antd";
import ReactMarkdown from "react-markdown";
import gfm from "remark-gfm";
import remarkCodeFrontmatter from "remark-code-frontmatter";
import highlight from "remark-syntax-highlight";
import highlightJS from "highlight.js";
import SwaggerUI from "swagger-ui-react";
import accessTokenPlugin from "../../lib/remarkPlugins/accessToken";
import * as constants from "../../lib/const";
import remarkattr from "remark-attr";

const { Title } = Typography;
import { useStateContext, useDispatchContext } from "../../lib/reducer/context";
import utils from "../../lib/util";

const component = () => {
  const state = useStateContext();
  const dispatch = useDispatchContext();
  const [swaggerForceLoad, setSwaggerForceLoad] = useState<number>(0);

  if (!state.selectedDocument) return <>Please select document.</>;

  let title = "";

  if (state.selectedDocument && state.selectedDocument.title) {
    const titleChunks = state.selectedDocument.title.split("/");
    title = titleChunks[titleChunks.length - 1];
  }

  useEffect(() => {
    console.log("active tab", state.activeTab);

    (async () => {
      // better to change
      await utils.wait(1);
      setSwaggerForceLoad(swaggerForceLoad + 1);
    })();
  }, [state.activeTab]);

  /*
  useEffect(() => {
    console.log("active tab", state.activeTab);
    setSwaggerForceLoad(swaggerForceLoad + 1);
  }, [state.documents]);
  */

  return (
    <>
      <Row gutter={[16, 16]} className="preview-top">
        <Col span={24} className="preview">
          <Title level={1}>{title}</Title>

          {state.selectedDocument.format === constants.FORMAT_SWAGGER ? (
            <SwaggerUI
              url={`/api/document/rawContent/${state.selectedDocument.id}?forceload=${swaggerForceLoad}`}
            />
          ) : (
            <ReactMarkdown
              plugins={[
                gfm,
                remarkCodeFrontmatter,
                [
                  highlight,
                  {
                    highlight: (code: any) => {
                      return highlightJS.highlightAuto(code).value;
                    },
                  },
                ],
                [accessTokenPlugin, { accessToken: state.accessToken }],
              ]}
              linkTarget="_blank"
              allowDangerousHtml={true}
            >
              {state.selectedDocument.markdown}
            </ReactMarkdown>
          )}
        </Col>
      </Row>
    </>
  );
};

export default component;
