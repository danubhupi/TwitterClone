const express=require('express');
const Twitter = require('./helpers/twitter');

const app=express();
const port=3000;

const twitter=new Twitter();

require('dotenv').config();




app.use((req,res,next)=>{
    res.setHeader('Access-Control-Allow-Origin','*');
    next();
})


app.get('/tweets',(req,res)=>{
    
    const query =req.query.q;
    const count =req.query.count;
    const maxID=req.query.max_id;
    

    const url='https://api.twitter.com/1.1/search/tweets.json';
    
    
    twitter.get(url,query,count,maxID)
    .then((response)=>{
res.status(200).send(response.data);
    })
    .catch((error)=>{
        res.status(400).send(error);
    })

    
})



app.listen(port,()=>{console.log(`listening on ${port}`)});