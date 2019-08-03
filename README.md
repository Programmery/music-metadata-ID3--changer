# music-metadata-ID3--changer
Когда скачиваешь музыку с помощью приложения, файлы часто скачиваются в формате "Автор - Название трека.mp3" (расширение может быть иным).

При этом в  ID3 tags могут быть некорректными. 
(ID3 metadata - это данные, по которым плеер (например, iTunes) определяет название трека и имя автора/исполнителя).

Настоящий скрипт использует название файла в формате "Автор - Название трека" для создания верных ID3 tags. 

Script использует node-id3 module по ссылке: https://www.npmjs.com/package/node-id3 

-------------

When you download music using 'weird applications' you may get files in a following format: "Author - TrackTitle.mp3" (extension may differ).

But the track ID3 metadata may be weird or wrong. (ID3 metadata/tags are used by audio players (ex. iTunes) to indentify the title of the track and the author/singer).

This script will use the name of the file (if the name format is "Author - TrackTitle") to create the correct ID3 tags for the author and title ID3 tag fields.

Just drop the files in the inputDir and you will get the files with correct ID3 tags in the outputDir.

Script uses "node-id3" module. The module can be found here: https://www.npmjs.com/package/node-id3

Have a nice day ;)
