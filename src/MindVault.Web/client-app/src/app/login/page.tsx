"use client"

import { FormEvent, useState } from "react"
import axiosInstance from "../api/axios"
import styles from "./page.module.css"
import { useRouter } from "next/navigation"
import useToastMessage from "../hooks/useToastMessage"
import { ErrorUtils } from "../Utils/ErrorUtils"

export default function Login()
{
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null); 
  var showToast = useToastMessage();

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (emailError || passwordError)
      return

    try
    {
      const response = await axiosInstance.post("/accounts/login", { email, password })

      const token = response.data.data.token;
      localStorage.setItem("token", token);
      showToast("Login efetuado com sucesso!", true);
      router.push("/notes");
    } catch (error: any) {
      var errors = error.response.data.errors;
      const emailError = errors?.Email;
      const passwordError = errors?.Password

      setEmailError(emailError);
      setPasswordError(passwordError);

      if (!emailError && !errors.Password)
        showToast(ErrorUtils.GetErrorMessageFromResponse(error), false);
    }
  }

  return (
    <div className={`${styles.page} p-4 d-flex justify-content-center align-items-center`} style={{ minHeight: "100vh" }}>
      <div className="col-12 col-md-6">
        <h1 className="h2 mb-4 text-center">MindVault</h1>
        <form onSubmit={(ev) => handleSubmit(ev)} noValidate className={`${styles.form} p-4 rounded m-auto shadow-lg bg-light needs-validation`}>
          <h3 className="h3 mb-3">Entrar</h3>
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
          <button type="submit" className="btn btn-primary w-100 mt-3">Entrar</button>
        </form>
      </div>
    </div>
  );

}