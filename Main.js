let music_list = document.querySelector('.music-list'),
 more_music = document.querySelector('#more-music'),
 close = document.querySelector('#close'),
 play_pause = document.querySelector('.play-pause i'),
 mainAudio = document.querySelector('#main-audio'),
 musicName = document.querySelector('.song-info .name'),
 musicArtist = document.querySelector('.song-info .artist'),
 musicImage = document.querySelector('.image img'),
 prevBtn = document.querySelector('#prev'),
 nextBtn = document.querySelector('#next'),
 musicDuration = document.querySelector('.duration'),
 currentDuration = document.querySelector('.current'),
 progressArea = document.querySelector('.progress-area'),
 progressBar = document.querySelector('.progress-bar')
 repeat = document.querySelector('#repeat')
 let musicIndex = 1,timer;
  
    if(sessionStorage.getItem('musicIndex')){
      musicIndex = sessionStorage.getItem('musicIndex')
    }
    
    const loadMusic = (Index) => {
    musicName.innerHTML = allMusic[Index-1].name
    musicArtist.innerHTML = allMusic[Index-1].artist
    mainAudio.src = 'music/'+allMusic[Index-1].audio+'.mp3'
    // musicImage.src = 'Images/'+allMusic[Index-1].image+'.jpg'
    musicImage.src = `https://picsum.photos/id/${Index+50}/200.jpg`
  }
  window.addEventListener('load',loadMusic(musicIndex))
  
  // progress area click karne par audio ka current time change karna
 
  progressArea.ontouchmove = (e)=>{
   if(timer){
     clearInterval(timer);
     timer = null;
     }
     
   let touchX = e.touches[0].clientX-42
   progressBar.style.width = 100*touchX/progressArea.clientWidth+'%'
    // current duration innerhtml update
   let ms = (touchX/progressArea.clientWidth)*mainAudio.duration
       ms <= 0 ? ms = 0 : ms = ms;
       ms > mainAudio.duration ? ms = mainAudio.duration : ms = ms;
    
        m = Math.floor(ms/60).toString().padStart(2,0)
        s = Math.floor(ms%60).toString().padStart(2,0)
        currentDuration.innerHTML = `${m}:${s}`
  }
  
   // touch ended
  progressArea.ontouchend = (e) =>{
    let touchX = e.changedTouches[0].clientX-42
    mainAudio.currentTime = (touchX/progressArea.clientWidth)*mainAudio.duration
    slider_range();
    !timer ? startTimer() : '';
  }
  // progress area scroll karne par audio ka current time change karna
  progressArea.onclick = (e)=>{
   mainAudio.currentTime = (e.offsetX/progressArea.clientWidth)*mainAudio.duration
   progressBar.style.width = 100*mainAudio.currentTime/mainAudio.duration+'%'
   let m = Math.floor(mainAudio.currentTime/60).toString().padStart(2,0),
       s = Math.floor(mainAudio.currentTime%60).toString().padStart(2,0)
      currentDuration.innerHTML = `${m}:${s}`
  } 
  
  //main audio data loaded
  mainAudio.addEventListener('loadeddata',(e)=>{
   let minute = Math.floor(e.target.duration/60).toString().padStart(2,0),
       second = Math.floor(e.target.duration%60).toString().padStart(2,0)
       musicDuration.innerHTML = `${minute}:${second}`
       playing()
  })
  
  // repeate Btn event handling
  repeat.onclick = ()=>{
    switch (repeat.innerHTML) {
      case 'repeat':
        repeat.innerHTML = 'repeat_one'
        break;
      case 'repeat_one' :
        repeat.innerHTML = 'shuffle'
        break;
      case 'shuffle' :
        repeat.innerHTML = 'repeat'
        break;
    }
  }
  
  //play  previouse Song
  prevBtn.onclick = () =>{
    let i = Math.floor(Math.random()*allMusic.length+1) //for play random song
    repeat.innerHTML == 'shuffle'? musicIndex = i : musicIndex--;

    musicIndex < 1 ? musicIndex = allMusic.length : musicIndex=musicIndex;
    loadMusic(musicIndex)
    play_pause.innerHTML = 'pause'
    mainAudio.play()
    progressBar.style.width = '0';
  }
  
  // play next Song
  const nextSong = () =>{
    let i = Math.floor(Math.random()*allMusic.length+1)  //creating a random index
    while (i == musicIndex){ i = Math.floor(Math.random()*allMusic.length+1)  }  //playing loop until new unique index
    
    repeat.innerHTML == 'shuffle'? musicIndex = i : musicIndex++;
    musicIndex <= allMusic.length ? musicIndex = musicIndex : musicIndex = 1;
    loadMusic(musicIndex)
    mainAudio.play()
    progressBar.style.width = '0';  
    currentDuration.innerHTML = `00:00`
  }
  nextBtn.addEventListener('click',nextSong)

  // mainAudio events handling
  mainAudio.onplay = ()=>{
    play_pause.innerHTML = 'pause'
    !timer ? startTimer() : '' ;
  } 
  mainAudio.onpause = () => play_pause.innerHTML = 'play_arrow'
 // play_pause Btn
 play_pause.onclick = ()=> play_pause.innerHTML == 'pause' ? mainAudio.pause() : mainAudio.play();
 
      
 // open & close music playlist
 more_music.onclick = () => music_list.classList.add('show')
 close.onclick = () => music_list.classList.remove('show')
 
 
  
  
  const slider_range = () =>{
     sessionStorage.setItem('currentTime',mainAudio.currentTime)
     sessionStorage.setItem('musicIndex',musicIndex)
    if(mainAudio.paused){
      clearInterval(timer)
      timer = null;
    }
    
    if(!mainAudio.paused){
      const {currentTime,duration} = mainAudio;
      let m = Math.floor(currentTime/60).toString().padStart(2,0),
          s = Math.floor(currentTime%60).toString().padStart(2,0)
          currentDuration.innerHTML = `${m}:${s}`
          progressBar.style.width = `${(currentTime/duration)*100}%`
    }
    
    // if song ended then playing next song
    
    if(mainAudio.ended){
        progressBar.style.width = '0%'
        repeat.innerHTML == 'repeat_one' ? mainAudio.play() : nextSong();
    }
  }
  
  const startTimer = () => timer = setInterval(slider_range,500)
  
   // when mainAudio start playing
  const playing = () =>{
    
   !timer ? startTimer() : '';  // timer start
    
    let allLiTag = document.querySelectorAll('li')
    
    for (let j = 0;j<allLiTag.length;j++){
      
      let audioTag = allLiTag[j].querySelector('.audio-duration')
    
      if( allLiTag[j].classList.contains('playing')){
         allLiTag[j].classList.remove('playing')
         audioTag.innerHTML = audioTag.getAttribute('song-duration')
      }
      
      // now adding class to playing song
      if(allLiTag[j].getAttribute('id') == `i${musicIndex-1}`){
         allLiTag[j].classList.add('playing')
         audioTag.innerHTML = 'playing'
      }
      // set onclick attribute to li Tag
       allLiTag[j].setAttribute('onclick','clicked(this)')
    }
  }
  
  // function for list-item clicked
  const clicked = (e) =>{
    musicIndex = e.getAttribute('index')
    loadMusic(musicIndex)
    mainAudio.play()
  }
  
