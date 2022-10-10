import QtQuick
import QtQuick.LocalStorage 2.15
import Qt.labs.qmlmodels 1.0
import QtQuick.Controls 2.15
import "ContactsFuncs.js" as Contacts
import "BooksFuncs.js" as Books
import "CatsFuncs.js" as Cats

Window {
    width: 640
    height: 480
    visible: true
    title: qsTr("Homework 7 part 1")
    property int cellHorizontalSpacing: 10
    property var db

    Rectangle{
        anchors.fill: parent
        ComboBox{
            id: comboBox
            anchors.top: parent.top
            anchors.topMargin: height / 4
            anchors.horizontalCenter: parent.horizontalCenter
            model: [qsTr("contacts"), qsTr("books"), qsTr("cats")]

            onActivated: {
                switch(currentIndex)
                {
                case(0):
                    table.model = contactsModel
                    break;
                case(1):
                    table.model = booksModel
                    break;
                case(2):
                    table.model = catsModel
                    break;
                default:
                    table.model = contactsModel
                }
            }
        }
        Rectangle{
            anchors.top: comboBox.bottom
            anchors.left: parent.left
            anchors.right: parent.right
            anchors.bottom: parent.bottom


            TableModel {
                id: contactsModel
                TableModelColumn { display: "id" }
                TableModelColumn { display: "first_name" }
                TableModelColumn { display: "last_name" }
                TableModelColumn { display: "email" }
                TableModelColumn { display: "phone" }
                rows: []
            }
            TableModel {
                id: booksModel
                TableModelColumn { display: "id" }
                TableModelColumn { display: "author" }
                TableModelColumn { display: "title" }
                rows: []
            }
            TableModel {
                id: catsModel
                TableModelColumn { display: "id" }
                TableModelColumn { display: "name" }
                TableModelColumn { display: "color" }
                TableModelColumn { display: "likes" }
                rows: []
            }

            TableView {
                id: table
                anchors.fill: parent
                anchors.margins: 10
                columnSpacing: 1
                rowSpacing: 1
                model: contactsModel

                delegate:
                    Rectangle {
                    implicitWidth: Math.max(100, /*left*/ cellHorizontalSpacing + innerText.width + /*right*/
                                            cellHorizontalSpacing)
                    implicitHeight: 50
                    border.width: 1

                    Text {
                        id: innerText
                        text: display
                        anchors.centerIn: parent
                        visible: true
                        Dialog{
                            id: editDialog
                            TextField{
                                id: dialogTextField
                                text: innerText.text
                                selectByMouse: true

                                Keys.onReturnPressed:{
                                    var from = innerText.text
                                    var to = dialogTextField.text
                                    try{
                                        db.transaction((tx) => {
                           switch (table.model)
                           {
                            case(contactsModel):
                            Contacts.updateTable(tx, contactsModel, from, to)
                            contactsModel.clear()
                            db.transaction((tx) => { Contacts.readContacts(tx, contactsModel) })
                            break

                            case(booksModel):
                            Books.updateTable(tx, booksModel, from, to)
                            booksModel.clear()
                            db.transaction((tx) => { Books.readBooks(tx, booksModel) })
                            break

                            case(catsModel):
                            Cats.updateTable(tx, catsModel, from, to)
                            catsModel.clear()
                            db.transaction((tx) => { Cats.readCats(tx, catsModel) })
                            break

                            default:
                            return
                           }
                           })
                                    }catch(err){
                                        console.log("Error updating table in database: " + err)
                                    }
                                    editDialog.accept()
                                }
                            }

                        }
                    }

                    MouseArea{
                        anchors.fill: parent
                        acceptedButtons: Qt.RightButton
                        onClicked: {
                            editDialog.open()
                        }

                    }

                }
            }

            Component.onCompleted:
            {
                db = LocalStorage.openDatabaseSync("DBHomework7_1", "1.0",
                                                   "Локальная база данных", 1000)

                try {

                    //----------- Contacts --------------
                    db.transaction(Contacts.createTable);

                    db.transaction((tx) => {
                                       Contacts.addContact(tx, "Makarov", "Иванi4", "ivanoviv2182@mail.ru",
                                                           "+7(988)37333112")
                                       Contacts.addContact(tx, "Заварнов", "Владимир", "zavlad@mail.ru",
                                                           "+7(977)98373331")
                                       Contacts.addContact(tx, "Говорун", "Максим", "landlord2000@mail.ru",
                                                           "+7(977)3311111")
                                   })

                    db.transaction((tx) => { Contacts.readContacts(tx, contactsModel) })

                    //----------- Books --------------
                    db.transaction(Books.createTable)

                    db.transaction((tx) => {
                                       Books.addBook(tx, "Karl Ernst Georges", "Latein-Deutsch Wörterbuch")
                                       Books.addBook(tx,"Umberto Pelizzari",  "Manual of freediving")
                                       Books.addBook(tx,"Jim Mock", "The FreeBSD Handbook")
                                       Books.addBook(tx,"Max Schlee",  "Qt 5.10 Professional programming on C++")
                                       Books.addBook(tx, "George Buhler", "The thrid book of sanskrit")
                                   })

                    db.transaction((tx) => { Books.readBooks(tx, booksModel) })

                    //----------- Cats --------------
                    db.transaction(Cats.createTable)

                    db.transaction((tx) => {
                                       Cats.addCat(tx,"Баксик", "серый", "очень добрый")
                                       Cats.addCat(tx, "Честер", "чёрный", "любит кусаться")
                                       Cats.addCat(tx,"Рыська", "серая в полоску", "охотница на мышей")
                                   })

                    db.transaction((tx) => { Cats.readCats(tx, catsModel) })


                } catch(err){
                    console.log("Error creating or updating table in database: " + err)
                }
            }
        }
    }

}
