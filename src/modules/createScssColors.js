import { createElement } from "../modules/utils/createElement";

export const createScssColors = (colors) => {
    let style = createElement('style')

    colors.forEach(color => {
        style.textContent += `
.color_${color.title}:after {
    content: '';
    display: inline-block;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background-color: ${color.code};
    ${color.title === 'white' ? 'border: 0.4px solid #8A8A8A;' : ''}
}
`
    })

    document.head.append(style);
}