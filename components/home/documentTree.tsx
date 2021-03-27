import useSWR, { mutate } from "swr";
import type { document as Document } from "@prisma/client";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Menu } from "antd";

import utils from "../../lib/util";
import { useStateContext } from "../../lib/reducer/context";

import useActions from "../../actions/useActions";
import { constructMenu, renderMenu } from "../DocumentTreeLib";

const component = () => {
  const state = useStateContext();
  const { actionChangeCurrentDocument, actionLoadDocuments } = useActions();
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [activeDocumentIds, setActiveDocumentIds] = useState(["0"]);
  const [menuTree, setMenuTree] = useState([]);
  const router = useRouter();

  useEffect(() => {
    if (!state.userSignedIn) return;
    actionLoadDocuments(state.currentProjectId);
  }, [state.currentProjectId]);

  useEffect(() => {
    if (state.documents) {
      if (isInitialLoad) {
        const docIdInUrl: number = parseInt(router.query.doc as string);

        const docInUrl: Document = state.documents.find(
          (doc) => doc.id == docIdInUrl
        );

        if (docInUrl) actionChangeCurrentDocument(docInUrl);
        else actionChangeCurrentDocument(state.documents[0]);
      }
      setIsInitialLoad(false);
      setMenuTree(constructMenu(state.documents));
    }
  }, [state.documents]);

  useEffect(() => {
    if (
      state.selectedDocument &&
      state.selectedDocument.id !== activeDocumentIds[0]
    )
      setActiveDocumentIds([`${state.selectedDocument.id}`]);
  }, [state.selectedDocument]);

  useEffect(() => {
    setMenuTree(constructMenu(state.documents));
  }, [state.renderMenu]);

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

  return (
    <Menu selectedKeys={activeDocumentIds} mode="inline" className="top-menu">
      {menuTree
        ? renderMenu(menuTree, (document: Document) => {
            console.log("click");
            actionChangeCurrentDocument(document);
          })
        : null}
    </Menu>
  );
};

export default component;
