import Link from "next/link"
import styles from "./styles.module.css" 

export default function Header()
{
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
      <i  className={"bi bi-person-circle " + styles.user}></i>    
    </div>
  )
}