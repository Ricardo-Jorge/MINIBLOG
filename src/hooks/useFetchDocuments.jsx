import { useState, useEffect } from "react";
import { db } from "../firebase/config";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  where,
} from "firebase/firestore";

/*docCollection (para definir da coleção que estamos buscando no banco de dados), 
search (um parametro para busca), 
uid (para buscar os posts de um usuario especifico e colocar em seu dashboard) */
export const useFetchDocuments = (docCollection, search = null, uid = null) => {
  const [documents, setDocuments] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(null);

  // Deal with memory leak

  const [cancelled, setCancelled] = useState(false);

  useEffect(() => {
    async function loadData() {
      if (cancelled) return;

      // Iniciar um loading enquanto o sistema busca os dados no firebase
      setLoading(true);

      /* aguardamos a busca no databse da firebase por uma collection especifica e 
      jogamos ela na variavel collectionRef*/
      const collectionRef = await collection(db, docCollection);

      try {
        let q;

        //busca

        //dashboard
        if (search) {
          q = await query(
            collectionRef,
            where("tagsArray", "array-contains", search),
            orderBy("createdAt", "desc")
          );
        } else if (uid) {
          q = await query(
            collectionRef,
            where("uid", "==", uid),
            orderBy("createdAt", "desc")
          );
        } else {
          // busca dos posts na collection ordenada pela data de criação em ordem decrescente
          q = await query(collectionRef, orderBy("createdAt", "desc"));
        }

        // mapeamento os dados, sempre que tiver um dado alterado, essa função mapeia o database e retorna os dados atualizados.
        await onSnapshot(q, (querySnapshot) => {
          setDocuments(
            querySnapshot.docs.map((doc) => ({
              //id do documento vem separado dos outros dados.
              id: doc.id,
              //titulo, imagem, tags, body
              ...doc.data(),
            }))
          );
        });

        setLoading(false);
      } catch (error) {
        console.log(error);
        setError(error.message);

        setLoading(false);
      }
    }

    loadData();
  }, [docCollection, search, uid, cancelled]);

  useEffect(() => {
    return () => setCancelled(true);
  }, []);

  return { documents, loading, error };
};
