import INote from "@/app/Interfaces/INote"
import styles from "./styles.module.css"
import { ListGroupItem } from "reactstrap"

export default function NoteItem({ note } : { note: INote })
{
  return (
    <ListGroupItem className={"list-group-item d-flex justify-between " + styles.note}>
      <p className={styles.title}>{ note.title }</p>
      <div>
        <div className={styles.categories}>
          {note.categories.map(x => (
            <span key={x.id}>
              <span className="badge" style={{backgroundColor: x.color}}>{x.name}</span>
            </span>
          ))}
        </div>
        <div className="dropdown">
          <button className="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false"></button>
          <ul className="dropdown-menu">
            <li><a className="dropdown-item" href="#">Editar</a></li>
            <li><a className="dropdown-item" href="#">Deletar</a></li>
          </ul>
        </div>
      </div>
    </ListGroupItem>
  )
}