import INote from "@/app/Interfaces/INote"
import styles from "./styles.module.css"
import { ListGroupItem } from "reactstrap"
import Link from "next/link"
import CategoryBadge from "../category-badge"
import { useState } from "react"
import DeleteNoteModal from "../delete-note-modal"

export default function NoteItem({ note } : { note: INote })
{
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const toggleDeleteModal = () => setDeleteModalOpen(!deleteModalOpen);

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
            <li>
              <Link  className="dropdown-item d-flex justify-content-between" href={`/notes/edit/${note.id}`}>
                Editar
                <i className="bi-pencil"></i>
              </Link>
            </li>
            <li>
              <span onClick={toggleDeleteModal} style={{cursor: 'pointer'}} className="dropdown-item d-flex justify-content-between">
                Deletar 
                <i className="bi-trash"></i>
              </span>
            </li>
          </ul>
        </div>
      </div>
      <DeleteNoteModal isOpen={deleteModalOpen} toggleModal={toggleDeleteModal} note={note}/>
    </ListGroupItem>
  )
}