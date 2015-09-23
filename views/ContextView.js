function ContextView (context) {
  this._context = context;
}

ContextView.prototype.add = function (context) {
  if (this._context['@context']) {
    for (var key in context) {
      this._context[key] = context[key];
    }
  }
}

ContextView.prototype.view = function () {
  return JSON.stringify(this._context);
};

module.exports = ContextView;
