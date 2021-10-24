const allMusic = [
  {name : '24kGoldn - Mood',
   artist : '24kGoldn',
   audio : '24kGoldn - Mood'
  },
  {name : 'Alan Walker',
   artist : 'Alan Walker',
   audio : 'Alan Walker'
  },
  {name : 'NEFFEX - Cold',
   artist : 'NEFFEX',
   audio : 'NEFFEX - Cold'
  },
  {name : 'NEFFEX - Fight Back',
   artist : 'NEFFEX',
   audio : 'NEFFEX - Fight Back'
  },
  {name : 'NEFFEX - Grateful',
   artist : 'NEFFEX',
   audio : 'NEFFEX - Grateful'
  }
  ]
  allMusic.map((music,i)=>{
    let li = `<li id=i${i} index=${i+1}>
                <div class="row">
                  <span>${music.name}</span>
                  <p>${music.artist}</p>
                </div>
                <div class="audio-duration">0.00</div>
                <audio src='${music.audio}.mp3' />
              </li>`
  document.querySelector('ul').insertAdjacentHTML('beforeend',li)
  
  let audio = document.querySelector(`#i${i} audio`)
  let duration = document.querySelector(`#i${i} .audio-duration`)
  
  audio.addEventListener('loadeddata',()=>{
    let m = Math.floor(audio.duration/60).toString().padStart(2,0),
        s = Math.floor(audio.duration%60).toString().padStart(2,0)
        duration.innerHTML = m+':'+s
        duration.setAttribute('song-duration',duration.innerHTML)
  })
  }
  )
  
  