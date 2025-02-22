export const getImage = (path) => {
    return new URL(`../assets/images/icons/${path}.png`, import.meta.url).href;
};

export const dayTokor = [
    '일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일',
]