
export const getTokenHeader = (accessToken?: string): object | { Authorization: string } => {
    if (!accessToken) {
        return {};
    }
    return {
        'Authorization': `Bearer ${accessToken}`
    }
}