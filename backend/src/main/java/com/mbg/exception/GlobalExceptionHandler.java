package com.mbg.exception;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

    @ExceptionHandler(MbgException.class)
    public ResponseEntity<ErrorResponse> handleMbgException(MbgException ex) {
        log.error("MBG Exception: {}", ex.getMessage());
        return ResponseEntity
                .status(ex.getStatus())
                .body(new ErrorResponse(
                        false,
                        ex.getMessage(),
                        ex.getStatus().value(),
                        UUID.randomUUID().toString()
                ));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidationExceptions(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach((error) -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });
        
        return ResponseEntity
                .badRequest()
                .body(new ErrorResponse(
                        false,
                        "Validation failed",
                        HttpStatus.BAD_REQUEST.value(),
                        UUID.randomUUID().toString(),
                        errors
                ));
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ErrorResponse> handleAccessDeniedException(AccessDeniedException ex) {
        log.error("Access Denied: {}", ex.getMessage());
        return ResponseEntity
                .status(HttpStatus.FORBIDDEN)
                .body(new ErrorResponse(
                        false,
                        "Access denied. Insufficient permissions.",
                        HttpStatus.FORBIDDEN.value(),
                        UUID.randomUUID().toString()
                ));
    }

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ErrorResponse> handleBadCredentials(BadCredentialsException ex) {
        return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body(new ErrorResponse(
                        false,
                        "Invalid email or password",
                        HttpStatus.UNAUTHORIZED.value(),
                        UUID.randomUUID().toString()
                ));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGlobalException(Exception ex) {
        log.error("Unexpected error: ", ex);
        return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ErrorResponse(
                        false,
                        "An unexpected error occurred",
                        HttpStatus.INTERNAL_SERVER_ERROR.value(),
                        UUID.randomUUID().toString()
                ));
    }

    public record ErrorResponse(
            boolean success,
            String message,
            int statusCode,
            String traceId,
            Map<String, String> validationErrors,
            LocalDateTime timestamp
    ) {
        public ErrorResponse(boolean success, String message, int statusCode, String traceId) {
            this(success, message, statusCode, traceId, null, LocalDateTime.now());
        }

        public ErrorResponse(boolean success, String message, int statusCode, String traceId, Map<String, String> validationErrors) {
            this(success, message, statusCode, traceId, validationErrors, LocalDateTime.now());
        }
    }
}
