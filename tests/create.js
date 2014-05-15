// Generated by CoffeeScript 1.6.3
var NJSMain, NJSReadline, NJSReadlineOptions, coffee, fs, main;

NJSReadline = require("readline");

fs = require('fs');

coffee = require("coffee-script");

NJSReadlineOptions = {
  input: process.stdin,
  output: process.stdout
};

NJSMain = (function() {
  function NJSMain() {
    var i, t;
    this.src = [];
    this.out = [];
    this.valid = true;
    i = 2;
    t = 0;
    while (i < process.argv.length) {
      if (process.argv[i] === "-s") {
        t = 1;
      } else if (process.argv[i] === "-o") {
        t = 2;
      } else if (t === 1) {
        this.src.push(process.argv[i]);
      } else if (t === 2) {
        this.out.push(process.argv[i]);
      } else {
        console.log("Unknown command!");
        this.valid = false;
        break;
      }
      i++;
    }
  }

  NJSMain.prototype._filesForPath = function(path) {
    var f, files, res, stats, _i, _len;
    console.log("files");
    stats = fs.statSync(path);
    if (stats.isDirectory()) {
      res = [];
      files = fs.readdirSync(path);
      console.log("expanding folder");
      for (_i = 0, _len = files.length; _i < _len; _i++) {
        f = files[_i];
        f = "" + path + "/" + f;
        if (fs.statSync(f).isFile()) {
          res.push(f);
        }
      }
      console.log("folder expanded");
      return res;
    } else {
      return [path];
    }
  };

  NJSMain.prototype._getInputFiles = function() {
    var comps, f, files, path, res, _i, _j, _len, _len1, _ref;
    res = {
      "pseuco": [],
      "coffee": []
    };
    _ref = this.src;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      path = _ref[_i];
      console.log("exploring path");
      files = this._filesForPath(path);
      console.log("exploring items");
      for (_j = 0, _len1 = files.length; _j < _len1; _j++) {
        f = files[_j];
        comps = f.split(".");
        if (comps[comps.length - 1] === "coffee") {
          res.coffee.push(f);
        } else if (comps[comps.length - 1] === "pseuco") {
          res.pseuco.push(f);
        }
      }
    }
    return res;
  };

  NJSMain.prototype.createTest = function() {
    var c, c2, comps, content, files, p, pseuco, pseucoString, spec, _i, _j, _len, _len1, _ref, _ref1, _results;
    if (!this.valid) {
      return;
    }
    files = this._getInputFiles();
    pseuco = {};
    console.log("collecting pseuco");
    _ref = files.pseuco;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      p = _ref[_i];
      content = fs.readFileSync(p, {
        "encoding": "utf8"
      });
      comps = p.split(".");
      comps = comps[comps.length - 2].split("/");
      pseuco[comps[comps.length - 1]] = {
        "code": content
      };
    }
    pseucoString = JSON.stringify(pseuco);
    console.log("collecting test code");
    _ref1 = files.coffee;
    _results = [];
    for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
      c = _ref1[_j];
      content = fs.readFileSync(c, {
        "encoding": "utf8"
      });
      content = coffee.compile(content);
      comps = c.split(".");
      comps[comps.length - 1] = "js";
      comps[comps.length - 2] += "Spec";
      c2 = comps.join(".");
      spec = "var testCases = " + pseucoString + "; \n\n\n" + content + "\n\n";
      _results.push(fs.writeFileSync(c2, spec));
    }
    return _results;
  };

  return NJSMain;

})();

main = new NJSMain();

main.createTest();