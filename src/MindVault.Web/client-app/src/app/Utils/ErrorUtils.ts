
export class ErrorUtils {
  static GetErrorMessageFromResponse(error: any): string {
    return error.response?.errors[0] ?? "Não foi possível obter os dados";
  }
}