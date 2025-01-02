
export class ErrorUtils {
  static GetErrorMessageFromResponse(error: any): string {
    console.log(error.response.data.errors)
    return error?.response?.data?.errors?.[0] ?? "Não foi possível concluir a requisição";
  }
}