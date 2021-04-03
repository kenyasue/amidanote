import { useState, useEffect, useRef, MutableRefObject } from "react";
import type { file } from "@prisma/client";
import {
  Table,
  Row,
  Col,
  Popconfirm,
  Button,
  Select,
  Modal,
  Menu,
  Dropdown,
  message,
} from "antd";
const { Option } = Select;
import { ColumnsType } from "antd/es/table";
import { UploadOutlined, DownOutlined } from "@ant-design/icons";
import axios from "axios";
import dayjs from "dayjs";
import filesize from "filesize";
import fileDownload from "js-file-download";

import { useStateContext, useDispatchContext } from "../../lib/reducer/context";
import useActions from "../../actions/useActions";
import ThumbImage from "../Thumb";

const messageDialogKey = "uploadingMsg";

const component = () => {
  const state = useStateContext();
  const dispatch = useDispatchContext();
  const fileInputRef: any = useRef();
  const { actionFileUpload, actionFileDownload } = useActions();
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

  const clickOnContectMenu = async (key: string, fileId: string) => {
    if (key == "code") {
    }

    if (key == "download") {
      actionFileDownload(
        files.find((file: file) => file.id === parseInt(fileId))
      );
    }

    if (key == "delete") {
      if (!confirm("Are you sure to delete this file ?")) return;

      const fileResponse = await axios({
        method: "delete",
        url: `/api/file/${fileId}`,
        headers: {
          acceesstoken: state.accessToken,
        },
      });

      loadFiles(state.selectedDocument.id);
    }
  };

  const columns: ColumnsType<file> = [
    {
      title: "",
      key: "thumbnailPath",
      dataIndex: "thumbnailPath",
      width: "10%",
      render: (text, file) => <ThumbImage file={file} />,
    },
    {
      title: "Name",
      key: "name",
      dataIndex: "name",
      width: "35%",
    },
    {
      title: "Type",
      key: "mimeType",
      dataIndex: "mimeType",
      width: "20%",
    },
    {
      title: "Size",
      key: "size",
      dataIndex: "size",
      render: (text) => <span>{filesize(text)}</span>,
      width: "10%",
    },
    {
      title: "Created",
      key: "createdAt",
      dataIndex: "createdAt",
      render: (text) => <span>{dayjs(text).format("YYYY/MM/DD HH:mm")}</span>,
      width: "20%",
      align: "right",
    },
    {
      title: "",
      key: "id",
      dataIndex: "id",
      render: (text) => (
        <Dropdown
          overlay={
            <Menu
              style={{ width: 150 }}
              onClick={(e) => clickOnContectMenu(e.key, text)}
            >
              <Menu.Item key="code">Get the code</Menu.Item>
              <Menu.Item key="download">Download</Menu.Item>
              <Menu.Item key="delete">Delete</Menu.Item>
            </Menu>
          }
        >
          <a className="ant-dropdown-link" onClick={(e) => e.preventDefault()}>
            <DownOutlined />
          </a>
        </Dropdown>
      ),
      width: "5%",
      align: "right",
    },
  ];
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
          <Table columns={columns} dataSource={files} pagination={false} />
        </Col>
      </Row>
    </>
  );
};

export default component;
