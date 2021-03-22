import { Typography, Row, Col, Divider, Button, Space } from "antd";
import ReactMarkdown from "react-markdown";
import gfm from "remark-gfm";
import remarkCodeFrontmatter from "remark-code-frontmatter";
import highlight from "remark-syntax-highlight";
import highlightJS from "highlight.js";

const { Title } = Typography;
import { useStateContext, useDispatchContext } from "../../lib/reducer/context";

const component = () => {
  const state = useStateContext();
  const dispatch = useDispatchContext();

  if (!state.selectedDocument) return <>Please select document.</>;

  let title = "";

  if (state.selectedDocument && state.selectedDocument.title) {
    const titleChunks = state.selectedDocument.title.split("/");
    title = titleChunks[titleChunks.length - 1];
  }

  return (
    <>
      <Row gutter={[16, 16]} className="preview-top">
        <Col span={24} className="preview">
          <Title level={1}>{title}</Title>
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
            ]}
            linkTarget="_blank"
            allowDangerousHtml={true}
          >
            {state.selectedDocument.markdown}
          </ReactMarkdown>
        </Col>
      </Row>
    </>
  );
};

export default component;
