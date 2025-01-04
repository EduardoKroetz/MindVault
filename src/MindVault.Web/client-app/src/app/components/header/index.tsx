"use client"

import Link from "next/link"
import styles from "./styles.module.css" 
import { Button, FormGroup, Input, Label, Nav, Offcanvas, OffcanvasBody, OffcanvasHeader } from "reactstrap"
import { useEffect, useState } from "react"
import { useAccount } from "@/app/contexts/accountContext"
import { useRouter } from "next/navigation"

export default function Header()
{
  const [userIsOpen, setUserIsOpen] = useState(false);
  const { account, getUser } = useAccount()
  const router = useRouter()

  useEffect(() => {
    getUser()
  }, [])

  const toggleUser = () => setUserIsOpen(v => !v);

  const handleLeaveAccount = () => {
    localStorage.removeItem('token');
    router.push("/login")
  }

  return (
    <div className={'border-bottom border-secondary ' + styles.header}>
      <Nav className={styles.nav}>
        <Link className={styles.title} href="/notes">
          <h1 className="h3">MV</h1>
        </Link>
        <div className={styles.links}>
          <Link href={"/notes"} className="fw-semibold">Anotações</Link>
          <Link href={"/categories"} className="fw-semibold">Categorias</Link>
        </div>
      </Nav>
      {account && (
        <>
          <i onClick={toggleUser} className={"bi bi-person-circle " + styles.user}></i>    
          <Offcanvas direction="end" toggle={toggleUser} isOpen={userIsOpen}>
            <OffcanvasHeader toggle={toggleUser}>Conta</OffcanvasHeader>
            <OffcanvasBody className="d-flex flex-column">
              <div className="d-flex flex-column flex-grow-1">
                <FormGroup floating className="mb-3">
                  <Input type="text" value={account.username} id="usernameFloating" readOnly />
                  <Label htmlFor="usernameFloating">Nome de usuário</Label>
                </FormGroup>
                <FormGroup floating className="mb-3">
                  <Input type="text" value={account.email} id="emailFloating" readOnly />
                  <Label htmlFor="emailFloating">E-mail</Label>
                </FormGroup>
              </div>
              <div>
                <Button onClick={handleLeaveAccount} color="danger" className="d-flex gap-2">
                  <i className="bi-box-arrow-left"></i>
                  Sair da Conta
                </Button>
              </div>
            </OffcanvasBody>
          </Offcanvas>
        </>
      ) }
      
    </div>
  )
}