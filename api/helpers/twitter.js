const axios=require('axios');


class Twitter{

    get=(url,query,count,maxID)=>{

       return( 
           axios.get(url,{
            params:{
                q:query,
                count:count,
                tweet_mode:"extended",
                max_id:maxID,
            },
            headers:{
            'Authorization':`Bearer ${process.env.TWITTER_API_TOKEN}`
            }
        })
       );

    }

}

module.exports=Twitter;