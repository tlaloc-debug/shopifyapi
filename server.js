const express = require("express");
const fetch = require("node-fetch");
const cors = require("cors");

const app = express();
app.use(cors());

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

app.listen(3001, () => console.log("Listening on port 3000 .... "));