package logger

import (
	"go.uber.org/zap"
	"go.uber.org/zap/zapcore"
)

// Logger wraps zap.Logger for use throughout the application
type Logger struct {
	*zap.Logger
}

// NewLogger creates a new logger instance based on environment
func NewLogger(level string, isDevelopment bool) *Logger {
	var logger *zap.Logger
	var err error

	logLevel := parseLevel(level)

	if isDevelopment {
		config := zap.NewDevelopmentConfig()
		config.Level = zap.NewAtomicLevelAt(logLevel)
		logger, err = config.Build()
	} else {
		config := zap.NewProductionConfig()
		config.Level = zap.NewAtomicLevelAt(logLevel)
		logger, err = config.Build()
	}

	if err != nil {
		panic(err)
	}

	return &Logger{Logger: logger}
}

// parseLevel converts string to zapcore.Level
func parseLevel(levelStr string) zapcore.Level {
	switch levelStr {
	case "debug":
		return zapcore.DebugLevel
	case "info":
		return zapcore.InfoLevel
	case "warn":
		return zapcore.WarnLevel
	case "error":
		return zapcore.ErrorLevel
	case "fatal":
		return zapcore.FatalLevel
	default:
		return zapcore.InfoLevel
	}
}

// Sync flushes any buffered log entries
func (l *Logger) Sync() error {
	return l.Logger.Sync()
}

// Info logs an info message with optional fields
func (l *Logger) Info(msg string, fields ...zap.Field) {
	l.Logger.Info(msg, fields...)
}

// Debug logs a debug message with optional fields
func (l *Logger) Debug(msg string, fields ...zap.Field) {
	l.Logger.Debug(msg, fields...)
}

// Warn logs a warning message with optional fields
func (l *Logger) Warn(msg string, fields ...zap.Field) {
	l.Logger.Warn(msg, fields...)
}

// Error logs an error message with optional fields
func (l *Logger) Error(msg string, fields ...zap.Field) {
	l.Logger.Error(msg, fields...)
}

// Fatal logs a fatal message and exits
func (l *Logger) Fatal(msg string, fields ...zap.Field) {
	l.Logger.Fatal(msg, fields...)
}

// WithFields returns a new logger with additional fields
func (l *Logger) WithFields(fields ...zap.Field) *Logger {
	return &Logger{Logger: l.Logger.With(fields...)}
}
