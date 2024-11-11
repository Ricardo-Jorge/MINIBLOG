import styles from "./Login.module.css";

import { useAuthentication } from "../../hooks/useAuthentication";

import { useState, useEffect } from "react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Mudamos o error para authError para evitar conflito com o erro do front-end
  const { login, error: authError, loading } = useAuthentication();

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Zerando os erros antes do envio
    setError("");

    // Definindo o objeto "Usuário"
    const user = {
      email,
      password,
    };

    const res = await login(user);

    console.log(res);
    console.log(error);
  };

  // Aqui vamos monitorar se houve algum erro do back-end e se sim, vamos atualizar o error front-end com setError
  useEffect(() => {
    if (authError) {
      setError(authError);
    }
  }, [authError]);

  return (
    <div className={styles.login}>
      <h1>Entrar</h1>
      <p>Faça o Login para utilizar o sistema.</p>
      <form onSubmit={handleSubmit}>
        <label>
          <span>E-mail: </span>
          <input
            type="email"
            name="email"
            required
            placeholder="E-mail do usuário"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <label>
          <span>Senha: </span>
          <input
            type="password"
            name="password"
            required
            placeholder="Insira sua senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>

        {!loading && <button className="btn">Entrar</button>}
        {loading && (
          <button className="btn" disabled>
            Aguarde...
          </button>
        )}
        {error && <p className="error">{error}</p>}
      </form>
    </div>
  );
};

export default Login;
