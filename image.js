'use strict';
const fs = require('fs');
const path = require('path');
const imageSize = require('image-size');
const sharp = require('sharp');

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
      sharp(this.getRandomImage(this.images[ratio]))
        .resize(x, y, { kernel: 'lanczos2'})
        .toBuffer()
        .then(buffer => {
          return resolve(buffer);
        })
        .catch(err => {
          if(err) console.log(err);
          return reject();
        });
    } else {
      return reject();
    }
  });
}

module.exports = ImageHelper;