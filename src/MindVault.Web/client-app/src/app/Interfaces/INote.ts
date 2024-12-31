import ICategory from "./ICategory";

export default interface INote {
  id: string,
  title: string,
  content: string,
  userId: string,
  createdAt: Date,
  updatedAt: Date,
  categories: ICategory[]
}