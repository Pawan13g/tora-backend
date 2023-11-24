export type AppResponse<T> = {
    success: boolean,
    msg?: string
    data: T
}