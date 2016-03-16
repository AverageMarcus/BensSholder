'use strict';
const fs = require('fs');
const path = require('path');
const imageSize = require('image-size');
const lwip = require('lwip');


let ImageHelper = function() {
  this.images = {};

  fs.readdir('./images', (err, list) => {
    if(err) throw err;
    list.forEach((file) => {
      file = path.resolve('./images', file);
      imageSize(file, (err, dimensions) => {
        if(err) return console.log(file, err);
        let ratio = this.getRatio(dimensions.width, dimensions.height);
        if(!this.images[ratio]) this.images[ratio] = [];
        this.images[ratio].push(file);
      });
    });
  });

}

ImageHelper.prototype.getRatio = (x, y) => {
  return `1:${ (1 * (y / x)).toFixed(1) }`;
}

ImageHelper.prototype.getRandomImage = (arr) => {
  return arr[Math.floor(Math.random()*arr.length)];
}

ImageHelper.prototype.getImage = function(x, y) {
  x = parseInt(x, 10);
  y = parseInt(y, 10);
  return new Promise((resolve, reject) => {
    let ratio = this.getRatio(x, y);
    if(this.images[ratio]) {
      lwip.open(this.getRandomImage(this.images[ratio]), (err, image) => {
        if(err) console.log(err);
        image.resize(x, y, 'lanczos', function(err, image) {
          if(err) console.log(err);
          image.toBuffer('png', function(err, buffer) {
            if(err) console.log(err);
            return resolve(buffer);
          });
        });
      });
    } else {
      return reject();
    }
  });
}

module.exports = ImageHelper;