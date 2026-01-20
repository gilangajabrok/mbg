package com.mbg.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public class MbgException extends RuntimeException {
    private final HttpStatus status;
    private final String message;

    public MbgException(HttpStatus status, String message) {
        super(message);
        this.status = status;
        this.message = message;
    }

    public static MbgException notFound(String resource) {
        return new MbgException(HttpStatus.NOT_FOUND, resource + " not found");
    }

    public static MbgException unauthorized(String message) {
        return new MbgException(HttpStatus.UNAUTHORIZED, message);
    }

    public static MbgException forbidden(String message) {
        return new MbgException(HttpStatus.FORBIDDEN, message);
    }

    public static MbgException badRequest(String message) {
        return new MbgException(HttpStatus.BAD_REQUEST, message);
    }

    public static MbgException conflict(String message) {
        return new MbgException(HttpStatus.CONFLICT, message);
    }
}
