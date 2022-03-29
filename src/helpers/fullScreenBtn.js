export function showFullScrinBtn(data) {
    if (!data) return null;
    const type = data?.content_type?.split('/')[0];
    if (type === 'audio' || type === 'video') {
        return false;
    }
    return true;
}
