function createTable(tx) {
    const sql =
              'CREATE TABLE IF NOT EXISTS books(' +
              'id INTEGER PRIMARY KEY,' +
              'author TEXT NOT NULL UNIQUE,' +
              'title TEXT NOT NULL UNIQUE' +
              ');'
    tx.executeSql(sql)
}

function addBook(tx, author, title) {
    const sql =
              'INSERT OR IGNORE INTO books(author, title)' +
              'VALUES("%1", "%2");'.arg(author).arg(title)
    tx.executeSql(sql)
}

function readBooks(tx, table_model){
    const sql =
              'SELECT * from books;'
    var results = tx.executeSql(sql)

    for (var i = 0; i < results.rows.length; i++)
    {
        table_model.appendRow({
                                  id: results.rows.item(i).id,
                                  author: results.rows.item(i).author,
                                  title: results.rows.item(i).title,
                              })
    }
}

function getColumnNumber(model, input_value)
{
    for (var i = 0; i < model.rowCount; i++)
    {
        for (var j = 0; j < model.columnCount; j++)
        {
            var indx = model.index(i,j)
            var existing_value = model.data(indx, "display")

            if (existing_value === input_value)
            {
                return model.headerData(j, Qt.Horizontal, "display")
            }
        }
    }

    return 0
}

function getColumnNameByNumber(number)
{
    var columnName = "null"

    if (number == 0)
    {
        return columnName
    }

    switch(number){
    case(2):
        columnName = "author"
        break
    case(3):
        columnName = "title"
        break
    default:
        columnName = "null"
    }

    return columnName
}

function updateTable(tx, model, from, to){
    var columnName = getColumnNameByNumber(getColumnNumber(model, from))
    if (columnName == "null")
    {
        return
    }

    const sql =
              'UPDATE books SET ' + columnName +' = \'' + to + '\' WHERE ' + columnName + ' = \'' + from + '\';'
    tx.executeSql(sql)

}

