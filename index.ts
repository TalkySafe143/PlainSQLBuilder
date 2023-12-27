import { DeleteStatement, QueryObject, RenameStatement, UpdateObject, WhereStatement } from './types/plainsqlbuilderTypes'

export const generateConditionQuery = (where : WhereStatement, filters: string[]) => {
    filters.push(
        `${where["column"]} ${where["type"]} (${
            typeof(where["value"]) === "string" ? where["value"] : generateQuery(where["value"])
        }) ${
            where["connector"] ? where["connector"] : ""
        } `
    )
}

export function generateQuery(queries : QueryObject) {
    let statement : string = "SELECT ";
    // SELECT comes as a string array or object to rename
    /*
    * renameObject
    * {
    *   column, -> original name
    *   rename -> name to override
    * }
    * */
    if (queries["SELECT"]) {
        let indexToDeleteDistinct : number = 0;
        if (Array.isArray(queries["SELECT"]) && queries["SELECT"].find((val, index) => {
            if (typeof val == 'string' && val.toLowerCase() === 'distinct') indexToDeleteDistinct = index;
            let res : boolean;
            if (typeof val === 'string') res = val.toLowerCase() === 'distinct';
            else res = false;
            return res;
        })) {
            statement += "DISTINCT ";
            delete queries["SELECT"][indexToDeleteDistinct];
        }
        const selectColumns : string[] = [];

        queries["SELECT"].forEach(select => {
            let preparedStr = "";
            typeof(select) === 'string' ? preparedStr += select + " " : preparedStr += `${select["column"]} AS ${select["rename"]} `;
            selectColumns.push(preparedStr);
        })

        statement += selectColumns.join(", ")
    }
    else statement += `* `
    // FROM comes as a string array and Object to specify the JOIN
    /*
    * JOIN setting object
    * {
    *   type, -> "INNER JOIN" | "OUTER JOIN"
    *   table, -> Table to join | Can be a query object with "rename" property to exec a rename
    *   condition : [{
           column,
           type, -> ">" | "<" | ">=" | "LIKE" | "ON"
           value, -> Can be query object.
           connector? -> "AND" | "OR" to the next filter
         }]
    * }
    * */
    if (queries["FROM"]){
        const joinFilters : string[] = [];

        if (queries["FROM"].length > 2) throw ('JOIN solo se puede hacer con 2 tablas');

        if (queries["FROM"].length == 1) statement += `FROM ${queries["FROM"][0]} `
        else {
            (queries["FROM"][1])?.condition.forEach((condition) => {
                joinFilters.push(
                    `${condition["column"]} ${condition["type"]} (${
                        typeof(condition["value"]) === "string" ?  condition["value"] : generateQuery(condition["value"])
                    }) ${
                        condition["connector"] ? condition["connector"] : ""
                    } `
                )
            })
            statement += `FROM ${queries["FROM"][0]} ${queries["FROM"][1]?.table} (${
                (typeof(queries["FROM"][1]?.table) === 'string' ? queries["FROM"][1].table : generateQuery(queries["FROM"][1]?.table as QueryObject))
            }) ON ${joinFilters.join("")} `
        }
    }
    else throw ('Debe existir un FROM o alguna tabla a la cual consultar')
    // WHERE comes as a object array
    /*
    * {
    *   column,
    *   type, -> ">" | "<" | ">=" | "LIKE" | "ON"
    *   value, -> Can be query object with "rename" property.
    *   connector? -> "AND" | "OR" to the next filter
    * }
    * */
    if (queries["WHERE"]) {
        const filters : string[] = []
        queries["WHERE"].forEach(where => {
            generateConditionQuery(where, filters);
        })

        statement += `WHERE ${filters.join("")} `
    }

    // GROUP BY comes as string array
    if(queries["GROUP_BY"]) {
        statement += `GROUP BY (${queries["GROUP_BY"].join(",")}) `;
    }

    if (queries["HAVING"]) {
        const filters : string[] = []
        queries["HAVING"].forEach(where => {
            generateConditionQuery(where, filters);
        })

        statement += `HAVING ${filters.join("")} ;`
    }
    return statement;
}

export function generateInsertStatement(table : string, data : object) {
    return `INSERT INTO ${table} (${Object.keys(data).join(", ")}) VALUES(${Object.values(data).join(", ")}) `
}


/*
* update object
* {
*   column, -> Column affected
*   newValue, -> New value for the column,
*   condition: [{
    *   column,
    *   type, -> ">" | "<" | ">=" | "LIKE" | "ON"
    *   value, -> Can be query object with "rename" property.
    *   connector? -> "AND" | "OR" to the next filter
    * }]
* }
*
* */
export function generateUpdateStatement(table : string, update : UpdateObject) {
    let statement = `UPDATE ${table} SET ${update["column"]} = ${update["newValue"]} `

    const filters : string[] = [];

    update["condition"].forEach(where => {
        generateConditionQuery(where, filters);
    })

    statement += `WHERE ${filters.join("")} `

    return statement;
}

export function generateDeleteStatement(table : string, deleteData : DeleteStatement) {
    if (!deleteData["condition"]) throw ('Para eliminar debe tener un Condition Object')
    let statement = `DELETE FROM ${table} `;

    const filters : string[] = [];

    deleteData["condition"].forEach(where => {
        generateConditionQuery(where, filters);
    })

    statement += `WHERE ${filters.join("")} `;

    return statement;
}
