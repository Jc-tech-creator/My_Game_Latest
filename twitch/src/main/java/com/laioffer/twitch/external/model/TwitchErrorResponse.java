package com.laioffer.twitch.external.model;

//this file is to formalize the error log
public record TwitchErrorResponse(
        String message,
        String error,
        String details
) {
}
