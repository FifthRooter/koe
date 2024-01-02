### Proof-of-concept voice-first messenger app
Instead of being second rate citizens in most popular instant messaging apps, voice notes get equal footing in koe by integrating them more seamlessly in the message flow. 

Voice notes as they come communicate no context by themselves, aside from the length of the message. That interrupts the flow of communication, as you are forced to switch between reading and listening, with no option to switch to only one or the other. In the case of koe, we give voice notes a room to breathe and allow users to read the voice notes. 

Furthermore, using sentiment analysis, the message bubbles are colorized to communicate the emotion of the message. Much more thought needs to be put into how to better visualize the essence, emotion, and context of the voice notes, but this is a proof of concept start.

### Tech stack
- [SvelteKit](https://kit.svelte.dev/)
- Matrix [protocol](https://spec.matrix.org/latest/) - [matrix-js-sdk](https://github.com/matrix-org/matrix-js-sdk)
- OpenAI [gpt-4-1106-preview API](https://platform.openai.com/docs/models/gpt-4-and-gpt-4-turbo) (summarization)
- OpenAI's [Whisper API](https://github.com/openai/whisper) (speech-to-text)
- Sam Lowe's [roberta-base-go_emotions](https://huggingface.co/SamLowe/roberta-base-go_emotions) (sentiment analysis) model
- [MediaStream Recording API](https://developer.mozilla.org/en-US/docs/Web/API/MediaStream_Recording_API) (voice recording)
- [wavesurfer.xyz](https://wavesurfer.xyz/) (audio visualization library)
- [PostgreSQL](https://www.postgresql.org/docs/) (db)

### Key features I'm working on:
- Voice notes get summarized using speech-to-text, then run through gpt4-turbo, and summary is shown right below the voice note within the same text bubble;
- To show the full transcript, click on the summarized text, which will enlarge the text bubble;
- Improved playback of voice messages: instead of just blindly sliding the duration dial on the note, the slider will automatically skip only to the beginnings of sentences;
- Open message threads in a separate tab/window, similar to Discord;
- Down the road it would be cool to also add a text-to-speech option, so that all text messages get converted to speech, with the generated voice being that of the message sender;
    - this can already be done with a very small amount of sample data (like elevenlabs), but the privacy concerns are too involved to exercise this idea so quick. but would be cool to figure out a way that, as long as all parties involved in the chat consent to it, their voices are used to train and later use for their text messages.

I'm using Matrix protocol due to it being an off-the-shelf, reliable, pretty mature E2EE messaging protocol that I can build a frontend around, instead of building my own.

This is a PoC I'm working on to satisfy my curiosity about whether voice notes can be better integrated into the messenger app communications flow, and is not intended to be a final product of any kind.

### Current game plan:
1. ~~Set up a basic local Matrix environment (using Synapse homeserver)~~
2. Integrate Matrix client SDK
3. ~~Create minimal chat interface~~
4. Implement voice recording functionality
5. Integrate speech-to-text API for transcription
6. Implement sentiment analysis
7. Develop color-coded emotion visualization
8. Incorporate audio visualization library
9. Create interactive playback dashboard
10. Implement threaded conversations feature
11. Prototype testing
12. Prepare a demo setup
13. Let people shit on the idea
14. Try to refine the prototype based on feedback
15. Slowly lose hope
16. Hope lost, queue despair
17. Move on to the next idea

### Current progress:
Set up a skeleton SvelteKit project and created a simple chat interface to post messages. Next up, creating two separate chat windows on the same page, log them in with different accounts, and chat between the two accounts locally first, then through my VPS. Afterwards will integrate voice recording and playback.
It ain't much, but it's honest work.
![it ain't much, but it's honest work](https://github.com/FifthRooter/koe/assets/22204845/4c2436ce-fc10-43a8-9df6-48662bb7942f)
