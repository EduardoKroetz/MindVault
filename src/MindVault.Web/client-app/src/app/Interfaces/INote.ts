import ICategory from "./ICategory";

export default interface INote {
  id: number,
  title: string,
  content: string,
  userId: string,
  createdAt: Date,
  updatedAt: Date,
  categories: ICategory[]
}