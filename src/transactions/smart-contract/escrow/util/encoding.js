export function base64ToUint8Array(base64) {
    return new Uint8Array(base64.split('').map((x) => x.charCodeAt(0)));
}
