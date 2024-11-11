import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAjPQFZvdk5IxUCJ26cq0QI6stV6gK_8N0",
  authDomain: "miniblog-7a778.firebaseapp.com",
  projectId: "miniblog-7a778",
  storageBucket: "miniblog-7a778.appspot.com",
  messagingSenderId: "602089446697",
  appId: "1:602089446697:web:4ffe72e76f3acf537d6b38",
};

const app = initializeApp(firebaseConfig);

// chamando o serviço de banco de dados da firebase e denominando o banco de dados de db.
const db = getFirestore(app);

export { db, app };
