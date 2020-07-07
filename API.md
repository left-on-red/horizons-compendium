**GET** `/api/clothing/<name>`  
`name` - the name of the clothing item to be returned OR if `name == "history"`, the history of every clothing item  

***

**POST** `/api/clothing/`  
**BODY:**
```
{
    token: string (your authentication token),
    name: string (the name ofd the item),
    colors: array<string> (the available colors the item can be in),
    defaultColor: string (the default clothing color),
    obtained: string (how said item can be obtained),
    cataloggable: bool,
    value: int (> 0)
}
```

***

**PATCH** `/api/clothing/<name>`  
`name` - the name of the clothing item that you wish to update  
**BODY:**
```
{
    token: string (your authentication token),
    colors?: array<string> (the available colors the item can be in),
    defaultColor?: string (the default clothing color),
    obtained?: string (how said item can be obtained),
    cataloggable?: bool,
    value?: int (> 0)
}
```

***

**DELETE** `/api/clothing/<name>/`  
`name` - the name of the clothing item that you wish to delete  
**BODY:**
```
{
    token: string (your authentication token)
}
```  
*note: your token NEEDS to match the original author of the item that you're trying to delete*  

***

**POST** `/api/auth/` ***(only for use by the master token user)***  
**BODY:**
```
{
    token: string (your authentication token)
}
```
**RETURNS:**
```
{
    id: null,
    name: null,
    master: false,
    startup: true
}
```

***

**GET** `/api/auth/validate?token=string`  
`token` - the token that you want to verify  
**RETURNS:**
```
{
    id: string,
    name: string,
    master: bool,
    startup: bool
}
```

***

**POST** `/api/auth/init/`  
**BODY:**
```
{
    token: string (your authentication token),
    username: string (the username that you wish to set for yourself)
}
```
**RETURNS:**
```
{
    id: string (your generated user id)
}
```

***

**PATCH** `/api/auth/username/`  
**BODY:**
```
{
    token: string (your authentication token),
    username: string (the username that you wish to set for yourself)
}
```

***

**GET:** `/api/username?id=string`  
`id` - the id that you wish to resolve into a username  
**RETURNS:**
```
{
    username: string
}
```