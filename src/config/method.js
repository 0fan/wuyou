String.prototype.removelastSlash = function () {
  return this.replace(/(\/)+$/g, '')
}