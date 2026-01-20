package com.mbg.controller;

import com.mbg.entity.FinancialRecord;
import com.mbg.service.FinancialService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/finance")
@RequiredArgsConstructor
public class FinancialController {

    private final FinancialService financialService;

    @GetMapping
    public ResponseEntity<Page<FinancialRecord>> getAllRecords(Pageable pageable) {
        return ResponseEntity.ok(financialService.getAllRecords(pageable));
    }

    @GetMapping("/summary")
    public ResponseEntity<Map<String, BigDecimal>> getSummary() {
        return ResponseEntity.ok(financialService.getSummary());
    }

    @PostMapping
    public ResponseEntity<FinancialRecord> createRecord(@RequestBody FinancialRecord record) {
        return ResponseEntity.ok(financialService.createRecord(record));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRecord(@PathVariable UUID id) {
        financialService.deleteRecord(id);
        return ResponseEntity.noContent().build();
    }
}
