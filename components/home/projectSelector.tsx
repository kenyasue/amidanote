import { useEffect, useState } from "react";
import { useRouter } from "next/router";

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
import axios from "axios";

import { useStateContext, useDispatchContext } from "../../lib/reducer/context";
import TreeView from "../../components/home/documentTree";
import Header from "../../components/header";
import Footer from "../../components/footer";
import ContentView from "../../components/home/conetntView";
import ProjectSelector from "../../components/home/projectSelector";

import useActions from "../../actions/useActions";

const component = () => {
  const { actionLoadProjects, actionSetCurrentProjectId } = useActions();
  const router = useRouter();
  const state = useStateContext();
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const [validationResult, setValidationResult] = useState({
    projectname: {
      success: true,
      errorText: " ",
    },
  });
  const [projectName, setProjectName] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    actionLoadProjects();
  }, []);

  const newProject = async () => {
    let isError = false;

    const validationResult = {
      projectname: {
        success: true,
        errorText: " ",
      },
    };

    if (projectName.length === 0) {
      validationResult.projectname.success = false;
      validationResult.projectname.errorText = "Please input project name";
      isError = true;
    }

    setValidationResult(validationResult);

    if (isError) return;

    // start adding new project
    setIsProcessing(true);

    try {
      const projectResponse = await axios({
        method: "post",
        url: "/api/project",
        headers: {
          acceesstoken: state.accessToken,
        },
        data: {
          name: projectName,
          isPrivate: isPrivate,
        },
      });

      setIsProcessing(false);
      actionLoadProjects();
      closeNewProjectModal();

      actionSetCurrentProjectId(projectResponse.data.id);
      router.push(`/project/${projectResponse.data.id}`);
    } catch (e) {
      console.error(e);
      setIsProcessing(false);
    }
  };

  const closeNewProjectModal = () => {
    if (isProcessing) return;

    const validationResult = {
      projectname: {
        success: true,
        errorText: " ",
      },
    };

    setValidationResult(validationResult);

    setProjectName("");
    setIsPrivate(false);
    setShowNewProjectModal(false);
    setIsProcessing(false);
  };

  const selectProject = async (projectId: number) => {
    actionSetCurrentProjectId(projectId);
    router.push(`/project/${projectId}`);
  };

  return (
    <>
      <Tooltip title="Select Project">
        <Select
          defaultValue={state.currentProjectId ? state.currentProjectId : null}
          style={{ width: "calc(100% - 108px)" }}
          value={state.currentProjectId ? state.currentProjectId : null}
          onChange={(e) => selectProject(e)}
        >
          {state.projects
            ? state.projects.map((project) => (
                <Option value={project.id} key={project.id}>
                  {project.name}
                </Option>
              ))
            : null}
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
        confirmLoading={isProcessing}
        cancelButtonProps={{
          disabled: isProcessing,
        }}
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
          <Col span={8}>Private</Col>
          <Col span={10}>
            <Switch
              onChange={(checked) => setIsPrivate(checked)}
              checked={isPrivate}
            />
          </Col>
        </Row>
      </Modal>
    </>
  );
};

export default component;
