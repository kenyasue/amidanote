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
  message,
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
import Header from "../header";
import Footer from "../../components/footer";
import ContentView from "../../components/home/conetntView";
import ProjectSelector from "../../components/home/projectSelector";

import useActions from "../../actions/useActions";
import utils from "../../lib/util";

const component = () => {
  const { actionLoadProjects, actionSetCurrentProjectId } = useActions();
  const router = useRouter();
  const state = useStateContext();
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const [showEditProjectModal, setShowEditProjectModal] = useState(false);
  const [validationResult, setValidationResult] = useState({
    projectname: {
      success: true,
      errorText: " ",
    },
  });
  const [projectName, setProjectName] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isProcessingDelete, setIsProcessingDelete] = useState(false);

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

  const updateProject = async () => {
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

    // start updating project
    setIsProcessing(true);

    try {
      const projectResponse = await axios({
        method: "put",
        url: `/api/project/${state.currentProjectId}`,
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
      setShowEditProjectModal(false);
      actionSetCurrentProjectId(projectResponse.data.id);
    } catch (e) {
      console.error(e);
      setIsProcessing(false);
    }
  };

  const deleteProject = async () => {
    let isError = false;

    // start updating project
    setIsProcessingDelete(true);

    if (!confirm("Are you sure to delete this project ? ")) return;

    try {
      const projectResponse = await axios({
        method: "delete",
        url: `/api/project/${state.currentProjectId}`,
        headers: {
          acceesstoken: state.accessToken,
        },
      });

      // get default project
      const defaultProject = await axios({
        method: "get",
        url: "/api/project/default",
        headers: {
          acceesstoken: state.accessToken,
        },
      });

      setIsProcessingDelete(false);
      actionLoadProjects();
      setShowEditProjectModal(false);
      router.push(`/project/${defaultProject.data.id}`);
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

  const selectProject = async (projectName: string) => {
    const projectId: number = state.projects.find(
      (prj) => prj.name === projectName
    ).id;

    actionSetCurrentProjectId(projectId);
    router.push(`/project/${projectId}`);
  };

  const copyURL = (url: string) => {
    utils.copyToClipboard(url);
    message.info("URL copied to clipboard.");
  };

  let selectedProject = null;

  if (state.projects) {
    selectedProject = state.projects.find(
      (prj) => prj.id == state.currentProjectId
    );
  }

  const urlInfo = utils.isBrowser() ? new URL(location.href) : null;
  const publicURL = state.selectedProject
    ? `${urlInfo.origin}/u/${state.selectedProject.userId}/${state.selectedProject.id}`
    : "";

  return (
    <>
      <Tooltip title="Select Project">
        <Select
          defaultValue={selectedProject ? selectedProject.name : null}
          style={{ width: "calc(100% - 108px)" }}
          value={selectedProject ? selectedProject.name : null}
          onChange={(e) => selectProject(e)}
        >
          {state.projects
            ? state.projects.map((project) => (
                <Option value={project.name} key={project.id}>
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
          onClick={(e) => {
            setProjectName(state.selectedProject && state.selectedProject.name);
            setIsPrivate(
              state.selectedProject && state.selectedProject.isPrivate
            );
            setShowEditProjectModal(true);
          }}
        />
      </Tooltip>

      <Tooltip title="Edit Project">
        <Button
          type="primary"
          icon={<DiffOutlined />}
          style={{ width: 48, marginLeft: 6 }}
          size="middle"
          onClick={(e) => {
            setProjectName("");
            setIsPrivate(true);
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

      <Modal
        title="Edit Project"
        visible={showEditProjectModal}
        onOk={(e) => updateProject()}
        onCancel={(e) => setShowEditProjectModal(false)}
        confirmLoading={isProcessing}
        cancelButtonProps={{
          disabled: isProcessing,
        }}
        footer={[
          <Button
            key="back"
            disabled={
              isProcessing ||
              isProcessingDelete ||
              (state.projects && state.projects.length) === 1
            }
            type="default"
            danger
            loading={isProcessingDelete}
            onClick={(e) => deleteProject()}
          >
            Delete
          </Button>,
          <Button
            key="back"
            disabled={isProcessing}
            onClick={(e) => setShowEditProjectModal(false)}
          >
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={isProcessing}
            onClick={(e) => updateProject()}
          >
            OK
          </Button>,
        ]}
      >
        <Row gutter={[16, 24]}>
          {!isPrivate ? (
            <>
              <Col span={8}>Public URL</Col>
              <Col span={16}>
                {state.selectedProject ? (
                  <Tooltip title="Click to copy">
                    <a
                      href="javascript:void(0)"
                      onClick={(e) => copyURL(publicURL)}
                    >
                      {utils.truncateString(publicURL, 32)}
                    </a>
                  </Tooltip>
                ) : null}
              </Col>
            </>
          ) : null}
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
