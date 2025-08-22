
export const getTokenHeader = (accessToken?: string): object | { Autorization: string } => {
    if (!accessToken) {
        return {};
    }
    return {
        'Authorization': `Bearer ${accessToken}`
    }
}