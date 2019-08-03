import { EventEmitter } from 'events';
import * as fs from 'fs';
import * as NodeID3 from 'node-id3';
import { join } from 'path';
// Папка, куда можно закидывать скачанные файлы (треки/музыку)
const inputDir = join(__dirname, 'inputDir');
// Папка, в которую будут попадать файлы с исправленными ID3 tags
const outputDir = join(__dirname, 'outputDir');
console.log('Put your files in this folder:', inputDir, '\nOutput files with edited ID3 tags will be in the following folder:', outputDir);

export default class Watcher extends EventEmitter {
  constructor(private readonly watchDir: string, private readonly processedDir: string) {
    super();
  }
  watch() {
    fs.readdir(this.watchDir, (err, files) => {
      if (err) { throw err; }
      for (const file in files) {
        if (files.hasOwnProperty(file)) {
          this.emit('process', files[file]);
        }
      }
    });
  }

  start() {
    fs.readdir(this.watchDir, (err, files) => {
      if (err) { throw err; }
      if (files.length) {
        console.log('Some files were found in the observed directory... Processing...');
        return this.watch();
      }

    });
    fs.watchFile(this.watchDir, () => {
      this.watch();
    });
  }
}

const watcher = new Watcher(inputDir, outputDir);

watcher.on('process', (file) => {
  const watchFile = join(inputDir, file);
  console.log(`Processing file: ${watchFile}`);
  if (!/ - /.test(file)) {
    return console.log(`The file's name is not in a specified format. Name of the file should be in the following format: "AuthorName - TrackName"`);
  }
  const splitName = file.split(' - ');
  const authorName = splitName[0];
  const trackName = splitName[1].replace(/\.[^/.]+$/, '');
  const tags = NodeID3.read(watchFile);
  tags.artist = authorName;
  tags.title = trackName;
  const success = NodeID3.update(tags, watchFile);
  if (success) {
    const newTags = NodeID3.read(watchFile);
    console.log('Output file\'s ID3 tags will be the following:', newTags);
  }
  const processedFile = join(outputDir, file);
  fs.rename(watchFile, processedFile, err => {
    if (err) { throw err; }
  });
});

watcher.start();
