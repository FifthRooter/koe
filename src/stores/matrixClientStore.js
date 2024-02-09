import { writable } from 'svelte/store';
import {createClient} from 'matrix-js-sdk'

function createMatrixClient(baseUrl, accessToken, userId) {
    return createClient({
        baseUrl: baseUrl,
        accessToken: accessToken,
        userId: userId
    })
}

const matrixClient = writable(null)

const initialize = ({baseUrl, accessToken, userId}) => {
    const client = createMatrixClient(baseUrl, accessToken, userId)
    matrixClient.set(client)
}

const clear = () => {
    matrixClient.set(null)
}

export default {
    subscribe: matrixClient.subscribe,
    initialize,
    clear
}