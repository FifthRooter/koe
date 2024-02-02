<script>
    import matrixClientStore from '../../stores/matrixClientStore'

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
        // This is where I left things, gotta figure out what matrixClient is
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
        // save audioblob or send to server
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
        console.log('hello')
        console.log('mxcUrl', mxcUrl)
        const httpUrl = mxcUrl.replace('mxc://', 'http://localhost:8008/_matrix/media/r0/download/')
        return httpUrl
    }

</script>

<div class='chat-container'>
    <div class='messages'>
        {#each messages as message}
            <div class='message'>
                {#if message.content.msgtype === 'm.text'}
                    {message.content.body}
                {:else if message.content.msgtype === 'm.audio'}
                    <audio controls src={mxcUrlToHttpUrl(message.content.url)}></audio>
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
        <button on:click={sendMessage}>Send</button>
        <button class='record' on:click={startRecording}>{isRecording ? '🛑' : '🎙️'}</button>
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
        flex-grow: 1;
        padding: 10px;
        overflow-y: auto;
        background-color: #2a2a2a;
    }
    .message {
        margin-bottom: 10px;
        padding: 8px;
        background-color: #1a1a1a;
        border-top: 1px solid #333;
        color: #fff;
        border-radius: 15px;
        max-width: 70%;
    }
    .input-area {
        display: flex;
        padding: 10px;
        background-color: #333;
        color: #ddd;
        border: 1px solid #444;
        border-top: 1px solid #ccc;
        align-items: center; /* Aligns items vertically centered */
        min-height: 50px;
    }
    .input-area input {
        flex-grow: 1;
        margin-right: 10px;
        padding: 8px;
        border: 1px solid #ccc;
        background-color: #504d4d;
        border-radius: 4px;
        color: #ddd;
        outline: none;
    }
    .input-area button {
        background-color: #920404;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        width: 90px;
        padding: 0;
        flex: none;
    }
    .input-area button:hover {
        background-color: #7a0404;
    }
    .input-area button.record {
        margin-left: 10px;
        width: 40px;
    }
    .input-area input, .input-area button {
        height: 40px; /* Fixed height for input and buttons */
        margin-bottom: 0;
    }
</style>