package com.mbg.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AuditAnalyticsDTO {
    private long totalActions;
    private Map<String, Long> actionsByType;
    private Map<String, Long> actionsByResource;
    private Map<String, Long> mostActiveUsers; // userId -> count
    private Map<String, Long> actionsPerDay; // date -> count
}
