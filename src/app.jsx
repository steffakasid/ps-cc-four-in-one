var inputFolder
var outputFolder

const PORTRAIT_NAME = 'portrait';
const LANDSCAPE_NAME = 'landscape';

(function main() {
    const width = prompt("Output image width", 19.5)
    const height = prompt("Output image height", 13)

    const portrait = fourInOne(height, width, PORTRAIT_NAME)
    const landscape = fourInOne(width, height, LANDSCAPE_NAME)

    inputFolder = Folder.selectDialog("Select a folder with images!")
    outputFolder = Folder.selectDialog("Select a folder for the output files!")
    const files = inputFolder.getFiles()

    if (!files) {
        alert('No files selected!')
    } else {
        const sortedFiles = sortFiles(files)

        portrait.processFiles(sortedFiles.portraitFiles)
        landscape.processFiles(sortedFiles.landscapeFiles)
        alert("Processing of images finished!")
    }
})()

function fourInOne(width, height, name) {
    var miniWidth = width / 2 - 0.5
    var miniHeight = height / 2 - 0.5
    var base = app.documents.add(new UnitValue(width, "cm"), new UnitValue(height, "cm"), 300, name, NewDocumentMode.RGB, DocumentFill.TRANSPARENT)
    return {
        width: width,
        height: height,
        miniWidth: miniWidth,
        miniHeight: miniHeight,
        base: base,
        name: name,
        processFiles: function(files) {
            for (var i = 0; i < files.length; i++) {
                var doc = open(files[i])

                app.activeDocument = doc

                doc.resizeImage(miniWidth, miniHeight, 300)

                doc.activeLayer.copy()

                app.activeDocument = base

                base.paste()

                doc.close(SaveOptions.DONOTSAVECHANGES)

                if ((i !== 0 && i % 3 === 0) || i === files.length - 1) {
                    if (base.artLayers.length >= 1) {
                        base.artLayers[0].translate(miniWidth * -1 / 2 - 0.5, miniHeight * -1 / 2 - 0.5)
                    }
                    if (base.artLayers.length >= 2) {
                        base.artLayers[1].translate(miniWidth * -1 / 2 - 0.5, miniHeight / 2 + 0.5)
                    }
                    if (base.artLayers.length >= 3) {
                        base.artLayers[2].translate(miniWidth / 2 + 0.5, miniHeight * -1 / 2 - 0.5)
                    }
                    if (base.artLayers.length >= 4) {
                        base.artLayers[3].translate(miniWidth / 2 + 0.5, miniHeight / 2 + 0.5)
                    }

                    var jpegOptions = new JPEGSaveOptions()
                    jpegOptions.quality = 10

                    base.info.author = 'ps-cc-four-in-one-script'
                    base.info.creationDate = new Date().toString()
                    base.flatten()
                    if(name === PORTRAIT_NAME) {
                      base.rotateCanvas(90)
                    }
                    base.bitsPerChannel = BitsPerChannelType.EIGHT
                    base.saveAs(new File(outputFolder + "/"+name+i+".jpg"), jpegOptions)
                    base.close(SaveOptions.DONOTSAVECHANGES)

                    base = app.documents.add(new UnitValue(width, "cm"), new UnitValue(height, "cm"), 300, name, NewDocumentMode.RGB, DocumentFill.TRANSPARENT)
                }
            }
            base.close(SaveOptions.DONOTSAVECHANGES)
        }
    }
}

function sortFiles(files) {
    const portraitFiles = []
    const landscapeFiles = []

    for (var i = 0; i < files.length; i++) {
        var doc = open(files[i])
        if (doc.height.value > doc.width.value) {
            portraitFiles.push(files[i])
        } else {
            landscapeFiles.push(files[i])
        }
        doc.close()
    }

    return {
        portraitFiles: portraitFiles,
        landscapeFiles: landscapeFiles
    }
}
