import INote from "@/app/Interfaces/INote"
import { ListGroupItem } from "reactstrap"
import Link from "next/link"
import CategoryBadge from "../category-badge"
import { useState } from "react"
import DeleteNoteModal from "../delete-note-modal"
import DateUtils from "@/app/Utils/DateUtils"

export default function NoteItem({ note } : { note: INote })
{
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const toggleDeleteModal = () => setDeleteModalOpen(!deleteModalOpen);

  return (
    <ListGroupItem className={"list-group-item d-flex"}>
      <div className="d-flex flex-grow-1 flex-wrap align-items-center">
        <Link href={`/notes/edit/${note.id}`} className="flex-grow-1 px-1">
          <span className="fw-semibold">{note.title}</span>   
          <span className="mx-2">{DateUtils.FormatDateTime(note.createdAt)}</span>
        </Link>
        <div className="d-flex gap-2 flex-wrap">
          {note.categories.map(x => (
            <CategoryBadge key={x.id} category={x}></CategoryBadge>
          ))}
        </div>
      </div>
      <div className="dropdown ms-sm-4">
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

      
      <DeleteNoteModal isOpen={deleteModalOpen} toggleModal={toggleDeleteModal} note={note}/>
    </ListGroupItem>
  )
}