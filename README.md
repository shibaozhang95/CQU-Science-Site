# CQU-Science-Site
Science and principle of technology in our side.

## Database Part
Chooise Monogdb, the database name is `science-in-our-side`.

Four collections:
+ `catalogs` contains the _chapters_ and theirs _sections_ of this book
+ `contents` contains every sections detail, such as: _section_title_ and _section_content_
+ `homepage` contains all items will be shown in homepage
+ `ranking` contains rankers' information such as score and username

Collections' detail:
    
`catalogs`
``` json
{
  "chapter_id": "0",  // use to locate
  "chapter_tilte": "first chapter",
  "sections": [
    { "section_id": "0.0", "section_title": "first section of chapter 0" },
    { "section_id": "0.1", "section_title": "second section of chapter 0" },
    ...
  ]
}
```

`contents`
``` json
{
  "section_id": "0.0",  // use to locate
  "section_title": "first section of chapter 0",
  "section_content": ["some text", "or img", "or vidio", ...]
}
...
```

`homepage`
``` json
{
  "section_id": "0.0",
  "section_title": "first section of chapter 0",
  "tags": ["electric", "mechanical"],
  "cover": "uri:img/example.png",
  "brif": "just some brif information"
}
```

`ranking`
``` json
{
  "username": "username",
  "score": 100,
  "data": "created data"
```


## API

> Rules:
>    + chpt means chapter
>    + sect means section
>    + section means chpt.sect

### Get the chapters and sections in ebook
```
method: GET

uri: /api/section

return:
{
  errcode: succ 0 | err 1
  errmsg: ""
  
  sections: [
    {
      chptTitle: string
      sectList: []
    },
    {
      chptTitle: string
      sectList: []
    },
    ...
  ]
}
```

### Get content of any section
``` 
method: Get

uri: /api/content?section="chpt.sect"
ex:  /api/content?section=1.1

return:
{
  errcode: succ 0 | err 1
  errmsg: "Don't have this section"
  
  sectList: []
  section: string
  content: []
  prev: {
    section: string
    sectTitle: string
  }
  next: {
    section: string
    sectTitle: string
  }
}
```

### Modified the content in exist section
```
method: POST

uri: /api/modify

param:
{
  section: string
  content: []    // being modified
}

return:
{
  errcode: succ 0 | err 1
  errmsg: "" | "Can't find this section"
} 
```

### Get/update ranking list
```
method: GET

uri: /api/ranking?count=number&username=string&score=number
ex1: /api/ranking?count=5                                // Get ranking
ex2: /api/ranking?count=5&username="xiaoqiang"&score=90  // Update ranking and get new ranking

return:
{
  errcode: succ 0 | err 1
  errmsg: ""
  
  totleCount: number
  count: number
  rankers: [
    {
      username: string
      score: number
    },
    {
      username: string
      score: number
    },
    ...
  ]
}
```

### Get homepage's items
```
method: GET

uri: /api/homepageitems?count=number
ex: /api/homepageitems?count=9

return:
{
  count: number
  items: [
    {
      section: string
      sectTitle: string
      tags: []
      cover_uri: string
      brif: string
    }
  ]
}
```