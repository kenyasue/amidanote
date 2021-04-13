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
import Image from "next/image";
import { FileIcon, defaultStyles } from "react-file-icon";

import { useStateContext, useDispatchContext } from "../../lib/reducer/context";
import useActions from "../../actions/useActions";
import utils from "../../lib/util";

const messageDialogKey = "uploadingMsg";

enum FilterType {
  Document,
  Project,
}

const component = () => {
  const state = useStateContext();
  const dispatch = useDispatchContext();
  const fileInputRef: any = useRef();
  const { actionFileUpload, actionFileDownload } = useActions();
  const [showUpload, setShowUpload] = useState(false);
  const [files, setFiles] = useState(null);
  const [filterType, setFilterType] = useState(FilterType.Document);

  useEffect(() => {
    if (!state.selectedDocument) return;

    loadFiles();
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
      loadFiles();
    }
  }, [state.uploadProgress]);

  useEffect(() => {
    loadFiles();
  }, [filterType]);

  const loadFiles = async () => {
    // get files

    if (filterType == FilterType.Document) {
      const fileResponse = await axios({
        method: "get",
        url: `/api/file?document=${state.selectedDocument.id}`,
        headers: {
          acceesstoken: state.accessToken,
        },
      });

      if (fileResponse.data) {
        setFiles(fileResponse.data);
      }
    }

    if (filterType == FilterType.Project) {
      const fileResponse = await axios({
        method: "get",
        url: `/api/file?project=${state.currentProjectId}`,
        headers: {
          acceesstoken: state.accessToken,
        },
      });

      if (fileResponse.data) {
        setFiles(fileResponse.data);
      }
    }
  };

  const setSelectedFile = (file: File) => {
    actionFileUpload(file, state.selectedDocument.id);
  };

  const clickOnContectMenu = async (key: string, file: file) => {
    if (key == "code") {
      let code = "";

      if (file.thumbnailPath) {
        code = `[![${file.name}](/api/file/${file.thumbnailPath}?token=__TOKEN__)](/api/file/${file.path}?token=__TOKEN__)`;
      } else {
        code = `[${file.name}](/api/file/${file.path}?token=__TOKEN__)`;
      }

      utils.copyToClipboard(code);
      message.info("code is copied to clipboard.");
    }

    if (key == "download") {
      window.open(
        `/api/file/${file.path}?token=${utils.sha1(state.accessToken)}`
      );
    }

    if (key == "delete") {
      if (!confirm("Are you sure to delete this file ?")) return;

      const fileResponse = await axios({
        method: "delete",
        url: `/api/file/${file.id}`,
        headers: {
          acceesstoken: state.accessToken,
        },
      });

      loadFiles();
    }
  };

  const columns: ColumnsType<file> = [
    {
      title: "",
      key: "thumbnailPath",
      dataIndex: "thumbnailPath",
      width: "10%",
      render: (text, file) => (
        <>
          {file.thumbnailPath ? (
            <img
              className="thumb"
              src={utils.getThumbUrl(file, state.accessToken)}
            />
          ) : (
            <div style={{ width: "50px", textAlign: "center" }}>
              <FileIcon
                extension={file.name.split(".").pop()}
                {...defaultStyles.docx}
              />
            </div>
          )}
        </>
      ),
      responsive: ["lg"],
    },
    {
      title: "Name",
      key: "name",
      dataIndex: "name",
      width: "35%",
      responsive: ["xs"],
    },
    {
      title: "Type",
      key: "mimeType",
      dataIndex: "mimeType",
      width: "20%",
      responsive: ["lg"],
    },
    {
      title: "Size",
      key: "size",
      dataIndex: "size",
      render: (text) => <span>{filesize(text)}</span>,
      width: "10%",
      responsive: ["lg"],
    },
    {
      title: "Created",
      key: "createdAt",
      dataIndex: "createdAt",
      render: (text) => <span>{dayjs(text).format("YYYY/MM/DD HH:mm")}</span>,
      width: "20%",
      align: "right",
      responsive: ["lg"],
    },
    {
      title: "",
      key: "id",
      dataIndex: "id",
      render: (text, file: file) => (
        <Dropdown
          overlay={
            <Menu
              style={{ width: 150 }}
              onClick={(e) => clickOnContectMenu(e.key, file)}
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
            defaultValue={FilterType.Document}
            style={{ textAlign: "left", width: "320px" }}
            onChange={(value) => {
              setFilterType(value);
            }}
            value={filterType}
          >
            <Option value={FilterType.Document}>
              Show files belongs to the document
            </Option>
            <Option value={FilterType.Project}>
              Show files belongs to the project
            </Option>
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
