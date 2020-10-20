
function fourInOne(width, height, name) {
  return {
    width: width,
    height: height,
    miniWidth: width / 2 - 0.5,
    miniheight: height / 2 - 0.5,
    name: name
  }
}



const portrait = fourInOne(13, 19.5, 'four-in-one-portrait')
const landscape = fourInOne(19.5, 13, 'four-in-one-landscape')

const landscapeBaseDoc = app.documents.add(new UnitValue(landscape.height, "cm"), new UnitValue(landscape.width, "cm"), 300, landscape.name, NewDocumentMode.RGB, DocumentFill.TRANSPARENT)
const portraitBaseDoc = app.documents.add(new UnitValue(portrait.height, "cm"), new UnitValue(portrait.height, "cm"), 300, portrait.name, NewDocumentMode.RGB, DocumentFill.TRANSPARENT)

function sortFiles(files) {
    const portraitFiles = []
    const landscapeFiles = []

    for (var i = 0; i < files.length; i++) {
        const file = files[i]
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

const files = app.openDialog()

const fileOne = open(files[0])

const sortedFiles = sortFiles(files)

if (fileOne.height.value > fileOne.width.value) {
    fileOne.resizeImage(6, 9, 300)
} else {
    fileOne.resizeImage(9, 6, 300)
}

fileOne.activeLayer.copy()

app.activeDocument = portraitBase

portraitBase.paste()
