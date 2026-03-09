import { createElement } from "../utils/createElement"
import { countController } from "../controllers/countController"


export const renderCount = (count, className, returnCount = () => {}) => {
    const control = createElement ('div', 
        {
            className: `${className} count`
        }
    )
//card__count
    const minus = createElement('button',
        {
            className: 'count__item count__minus',
            type: 'button',
            textContent: '-'
        },
        {
            parent: control
        }
    )

    const number = createElement('span',
        {
            className: 'count__item count__number',
            textContent: count
        },
        {
            parent: control
        }
    )

    const plus = createElement('button',
        {
            className: 'count__item count__plus',
            type: 'button',
            textContent: '+'
        },
        {
            parent: control
        }
    )

    const input = createElement('input',
        {
            type: 'hidden',
            value: count,
            name: 'count'
        },
        {
            parent: control
        }
    )


    countController(minus, number, plus, input, returnCount)

    return control
}

/*
<span class="count__item count__number">1</span>
              <button class="count__item count__plus">+</button>
              <input type="hidden" name="count" value="1">
            </div>
*/