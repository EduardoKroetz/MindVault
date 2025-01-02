import INote from "@/app/Interfaces/INote"
import styles from "./styles.module.css"
import { ListGroupItem } from "reactstrap"
import Link from "next/link"
import CategoryBadge from "../category-badge"

export default function NoteItem({ note } : { note: INote })
{
  return (
    <ListGroupItem className={"list-group-item d-flex justify-between " + styles.note}>
      <Link href={`/notes/${note.id}`} className={styles.title}>{ note.title }</Link>
      <div>
        <div className={styles.categories}>
          {note.categories.map(x => (
            <CategoryBadge key={x.id} category={x}></CategoryBadge>
          ))}
        </div>
        <div className="dropdown">
          <button className="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false"></button>
          <ul className="dropdown-menu">
            <li><Link  className="dropdown-item" href={`/notes/edit/${note.id}`}>Editar</Link></li>
            <li><a className="dropdown-item" href="#">Deletar</a></li>
          </ul>
        </div>
      </div>
    </ListGroupItem>
  )
}