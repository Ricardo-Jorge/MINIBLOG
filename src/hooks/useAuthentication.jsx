// eslint-disable-next-line no-unused-vars
import { db, app } from "../firebase/config";

import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  signOut,
} from "firebase/auth";

import { useState, useEffect } from "react";

export const useAuthentication = () => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(null);

  // Cleanup
  // Deal with memory leak
  const [cancelled, setCancelled] = useState(false);

  const auth = getAuth(app);

  function checkIfCancelled() {
    if (cancelled) {
      return;
    }
  }

  // Register
  const createUser = async (data) => {
    checkIfCancelled();

    setLoading(true);
    setError(null);

    try {
      // Aqui vamos jogar o usuario criado na firebase com a função especifica abaixo na const em forma de objeto { user }, uma função asincrona, com isso devemos usar o "await" para esperar a resposta do sistema firebase.
      const { user } = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );

      // Aqui aguardamos o update do displayName do usuário { user } e por fim retornamos um usuário com essa função (createUser())
      await updateProfile(user, {
        displayName: data.displayName,
      });

      setLoading(false);

      return user;
    } catch (error) {
      console.log(error.message);
      console.log(typeof error.message);

      let systemErrorMessage;

      if (error.message.includes("password")) {
        systemErrorMessage = "A senha precisa ter pelo menos 6 caracteres.";
      } else if (error.message.includes("email-already")) {
        systemErrorMessage = "E-mail já cadastrado.";
      } else {
        systemErrorMessage =
          "Ocorreu um erro inesperado, por favor tente novamente mais tarde.";
      }

      setLoading(false);
      setError(systemErrorMessage);
    }
  };

  // Logout - Sign out
  const logout = () => {
    checkIfCancelled();
    signOut(auth);
  };

  // login - sign in

  const login = async (data) => {
    checkIfCancelled();

    setLoading(true);
    setError(false);

    try {
      await signInWithEmailAndPassword(auth, data.email, data.password);
      setLoading(false);
      // eslint-disable-next-line no-unused-vars
    } catch (error) {
      let systemErrorMessage = "Usuário e/ou senha incorreto(s).";

      setError(systemErrorMessage);
      setLoading(false);
    }
  };

  // Evita o memory leak
  useEffect(() => {
    return () => setCancelled(true);
  }, []);

  return {
    auth,
    createUser,
    error,
    loading,
    logout,
    login,
  };
};
