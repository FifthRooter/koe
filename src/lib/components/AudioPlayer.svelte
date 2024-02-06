<script>
    import { onMount } from 'svelte'

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
            audio.paused()
            isPlaying = false
        }
    }

    function handleTimeUpdate() {
        playbackTime = audio.currentTime
    }

    function handleLoadedMetadata() {
        duration = audio.duration
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
    <audio bind:this={audio} {src} on:timeupdate={handleTimeUpdate} on:loadedmetadata={handleLoadedMetadata} on:ended={handleAudioEnded}>
        Your browser does not support the audio element.
    </audio>
    <div class='audio-controls'>
        <button on:click={togglePlay}>
            {isPlaying ? 'Pause' : 'Play'}
        </button>
        <input type='range' min='0' max={duration} step='any' bind:value={playbackTime} on:input={handleSeek}/>
        <span>{formatTime(playbackTime)} / {formatTime(duration)}</span>
    </div>

</div>

<style>
    .audio-message {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-bottom: 10px;
        padding: 12px;
        background-color: #1a1a1a;
        border-radius: 15px;
        align-self: flex-end;
        max-width: 70%;
        box-sizing: border-box;
    }

    .audio-controls {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .audio-controls button {
        background-color: #920404;
        border: none;
        color: #fff;
        border-radius: 4px;
        padding: 8px 16px;
        margin-right: 10px;
        cursor: pointer;
    }

    .audio-controls input[type='range'] {
        -webkit-appearance: none;
        appearance: none;
        width: 100%;
        margin: 0 10px;
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
    }

    .audio-controls input[type='range']::-webkit-slider-runnable-track {
        width: 100%;
        height: 4px;
        background-color: #ccc;
    }

    .audio-controls input[type='range']::-moz-range-thumb {
        width: 10px;
        height: 10px;
        background-color: #920404;
        border-radius: 50%;
        border-color: transparent;

    }

    .audio-controls input[type='range']::-moz-range-track {
        width: 100%;
        height: 4px;
        background-color: #ccc;
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