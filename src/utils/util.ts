
export function isMacOS() {
    if (typeof navigator !== 'undefined' && navigator.userAgent) {
        return /Macintosh|Mac OS/.test(navigator.userAgent);
    }
    return process.platform === 'darwin';
}

