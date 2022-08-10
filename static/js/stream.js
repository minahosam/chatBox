const appId = '756b609c3c9d4c3089be50700284483c'
const channelName = sessionStorage.getItem('chatRoomName')
const tempToken = sessionStorage.getItem('token')
let UID = sessionStorage.getItem('uidNO')
let NAME = sessionStorage.getItem('username')


const client = AgoraRTC.createClient({mode: 'rtc',codec: 'vp8'})
console.log('client: ' + client)

let localTracks=[]
let remoteUsers={}

let joinAndDisplayLocalTracks = async () => {
    document.getElementById('room-name').innerText = channelName
    client.on('user-published',handleJoinStream)
    client.on('user-left',handleLeaveStream)
    try {
        await client.join(appId,channelName,tempToken,UID)
    }catch (error) {
        console.error(error)
        window.open('/', '_self')
    }
    console.log('uid'+UID)
    localTracks = await AgoraRTC.createMicrophoneAndCameraTracks()
    console.log('localTracks'+localTracks)
    let member = await createMember()
    console.log('member',member)
    let player = `<div class="video-container" id="user-container-${UID}">
                    <div class="user-name-wrapper"><span class="user-name">${member.member_name}</span></div>
                    <div class="video-player" id="user-${UID}"></div>
                </div>`
    document.getElementById('video-streams').insertAdjacentHTML('beforeend',player)
    localTracks[1].play(`user-${UID}`)
    await client.publish([localTracks[0],localTracks[1]])

}

let handleJoinStream = async(user,mediaType) => {
    console.log(user,mediaType)
    remoteUsers[user.uid]=user
    await client.subscribe(user,mediaType)
    if (mediaType === 'video'){
        let player = document.getElementById(`user-container-${user.uid}`)
        if (player != null) {
            player.remove()
        }
        let member = await getMember(user)
        console.log('member',member)
        player = `<div class="video-container" id="user-container-${user.uid}">
                    <div class="user-name-wrapper"><span class="user-name">${member.name}</span></div>
                    <div class="video-player" id="user-${user.uid}"></div>
                </div>`
        document.getElementById('video-streams').insertAdjacentHTML('beforeend',player)
        user.videoTrack.play(`user-${user.uid}`)
    }
    if (mediaType ==='audio') {
        user.audioTrack.play(`user-${user.uid}`)
    }
}
let handleLeaveStream = async(user) => {
    delete remoteUsers[user.uid]
    document.getElementById(`user-container-${user.uid}`).remove()
}
// let backToHome = () => {
//     window.open('/','_self')
// }
let backToHome = async() => {
    for (let index = 0; localTracks.length < 0; index++) {
        localTracks[index].stop()
        localTracks[index].close()
        
    }
    await client.leave()
    deleteMember()
    window.open('/', '_self')
}

let toggleCamera = async(e) => {
    if (localTracks[1].muted) {
        localTracks[1].setMuted(false)
        e.target.style.background='#fff'
    }else{
        localTracks[1].setMuted(true)
        e.target.style.background='rgb(255, 80, 80, 1)'
    }
}

let togglemic = async(e) => {
    if (localTracks[0].muted) {
        localTracks[0].setMuted(false)
        e.target.style.background='#fff'
    }else{
        localTracks[0].setMuted(true)
        e.target.style.background='rgb(255, 80, 80, 1)'
    }
}
let createMember = async() => {
    let response = await fetch('/create/',{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body:JSON.stringify({
            'name':NAME,
            'uid':UID,
            'room':channelName,
        })
    })
    console.log('response:',response)
    let member = await response.json()
    console.log('member',member)
    return member
}

let getMember = async(user) => {
    let response = await fetch(`/get/?uid=${user.uid}&room=${channelName}`)
    console.log('response:',response)
    let member = await response.json()
    console.log('member',member)
    return member
}

let deleteMember = async() => {
    let response = await fetch('/delete/',{
      method:'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({'name':NAME, 'uid':UID,'room':channelName})  
    })
    let member = await response.json()
}

window.addEventListener("beforeunload",deleteMember);

joinAndDisplayLocalTracks()


document.getElementById('leave-btn').addEventListener('click', backToHome)
document.getElementById('video-btn').addEventListener('click',toggleCamera)
document.getElementById('mic-btn').addEventListener('click',togglemic)
