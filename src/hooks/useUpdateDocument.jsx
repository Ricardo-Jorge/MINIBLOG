// eslint-disable-next-line no-unused-vars
import { useState, useEffect, useReducer } from "react";
import { db } from "../firebase/config";
import { updateDoc, doc } from "firebase/firestore";

// Estado inicial do Reducer
const initialState = {
  loading: null,
  error: null,
};

const updateReducer = (state, action) => {
  switch (action.type) {
    case "LOADING":
      return { loading: true, error: null };
    case "UPDATED_DOC":
      return { loading: false, error: null };
    case "ERROR":
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const useUpdateDocument = (docCollection) => {
  // Função a ser executada dentro do reducer
  const [response, dispatch] = useReducer(updateReducer, initialState);

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
  const updateDocument = async (id, data) => {
    checkCancelledBeforeDispatch({ type: "LOADING" });

    try {
      const docRef = await doc(db, docCollection, id);

      const updatedDocument = await updateDoc(docRef, data);

      checkCancelledBeforeDispatch({
        type: "UPDATED_DOC",
        payload: updatedDocument,
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

  return { updateDocument, response };
};
