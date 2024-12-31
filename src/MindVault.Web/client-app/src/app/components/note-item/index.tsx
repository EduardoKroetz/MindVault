import styles from "./styles.module.css"

export default function NoteItem()
{
  return (
    <li className={"list-group-item d-flex justify-between " + styles.note}>
      <p className={styles.title}>Título</p>
      <div>
        <div className={styles.categories}>
          <span><span className="badge text-bg-primary">Categoria</span></span>
          <span><span className="badge text-bg-warning">Categoria</span></span>
        </div>
        <div className="dropdown">
          <button className="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
          </button>
          <ul className="dropdown-menu">
            <li><a className="dropdown-item" href="#">Editar</a></li>
            <li><a className="dropdown-item" href="#">Deletar</a></li>
          </ul>
        </div>
      </div>
      
    </li>
  )
}