<script>
    import matrixClientStore from '../../stores/matrixClientStore'
    import AudioPlayer from '../../lib/components/AudioPlayer.svelte';
    import stopIcon from '$lib/img/stop.png'
    import recordIcon from '$lib/img/record.png'
    import sendIcon from '$lib/img/message.png'


    const hardcodedRoomId = '!WykLVsTBkyIISnsHmj:koe-matrix'

    let messages = []
    let newMessage = ''
    let isRecording = false
    let mediaRecorder
    let audioChunks = []

    let matrixClient
    matrixClientStore.subscribe(value => {
        matrixClient = value
        console.log("Matrix client initialized:", matrixClient);
    })

    function sendMessage() {
        if (newMessage.trim() && matrixClient) {
            const messageObject = {content: {
                body: newMessage,
                msgtype: 'm.text'
            
            }}
            messages = [...messages, messageObject]
            matrixClient.sendMessage(hardcodedRoomId, {
                body: newMessage,
                msgtype: 'm.text'
            }).then((res) => {
                console.log('Message sent', res)
            }).catch((err) => {
                console.error('Failed to send message', err)
            })
            newMessage = ''
    }}
    

    function startRecording() {
        if (!isRecording) {
            navigator.mediaDevices.getUserMedia({ audio: true})
                .then(stream => {
                    mediaRecorder = new MediaRecorder(stream)
                    mediaRecorder.ondataavailable = event => {
                        audioChunks.push(event.data)
                    }
                    mediaRecorder.onstop = handleRecordingStop
                    mediaRecorder.start()
                    isRecording = true
                })
                .catch(error => {
                    console.error("Error accessing the microphone", error)
                })
        } else {
            mediaRecorder.stop()
            isRecording = false
        }
    }

    function handleRecordingStop() {
        const audioBlob = new Blob(audioChunks, { type: 'audio/mpeg'})
        audioChunks = []
        const audioFile = new File([audioBlob], 'voice-message.mp3', { type: 'audio/mpeg', lastModified: new Date().getTime() })

        if (matrixClient) {
            matrixClient.uploadContent(audioFile).then((res) => {
                const contentUri = res.content_uri

                const messageContent = {
                    body: 'voice message',
                    msgtype: 'm.audio',
                    url: contentUri
                }

                messages = [...messages, {content: messageContent}]

                matrixClient.sendMessage(hardcodedRoomId, messageContent).then((res) => {
                    console.log('Message sent', res)
                }).catch((err) => {
                    console.error('Failed to send message', err)
                })
            })
        }
        console.log("Recording stopped. Blob created:", audioBlob);
    }  
    
    function mxcUrlToHttpUrl(mxcUrl) {
        if (!matrixClient) return ''
        const httpUrl = mxcUrl.replace('mxc://', 'http://localhost:8008/_matrix/media/r0/download/')
        return httpUrl
    }

</script>

<div class='chat-container'>
    <div class='messages'>
        {#each messages as message, i}
            <div class:message={true} class:audio={message.content.msgtype === 'm.audio'} class:sender={i % 2 === 0} class:receiver={i % 2 !== 0}>
                {#if message.content.msgtype === 'm.text'}
                    {message.content.body}
                {:else if message.content.msgtype === 'm.audio'}
                    <AudioPlayer src={mxcUrlToHttpUrl(message.content.url)} bind:isPlaying={message.isPlaying} bind:playbackTime={message.playbackTime} bind:duration={message.duration}></AudioPlayer>
                {/if}
            </div>
        {/each}
    </div>
    <div class='input-area'>
        <input
            type='text'
            bind:value={newMessage}
            on:keyup={event => { if (event.key === 'Enter') sendMessage();}}
        />
        <button class='button send' on:click={sendMessage}>
            <img src={sendIcon} alt="Send" />
        </button>
        <button class='button record' on:click={startRecording}>
            <img src={isRecording ? stopIcon : recordIcon} alt={isRecording ? "Stop" : "Record"} />
        </button>
    </div>
</div>

<style>
    .chat-container {
        display: flex;
        flex-direction: column;
        height: 90vh;
        max-width: 600px;
        margin: auto;
        border: 1px solid #333;
        border-radius: 8px;
        overflow: hidden;
    }
    .messages {
        display: flex;
        flex-direction: column;
        flex-grow: 1;
        padding: 10px;
        overflow-y: auto;
        background-color: #F4F1DE;
    }

    .message {
        display: inline-block;
        box-sizing: border-box;
        font-family: 'Arial', sans-serif;
        font-size: small;
        margin-bottom: 10px;
        padding: 12px;
        border: none;
        color: #fff;
        border-radius: 15px;
        height: auto;
        width: fit-content;
        max-width: 70%;
    }
    .message.audio {
        padding: 0;
    }

    .sender {
        align-self: flex-end;
        background-color: #3D405B;
    }
    .receiver {
        align-self: flex-start;
        background-color: #E07A5F;
    }
    .input-area {
        display: flex;
        padding: 10px;
        background-color: #3D405B;
        color: #ddd;
        /* border: 1px solid #444; */
        border-top: 1px solid #ccc;
        align-items: center;
        min-height: 50px;
    }
    .input-area input {
        flex-grow: 1;
        margin-right: 10px;
        padding: 8px;
        border: none;
        background-color: #525679;
        border-radius: 4px;
        color: #f4f1dee0;
        outline: none;
    }
    .input-area button {
        background-color: #81B29A;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        width: 35px;
        height: 35px;
        padding: 0;
        flex: none;
        margin-left: 10px;
    }
    .input-area button:hover {
        background-color: #eebb6a;
    }
    .input-area input{
        height: 40px; /* Fixed height for input and buttons */
        margin-bottom: 0;
    }
    .button img {
        padding: 3px 1px 0 0;
        width: 50%;
        height: 50%;
    }

</style>