import axios, { AxiosRequestConfig } from "axios";

import SendbirdChat from '@sendbird/chat'
import { OpenChannelModule } from '@sendbird/chat/openChannel';
import { NextApiResponse } from "next";

import '@/app/envConfig';
const { APP_ID, API_TOKEN } = process.env;

enum HTTP_VERBS {
    GET = "get",
    POST = "post",
    PUT = "put",
    DELETE = "delete",
}

if (!APP_ID || !API_TOKEN) {
    throw new Error("APP_ID and API_TOKEN are required in the app .env file");
}

export default class APIAdapter {
    static API_BASE_URL = `https://api-${APP_ID}.sendbird.com/v3/`;
    
    static tokenHeaders = {
        headers: {
          "Api-Token": API_TOKEN
        }
    } as AxiosRequestConfig;

    calls: SendbirdChat;

    constructor() {
        if (!APP_ID) {
            throw new Error("APP_ID is required in the app .env file");
        }
        this.calls = SendbirdChat.init({
            appId: APP_ID,
            modules: [
                new OpenChannelModule(),
            ],
        });
    }

    /**
     * Process any request and return either data, or errors.
     * @param {object} params Option object
     * @param {string} params.verb HTTP verb
     * @param {string} params.path Which ressource do we request
     * @param {object} params.body Does user provides data ?
     * @param {object} params.reply The Fastify reply object
     * @returns 
     */
    /* eslint-disable @typescript-eslint/no-explicit-any */
    static async getCallData(
        { verb, path, body }
        : { verb: HTTP_VERBS, path: string, body?: any, reply?: NextApiResponse}
    ) {
        let call;
        if(["GET", "DELETE"].includes(verb.toUpperCase())) {
            call = axios[verb](this.API_BASE_URL + path, this.tokenHeaders)
            .catch(
                reason => {
                    return { data: {verb, path, error: reason.response.data} } 
                }
            );
        }

        if (["POST", "PUT"].includes(verb.toUpperCase())) {
            call = axios[verb](this.API_BASE_URL + path, body, this.tokenHeaders)
            .catch(
                reason => {
                    return { data: {verb, path, error: reason.response.data} }
                }
            );
        }

        return (await call)?.data;
    }

    /**
     * Process to a GET request and returns the matching data or error.
     * @param {string} path 
     * @param {*|undefined} reply Optionnal Fastify request for error handling.
     * @returns Response data or error
     */
    static async get(path: string) {
        return await this.getCallData({
            verb: HTTP_VERBS.GET, path
        });
    }
    
    /**
     * Process to a POST request
     * @param {string} path Ressource location.
     * @param {object} body Data to send to the server.
     * @param {*|undefined} reply Optionnal Fastify request for error handling.
     * @returns Response data or error
     */
    /* eslint-disable @typescript-eslint/no-explicit-any */
    static async post(path: string, body: any) {
        return await this.getCallData({
            verb: HTTP_VERBS.POST, path, body
        });
    }

    /**
     * Process to a PUT request
     * @param {string} path Ressource location.
     * @param {*} reply Optionnal Fastify request for error handling.
     * @returns Response data or error
     */
    /* eslint-disable @typescript-eslint/no-explicit-any */
    static async put(path: string, body: any) {
        return await this.getCallData({
            verb: HTTP_VERBS.GET, path, body
        });
    }


    /**
     * Process to a DELETE request
     * @param {string} path Ressource location.
     * @param {*} reply Optionnal Fastify request for error handling.
     * @returns Response data or error
     */
    static async delete(path: string) {
        return await this.getCallData({
            verb: HTTP_VERBS.DELETE, path
        });
    }

}