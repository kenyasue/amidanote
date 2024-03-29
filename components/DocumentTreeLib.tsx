import type { document as Document } from "@prisma/client";
import { Menu } from "antd";
import * as constants from "../lib/const";
const { SubMenu } = Menu;

export const constructMenu = (documents: Array<Document>) => {
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

  return menuTreeWork;
};

export const renderMenu = (branch: any, onSelect: Function) => {
  const render = Object.keys(branch).map((key: string) => {
    const subBranch = branch[key];
    if (subBranch.id) {
      // if the branch is document render item and finish
      const document: Document = subBranch;
      return (
        <Menu.Item
          key={document.id}
          onClick={() => {
            onSelect(document);
          }}
        >
          {document.format === constants.FORMAT_SWAGGER ? (
            <img src="/images/swagger_icon.svg" height="16" />
          ) : (
            <img src="/images/markdown_icon.svg" height="16" />
          )}
          &nbsp;&nbsp;
          {document.title.split("/").pop()}
        </Menu.Item>
      );
    } else {
      return (
        <Menu.SubMenu key={key} title={key}>
          {renderMenu(subBranch, (document: Document) => onSelect(document))}
        </Menu.SubMenu>
      );
    }
  });

  return render;
};
