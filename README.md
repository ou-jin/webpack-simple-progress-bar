# webpack-simple-progress-bar
it is a simple webpcak progress plugin
### webpack-simple-progress-bar

A simple webpack progress bar plugin

#### Effect
![](http://106.55.160.96/file/img/webpackBar.gif)

#### Instructions


`npm i webpack-simple-progress-bar`



    
    const bar = require('webpack-simple-progress-bar');
    
    plugins: [
        new bar(),
    ]

#### params

```
new bar(
 {
  color:' #65f3ba',
  length:30
 }
)
```