function createTable(tx) {
    const sql =
              'CREATE TABLE IF NOT EXISTS cats(' +
              'id INTEGER PRIMARY KEY,' +
              'name TEXT NOT NULL UNIQUE,' +
              'color TEXT NOT NULL,' +
              'likes TEXT NOT NULL UNIQUE' +
              ');'
    tx.executeSql(sql)
}

function addCat(tx, name, color, likes) {
    const sql =
              'INSERT OR IGNORE INTO cats(name, color, likes)' +
              'VALUES("%1", "%2", "%3");'.arg(name).arg(color).arg(likes)
    tx.executeSql(sql)
}

function readCats(tx, table_model){
    const sql =
              'SELECT * from cats;'
    var results = tx.executeSql(sql)

    for (var i = 0; i < results.rows.length; i++)
    {
        table_model.appendRow({
                                  id: results.rows.item(i).id,
                                  name: results.rows.item(i).name,
                                  color: results.rows.item(i).color,
                                  likes: results.rows.item(i).likes
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
        columnName = "name"
        break
    case(3):
        columnName = "color"
        break
    case(4):
        columnName = "likes"
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
              'UPDATE cats SET ' + columnName +' = \'' + to + '\' WHERE ' + columnName + ' = \'' + from + '\';'
    tx.executeSql(sql)

}

