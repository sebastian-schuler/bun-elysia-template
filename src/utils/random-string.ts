const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
const charsLength = chars.length;

export function randomString(length = 6) {
    const randomBytes = crypto.getRandomValues(new Uint8Array(length));
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars[randomBytes[i] % charsLength];
    }
    return result;
}
