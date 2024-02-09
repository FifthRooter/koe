<script>
    import { onMount } from 'svelte'
    import pauseIcon from '$lib/img/pause.png'
    import playIcon from '$lib/img/play.png'

    let audio

    export let src
    export let isPlaying = false
    export let playbackTime = 0
    export let duration = 0

    function togglePlay() {
        if (!audio) return
        if (audio.paused) {
            audio.play()
            isPlaying = true
        }
        else {
            audio.pause()
            isPlaying = false
        }
    }

    function handleTimeUpdate() {
        playbackTime = audio.currentTime
    }

    function handleLoadedMetadata() {
        duration = audio.duration
        console.log('duration: ', duration)
    }

    function handleSeek(event) {
        const time = parseFloat(event.target.value)
        audio.currentTime = time
        playbackTime = time
    }

    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60)
        const secs = Math.floor(seconds % 60)
        return `${minutes}:${secs < 10 ? '0' : ''}${secs}`
    }

    function handleAudioEnded() {
        isPlaying = false
    }

    onMount(() => {

    })
</script>

<div class='audio-message'>
    <audio bind:this={audio} {src} preload="auto" on:timeupdate={handleTimeUpdate} on:loadedmetadata={handleLoadedMetadata} on:ended={handleAudioEnded}>
        Your browser does not support the audio element.
    </audio>
    <div class='audio-controls'>
        <button on:click={togglePlay}>
            <img src={isPlaying ? pauseIcon : playIcon} alt={isPlaying ? 'Pause' : 'Play'}/>
        </button>
        <div class='player-time'>
            <p>{formatTime(playbackTime)} {formatTime(duration)}</p>
            </div>
        <input type='range' min='0' max={duration} step='any' bind:value={playbackTime} on:input={handleSeek}/>
    </div>

</div>

<style>
    .player-time {
        color: black;
        font-size: x-small;
        align-items: center;
        margin: 0;
        width: 38px;
    }
    .player-time p {
        margin: 0;
        text-align: center;
    }
    
    .audio-message {
        display: flex-end;
        flex-direction: column;
        align-items: center;
        padding: 8px;
        background-color: transparent;
        border-radius: 15px;
        align-self: flex-end;
        max-width: 100%;
        box-sizing: border-box;
    }

    .audio-controls {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        padding: 0 1px 0 1px;
    }

    .audio-controls button {
        background-color: transparent;
        border: none;
        color: black;
        border-radius: 4px;
        padding: 0 0 0 4px;
        margin: 0 0px 0 0;
        flex: none;
        cursor: pointer;
    }

    .audio-controls button>img {
        width: 20px;
        height: 20px;
        object-fit: contain;
    }
    .audio-controls input[type='range'] {
        -webkit-appearance: none;
        flex-grow: 1;
        appearance: none;
        width: 70%;
        margin: 0;
        background: transparent;
    }

    .audio-controls input[type='range']::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: 10px;
        height: 10px;
        background-color: #920404;
        border-radius: 50%;
        border-color: transparent;
        border: none;
        cursor: pointer;
    }

    .audio-controls input[type='range']::-webkit-slider-runnable-track {
        width: 100%;
        height: 4px;
        background-color: black;
    }
    .audio-controls input[type='range']::-moz-range-thumb {
        width: 10px;
        height: 10px;
        background-color: black;
        border-radius: 50%;
        border-color: transparent;
        cursor: pointer;
    }

    .audio-controls input[type='range']::-moz-range-track {
        width: 100%;
        height: 4px;
        background-color: rgba(0, 0, 0, 0.541);
    }

    @media (max-width: 600px) {
        .audio-controls {
            padding: 8px;
        }
        .audio-controls {
            flex-direction: column;
        }
    }

</style>