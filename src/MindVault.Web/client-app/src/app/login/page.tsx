"use client"

import { FormEvent, useState } from "react"
import axiosInstance from "../api/axios"
import styles from "./page.module.css"
import { useRouter } from "next/navigation"
import useToastMessage from "../hooks/useToastMessage"

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
      const response = await axiosInstance.post("/auth/login", { email, password })

      const token = response.data.data.token;
      localStorage.setItem("token", token);
      showToast("Login efetuado com sucesso!", true);
      router.push("/notes");
    } catch (error: any) {
      var errors = error.response.data.errors;
      setEmailError(() => errors.Email);
      setPasswordError(() => errors.Password);

      if (!errors.Email && !errors.Password)
        showToast(errors[0], false);
    }
  }

  return (
    <div className={styles.page + " p-2"}>
      <h1 className="h2 mb-4">MindVault - Entrar</h1>
      <form onSubmit={(ev) => handleSubmit(ev)} noValidate className={styles.form + " col-12 col-md-6 container border p-4 p-5-md rounded text-center needs-validation"}> 
        <div className="form-floating mb-3">
          <input type="email" id="floatingEmail" placeholder="nome@exemplo.com" 
            onChange={(e) => { setEmail(e.target.value); setEmailError(null)} }
            className={`form-control ${emailError ? "is-invalid" : ""}`}
            />
          <label htmlFor="floatingEmail">E-mail</label>
          <div className="invalid-feedback">
            { emailError }
          </div>
        </div>
        <div className="form-floating position-relative">
          <input type="password" id="floatingPassword" placeholder="Senha" 
            onChange={(e) => { setPassword(e.target.value); setPasswordError(null)} }
            className={`form-control ${passwordError ? "is-invalid" : ""}`}
          />
          <label htmlFor="floatingPassword">Senha</label>
          <div className="invalid-feedback">
            { passwordError }
          </div>
        </div>
        <button type="submit" className="btn btn-primary mt-3 ">Entrar</button>
      </form>
    </div>
  )
}