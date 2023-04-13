import SQLite from 'react-native-sqlite-storage'

export class SqliteService {

    constructor() {
        this.sqlite = SQLite;
        this.sqlite.DEBUG(false);
        this.sqlite.enablePromise(true);
        this.sqlite.openDatabase({
            name: "MStockDB",
            location: "default"
        }).then((db) => {
            this.dbInstance = db;
        })
    }

    createTable(tableName, columns) {
        return new Promise((resolve, reject) => {
            let query = 'CREATE TABLE IF NOT EXISTS ' + tableName + ' (';
            for (let i = 0; i < columns.length; i++) {
                if (i === columns.length - 1) {
                    query += columns[i].name + ' ' + columns[i].dataType + ' ' + ((columns[i].isNotNull) ? "NOT NULL " : "") + (columns[i].options ? columns[i].options : '') + ')'
                } else {
                    query += columns[i].name + ' ' + columns[i].dataType + ' ' + ((columns[i].isNotNull) ? "NOT NULL " : "") + (columns[i].options ? columns[i].options : '') + ','
                }
            }
            this.executeSql(query).then((value) => resolve(value)).catch((error) => reject(error));
        });
    }

    async select(tableName, columns, where, orderBy = null) {
        return new Promise((resolve, reject) => {

            let query = "SELECT " + ((!columns || columns === "") ? "*" : columns) + " FROM " + tableName;
            if (where) {
                query = query + " WHERE " + where;
            }
            if (orderBy) {
                query = query + " ORDER BY " + orderBy;
            }

            this.executeSql(query).then(([values]) => {
                const array = [];
                for (let index = 0; index < values.rows.length; index++) {
                    const element = values.rows.item(index);
                    array.push(element);
                }
                resolve(array);
            }).catch((err) => {
                reject(false);
            })

        });
    }

    insert(tableName, rows: Array<string>, values: Array<any>, valueCount = 1) {
        return new Promise((resolve, reject) => {
            let sqlValues = '';
            for (let i = 0; i < valueCount; i++) {
                sqlValues += '(';
                rows.forEach((row, rowIndex) => {
                    sqlValues += '?' + ((rowIndex === rows.length - 1) ? ((i === valueCount - 1) ? ')' : '),') : ', ');
                });
            }
            let query = "INSERT INTO " + tableName + " (" + rows.join() + ") VALUES " + sqlValues;
            this.executeSql(query, values).then((value) => resolve(value)).catch((error) => reject(error));
        });
    }

    update(tableName, keys, values, where: Object) {
        return new Promise((resolve, reject) => {
            const whereKey = Object.keys(where)[0]
            const whereValue = where[whereKey]
            values.push(whereValue);
            let query = "UPDATE " + tableName + " SET " + keys.join(' = ?, ') + " = ? WHERE " + whereKey + " = ?";
            this.executeSql(query, values).then((value) => resolve(value)).catch((error) => reject(error));
        });
    }

    delete(tableName, where: string) {
        return new Promise((resolve, reject) => {
            const query = "DELETE FROM " + tableName + " WHERE " + where;
            this.executeSql(query).then((value) => resolve(value)).catch((error) => reject(error));
        });
    }

    executeSql(query, params = []) {
        return new Promise((resolve, reject) => {
            this.dbInstance.executeSql(query, params).then((value) => resolve(value)).catch((error) => reject(error));
        })
    }

    dropTable(tableName) {
        return new Promise((resolve, reject) => {
            this.dbInstance.executeSql("DELETE FROM " + tableName).then(() => resolve(true)).catch(() => reject(false));
        });
    }
}
