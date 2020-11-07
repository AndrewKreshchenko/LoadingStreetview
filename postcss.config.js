const fs = require('fs');

// It is handy to not have those transformations while we developing
// if(process.env.NODE_ENV === 'production') {
//     module.exports = {
//         plugins: [
//             require('autoprefixer'),
//             require('cssnano'),
//             // More postCSS modules here if needed
//         ]
//     }
// }

setStyles();

function setStyles() {
    var prepare = fs.readFileSync(__dirname+'/src/data_prepare.config.json');
    var user_env = JSON.parse(prepare);
    console.log(user_env);
    
    var style = '';
    user_env['body-bg'].forEach(el => {
        let item = Object.keys(el)[0];
        console.log(item);
        style += `.bg-${item}-daylight{background:url('../img/${el[item].daylight}')}.bg-${item}-night{background:url('../img/${el[item].night}')}`
    });

    fs.writeFile(__dirname+'/public/css/user_env.css', style, (err) => {
        if (err) throw err;
        console.log('The file has been saved!');
    });
    return user_env;
};