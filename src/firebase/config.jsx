import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import "dotenv";

const apiKey = import.meta.env.VITE_APP_API_KEY;
const authDom = import.meta.env.VITE_APP_AUTH_DOM;
const projID = import.meta.env.VITE_APP_PROJ_ID;
const storBuck = import.meta.env.VITE_APP_STOR_BUCK;
const messSendId = import.meta.env.VITE_APP_MESS_SEND_ID;
const appId = import.meta.env.VITE_APP_App_ID;

const firebaseConfig = {
  apiKey: apiKey,
  authDomain: authDom,
  projectId: projID,
  storageBucket: storBuck,
  messagingSenderId: messSendId,
  appId: appId,
};

const app = initializeApp(firebaseConfig);

// chamando o serviço de banco de dados da firebase e denominando o banco de dados de db.
const db = getFirestore(app);

export { db, app };
