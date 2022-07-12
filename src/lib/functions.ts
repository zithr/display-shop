export const getSearchParamFromUrl = (paramToGet: string): string|null => {
    // From current url, get a searchparams
    const url = new URL(location.href)
    return url.searchParams.get(paramToGet)
}