/* eslint-disable react/prop-types */
import { useContext, createContext } from "react";
const AuthContext = createContext();

// Função que permite a utilização de um valor para o componente para os componentes filhos.
export function AuthProvider({ children, value }) {
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuthValue() {
  return useContext(AuthContext);
}

// Essa função exporta o contexto já sendo utilizado.
