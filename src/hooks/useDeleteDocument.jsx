// eslint-disable-next-line no-unused-vars
import { useState, useEffect, useReducer } from "react";
import { db } from "../firebase/config";
import { doc, deleteDoc } from "firebase/firestore";

// Estado inicial do Reducer
const initialState = {
  loading: null,
  error: null,
};

const deleteReducer = (state, action) => {
  switch (action.type) {
    case "LOADING":
      return { loading: true, error: null };
    case "DELETED_DOC":
      return { loading: false, error: null };
    case "ERROR":
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const useDeleteDocument = (docCollection) => {
  // Função a ser executada dentro do reducer
  const [response, dispatch] = useReducer(deleteReducer, initialState);

  // Deal with memory leak
  // eslint-disable-next-line no-unused-vars
  const [cancelled, setCancelled] = useState(false);

  // Antes de executar qualquer ação verificar se cancelled(false), not cancelled.
  const checkCancelledBeforeDispatch = (action) => {
    if (!cancelled) {
      dispatch(action);
    }
  };
  // Função assincrona que vai recever um document
  const deleteDocument = async (id) => {
    checkCancelledBeforeDispatch({ type: "LOADING" });

    try {
      const deletedDocument = await deleteDoc(doc(db, docCollection, id));

      checkCancelledBeforeDispatch({
        type: "DELETED_DOC",
        payload: deletedDocument,
      });
    } catch (error) {
      checkCancelledBeforeDispatch({
        type: "ERROR",
        payload: error.message,
      });
    }
  };

  //   useEffect(() => {
  //     return () => setCancelled(true);
  //   }, []);

  return { deleteDocument, response };
};
