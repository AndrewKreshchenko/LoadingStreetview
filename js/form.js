/* Author: Andrew Kreshchenko
 * Code is under development
 * 
 * For developers:
 * @see - notice that is worth to understand or to learn
 * @note - recommend to consider something or do something in future
 * @params - list of parameters of a method for developer
 * 
 * 
 * Class with various methods for manipulation with data entered in form
*/

class Form {
    constructor(form) {
        this.form = form
    }

    getFormData() {
        const data = new FormData(this.form);
        // let arr = Array.from(data,
        //     e => e.map(encodeURIComponent).join('=')
        // ).join('&')

        return Array.from(data)
    }

    includeItems(arr, includable, pos) {
        var res = [];
        for (var i = 0; i < includable.length; i++) {
            for (var x = 0; x < arr.length; x++) {
                if (arr[x][pos] == includable[i]) {
                    res.push(includable[i]);
                    break
                }
            }
        }
        return res
    }

    findFormValue(arr, key) {
        for (var i = 0; i < arr.length; i++) {
            console.log(arr[i][0]);
            if (arr[i][0] == key) {
                return arr[i][1];
            }
        }
    }

    // @params:
    // block - parent element
    // attr - DOM attribute of elements ('input') inside of parent element `block`
    // regex - Regular expression to convert attributes values of their relative `attr` to create the keys of `res` object
    // NOTE: all 'input' elements should have 'name' attribute
    collectDataGroup(block, attr, regex) {
        var res = {};
        block.querySelectorAll(`input[${attr}]`).forEach(el => {
            let key_str = el.getAttribute('name').replace(regex,'');
            if (key_str)
                res[key_str] = el.value;
        })

        return res;
    }
}