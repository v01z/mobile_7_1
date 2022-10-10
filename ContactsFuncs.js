function createTable(tx) {
    const sql =
              'CREATE TABLE IF NOT EXISTS contacts (' +
              'id INTEGER PRIMARY KEY,' +
              'first_name TEXT NOT NULL,' +
              'last_name TEXT NOT NULL,' +
              'email TEXT NOT NULL UNIQUE,' +
              'phone TEXT NOT NULL UNIQUE' +
              ');'
    tx.executeSql(sql)
}

function addContact(tx, first_name, last_name, email, phone) {
    const sql =
              'INSERT OR IGNORE INTO contacts (first_name, last_name, email, phone)' +
              'VALUES("%1", "%2", "%3", "%4");'.arg(first_name).arg(last_name).arg(email).arg(phone)
    tx.executeSql(sql)
}

function readContacts(tx, table_model){
    const sql =
              'SELECT * from contacts;'
    var results = tx.executeSql(sql)

    for (var i = 0; i < results.rows.length; i++)
    {
        table_model.appendRow({
                                  id: results.rows.item(i).id,
                                  first_name: results.rows.item(i).first_name,
                                  last_name: results.rows.item(i).last_name,
                                  email: results.rows.item(i).email,
                                  phone: results.rows.item(i).phone
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
        columnName = "first_name"
        break
    case(3):
        columnName = "last_name"
        break
    case(4):
        columnName = "email"
        break
    case(5):
        columnName = "phone"
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
              'UPDATE contacts SET ' + columnName +' = \'' + to + '\' WHERE ' + columnName + ' = \'' + from + '\';'
    tx.executeSql(sql)

}

