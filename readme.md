[![npm](https://badgen.net/npm/v/fast-creator)](https://www.npmjs.com/package/fast-creator)
[![downloads](https://badgen.net/npm/dt/fast-creator)](https://www.npmjs.com/package/fast-creator)
[![downloads](https://badgen.net/npm/license/fast-creator)](https://www.npmjs.com/package/fast-creator)
[![downloads](https://badgen.net/npm/dependents/fast-creator)](https://www.npmjs.com/package/fast-creator)

This library reduces amount of code needed to create dom (html) element
#samples

``` javascript
import {create} from 'fast-creator';

let a = create('div.sample p#fisrt');
let b = create({tagName:'div', className:'sample', children:['p#fisrt']));
let c = create('div', {data:{thisWillBeInDataset:'abcd'}});
```

#list of functions
### create(selector, attributes, document)
Generates and returns new element. You can define an element on two ways:
* selector string - css-like selector
* attributes object

In this example all three elemens will be identical:
```javascript
import {create} from 'fast-creator';

let a = create('p#first.red');
let b = create({tagname:'p',id:'first',className:'red'});
let c = create('p',{id:'first',className:'red'});
```