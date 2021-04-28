import useSWR, { mutate } from "swr";
import type { document as Document } from "@prisma/client";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Menu } from "antd";

import utils from "../../lib/util";
import { useStateContext } from "../../lib/reducer/context";

import useActions from "../../actions/useActions";
import { constructMenu, renderMenu } from "../DocumentTreeLib";

const component = ({ documents }: { documents: Array<Document> }) => {
  const state = useStateContext();
  const { actionChangeCurrentDocument, actionLoadDocuments } = useActions();
  const [activeDocumentIds, setActiveDocumentIds] = useState(["0"]);
  const [menuTree, setMenuTree] = useState([]);
  const router = useRouter();

  useEffect(() => {
    if (state.documents) {
      setMenuTree(constructMenu(state.documents));
    }
  }, [state.documents]);

  useEffect(() => {
    const keyword = state.documentSearchKeyword;

    if (state.documentSearchKeyword && state.documentSearchKeyword.length > 0)
      setMenuTree(
        constructMenu(
          state.documents
            ? state.documents.filter(
                (row) => row.title.indexOf(state.documentSearchKeyword) !== -1
              )
            : []
        )
      );
    else setMenuTree(constructMenu(state.documents));
  }, [state.documentSearchKeyword]);

  useEffect(() => {
    if (documents) constructMenu(documents);
  }, []);

  return (
    <Menu selectedKeys={activeDocumentIds} mode="inline" className="top-menu">
      {menuTree
        ? renderMenu(menuTree, (document: Document) =>
            actionChangeCurrentDocument(document)
          )
        : null}
    </Menu>
  );
};

export default component;
