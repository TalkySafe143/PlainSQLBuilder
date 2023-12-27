
# Plain SQL Builder

This package convert a JSON object into a SQL string to be executed. SQL dialect is treated as generic.

## Usage/Examples

You can use the types from dist folder.

> [!WARNING]
> If you have to validate a string, please type `''` in the field.

> [!WARNING]
> Make shure to have additional security for SQL Injection.

- TypeScript

```typescript
import { generateQuery } from 'plainsqlbuilder'
import { QueryObject } from 'plainsqlbuilder/dist/types/plainsqlbuilderTypes'

const query : QueryObject = {
    FROM: ['user'],
    WHERE: [
        {
            column: 'email',
            type: '=',
            value: "'hi@example.com'",
            connector: 'AND'
        },
        {
            column: 'password',
            type: '=',
            value: "'hash'"
        }
    ]
}

// SELECT * FROM user WHERE email = ('hi@example.com') AND password = ('hash')   ;
console.log(generateQuery(query));

```

```typescript
import { generateQuery } from 'plainsqlbuilder'
import { QueryObject } from 'plainsqlbuilder/dist/types/plainsqlbuilderTypes'

const query : QueryObject = {
    SELECT: [{
        rename: 'NAME_UPPERCASE',
        column: "name"
    }],
    FROM: ['user'],
    WHERE: [
        {
            column: 'email',
            type: '=',
            value: "'hi@example.com'",
            connector: 'AND'
        },
        {
            column: 'password',
            type: '=',
            value: "'hash'"
        }
    ]
}
// SELECT name AS NAME_UPPERCASE FROM user WHERE email = ('hi@example.com') AND password = ('hash')   ;
console.log(generateQuery(query));

```

```typescript
import { generateQuery } from 'plainsqlbuilder'
import { QueryObject } from 'plainsqlbuilder/dist/types/plainsqlbuilderTypes'

const query : QueryObject = {
    SELECT: ["name", "code"],
    FROM: ['user'],
    WHERE: [
        {
            column: 'email',
            type: '=',
            value: "'hi@example.com'",
            connector: 'AND'
        },
        {
            column: 'password',
            type: '=',
            value: "'hash'"
        }
    ]
}
// SELECT name , code FROM user WHERE email = ('hi@example.com') AND password = ('hash')   ;
console.log(generateQuery(query));

```

- JavaScript


```javascript
const { generateQuery } = require('plainsqlbuilder')

const query = {
    FROM: ['student'],
    WHERE: [
        {
            column: 'name',
            type: "=",
            value: "'Sebastian'"
        }
    ],
}


// SELECT * FROM student WHERE name = ('Sebastian')   ;
console.log(generateQuery(query));
```
## Contributing

Contributions are always welcome! One great feature would be: Adding bindings to avoid SQL Injection.

