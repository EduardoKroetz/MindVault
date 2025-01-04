export default interface IResponse<T> {
  data: T,
  status: number,
  success: boolean,
  errors: string[]
}