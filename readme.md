This library reduces amount of code needed to create dom (html) element
#samples

``` javascript
import {create} from 'fast-creator';

let a = create('div.sample p#fisrt');
let b = create({tagName:'div', className:'sample', children:['p#fisrt']));
let c = create('div', {data:{thisWillBeInDataset:'abcd'}});
```