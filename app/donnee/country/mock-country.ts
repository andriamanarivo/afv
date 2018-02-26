export const mockcountry: any =  {
        "took":101,
        "timed_out":false,
        "_shards":{
            "total":3,
            "successful":3,
            "failed":0
        },
        "hits":{
            "total":4,
            "max_score":1.0,
            "hits":[
                {
                    "_index":"paysindex",
                    "_type":"pays",
                    "_id":"AVzLbC7w6BMeNFXo7VR4",
                    "_score":1.0,
                    "_source":{
                        "pays": "French Guiana", 
                        "iso3": "GF"
                    }
                },
                {
                    "_index":"paysindex",
                    "_type":"pays",
                    "_id":"AVzLbC7w6BMeNFXo7VR5",
                    "_score":1.0,
                    "_source":{
                        "pays": "French Polynesia", 
                        "iso3": "PF"
                    }
                },
                {
                    "_index":"paysindex",
                    "_type":"pays",
                    "_id":"AVzLbC7w6BMeNFXo7VR6",
                    "_score":1.0,
                    "_source":{
                        "pays": "French Southern Territories",
                        "iso3": "TF"
                        }
                },
                {
                    "_index":"paysindex",
                    "_type":"pays",
                    "_id":"AVzLbC7w6BMeNFXo7VR3",
                    "_score":1.0,
                    "_source":{
                        "pays": "France", 
                        "iso3": "FR"
                }
            }
        ]
    }
}