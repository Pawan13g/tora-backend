
export function response(msg?: string, data: any = null, success: boolean = true) {
    return {
        success,
        msg,
        data
    }
}