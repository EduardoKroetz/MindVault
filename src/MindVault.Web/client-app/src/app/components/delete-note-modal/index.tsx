"use client"

import axiosInstance from "@/app/api/axios";
import { useNotes } from "@/app/contexts/notesContext";
import useToastMessage from "@/app/hooks/useToastMessage";
import INote from "@/app/Interfaces/INote";
import { ErrorUtils } from "@/app/Utils/ErrorUtils";
import { useState } from "react";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";

export default function DeleteNoteModal({ isOpen, toggleModal, note } : { isOpen: boolean, toggleModal(): void, note: INote })
{
  const [confirmation, setConfirmation] = useState("");
  const confirmationMsg = "deletar"
  const [errorConfirmation, setErrorConfirmation] = useState<string | null>(null)
  const { removeNote } = useNotes()
  const showToast = useToastMessage();

  const handleDeleteNote = async () => {
    setErrorConfirmation(null)
    if (confirmation != confirmationMsg)
    {
      setErrorConfirmation(`A confirmação deve ser idêntica a palavra ${confirmationMsg}`)
      return;
    }

    setConfirmation('')
    try {
      await axiosInstance.delete(`/notes/${note.id}`)
      toggleModal();
      showToast("Anotação deletada com sucesso", true);
      removeNote(note);
    }catch (error: any)
    {
      toggleModal();
      showToast(ErrorUtils.GetErrorMessageFromResponse(error), false)
    }
  }

  return (
    <Modal isOpen={isOpen} toggle={toggleModal}>
      <ModalHeader toggle={toggleModal}>Deletar Anotação - {note.title}</ModalHeader>
      <ModalBody>
        <p>Tem certeza que deseja deletar essa anotação?</p> 
        <div className="alert alert-danger" role="alert">
          Essa ação é irreversível
        </div>
        <div className="form-floating">
          <input type="text" id="floatingInputTitle" autoComplete="off" 
              className={`form-control ${errorConfirmation ? 'is-invalid' : ''}`}
            onChange={(ev) => setConfirmation(ev.target.value)}
            value={confirmation}/>
          <label htmlFor="floatingInputTitle">Confirme a ação digitando: '{confirmationMsg}'.</label>
          <div className="invalid-feedback">
            { errorConfirmation }
          </div>
        </div>
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={toggleModal}>
          Cancelar
        </Button>
        <Button color="primary" onClick={handleDeleteNote}>
          Confirmar
        </Button>
      </ModalFooter>
    </Modal>
  )
}