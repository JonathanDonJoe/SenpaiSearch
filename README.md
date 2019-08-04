# Anime Opening and Ending Themes Search

### Description:
Searches for anime opening and ending themes.  Information acquired through the [Jikan unofficial MyAnimeList API](https://jikan.docs.apiary.io/#) and the [Official Youtube Data API](https://developers.google.com/youtube/v3/).  

Limited to only the official openings and endings in the native language.  Only displays youtube videos that do not infringe on copyright.


### Requirements: 
* Youtube Data v3 API key



### Function Flow:

> Event Listener: Search Button ->    Event Listener
>> searchAnime()       
>>> getAnimeShortData()  
>>>> queries anime API for ids  
>>>>
>>> getAnimeLongData()    
>>>> queries anime API for details  
>>>> createCard() for each result  
>>>>>makes small card  
>>>>>
>> Event Listener: Cards  
>>> makeBigCard()  
>>>> builds big card  
>>>> makes compiled list of OP/ED  
>>>> searchYoutube() for each entry
>>>>> look in local storage  
>>>>>> ? pull from local storage  
>>>>>> : queries youtube API and stores for future  
>>>>>>
>>>> createBigCardVideos()  
>>>>> creates embedded videos from ids  

                