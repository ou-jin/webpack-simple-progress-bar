# webpack-simple-progress-bar
it is a simple webpcak progress bar plugin
### webpack-simple-progress-bar

A simple webpack progress bar plugin

#### Effect
![](http://106.55.160.96/file/img/webpack-bar.gif)

#### Instructions


`npm i webpack-simple-progress-bar`


```javascript
var bar = require('webpack-simple-progress-bar');
...
plugins: [
  new bar()
]
```

###### Options

- `color` the color of the progress bar
- `length` the length of the progress bar


 ```javascript
  new bar(
    {
        color:' #65f3ba',
        length:30
    }
  )
```
 

 