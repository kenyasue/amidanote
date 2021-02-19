import { useState, useEffect } from "react";
import axios from "axios";
import { Typography, Row, Col, Input, Button, Modal } from "antd";
const { Title } = Typography;
const { TextArea } = Input;
import useSWR, { mutate } from "swr";
import type { document as Document } from "@prisma/client";
import { Controlled as CodeMirror } from "react-codemirror2";

import useActions from "../../actions/useActions";
import { useStateContext, useDispatchContext } from "../../lib/reducer/context";
import utils from "../../lib/util";
import { util } from "chai";

const component = () => {
  const state = useStateContext();
  const dispatch = useDispatchContext();

  const [editorInstance, setEditorInstance] = useState(null);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const {
    actionUpdateCurrentDocument,
    actionDeleteDocument,
    actionRenderMenu,
  } = useActions();

  useEffect(() => {
    if (editorInstance) editorInstance.focus();

    (async () => {
      state.selectedDocument.markdown = state.selectedDocument.markdown + " ";
      actionUpdateCurrentDocument(state.selectedDocument, true);

      await utils.wait(0.01);

      const md = state.selectedDocument.markdown;
      state.selectedDocument.markdown = md.substr(0, md.length - 1);
      actionUpdateCurrentDocument(state.selectedDocument, true);
    })();
  }, [state.activeTab]);

  useEffect(() => {
    console.log("editor instance set", editorInstance);
  }, [editorInstance]);

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
          <Button
            danger
            className="delete-btn"
            onClick={() => setShowDeleteConfirmModal(true)}
          >
            Delete
          </Button>
        </Col>
        <Col span={24}>
          <CodeMirror
            className="markdown-input"
            value={state.selectedDocument.markdown}
            options={{
              mode: "markdown",
              theme: "material",
              lineNumbers: true,
            }}
            onBeforeChange={(editor, data, value) => {
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
