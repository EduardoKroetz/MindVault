"use client"

import { FormEvent, useState } from "react"
import axiosInstance from "../api/axios"
import { useRouter } from "next/navigation"
import useToastMessage from "../hooks/useToastMessage"
import { ErrorUtils } from "../Utils/ErrorUtils"
import Link from "next/link"

export default function Register()
{
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [usernameError, setUsernameError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null); 
  var showToast = useToastMessage();

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (emailError || passwordError || usernameError)
      return

    try
    {
      const response = await axiosInstance.post("/accounts/register", { username ,email, password })

      const token = response.data.data.token;
      localStorage.setItem("token", token);
      showToast("Conta registrada com sucesso!", true);
      router.push("/notes");
    } catch (error: any) {
      var errors = error.response.data.errors;
      const usernameError = errors?.UserName
      const emailError = errors?.Email;
      const passwordError = errors?.Password

      setUsernameError(usernameError);
      setEmailError(emailError);
      setPasswordError(passwordError);

      if (!emailError && !passwordError && !usernameError)
        showToast(ErrorUtils.GetErrorMessageFromResponse(error), false);
    }
  }

  return (
    <div className="p-4 d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
      <div className="col-12 col-md-6 col-lg-4">
        <h1 className="h2 mb-4 text-center">MindVault</h1>
        <form onSubmit={(ev) => handleSubmit(ev)} noValidate className="p-4 rounded m-auto shadow-lg bg-light needs-validation">
          <h3 className="h3 mb-3">Cadastrar</h3>
          <div className="form-floating mb-3">
            <input
              type="text"
              id="floatingUsername"
              placeholder="Nome de usuário"
              autoComplete="email"
              onChange={(e) => { setUsername(e.target.value); setUsernameError(null); }}
              className={`form-control ${usernameError ? "is-invalid" : ""}`}
            />
            <label htmlFor="floatingUsername">Nome de usuário</label>
            <div className="invalid-feedback">
              { usernameError }
            </div>
          </div>
          <div className="form-floating mb-3">
            <input
              type="email"
              id="floatingEmail"
              placeholder="nome@exemplo.com"
              onChange={(e) => { setEmail(e.target.value); setEmailError(null); }}
              className={`form-control ${emailError ? "is-invalid" : ""}`}
            />
            <label htmlFor="floatingEmail">E-mail</label>
            <div className="invalid-feedback">
              { emailError }
            </div>
          </div>
          <div className="form-floating mb-3 position-relative">
            <input
              type="password"
              id="floatingPassword"
              placeholder="Senha"
              onChange={(e) => { setPassword(e.target.value); setPasswordError(null); }}
              className={`form-control ${passwordError ? "is-invalid" : ""}`}
            />
            <label htmlFor="floatingPassword">Senha</label>
            <div className="invalid-feedback">
              { passwordError }
            </div>
          </div>
          <button type="submit" className="btn btn-primary w-100 mt-3">Cadastrar</button>
          <div className="mt-3">
            <Link href={"/login"}>Já possui uma conta? Entrar</Link>
          </div>
        </form>
      </div>
    </div>
  );

}