import { Typography, Row, Col, Divider, Button, Space } from "antd";
import type { document as Document, project } from "@prisma/client";
import ReactMarkdown from "react-markdown";
import gfm from "remark-gfm";
import remarkCodeFrontmatter from "remark-code-frontmatter";
import highlight from "remark-syntax-highlight";
import highlightJS from "highlight.js";
import SwaggerUI from "swagger-ui-react";
import accessTokenPlugin from "../../lib/remarkPlugins/accessToken";
import * as constants from "../../lib/const";

const { Title } = Typography;
import { useStateContext, useDispatchContext } from "../../lib/reducer/context";

const component = ({ defaultDocument }: { defaultDocument: Document }) => {
  const state = useStateContext();
  const dispatch = useDispatchContext();

  if (!state.selectedDocument || !defaultDocument)
    return <>Please select document.</>;

  const displayDocument: Document =
    state.selectedDocument && state.selectedDocument.id
      ? state.selectedDocument
      : defaultDocument;

  let title = "";

  if (displayDocument && displayDocument.title) {
    const titleChunks = displayDocument.title.split("/");
    title = titleChunks[titleChunks.length - 1];
  }

  return (
    <>
      <Row className="preview-top">
        <Col span={24} className="preview">
          <Title level={2}>{title}</Title>
          {state.selectedDocument.format === constants.FORMAT_SWAGGER ? (
            <SwaggerUI
              url={`/api/document/rawContent/${state.selectedDocument.id}`}
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
                [accessTokenPlugin, { accessToken: null }],
              ]}
              linkTarget="_blank"
              allowDangerousHtml={true}
            >
              {displayDocument.markdown}
            </ReactMarkdown>
          )}
        </Col>
      </Row>
    </>
  );
};

export default component;
