/* Author: Andrew Kreshchenko
 * 2018 - 2020
 * Code is under development
 * 
 * For developers:
 * @see - notice that is worth to understand or to learn
 * @note - recommend to consider something or do something in future
 * 
 * 
 * General handlers for web app
*/


// Methods
const isVisible = elem => !!elem && !!(elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length)

function onClickOutside(el) {
    const outsideClickListener = event => {
        if (isVisible(el) && !el.contains(event.target)) { // ev.target.closest(selector) === null
            el.style.display = 'none';
            removeClickListener();
            if (document.body.classList.contains('hide-inner-content'))
                document.body.classList.remove('hide-inner-content')
        }
    }

    const removeClickListener = () => {
        document.removeEventListener('click', outsideClickListener)
    }

    document.addEventListener('click', outsideClickListener)
}

// Show click-outside-sensitive elements
function showCOSElements(elem, hide_fl) {
    elem.style.display = 'block'
    onClickOutside(elem)
    if (hide_fl)
        document.body.classList.add('hide-inner-content')
}

// Attach handlers to events after content loaded
document.addEventListener('DOMContentLoaded', () => {
    var langPage = document.getElementsByTagName('html')[0].lang;

    // Full image view
    document.querySelector('#close-p img').addEventListener('click', function() {
        document.getElementById('prompts').style.display = 'none';
    });
    document.getElementById('show-view-btn').addEventListener('click', function(e) {
        document.getElementById('bgimg').style.zIndex = '11';
        document.getElementById('fullimg').style.display = 'block'
        e.preventDefault();
    });
    document.getElementById('view-close').addEventListener('click', function() {
        document.getElementById('fullimg').style.display = 'none';
        document.getElementById('bgimg').style.zIndex = '-1';
    });
    document.getElementById('view-download').addEventListener('click', function() {
        var src = document.getElementById('bgimg').getAttribute('src');
        this.setAttribute('href', src);
        this.setAttribute('download', src);
        document.getElementById('alert-b').style.display = 'block';
    });

    document.querySelectorAll('[data-attach]').forEach(function(elem) {
        elem.addEventListener('click', function(e) { // @see not arrow function because 'this' needed
            e.stopPropagation();
            let elem_attach = document.querySelector(this.dataset.attach);
            elem_attach.offsetParent === null ? showCOSElements(elem_attach) : hideOnClickOutside(elem_attach)
        })
    })
    
    // if (document.getElementById('form-container') != null) {
    //     let geosearch = new Geosearch();
    // }
})