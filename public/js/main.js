const chatForm = document.querySelector('#chat-form')
const chatMessages = document.querySelector('.chat-messages')
const roomName = document.querySelector('#room-name')
// const userList = document.querySelector('#users')
const userList = document.getElementById('users')



//Get username and room from url using qs library
const{username,room}=Qs.parse(location.search,{
    ignoreQueryPrefix:true //to ingnore & like other signs
})
console.log(username,room)

const socket = io();

//Join chat room
socket.emit('joinRoom',{username,room})

//Get Room and Users
socket.on('roomUsers',({room,users})=>{
    outputUsers(users);
    outputRoomName(room)
})

//Message from server

socket.on('message',message=>{
    console.log(message)
    outputMessage(message)  

    //Scroll down
    chatMessages.scrollTop=chatMessages.scrollHeight
})

//Message submit
chatForm.addEventListener('submit',(e)=>{
    e.preventDefault();
    const msg=e.target.elements.msg.value
    // console.log(msg)

    //Emitting the message to server
    socket.emit('chatMessage',msg)

    //Clear input
    e.target.elements.msg.value='';
    e.target.elements.msg.focus()
    
});

//Output message to DOM
function outputMessage(message){
const div=document.createElement('div')
div.classList.add('message')
div.innerHTML=`<p class="meta">${message.username} <span>${message.time}</span></p>
<p class="text">
${message.text}
</p>`
chatMessages.appendChild(div)

}



//Add room and users to DOM
function outputRoomName(room){
   roomName.innerText=room
}

function outputUsers(users){
    userList.innerHTML=''
    users.forEach((user)=>{
        const li=document.createElement('li')
        li.innerText=user.username
        userList.appendChild(li)

    })

}

//Prompt the user before leave chat room
document.getElementById('leave-btn').addEventListener('click',()=>{
    const leaveRoom= confirm('Do you really wanna leave the chat?')
    if(leaveRoom){
        window.location = '../index.html'

    }else{

    }
})


