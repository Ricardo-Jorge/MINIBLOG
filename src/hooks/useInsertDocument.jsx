// eslint-disable-next-line no-unused-vars
import { useState, useEffect, useReducer } from "react";
import { db } from "../firebase/config";
import { collection, addDoc, Timestamp } from "firebase/firestore";

// Estado inicial do Reducer
const initialState = {
  loading: null,
  error: null,
};

const insertReducer = (state, action) => {
  switch (action.type) {
    case "LOADING":
      return { loading: true, error: null };
    case "INSERTED_DOC":
      return { loading: false, error: null };
    case "ERROR":
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const useInsertDocument = (docCollection) => {
  // Função a ser executada dentro do reducer
  const [response, dispatch] = useReducer(insertReducer, initialState);

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
  const insertDocument = async (document) => {
    checkCancelledBeforeDispatch({ type: "LOADING" });

    try {
      /*documento a ser recebido, vamos pegar os dados colocados nessa função
         através do spread operator, e o momento que esse documento foi criado, createdAt*/
      const newDocument = { ...document, createdAt: Timestamp.now() };

      //função com resultado da inserção, passando a collection, basicamente procurar no banco de dados essa coleção
      const insertedDocument = await addDoc(
        collection(db, docCollection),
        newDocument
      );
      checkCancelledBeforeDispatch({
        type: "INSERTED_DOC",
        payload: insertedDocument,
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

  return { insertDocument, response };
};
