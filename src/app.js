const files = app.openDialog()

const myDoc = app.documents.add(new UnitValue(19.5, "cm"), new UnitValue(13, "cm"), 300, "ps-cc-four-in-one", NewDocumentMode.RGB, DocumentFill.TRANSPARENT)

const fileOne = open(files[0])

fileOne.activeLayer.copy()

app.activeDocument = myDoc

myDoc.paste()