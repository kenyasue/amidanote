import { useEffect, useState } from "react";

import {
  Tooltip,
  Row,
  Col,
  Input,
  Button,
  Select,
  Modal,
  Switch,
  Form,
} from "antd";
const { Option } = Select;

const { Search } = Input;
import {
  SettingOutlined,
  FileAddOutlined,
  DiffOutlined,
} from "@ant-design/icons";

import { useStateContext, useDispatchContext } from "../../lib/reducer/context";
import TreeView from "../../components/home/documentTree";
import Header from "../../components/header";
import Footer from "../../components/footer";
import ContentView from "../../components/home/conetntView";
import ProjectSelector from "../../components/home/projectSelector";

import useActions from "../../actions/useActions";

const component = () => {
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const [validationResult, setValidationResult] = useState({
    projectname: {
      success: true,
      errorText: " ",
    },
  });
  const [projectName, setProjectName] = useState("");
  const [publish, setPublish] = useState(false);

  const newProject = () => {
    const validationResult = {
      projectname: {
        success: true,
        errorText: " ",
      },
    };

    if (projectName.length === 0) {
      validationResult.projectname.success = false;
      validationResult.projectname.errorText = "Please input project name";
    }

    setValidationResult(validationResult);
  };

  const closeNewProjectModal = () => {
    const validationResult = {
      projectname: {
        success: true,
        errorText: " ",
      },
    };

    setValidationResult(validationResult);

    setProjectName("");
    setPublish(false);
    setShowNewProjectModal(false);
  };

  return (
    <>
      <Tooltip title="Select Project">
        <Select defaultValue="lucy" style={{ width: "calc(100% - 108px)" }}>
          <Option value="jack">Jack</Option>
        </Select>
      </Tooltip>

      <Tooltip title="Project Settings">
        <Button
          type="primary"
          icon={<SettingOutlined />}
          style={{ width: 48, marginLeft: 6 }}
          size="middle"
          onClick={(e) => {}}
        />
      </Tooltip>

      <Tooltip title="New Project">
        <Button
          type="primary"
          icon={<DiffOutlined />}
          style={{ width: 48, marginLeft: 6 }}
          size="middle"
          onClick={(e) => {
            setShowNewProjectModal(true);
          }}
        />
      </Tooltip>

      <Modal
        title="New Project"
        visible={showNewProjectModal}
        onOk={(e) => newProject()}
        onCancel={(e) => closeNewProjectModal()}
      >
        <Row gutter={[16, 24]}>
          <Col span={8}>Project Name</Col>
          <Col span={10}>
            <Input
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              className={
                !validationResult.projectname.success ? "errorForm" : ""
              }
            />
            <div className="errorText">
              {validationResult.projectname.errorText}
            </div>
          </Col>
          <Col span={8}>Publish</Col>
          <Col span={10}>
            <Switch
              onChange={(checked) => setPublish(checked)}
              checked={publish}
            />
          </Col>
        </Row>
      </Modal>
    </>
  );
};

export default component;
