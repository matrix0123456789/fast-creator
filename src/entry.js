/**
 *
 * @param attributes
 * @param documentObject
 * @returns {HTMLElement}
 */
function createFromDefinition(attributes = {}, documentObject = null) {
    if (!documentObject) documentObject = document;
    let element = documentObject.createElement(attributes.tagName || 'div');
    repairClasses(attributes);
    for (let attrName in attributes) {
        if (attrName === 'className') {
            element.className = attributes[attrName];
        } else if (attrName === 'classList') {
            for (let x of attributes.classList)
                element.classList.add(x);
        } else if (attrName === 'text') {
            element.textContent = attributes.text;
        } else if (attrName === 'html') {
            element.innerHTML = attributes.html;
        } else if (attrName === 'data') {
            Object.assign(element.dataset, attributes.data);
        } else if (attrName === 'children') {
            attributes.children.forEach(x => element.appendChild(create(x, {}, documentObject)));
        } else if (attrName === 'tagName') {
            //nothing
        } else {
            element.setAttribute(attrName, attributes[attrName]);
        }
    }
    return element;
}

function repairClasses(obj) {
    if (obj.className) {
        if (!obj.classList) obj.classList = [];
        obj.classList = [...obj.classList, ...obj.className.split(' ')];
        delete obj.className;
    }
}

/**
 *
 * @param {string} selector
 * $returns {object}
 */
function parseSelector(selector) {
    selector = (selector + "").trim();
    let position = 0;

    function parseElement() {
        let ret = {};
        let canBeTagname = true;
        while (position < selector.length) {
            let char = selector[position];
            position++;
            if (char === '#') {
                ret.id = parseText();
            } else if (char === '.') {
                if (!ret.classList) ret.classList = [];
                ret.classList.push(parseText());
            } else if (/\s/.test(char)) {
                while (position < selector.length && /\s/.test(selector[position])) {
                    position++;
                }
                ret.children = [parseElement()];

            } else if (canBeTagname) {
                ret.tagName = char + parseText();
            } else {
                throw new Error("Syntax error in position " + position);
            }
            canBeTagname = false;
        }
        return ret;

    }

    function parseText() {
        let text = '';
        const escape = ['.', '#', ','];
        while (position < selector.length) {
            let char = selector[position];
            if (/\s/.test(char) || escape.includes(char)) {
                return text
            } else {
                text += char;
                position++;
            }
        }
        return text;
    }

    if (selector === "") return {};
    else
        return parseElement();
}

/**
 *
 * @param {string} selector
 * @param {object} attributes
 * @param documentObject
 * @returns {HTMLElement}
 */
function create(selector = "", attributes = {}, documentObject = null) {
    let definition;
    if (typeof (selector) == "string")
        definition = mergeObjects(parseSelector(selector), attributes);
    else
        definition = selector;

    if (attributes instanceof Document)
        documentObject = attributes;
    return createFromDefinition(definition, documentObject);
}

function mergeObjects(a, b) {
    repairClasses(a);
    repairClasses(b);
    let ret = {...a, ...b};
    if (a.data && b.data) {
        ret.data = {...a.data, ...b.data}
    }
    if (a.children && b.children) {
        ret.children = [...a.children, ...b.children]
    }
    if (a.classList && b.classList) {
        ret.classList = [...a.classList, ...b.classList]
    }
    return ret;
}

module.exports = {createFromDefinition, parseSelector, create, mergeObjects, default: create};