import { useState, useEffect, useRef, MutableRefObject } from "react";
import type { file } from "@prisma/client";
import {
  Table,
  Row,
  Col,
  Input,
  Button,
  Select,
  Modal,
  Switch,
  Progress,
  message,
} from "antd";
const { Option } = Select;
import { ColumnsType } from "antd/es/table";
import { UploadOutlined } from "@ant-design/icons";
import axios from "axios";
import dayjs from "dayjs";

import { useStateContext, useDispatchContext } from "../../lib/reducer/context";
import useActions from "../../actions/useActions";

const columns: ColumnsType<file> = [
  {
    title: "Name",
    key: "name",
    dataIndex: "name",
  },
  {
    title: "Size",
    key: "size",
    dataIndex: "size",
  },
  {
    title: "Type",
    key: "mimeType",
    dataIndex: "mimeType",
  },
  {
    title: "Created",
    key: "createdAt",
    dataIndex: "createdAt",
    render: (text) => <span>{dayjs(text).format("YYYY/MM/DD HH:mm")}</span>,
  },
];

function onChange(pagination: any, filters: any, sorter: any, extra: any) {
  console.log("params", pagination, filters, sorter, extra);
}

const messageDialogKey = "uploadingMsg";

const component = () => {
  const state = useStateContext();
  const dispatch = useDispatchContext();
  const fileInputRef: any = useRef();
  const { actionFileUpload } = useActions();
  const [showUpload, setShowUpload] = useState(false);
  const [files, setFiles] = useState(null);

  useEffect(() => {
    if (!state.selectedDocument) return;

    loadFiles(state.selectedDocument.id);
  }, [state.selectedDocument]);

  useEffect(() => {
    if (!showUpload && state.uploadProgress > 0 && state.uploadProgress < 100) {
      message.loading({
        content: "Uploading...",
        key: messageDialogKey,
        duration: 0,
      });

      setShowUpload(true);
    }

    if (showUpload && state.uploadProgress >= 100) {
      message.success({
        content: "Done",
        key: messageDialogKey,
        duration: 2,
      });

      setShowUpload(false);
      loadFiles(state.selectedDocument.id);
    }
  }, [state.uploadProgress]);

  const loadFiles = async (documentId: number) => {
    // get files
    const fileResponse = await axios({
      method: "get",
      url: `/api/file?document=${documentId}`,
      headers: {
        acceesstoken: state.accessToken,
      },
    });

    if (fileResponse.data) {
      setFiles(fileResponse.data);
    }
  };

  const setSelectedFile = (file: File) => {
    actionFileUpload(file, state.selectedDocument.id);
  };

  return (
    <>
      <Row gutter={[16, 16]}>
        <Col span={24} style={{ textAlign: "right" }}>
          <Select
            defaultValue={1}
            style={{ textAlign: "left", width: "320px" }}
          >
            <Option value={1}>Show files belongs to the document</Option>
            <Option value={1}>Show files belongs to the project</Option>
          </Select>

          <Button
            type="primary"
            icon={<UploadOutlined />}
            style={{ width: 48, marginLeft: 6 }}
            size="middle"
            onClick={(e) => {
              fileInputRef.current.click();
            }}
          />

          <input
            type="file"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={(e) => setSelectedFile(e.target.files[0])}
          />
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <Table
            columns={columns}
            dataSource={files}
            onChange={onChange}
            pagination={false}
          />
        </Col>
      </Row>
    </>
  );
};

export default component;
