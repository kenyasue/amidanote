import { useState, useEffect } from "react";

import axios from "axios";
import { Typography, Row, Col, Input, Button, Modal } from "antd";
import { ConsoleSqlOutlined, DeleteOutlined } from "@ant-design/icons";
import { Controlled as CodeMirror } from "react-codemirror2";

import useActions from "../../actions/useActions";
import { useStateContext, useDispatchContext } from "../../lib/reducer/context";
import utils from "../../lib/util";

const component = () => {
  const state = useStateContext();
  const dispatch = useDispatchContext();

  const [editorInstance, setEditorInstance] = useState(null);
  const [editorContent, setEditorContent] = useState(null);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const {
    actionUpdateCurrentDocument,
    actionDeleteDocument,
    actionRenderMenu,
  } = useActions();

  useEffect(() => {
    (async () => {
      // hack to force refresh codemirror component.
      setEditorContent(state.selectedDocument.markdown + " ");
      await utils.wait(0.01);
      const md = state.selectedDocument.markdown;
      setEditorContent(md.substr(0, md.length - 1));
    })();
  }, [state.activeTab]);

  useEffect(() => {
    setEditorContent(state.selectedDocument.markdown);
  }, [editorInstance]);

  useEffect(() => {
    setEditorContent(state.selectedDocument.markdown);
  }, [state.selectedDocument]);

  return (
    <>
      <Row gutter={[16, 16]} className="markdown-view">
        <Col span={24} className="title-hodler">
          <Input
            size="large"
            placeholder="Please input title"
            value={state.selectedDocument.title}
            className="title-input"
            onChange={(e) => {
              state.selectedDocument.title = e.target.value;
              actionUpdateCurrentDocument(state.selectedDocument, false);
              actionRenderMenu();
            }}
          />

          {utils.isMobile() ? (
            <Button
              danger
              icon={<DeleteOutlined />}
              className="delete-btn-small"
              onClick={() => setShowDeleteConfirmModal(true)}
            />
          ) : (
            <Button
              danger
              className="delete-btn"
              onClick={() => setShowDeleteConfirmModal(true)}
            >
              Delete
            </Button>
          )}
        </Col>
        <Col span={24}>
          <CodeMirror
            className="markdown-input"
            value={editorContent}
            options={{
              mode: "markdown",
              theme: "vscode-dark",
              lineNumbers: true,
            }}
            onBeforeChange={(editor, data, value) => {
              setEditorContent(value);
              state.selectedDocument.markdown = value;
              actionUpdateCurrentDocument(state.selectedDocument, false);
            }}
            editorDidMount={(editor) => {
              setEditorInstance(editor);
            }}
          />
        </Col>
      </Row>

      <Modal
        title="Delete docuemnt"
        visible={showDeleteConfirmModal}
        onOk={() => {
          actionDeleteDocument(state.selectedDocument);
          setShowDeleteConfirmModal(false);
        }}
        onCancel={() => {
          setShowDeleteConfirmModal(false);
        }}
      >
        <p>Are you sure to delete this docuemnt ? </p>
      </Modal>
    </>
  );
};

export default component;
