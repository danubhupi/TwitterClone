const URL = "http://localhost:3000/tweets";
nextURL=null;

const onEnter = (e) => {
  if (e.key === "Enter") {
    getTwitterData();
    
  }
};


const onNextPage=()=>{
  if(nextURL){
    getTwitterData(true);
  }
}

/**
 * Retrive Twitter Data from API
 */
const getTwitterData = (nextPage=false) => {
  const query = document.getElementById("user-search-input").value;
  if (!query) return;

  const encodedQuery = encodeURIComponent(query);

  let url = `${URL}?q=${encodedQuery}&count=10`;

  if(nextURL && nextPage){
    url=nextURL;
  }

  fetch(url)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      buildTweets(data.statuses,nextPage);
      saveNextPage(data.search_metadata);
    })
    .catch((error) => {
      console.log(error);
    });

  
  // buildTweets(data,0);
};

/**
 * Save the next page data
 */
const saveNextPage = (metadata) => {
  if(metadata.next_results){
    nextURL=`${URL}${metadata.next_results}`;
    nextPageButtonVisibility(true);
  }
 
};

/**
 * Handle when a user clicks on a trend
 */
const selectTrend = (e) => {
  document.getElementById("user-search-input").value=e.innerText;
  getTwitterData();
};

/**
 * Set the visibility of next page based on if there is data on next page
 */
const nextPageButtonVisibility = (present=false) => {
  if(present){
    document.getElementById('nextPageButton').style.visibility="visible";
  }
  else{
    document.getElementById('nextPageButton').style.visibility="hidden";


  }
};

/**
 * Build Tweets HTML based on Data from API
 */
const buildTweets = (tweets, nextPage) => {
  let tweetList = "";
  console.log(tweets);

  for (i of tweets) {
    const date=moment(i.created_at).fromNow();
    let full_text = i.full_text;

    tweetList += `
        <div class="tweet-container">
                    <div class="tweet-user-info">
                        <div class="tweet-user-profile"   style="background-image:url(${i.user.profile_image_url_https})">
                        </div>
                        <div class="tweet-user-name-container">
                            <div class="tweet-user-fullname">${i.user.name}</div>
                            <div class="tweet-user-username">@${i.user.screen_name}</div>
                        </div>
                    </div>`;

    if (i.extended_entities && i.extended_entities.media.length > 0) {
      let content = i.extended_entities.media;
      tweetList += `${buildImages(content)}`;

      tweetList += `${buildVideo(content)}`;
    }

    tweetList += `<div class="tweet-text-container">${full_text} </div>
         <div class="tweet-date-container">${date}</div>
                </div> 
                </div>`;
  }

  //document.getElementById('tweets-list').remove();
  if(nextPage===true){
  document.querySelector(".tweets-list").insertAdjacentHTML("beforeend",tweetList);


}else{
  document.querySelector(".tweets-list").innerHTML = tweetList;

}
};

/**
 * Build HTML for Tweets Images
 */
const buildImages = (mediaList) => {
  let isImage = false;

  let image = ` <div class="tweet-images-container">`;
  let j = 0;
  for (i of mediaList) {
    if (i.type === "photo" && j < 4) {
      isImage = true;
      image += `<div class="tweet-image" style="background-image:url(${i.media_url});">
            </div> `;
      j++;
    }
  }
  image += `</div>`;
  return isImage ? image : "";
};

/**
 * Build HTML for Tweets Video
 */
const buildVideo = (mediaList) => {
  let video = ` <div class="tweet-video-container">`;

  let isVideo = false;
  for (i of mediaList) {
    if (i.type === "video") {
      isVideo = true;

      const videoVariant=i.video_info.variants.find((variant)=>variant.content_type==="video/mp4");

      video += `<video controls>
                        <source src="${videoVariant.url}" type="video/mp4">
                        </video>`;
    } else if (i.type == "animated_gif") {
      isVideo = true;
      const videoVariant=i.video_info.variants.find((variant)=>variant.content_type==="video/mp4");

      video += `<video loop autoplay>
                        <source src="${videoVariant.url}" type="video/mp4">
                        </video>`;
    }
  }
  video += `</div>`;

  return isVideo ? video : "";
};
