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
            attributes.children.forEach(x => element.appendChild(x instanceof Node ? x : create(x, {}, documentObject)));
        } else if (attrName.startsWith('on')) {
            element[attrName] = attributes[attrName];
        } else if (attrName.startsWith('style')) {
            if (typeof (attributes[attrName]) == "object") {
                for (const styleName in attributes[attrName]) {
                    element.style.setProperty(styleName, attributes[attrName][styleName])
                }
            } else if (attributes[attrName] !== false) {
                element.setAttribute(attrName, attributes[attrName]);
            }
        } else if (attrName === 'tagName') {
            //nothing
        } else {
            if (attributes[attrName] === true)
                element.setAttribute(attrName, attrName);
            else if (attributes[attrName] !== false)
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
            } else if (char === '[') {
                let attrName = parseText(['=', ']']);
                skipWhitespace();
                if (selector[position] == '=') {
                    position++;
                    skipWhitespace();
                    if (selector[position] != '"')
                        throw new Error("Syntax error in position " + position);
                    position++;
                    let value = parseAttributeValue();
                    skipWhitespace();
                    if (selector[position] != '"')
                        throw new Error("Syntax error in position " + position);
                    position++;
                    skipWhitespace();
                    if (selector[position] != ']')
                        throw new Error("Syntax error in position " + position);
                    position++;
                    ret[attrName] = value;
                } else if (selector[position] == ']') {
                    position++;
                    ret[attrName] = true;
                } else {
                    throw new Error("Syntax error in position " + position);
                }

            } else if (/\s/.test(char)) {
                while (position < selector.length && /\s/.test(selector[position])) {
                    position++;
                    skipWhitespace();
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

    function parseText(escape = ['.', '#', ',', '[']) {
        let text = '';
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

    function parseAttributeValue() {
        let text = '';
        while (position < selector.length) {
            let char = selector[position];
            if (char == '"') {
                return text
            } else {
                text += char;
                position++;
            }
        }
        return text;
    }

    function skipWhitespace() {
        while (position < selector.length) {
            let char = selector[position];
            if (!/\s/.test(char)) {
                return
            } else {
                position++;
            }
        }
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
function create(...params) {
    let definition = {};
    let documentObject = null;
    if (typeof (params[0]) == "string")
        definition = mergeObjects(definition, parseSelector(params.splice(0,1)[0]));

    if (typeof (params[0]) == "object" && !(params[0] instanceof Node))
        definition = mergeObjects(definition, params.splice(0,1)[0]);

    for (let param of params) {
        if (param instanceof Document) {
            documentObject = param;
        } else if (param instanceof Node) {
            documentObject = param.ownerDocument
            if (!definition.children)
                definition.children = [];
            definition.children.push(param);
        }
    }
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