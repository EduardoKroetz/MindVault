"use client"

import Link from "next/link"
import styles from "./styles.module.css" 
import { Button, Offcanvas, OffcanvasBody, OffcanvasHeader } from "reactstrap"
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

  if (!account)
    return

  const toggleUser = () => setUserIsOpen(v => !v);

  const handleLeaveAccount = () => {
    localStorage.removeItem('token');
    router.push("/login")
  }

  return (
    <div className={styles.header}>
      <nav className={styles.nav}>
        <Link className={styles.title} href="/notes">
          <h1 className="h3">MindVault</h1>
        </Link>
        <div className={styles.links}>
          <Link href={"/notes"}>Anotações</Link>
          <Link href={"/categories"}>Categorias</Link>
        </div>
      </nav>
      <i onClick={toggleUser} className={"bi bi-person-circle " + styles.user}></i>    
      <Offcanvas direction="end" toggle={toggleUser} isOpen={userIsOpen}>
        <OffcanvasHeader toggle={toggleUser}>Conta</OffcanvasHeader>
        <OffcanvasBody className="d-flex flex-column">
          <div className="d-flex flex-column flex-grow-1">
            <div className="form-floating mb-3">
              <input type="text" className="form-control" value={account.username} id="usernameFloating" placeholder="name@example.com" readOnly />
              <label htmlFor="usernameFloating">Nome de usuário</label>
            </div>
            <div className="form-floating mb-3">
              <input type="text" className="form-control" value={account.email} id="usernameFloating" placeholder="name@example.com" readOnly />
              <label htmlFor="usernameFloating">E-mail</label>
            </div>
          </div>
          <div>
            <Button onClick={handleLeaveAccount} color="danger" className="d-flex gap-2">
              <i className="bi-box-arrow-left"></i>
              Sair
            </Button>
          </div>

        </OffcanvasBody>
      </Offcanvas>
    </div>
  )
}