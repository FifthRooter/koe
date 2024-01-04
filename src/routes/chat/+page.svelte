<script>
    let messages = []
    let newMessage = ''

    function sendMessage() {
        if (newMessage.trim()) {
            messages = [...messages, newMessage]
            newMessage = ''
        }   
    }
</script>

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
        padding: 8px 15px;
        background-color: #920404;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
    }
    .input-area button:hover {
        background-color: #7a0404;
    }
</style>


<div class='chat-container'>
    <div class='messages'>
        {#each messages as message}
            <div class='message'>{message}</div>
        {/each}
    </div>
    <div class='input-area'>
        <input
            type='text'
            bind:value={newMessage}
            on:keyup={event => { if (event.key === 'Enter') sendMessage();}}
        />
        <button on:click={sendMessage}>Send</button>
    </div>
</div>