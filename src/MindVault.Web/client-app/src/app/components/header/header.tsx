import Link from "next/link"
import styles from "./header.module.css" 

export default function Header()
{
  return (
    <div className={styles.header}>
      <nav className={styles.nav}>
        <a className={styles.title} href="/">
          <h1 className="h3">MindVault</h1>
        </a>
        <div className={styles.links}>
          <Link href={"/notes"}>Anotações</Link>
          <Link href={"/categories"}>Categorias</Link>
        </div>
      </nav>
      <i  className={"bi bi-person-circle " + styles.user}></i>    
    </div>
  )
}