# VRT_server

# Description



# Requirements

For server to work, needs working `data_extraction.py` script.
Script is avalible here: https://github.com/mdezelak/VRT_data_extractor

Server also requires MySql databse server.
MySQL is avaliable here: https://www.mysql.com/

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

4. In index.js file set databse connection parameters

```
var con = mysql.createConnection({
  host: "",
  user: "",
  password: "",
  database: ''
});```
