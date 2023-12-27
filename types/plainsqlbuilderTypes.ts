export type RenameStatement = {
    /**
     * Original name of the column
     */
    column : string,

    /**
     * New column name
     */
    rename : string
}

export type WhereStatement = {

    /**
     * Column to evaluate
     */
    column: string,

    /**
     * Type of query (Equal, less, etc)
     */
    type: ">" | "<" | ">=" | "LIKE" | "ON" | "=",

    /**
     * Value to be validated. Can be a QueryObject
     */
    value: QueryObject | string,

    /**
     * Connector to the next WhereStatement
     */
    connector?: "AND" | "OR"
}

export type JoinStatement = {

    /**
     * Join type
     */
    type: "INNER JOIN" | "OUTER JOIN",

    /**
     * Table to JOIN. Can be a QueryObject according to the SQL syntax to JOIN a SQL result
     */
    table: QueryObject | string,

    /**
     * Conditions to JOIN
     */
    condition: WhereStatement[]
}

export type QueryObject = {
    SELECT?: string[] | RenameStatement[],
    FROM: [string , JoinStatement?],
    WHERE?: WhereStatement[],
    /**
     * Columns to be grouped
     */
    GROUP_BY?: string[],
    /**
     * Conditions to group
     */
    HAVING?: WhereStatement[]
}

export type UpdateObject = {
    /**
     * Column affected
     */
    column: string,

    /**
     * New value for the column
     */
    newValue: string,
    condition: WhereStatement[]
}

export type DeleteStatement = {
    condition: WhereStatement[]
}