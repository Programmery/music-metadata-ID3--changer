"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var events_1 = require("events");
var fs = require("fs");
var NodeID3 = require("node-id3");
var path_1 = require("path");
// Папка, куда можно закидывать скачанные файлы (треки/музыку)
var inputDir = path_1.join(__dirname, 'inputDir');
// Папка, в которую будут попадать файлы с исправленными ID3 tags
var outputDir = path_1.join(__dirname, 'outputDir');
console.log('Put your files in this folder:', inputDir, '\nOutput files with edited ID3 tags will be in the following folder:', outputDir);
var Watcher = /** @class */ (function (_super) {
    __extends(Watcher, _super);
    function Watcher(watchDir, processedDir) {
        var _this = _super.call(this) || this;
        _this.watchDir = watchDir;
        _this.processedDir = processedDir;
        return _this;
    }
    Watcher.prototype.watch = function () {
        var _this = this;
        fs.readdir(this.watchDir, function (err, files) {
            if (err) {
                throw err;
            }
            for (var file in files) {
                if (files.hasOwnProperty(file)) {
                    _this.emit('process', files[file]);
                }
            }
        });
    };
    Watcher.prototype.start = function () {
        var _this = this;
        fs.readdir(this.watchDir, function (err, files) {
            if (err) {
                throw err;
            }
            if (files.length) {
                console.log('Some files were found in the observed directory... Processing...');
                return _this.watch();
            }
        });
        fs.watchFile(this.watchDir, function () {
            _this.watch();
        });
    };
    return Watcher;
}(events_1.EventEmitter));
exports["default"] = Watcher;
var watcher = new Watcher(inputDir, outputDir);
watcher.on('process', function (file) {
    var watchFile = path_1.join(inputDir, file);
    console.log("Processing file: " + watchFile);
    if (!/ - /.test(file)) {
        return console.log("The file's name is not in a specified format. Name of the file should be in the following format: \"AuthorName - TrackName\"");
    }
    var splitName = file.split(' - ');
    var authorName = splitName[0];
    var trackName = splitName[1].replace(/\.[^/.]+$/, '');
    var tags = NodeID3.read(watchFile);
    tags.artist = authorName;
    tags.title = trackName;
    var success = NodeID3.update(tags, watchFile);
    if (success) {
        var newTags = NodeID3.read(watchFile);
        console.log('Output file\'s ID3 tags will be the following:', newTags);
    }
    var processedFile = path_1.join(outputDir, file);
    fs.rename(watchFile, processedFile, function (err) {
        if (err) {
            throw err;
        }
    });
});
watcher.start();
