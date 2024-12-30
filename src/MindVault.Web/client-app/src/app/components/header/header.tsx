import styles from "./header.module.css" 

export default function Header()
{
  return (
    <div className={styles.header}>
      <div>
        <h1>MindVault</h1>
        <div>
          <a href="/notes">Anotações</a>
          <a href="/categories">Categorias</a>
        </div>
      </div>
      <i></i>
    </div>
  )
}