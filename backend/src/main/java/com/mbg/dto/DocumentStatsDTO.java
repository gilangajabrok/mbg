package com.mbg.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class DocumentStatsDTO {
    private long totalDocuments;
    private long pendingDocuments;
    private long approvedDocuments;
    private long rejectedDocuments;
}
