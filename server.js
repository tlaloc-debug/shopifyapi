const { Pool } = require('pg');
const { parse } = require('pg-connection-string')
const express = require("express");
const fetch = require("node-fetch");
const cors = require("cors");
const connectionString = process.env.DATABASE_URL;
const config = parse(connectionString)
const app = express();
app.use(cors());

config.ssl = {
  rejectUnauthorized: false
}
const pool = new Pool(config)

app.post("/bookappointment", (req, res) => {
  appointmentdate = req.body.appointmentdate;
  appointmenttime = req.body.appointmenttime;
  appointmentlocation = req.body.appointmentlocation;
  appointmentname = req.body.appointmentname;
  appointmentemail = req.body.appointmentemail;
  appointmentphone = req.body.appointmentphone;
pool.query('INSERT INTO apointment (date,time,location,name,email,phone) values ($1, $2, $3, $4, $5, $6)', [appointmentdate, appointmenttime, appointmentlocation, appointmentname, appointmentemail, appointmentphone], 
    function(err, result){
        if (err){
            console.log(err);
        }else {
            console.log(result);
        }
    });
  })

app.get("/products", (req, res) => {
    fetch("https://tlaloc-debug-dev.myshopify.com/admin/api/graphql.json", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": "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"
      },
      body: JSON.stringify({
        query: `query findProducts($query: String!, $num: Int!) {
           shop {
             name
           }

           collections (first: $num, query: $query) {
            edges{
              node{
                title
                products (first: $num){
                  edges{
                    node{
                      title
                      totalInventory
                      variants(first:1){
                        edges{
                          node{
                            price
                          }
                        }
                        
                      }
                    }
                  }
                }
              }
            }
            
          }

         }`,
        variables: {query: "inches", num: 5 }
      })
    })
      .then(result => {
        return result.json();
      })
      .then(data => {
        console.log("data returned:\n", data);
        res.send(data);
      });
  });

app.listen(process.env.PORT, () => console.log("Listening on port 3000 .... "));