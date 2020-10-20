const files = app.openDialog()

const miniPictureHeight = 6
const miniPictureWidth = 9

const portraitBase = app.documents.add(new UnitValue(miniPictureWidth*2+1, "cm"), new UnitValue(miniPictureHeight*2+1, "cm"), 300, "ps-cc-four-in-one-portrait", NewDocumentMode.RGB, DocumentFill.TRANSPARENT)
const landscapeBase = app.documents.add(new UnitValue(miniPictureHeight*2+1, "cm"), new UnitValue(miniPictureWidth*2+1, "cm"), 300, "ps-cc-four-in-one-landscape", NewDocumentMode.RGB, DocumentFill.TRANSPARENT)

const fileOne = open(files[0])

const {portraitFiles, landscapeFiles} = {... sortFiles(files)}

if(fileOne.height.value > fileOne.width.value) {
    fileOne.resizeImage(6, 9, 300)
} else {
    fileOne.resizeImage(9, 6, 300)
}

fileOne.activeLayer.copy()

app.activeDocument = portraitBase

portraitBase.paste()

sortFiles = (files) => {
    const portraitFiles = []
    const landscapeFiles = []
    files.forEach(file => {
        if(fileOne.height.value > fileOne.width.value) {
            portraitFiles.push(file)
        } else {
            landscapeFiles.push(file)
        }
    })
    return {portraitFiles,landscapeFiles}
}
