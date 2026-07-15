const blackList = new Set<string>();

export const agregarToken = (token: string) => {
    blackList.add(token);
};

export const esToken = (token: string) => {
    return blackList.has(token);
};
