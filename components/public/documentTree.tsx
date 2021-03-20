import useSWR, { mutate } from "swr";
import type { document as Document } from "@prisma/client";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Menu } from "antd";

const { SubMenu } = Menu;

import utils from "../../lib/util";
import {
  AppstoreOutlined,
  MailOutlined,
  SettingOutlined,
} from "@ant-design/icons";

import {
  useStateContext,
  useDispatchContext,
  useDispatchLaterContext,
} from "../../lib/reducer/context";

import useActions from "../../actions/useActions";

const component = ({ documents }: { documents: Array<Document> }) => {
  const state = useStateContext();
  const { actionChangeCurrentDocument, actionLoadDocuments } = useActions();
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [activeDocumentIds, setActiveDocumentIds] = useState(["0"]);
  const [menuTree, setMenuTree] = useState([]);
  const router = useRouter();

  useEffect(() => {
    if (documents) constructMenu(documents);
  }, []);

  const constructMenu = (documents: Array<Document>) => {
    // build menu tree
    const menuTreeWork: any = {};

    const addToBranch = (path: Array<string>, doc: Document) => {
      // generate js code from path
      const folders = path.slice(0, path.length - 1);
      const title = path[path.length - 1];

      // [foldername1][foldername2]
      let code = folders.reduce((res, cur, index, all) => {
        const code1 = `!menuTreeWork${res.trim()} ? menuTreeWork${res.trim()}  = {} : null`;
        eval(code1); // create obj for each branch if empty
        return `${res}['${cur.trim()}']`;
      }, "");

      if (folders.length > 0) {
        const code2 = `!menuTreeWork${code} ? menuTreeWork${code}  = {} : null`;
        eval(code2); // create obj for each branch if empty
      }

      code = `menuTreeWork${code}['___${doc.id}'] = doc`;

      eval(code);
    };

    if (!documents) return;

    // the logic to build tree structure from title splitted by "/"
    documents.map((doc) => {
      const title = doc.title;
      const titleSplitted = doc.title.split("/");

      // create folders
      let cursor: any = menuTreeWork;

      addToBranch(titleSplitted, doc);
    });

    setMenuTree(menuTreeWork);
  };

  const renderMenu = (branch: any) => {
    const render = Object.keys(branch).map((key: string) => {
      const subBranch = branch[key];
      if (subBranch.id) {
        // if the branch is document render item and finish
        const document: Document = subBranch;
        return (
          <Menu.Item
            key={document.id}
            onClick={() => {
              actionChangeCurrentDocument(document);
            }}
          >
            {document.title.split("/").pop()}
          </Menu.Item>
        );
      } else {
        return (
          <Menu.SubMenu key={key} title={key}>
            {renderMenu(subBranch)}
          </Menu.SubMenu>
        );
      }
    });

    return render;
  };

  return (
    <Menu selectedKeys={activeDocumentIds} mode="inline" className="top-menu">
      {menuTree ? renderMenu(menuTree) : null}
    </Menu>
  );
};

export default component;
