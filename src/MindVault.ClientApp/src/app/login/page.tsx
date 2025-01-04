"use client"

import { FormEvent, useState } from "react"
import axiosInstance from "../api/axios"
import { useRouter } from "next/navigation"
import useToastMessage from "../hooks/useToastMessage"
import { ErrorUtils } from "../Utils/ErrorUtils"
import Link from "next/link"
import { Button, Form, FormFeedback, FormGroup, FormText, Input, Label } from "reactstrap"
import LoadingSpinner from "../components/loading-spinner"

export default function Login()
{
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null); 
  const [loading, setLoading] = useState(false);
  var showToast = useToastMessage();

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (emailError || passwordError)
      return

    setLoading(true);
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

      if (!emailError && !passwordError)
        showToast(ErrorUtils.GetErrorMessageFromResponse(error), false);
    }
    setLoading(false);
  }

  return (
    <div className="p-4 d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
      <div className="col-12 col-md-6 col-lg-4">
        <h1 className="h2 mb-4 text-center">MindVault</h1>
        <Form onSubmit={(ev) => handleSubmit(ev)} noValidate className="p-4 rounded m-auto shadow-lg bg-light needs-validation">
          <h3 className="h3 mb-3">Entrar</h3>
          <FormGroup floating>
            <Input
              type="email"
              id="floatingEmail"
              placeholder="nome@exemplo.com"
              autoComplete="email"
              onChange={(e) => { setEmail(e.target.value); setEmailError(null); }}
              invalid={emailError != null}
            />
            <Label htmlFor="floatingEmail">E-mail</Label>
            <FormFeedback>
              { emailError }
            </FormFeedback>
          </FormGroup>
          <FormGroup floating>
            <Input
              type="password"
              id="floatingPassword"
              placeholder="Senha"
              onChange={(e) => { setPassword(e.target.value); setPasswordError(null); }}
              invalid={passwordError != null}
            />
            <Label htmlFor="floatingPassword">Senha</Label>
            <FormFeedback>
              { passwordError }
            </FormFeedback>
          </FormGroup>
          <Button disabled={loading} type="submit" className="w-100 mt-3">
            {loading ? "Entrando" : "Entrar" }
            {loading && <LoadingSpinner />}
          </Button>
          <div className="mt-3">
            <Link href={"/register"}>Não possui uma conta? Cadastre-se</Link>
          </div>
        </Form>
      </div>
    </div>
  );

}