"use client"

import { Accordion, AccordionBody, AccordionHeader, AccordionItem, Button } from "reactstrap";
import { useCategories } from "../contexts/categoriesContext";
import Layout from "../layouts/layout/layout";
import { useState } from "react";
import CategoryModalOpen from "../components/category-modal";
import ICategory from "../Interfaces/ICategory";
import DeleteCategoryModal from "../components/delete-category-modal";

export default function Categories()
{
  const { categories } = useCategories()
  const [open, setOpen] = useState<string | string[]>([]);
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [category, setCategory] = useState<ICategory | null>(null)

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<ICategory | null>(null)

  const toggleModal = () => setCategoryModalOpen(v => !v)

  const toggle = (id: string) => {
    setOpen(open === id ? [] : id);
  };

  const editCategory = (category: ICategory) => {
    setCategory(category);
    toggleModal();
  }

  const newCategory = () => {
    setCategory(null);
    toggleModal();
  }

  const deleteCategory = (category: ICategory) => {
    setCategoryToDelete(category)
    toggleDeleteModal();
  }

  const toggleDeleteModal = () => setDeleteModalOpen(v => !v);

  return (
    <Layout>
      <div className="d-flex flex-column gap-3 container-fluid">
        <div>
          <Button onClick={newCategory}>Criar Categoria</Button>
        </div>
        <Accordion open={open} toggle={toggle}>
          { categories.map(x => (
            <AccordionItem key={x.id}>
              <AccordionHeader targetId={x.id.toString()}>
                <strong style={{color: x.color}}>{ x.name }</strong>
              </AccordionHeader>
              <AccordionBody accordionId={x.id.toString()}>
                <div className="d-flex justify-content-between">
                  <div>{ x.description }</div>
                  <div className="d-flex gap-4">
                    <i onClick={() => editCategory(x)} className="bi-pencil"></i>
                    <i onClick={() => deleteCategory(x)} className="bi-trash"></i>
                  </div>
                </div>

              </AccordionBody>
            </AccordionItem>
          )) }
        </Accordion>
      </div>
      <CategoryModalOpen category={category} isEdit={category ? true : false} open={categoryModalOpen} toggle={toggleModal}></CategoryModalOpen>
      <DeleteCategoryModal category={categoryToDelete} isOpen={deleteModalOpen} toggleModal={toggleDeleteModal}></DeleteCategoryModal>
    </Layout>
  )
}