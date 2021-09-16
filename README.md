# VRT_server

# Description

VRT server is part of VRT application. It's based on node.js structure and contains APIs needed for VRT_app. It works as interface between app, database and data  extraction script.


# Requirements

For server to work, needs working `data_extraction.py` script.
Script is avalible here: https://github.com/mdezelak/VRT_data_extractor

Server also requires MySql database server.
MySQL is available here: https://www.mysql.com/
After installation import database structure from DB folder.

# Usage

1. Clone repository and go into project file.

```
git clone https://github.com/mdezelak/VRT_server.git
cd VRT_server
```

2. Install dependencies 

```
npm install
```

3. If application and server is located on same machine, install cors

```
npm install cors
```

4. In index.js file set database connection parameters

```
var con = mysql.createConnection({
  host: "",
  user: "",
  password: "",
  database: ''
});```
