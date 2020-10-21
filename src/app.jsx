var inputFolder
var outputFolder

(function main() {
    const portrait = fourInOne(13, 19.5, 'four-in-one-portrait')
    const landscape = fourInOne(19.5, 13, 'four-in-one-landscape')

    inputFolder = Folder.selectDialog("Select a folder with images!")
    outputFolder = Folder.selectDialog("Select a folder for the output files!")
    const files = app.openDialog()

    if (!files) {
        alert('No files selected!')
    } else {
        const sortedFiles = sortFiles(files)

        portrait.processFiles(sortedFiles.portraitFiles)
        landscape.processFiles(sortedFiles.landscapeFiles)
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
        processFiles: function(docs) {
            for (var i = 0; i < docs.length; i++) {
                var doc = docs[i]

                app.activeDocument = doc

                doc.resizeImage(miniWidth, miniHeight, 300)

                doc.activeLayer.copy()

                app.activeDocument = base

                base.paste()

                doc.close(SaveOptions.DONOTSAVECHANGES)

                if (i % 4 === 0 || i === docs.length - 1) {
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
                    base.flatten()
                    base.bitsPerChannel = BitsPerChannelType.EIGHT
                    base.saveAs(new File(outputFolder + "/Output"+i+".jpg"), jpegOptions)
                    base.close(SaveOptions.DONOTSAVECHANGES)
                    base = app.documents.add(new UnitValue(width, "cm"), new UnitValue(height, "cm"), 300, name, NewDocumentMode.RGB, DocumentFill.TRANSPARENT)
                }
            }
        }
    }
}

function sortFiles(files) {
    const portraitFiles = []
    const landscapeFiles = []

    for (var i = 0; i < files.length; i++) {
        var file = open(files[i])
        if (file.height.value > file.width.value) {
            portraitFiles.push(file)
        } else {
            landscapeFiles.push(file)
        }
    }

    return {
        portraitFiles: portraitFiles,
        landscapeFiles: landscapeFiles
    }
}
