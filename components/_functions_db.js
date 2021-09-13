
// ========
module.exports = {
    saveFile: function (con,res, data,file_name, id_user = 1) {
          var sql =  `SELECT * FROM uporabniki WHERE id = `+id_user;
          console.log(sql);
          con.query(sql, function (err, result, fields) {
            if (err) {
              res.json({result: err, success: false})
            } else {
              console.log(result);

              selectRes = JSON.parse(JSON.stringify(result))[0];
              console.log(selectRes);

              if ( selectRes.gender = 'M' ) {
                data['calories'] =((selectRes.age*0.2017)-(selectRes.weight*2.205*0.09036)+(data['avg_heartrate']*0.6309)-55.0969)*  (data['duration']/60)/4.184   
              } else {
                data['calories']=((selectRes.age*0.074)-(selectRes.weight*2.205*0.05741)+(data['avg_heartrate']*0.4472)-20.4022)*  (data['duration']/60)/4.184    
              }

              var sql =  `INSERT INTO db_activites SET
                            id_user         = '`+id_user+`',
                            file_name       = '`+file_name+`',
                            added           = NOW(),
                            num_hills       = `+data['num_hills']+`,
                            avg_altitude    = `+data['avg_altitude']+`,
                            avg_ascent      = `+data['avg_ascent']+`,
                            distance_hills  = `+data['distance_hills']+`,
                            hills_share     = `+data['hills_share']+`,
                            duration        = `+data['duration']+`,
                            total_distance  = `+data['total_distance']+`,
                            avg_heartrate   = `+data['avg_heartrate']+`,
                            avg_speed       = `+data['avg_speed']+`,
                            total_ascent    = `+data['ascent']+`,
                            calories        = `+data['calories']+`,
                            forma           = `+data['forma']+`
                          `;
              con.query(sql, function (err, result) {
                if (err) {
                  res.json({result: err, success: false})
                } else {
                  module.exports.getPreviousAverage(con,res,data, result.insertId,id_user)
                }
              });
            }
        });
    },
    getUser: function (con,res,id_user = 1) {
      var sql =  `SELECT * FROM uporabniki WHERE id = `+id_user;
      con.query(sql, function (err, result, fields) {
          if (err) {
            res.json({result: err, success: false})
          } else {
            res.json({result: result, success: true});
          }
      });
    },
    getFiles: function (con,res,id_user = 1) {
      var sql =  `SELECT * FROM db_activites WHERE id_user = 1 ORDER BY added DESC`;
      con.query(sql, function (err, result, fields) {
          if (err) {
            res.json({result: err, success: false})
          } else {
            res.json({result: result, success: true});
          }
      });
    },
    getPreviousAverage: function (con,res, data, file_id, id_user = 1) {
      var sql =  `SELECT avg(num_hills) as num_hills, avg(avg_altitude) as avg_altitude, avg(avg_ascent) as avg_ascent, 
                  avg(distance_hills) as distance_hills, avg(hills_share) as hills_share, avg(duration) as duration, 
                  avg(total_distance) as total_distance, avg(avg_heartrate) as avg_heartrate, avg(avg_speed) as avg_speed, 
                  avg(total_ascent) as total_ascent, avg(forma) as forma, avg(calories) as calories
                  FROM ( SELECT * 
                    FROM  db_activites
                    WHERE id != `+file_id+` AND id_user =  '`+id_user+`'
                    ORDER BY added DESC
                    LIMIT 5
                  ) as t
                  `;
      con.query(sql, function (err, result) {
        if (err) {
          res.json({result: err, success: false})
        } else {
          if ( result.length > 0) {
            module.exports.saveResult(con,res,data,result,file_id);
          } else {
            // DEFAULT
          }
        }
      });
    },
    saveResult: function (con,res, data, selectRes, file_id) {
      selectRes = JSON.parse(JSON.stringify(selectRes))[0];
      console.log(selectRes);
      console.log(data);
      var sql =  `INSERT INTO db_activites_results SET
                    id_file         = '`+file_id+`',
                    num_hills       = `+module.exports.getPercentage(selectRes['num_hills'], data['num_hills'])+`,
                    avg_altitude    = `+module.exports.getPercentage(selectRes['avg_altitude'], data['avg_altitude'])+`,
                    avg_ascent      = `+module.exports.getPercentage(selectRes['avg_ascent'], data['avg_ascent'])+`,
                    distance_hills  = `+module.exports.getPercentage(selectRes['distance_hills'], data['distance_hills'])+`,
                    hills_share     = `+module.exports.getPercentage(selectRes['hills_share'], data['hills_share'])+`,
                    duration        = `+module.exports.getPercentage(selectRes['duration'], data['duration'])+`,
                    total_distance  = `+module.exports.getPercentage(selectRes['total_distance'], data['total_distance'])+`,
                    avg_heartrate   = `+module.exports.getPercentage(selectRes['avg_heartrate'], data['avg_heartrate'])+`,
                    avg_speed       = `+module.exports.getPercentage(selectRes['avg_speed'], data['avg_speed'])+`,
                    total_ascent    = `+module.exports.getPercentage(selectRes['total_ascent'], data['ascent'])+`,
                    calories        = `+module.exports.getPercentage(selectRes['calories'], data['calories'])+`,
                    forma           = `+module.exports.getPercentage(selectRes['forma'], data['forma'])+`
                  `;
      console.log(sql);
      con.query(sql, function (err, result) {
        if (err) {
          res.json({result: err, success: false})
        } else {
          res.json({result: result, success: true});
        }
      });
    },
    getLastResult: function (con,res) {
      var sql =  `SELECT id_file
                  FROM db_activites_results
                  ORDER BY id DESC LIMIT 1 `;
                  console.log(sql)

      con.query(sql, function (err, result) {
        if (err) {
          res.json({result: err, success: false})
        } else {
          selectRes = JSON.parse(JSON.stringify(result))[0];
          console.log(selectRes)
          module.exports.getResult(con,res,selectRes.id_file)
        }
      });

    },
    getResult: function (con,res,file_id) {
      var sql =  `SELECT dar.*, da.num_hills as og_num_hills, da.avg_altitude as og_avg_altitude,
                  da.avg_ascent as og_avg_ascent, da.distance_hills as og_distance_hills, da.hills_share as og_hills_share,
                  da.duration as og_duration, da.total_distance as og_total_distance, da.avg_heartrate as og_avg_heartrate,
                  da.avg_speed as og_avg_speed, da.total_ascent as og_total_ascent, da.forma as og_forma, da.calories as og_calories
                  FROM db_activites_results as dar
                  LEFT JOIN db_activites as da ON da.id = dar.id_file
                  WHERE id_file = `+file_id;
      con.query(sql, function (err, result) {
        if (err) {
          res.json({result: err, success: false})
        } else {
          res.json({result: result, success: true});
        }
      });
    },
    getPercentage: function(val1,val2) {
      //console.log('val1: '+ val1 + 'Val2: '+ val2);
      if ( val2 == 0 || val1 == 0) {
        return 0;
      } else {
        return (parseFloat(val2)/parseFloat(val1))*100;
      }
    }
};