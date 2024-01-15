<script>
    import { onMount } from "svelte";
    import matrixClientStore from '../stores/matrixClientStore'
    import {goto} from '$app/navigation'
    import { createClient } from 'matrix-js-sdk'

    let userId = ''
    let password = ''
    let client
    let isLoggedIn = false
    let loginError = ''

    onMount(() => {
        const session = localStorage.getItem('matrix_auth_session')
        if (session) {
            const { homeServer, accessToken, userId } = JSON.parse(session)
            matrixClientStore.initialize(homeServer, accessToken, userId)
        }
    })

    async function loginUser() {
        const homeServer = 'http://localhost:8008'
        let tempMatrixClient = createClient({baseUrl: homeServer})

        // matrixClientStore.initialize({baseUrl: homeServer, accessToken: "", userId: ""})
        
        let matrixClient
        const unsubscribe = matrixClientStore.subscribe(value => {
            matrixClient = value
        })
        unsubscribe()

        try {
            const response = await tempMatrixClient.loginWithPassword(userId, password)
            matrixClientStore.initialize({baseUrl: homeServer, accessToken: response.access_token, userId: response.user_id})
            
            localStorage.setItem('matrix_auth_session', JSON.stringify({
                userId: response.user_id,
                accessToken: response.access_token,
                homeServer: homeServer
            }))
            goto('/chat')
        } catch (err) {
            console.error('Failed to log in', err)
            loginError = err.message
        } finally {
            unsubscribe()
        }
    }

    function logoutUser() {
        localStorage.removeItem('matrix_auth_session')
        isLoggedIn = false
        client = null
        userId = ''
        password = ''
        // redirect to login page or show the login interface
        matrixClientStore.clear()
    }
</script>

<h1>this is koe, the voice-first messenger app</h1>

{#if !isLoggedIn}
    <form on:submit|preventDefault={loginUser}>
        <input type='text' bind:value={userId} placeholder='User ID' required>
        <input type='password' bind:value={password} placeholder='Password' required>
        <button type='submit'>Log In</button>
        {#if loginError}
            <p class='error'>{loginError}</p>
        {/if}
    </form>
{/if}

<style>
    * {
        box-sizing: border-box;
    }
    input, button {
        width: calc(100% - 20px); /* Subtract the total horizontal padding */
    }
    form {
        background-color: #222831;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.5);
    }
    input {
        display: block;
        width: 100%;
        padding: 10px;
        margin-bottom: 10px;
        background: #393e46;
        border: 1px solid #393e46;
        color: #fff;
        border-radius: 4px;
    }
    button {
        width: 100%;
        padding: 10px;
        background-color: #920404;
        color: #fff;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-weight: bold;
    }
    button:hover {
        background-color: #007979;
    }
    .error {
        color: rgb(167, 2, 2);
    }
</style>